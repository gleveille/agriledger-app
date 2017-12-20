import {Component} from '@angular/core';
import {Events, AlertController} from 'ionic-angular';
import {ContainerApi} from '../../../src/app/api.config'
import {FileUploader} from 'ng2-file-upload';
import {NavParams, ViewController} from "ionic-angular/index";
import {IUploadPageConfig} from "../../interface/uploadPageConfig.interface";
import {UploadProvider} from "../../providers/upload";
import {Geolocation} from '@ionic-native/geolocation';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {ToastProvider} from "../../providers/toast";
import {FingerprintProvider} from "../../providers/fingerprint";
import {UserService} from "../../providers/user.service";
import {Iuser} from "../../interface/user.interface";


@Component({
  selector: 'page-uploads',
  templateUrl: 'upload.html',
})

export class UploadPage {
  url = '';
  lat = 0;
  long = 0;
  pageConfigData:IUploadPageConfig;
  uploader:FileUploader;
  public photos:any;
  public base64Image:string;
  userData = {user_id: "", token: "", imageB64: ""};
  user={} as Iuser;

  constructor(public params:NavParams,
              private toastService:ToastProvider,
              public viewCtrl:ViewController,
              private events:Events, private uploadProvider:UploadProvider, private geolocation:Geolocation,
              private camera:Camera,
              private alertCtrl:AlertController, private fingerprintProvider:FingerprintProvider,
              public userService: UserService) {

    this.pageConfigData = params.get('config') || {};
    console.log('pageConfigData', params.get('config'));
    this.url = this.getApi();
    this.uploader = this.uploadProvider.initUploader(this.url, this.pageConfigData, this.lat, this.long);

    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp.coords.latitude);
      this.lat = resp.coords.latitude;
      console.log(resp.coords.longitude);
      this.long = resp.coords.longitude;
      this.uploader = this.uploadProvider.initUploader(this.url, this.pageConfigData, this.lat, this.long);

    }).catch((error) => {
      console.log('Error getting location', error);
    });

    this.userService.getUser().subscribe((user)=>{
      this.user=user;
    });
  }

  getApi() {
    if (this.pageConfigData.uploadType === 'profile')
      return ContainerApi.ProfileUploadUrl();
    else if (this.pageConfigData.uploadType === 'evidences')
      return ContainerApi.FieldUploadUrl();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  ngOnInit() {
    this.photos = [];
  }

  deletePhoto(index) {
    let confirm = this.alertCtrl.create({
      title: "Sure you want to delete this photo? There is NO undo!",
      message: "",
      buttons: [
        {
          text: "No",
          handler: () => {
            console.log("Disagree clicked");
          }
        },
        {
          text: "Yes",
          handler: () => {
            console.log("Agree clicked");
            this.photos.splice(index, 1);
          }
        }
      ]
    });
    confirm.present();
  }

  takePhoto() {
    const options:CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 450,
      targetHeight: 450,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    this.camera.getPicture(options).then(
      imageData => {
        this.base64Image = "data:image/jpeg;base64," + imageData;
        this.photos.push(this.base64Image);
        this.photos.reverse();
      },
      err => {
        console.log(err);
      }
    );

  }

  verify(photo:any,index:number,type:number) {

    if(type===1){
      this.fingerprintProvider.presentActionSheet(this.uploadFromGallary, this, this.user.passcode, false, index);

    }
    if(type===2)
    this.fingerprintProvider.presentActionSheet(this.uploadFromCamera, this, this.user.passcode, false, photo, index);
  }

  uploadFromGallary(params:any[]){

    const index=params[0];
    this.uploader.queue[index].upload();
  }

  async uploadFromCamera(params:any[]){
    const photo=params[0];
    const index=params[1];
    console.log(photo)
    console.log(this.url)
    console.log(this.pageConfigData)
    console.log(this.lat,this.long)
    let url;
    try{
      url=await this.uploadProvider.uploadFromCamera(photo,this.url, this.pageConfigData, this.lat, this.long)
      console.log('uploaded')
      this.toastService.presentToast('Uploaded');
      this.photos.splice(index, 1);
    }
    catch (err){
      console.log(err)
      this.toastService.presentToast(err);
    }
    console.log(url)
  }

}
