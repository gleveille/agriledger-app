import {Component} from '@angular/core';
import {Events, AlertController} from 'ionic-angular';
import {ContainerApi} from '../../../src/app/api.config'
import {FileUploader} from 'ng2-file-upload';
import {NavParams, ViewController} from "ionic-angular/index";
import {IUploadPageConfig} from "../../interface/uploadPageConfig.interface";
import {UploadProvider} from "../../providers/upload";
import {Geolocation} from '@ionic-native/geolocation';
import {Camera, CameraOptions} from '@ionic-native/camera';


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

  constructor(public params:NavParams,
              public viewCtrl:ViewController,
              private events:Events, private uploadProvider:UploadProvider, private geolocation:Geolocation,
              private camera:Camera,
              private alertCtrl:AlertController) {

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
    console.log("coming here");

    const options:CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 450,
      targetHeight: 450,
      saveToPhotoAlbum: false
    };

    this.camera.getPicture(options).then(
      imageData => {
        this.base64Image = "data:image/jpeg;base64," + imageData;
        this.photos.push(this.base64Image);
        this.photos.reverse();
        /*this.sendData(imageData);*/
      },
      err => {
        console.log(err);
      }
    );

  }

  /*sendData(imageData) {
    this.userData.imageB64 = imageData;
    this.userData.user_id = "1";
    this.userData.token = "222";
    console.log(this.userData);
    this.authService.postData(this.userData, "userImage").then(
      result => {
        this.responseData = result;
      },
      err => {
        // Error log
      }
    );
  }*/

}
