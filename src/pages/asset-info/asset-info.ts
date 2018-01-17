import {Component, ViewChild} from '@angular/core';
import {
  NavController, NavParams, Platform, Events, ActionSheetController,
  LoadingController, Slides, ModalController
} from 'ionic-angular';
import {AssetsService} from "../../providers/assets.service";
import {Iuser} from "../../interface/user.interface";
import {UserService} from "../../providers/user.service";
import {UploadProvider} from "../../providers/upload";
import {IUploadPageConfig} from "../../interface/uploadPageConfig.interface";
import {ToastProvider} from "../../providers/toast";
import {FingerprintProvider} from "../../providers/fingerprint";
import {PasscodeLockPage} from "../passcode-lock/passcode-lock";
import {ServerUrl} from '../../app/api.config'

@Component({
  selector: 'page-asset-info',
  templateUrl: 'asset-info.html',
})
export class AssetInfoPage {
  @ViewChild(Slides) slides:Slides;
  serverUrl = ServerUrl;
  minDate:string;
  chosenLang = 'en';
  asset = {category: {}} as any;
  assets = [];
  tempAsset = [];
  pet:string = "puppies";
  isAndroid:boolean = false;
  isSecurityCheckPassed:boolean = false;
  user = {} as Iuser;
  isEditable:boolean=true;
  disabledButton:boolean = true;
  previousDate:any;


  constructor(public navCtrl:NavController,
              private loadingCtrl:LoadingController,
              private actionSheetCtrl:ActionSheetController,
              private uploadService:UploadProvider,
              private toastService:ToastProvider,
              private modalController:ModalController,
              private userService:UserService,
              public navParams:NavParams,
              private assetsService:AssetsService, platform:Platform, private events:Events) {

    this.isAndroid = platform.is('android');
    this.asset = this.navParams.get('asset');
    this.tempAsset = this.navParams.get('asset');

  }

  onDateChange(event){

    var newDate = event.split("T",1);
    var oldDate = this.previousDate.split("T",1)

    var oldDateUnix = (+new Date(oldDate).getTime())/1000;
    var newDateUnix = (+new Date(newDate).getTime())/1000;

    console.log(newDateUnix);
    console.log(oldDateUnix);

    if(newDateUnix === oldDateUnix){
      this.disabledButton = true;
      console.log(true);
    }else{
      this.disabledButton = false;
      console.log(false);
    }
  }

  onChange(keyCode){
    //console.log(keyCode)
    console.log(this.asset);
    console.log(this.tempAsset);

    if(JSON.stringify(this.asset)===JSON.stringify(this.tempAsset)){
      this.disabledButton = true;
      console.log(true);
    }else{
      this.disabledButton = false;
      console.log(false);
    }
    
  }

  ionViewDidLoad() {
    let date = new Date();
    this.minDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2).toString();
    this.subscribeMyAssets();
    this.userService.user.subscribe((user:Iuser)=> {
      this.user = user;
    });
  }


  subscribeMyAssets(){
    this.assetsService.myAssets.subscribe((assets:any[])=>{
      this.assets=assets;

      console.log('asset info subscription');

      assets.forEach((asset)=> {
        if (asset.id === this.asset.id) {
          this.asset = asset;
          if (this.slides)
            this.slides.slideTo(0, 500);
        }
      });

      //Storing assets temporary...
      this.previousDate = this.asset.expectedHarvestDate;//new Date();
      console.log(this.previousDate);
      this.tempAsset=JSON.parse(JSON.stringify(this.asset));

      console.log('main asset');
      console.log(this.asset);
      console.log('temp assets');
      console.log(this.tempAsset);

    });
  }

  verifyBeforeUpload(source:string) {
    let passcodeModal = this.modalController.create(PasscodeLockPage, {passcode: this.user.profiles.passcode});
    passcodeModal.present();
    passcodeModal.onDidDismiss(data => {
      console.log(data);
      if (data && data.success === true) {
        this.upload(source);
      }
      else {
      }
    });
  }

  verifyBeforeUploadDox(source:string) {
    let passcodeModal = this.modalController.create(PasscodeLockPage, {passcode: this.user.profiles.passcode});
    passcodeModal.present();
    passcodeModal.onDidDismiss(data => {
      console.log(data);
      if (data && data.success === true) {
        this.uploadDox(source);
      }
      else {
      }
    });
  }

  verifyBeforeUpdate() {
    // this.isEditable=true;
    let passcodeModal = this.modalController.create(PasscodeLockPage, {passcode: this.user.profiles.passcode});
    passcodeModal.present();
    passcodeModal.onDidDismiss(data => {
      console.log(data);
      if (data && data.success === true) {
        this.updateAsset();
      }
      else {
      }
    });
  }

  async upload(source:string) {
    const config:IUploadPageConfig = {
      assetId: this.asset.id,
      uploadType: 'evidences', //profile,field
      id: this.user.profiles.id
    };
    let isUploaded;
    if (source === 'camera') {
      isUploaded = await this.uploadService.takePhotoFromCamera(config);

    }
    else if (source === 'album') {
      isUploaded = await this.uploadService.takePhotoFromAlbum(config);

    }
    if (isUploaded) {
      return true;
    }
    else {
      return false;
    }
  }

  async uploadDox(source:string) {
    const config:IUploadPageConfig = {
      assetId: this.asset.id,
      uploadType: 'asset_documents', //profile,field
      id: this.user.profiles.id
    };
    let isUploaded;
    if (source === 'camera') {
      isUploaded = await this.uploadService.takePhotoFromCamera(config);

    }
    else if (source === 'album') {
      isUploaded = await this.uploadService.takePhotoFromAlbum(config);

    }
    if (isUploaded) {
      return true;
    }
    else {
      return false;
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
            this.verifyBeforeUpload('album')
            return;
          }
        },
        {
          text: 'From Camera',
          icon: 'camera',
          handler: () => {
            this.verifyBeforeUpload('camera')

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

  presentActionSheetDoc() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Upload Documents',
      buttons: [
        {
          text: 'From Gallery',
          icon: 'folder-open',
          handler: () => {
            this.verifyBeforeUploadDox('album')
            return;
          }
        },
        {
          text: 'From Camera',
          icon: 'camera',
          handler: () => {
            this.verifyBeforeUploadDox('camera')

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

  updateAsset() {
    let loader = this.loadingCtrl.create({
      content: 'Updating Asset Details..'
    });
    loader.present();
    this.assetsService.updateAsset(this.asset).subscribe((data)=> {
      console.log('saved succesfully')
      loader.dismiss();
      this.toastService.presentToast('Saved Succesfully');
      //Adding code here. Start....
      this.disabledButton = true;
      this.tempAsset = JSON.parse(JSON.stringify(this.asset));
      //End..

    }, (err)=> {
      console.log(err)
      loader.dismiss();
      this.toastService.presentToast('Something went wrong');
    })
  }

  // onEdit(){
  //   this.isEditable=false;
  // }

}
