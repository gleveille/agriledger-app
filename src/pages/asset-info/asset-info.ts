import {Component, ViewChild} from '@angular/core';
import {
  IonicPage, NavController, NavParams, Platform, Events, ActionSheetController,
  LoadingController, Slides
} from 'ionic-angular';
import {AssetsService} from "../../providers/assets.service";
import {Iuser} from "../../interface/user.interface";
import {UserService} from "../../providers/user.service";
import {ServerUrl} from "../../app/api.config";
import {UploadProvider} from "../../providers/upload";
import {IUploadPageConfig} from "../../interface/uploadPageConfig.interface";
import {ToastProvider} from "../../providers/toast";
import {FingerprintProvider} from "../../providers/fingerprint";

@Component({
  selector: 'page-asset-info',
  templateUrl: 'asset-info.html',
})
export class AssetInfoPage {
  @ViewChild(Slides) slides: Slides;

  serverUrl = ServerUrl;
  chosenLang='en';
  asset = {category: {}} as any;
  assets = [];
  pet:string = "puppies";
  isAndroid:boolean = false;
  isSecurityCheckPassed:boolean=false;
  user = {} as Iuser;

  constructor(public navCtrl:NavController,
              private loadingCtrl:LoadingController,
              private actionSheetCtrl:ActionSheetController,
              private uploadService:UploadProvider,
              private toastService:ToastProvider,
              private userService:UserService,
              public navParams:NavParams,
              private assetsService: AssetsService, platform:Platform, private events:Events,
              public fingerprintProvider: FingerprintProvider) {

    this.isAndroid = platform.is('android');

    this.userService.getAssets();

    this.events.subscribe('evidences:uploaded', (url)=> {
      console.log(url);
      if(this.asset.evidences){
        this.asset.evidences.unshift(url);
        this.slides.slideTo(0, 500);
      }

    else{
        this.asset.evidences=[];
        this.asset.evidences.unshift(url);
        this.slides.slideTo(0, 500);
      }
    })
  }

  ionViewDidLoad() {
    this.userService.getUser().subscribe((user:Iuser)=> {
      this.user = user;
      console.log(this.user)
    }, (err)=> {
      console.log(err);
    });

    this.asset = this.navParams.get('asset');
    console.log(this.asset);
  }

  uploadPage() {

    this.presentActionSheet()
  }



  async upload(source:string){
    if(!this.isSecurityCheckPassed){
      let isVerified=await  this.fingerprintProvider.securityCheck(this.user.passcode);
      if(!isVerified){
        return false;
      }
      else{
        this.isSecurityCheckPassed=true;
      }
    }
    const config:IUploadPageConfig={
      assetId:this.asset.id,
      uploadType:'evidences', //profile,field
      id:this.user.id
    };
    let isUploaded;
    if(source==='camera'){
      isUploaded=await this.uploadService.takePhotoFromCamera(config);

    }
    else if(source==='album') {
      isUploaded=await this.uploadService.takePhotoFromAlbum(config);

    }
    if(isUploaded){
      this.toastService.presentToast('Upload successfully');
      return true;

    }
    else{
      if(isUploaded===null)
        return false;
      else{
        this.toastService.presentToast('Upload failed.try again');
        return false;

      }
    }
  }


  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Upload Evidences',
      buttons: [
        {
          text: 'From Gallery',
          icon: 'folder-open',
          handler: () => {
            this.upload('album')
            return;
          }
        },
        {
          text: 'From Camera',
          icon: 'camera',
          handler: () => {
             this.upload('camera')

          }
        },

        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }

  async verify() {
    let asset = JSON.parse(JSON.stringify(this.asset));
    console.log(this.asset)
    /*for (let level in this.asset.category) {

      if (this.asset.category[level].attrs && this.asset.category[level].attrs.length)
        asset.category[level] = this.asset.category[level].attrs[this.chosenLang];
      else
        asset.category[level] = '';
    }*/

    let isVerified=await  this.fingerprintProvider.securityCheck(this.user.passcode);
    if(isVerified){
      this.updateAsset(asset);
    }
    else{

    }

  }

  updateAsset(asset:any) {
    console.log(asset)
    this.assetsService.updateAsset(asset).subscribe((data)=> {
      console.log('saved succesfully')
      this.toastService.presentToast('Saved Succesfully');
    }, (err)=> {
      console.log(err)
      this.toastService.presentToast('Something went wrong');
    })
  }


}
