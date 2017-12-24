import {Component, ViewChild} from '@angular/core';
import {
  IonicPage, NavController, NavParams, Platform, Events, ActionSheetController,
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
  @ViewChild(Slides) slides: Slides;
  serverUrl=ServerUrl;

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
              private modalController:ModalController,
              private userService:UserService,
              public navParams:NavParams,
              private assetsService: AssetsService, platform:Platform, private events:Events,
              public fingerprintProvider: FingerprintProvider) {

    this.isAndroid = platform.is('android');


    this.events.subscribe('evidences:uploaded', (data)=> {
      if(this.asset.evidences){
        this.asset.evidences.unshift(data);
        this.slides.slideTo(0, 500);
      }

    else{
        this.asset.evidences=[];
        this.asset.evidences.unshift(data);
        this.slides.slideTo(0, 500);
      }
    })
  }

  ionViewDidLoad() {
    this.userService.user.subscribe((user:Iuser)=> {
      this.user = user;
    });

    this.asset = this.navParams.get('asset');
  }




  verifyBeforeUpload(source:string){
    let passcodeModal = this.modalController.create(PasscodeLockPage, { passcode: this.user.profiles.passcode });
    passcodeModal.present();
    passcodeModal.onDidDismiss(data => {
      console.log(data);
      if(data && data.success===true){
        this.upload(source);
      }
      else{
      }
    });
  }

  verifyBeforeUpdate(){
    let passcodeModal = this.modalController.create(PasscodeLockPage, { passcode: this.user.profiles.passcode });
    passcodeModal.present();
    passcodeModal.onDidDismiss(data => {
      console.log(data);
      if(data && data.success===true){
        this.updateAsset();
      }
      else{
      }
    });
  }

  async upload(source:string){
    const config:IUploadPageConfig={
      assetId:this.asset.id,
      uploadType:'evidences', //profile,field
      id:this.user.profiles.id
    };
    let isUploaded;
    if(source==='camera'){
      isUploaded=await this.uploadService.takePhotoFromCamera(config);

    }
    else if(source==='album') {
      isUploaded=await this.uploadService.takePhotoFromAlbum(config);

    }
    if(isUploaded){
      return true;
    }
    else{
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



  updateAsset() {
    let loader = this.loadingCtrl.create({
      content: 'Updating Asset Details..'
    });
    loader.present();
    this.assetsService.updateAsset(this.asset).subscribe((data)=> {
      console.log('saved succesfully')
      loader.dismiss();
      this.toastService.presentToast('Saved Succesfully');
    }, (err)=> {
      console.log(err)
      loader.dismiss();
      this.toastService.presentToast('Something went wrong');
    })
  }


}
