import {Component} from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {
  NavController, ActionSheetController, ModalController,
  LoadingController
} from "ionic-angular/index";
import {ServerUrl} from '../../app/api.config'
import {ToastProvider} from "../../providers/toast";
import {IUploadPageConfig} from "../../interface/uploadPageConfig.interface";
import {UserService} from "../../providers/user.service";
import {Iuser} from "../../interface/user.interface";
import {TranslateServiceProvider} from "../../providers/translate-service";
import {UploadProvider} from "../../providers/upload";
import {PasscodeLockPage} from "../passcode-lock/passcode-lock";
import {AssetsService} from "../../providers/assets.service";
import {IndexProvider} from '../../providers/index/index';
import {AlertController} from 'ionic-angular';


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  serverUrl = ServerUrl;
  user={profiles:{
    farmDetails: {farmName: '', products: '', crops: '', grade: '', size: '', region: ''},
    documents: [],
    address: {line1: '', line2: '', city: '', province: ''}}} as Iuser;
  tempUser={profiles:{
    farmDetails: {farmName: '', products: '', crops: '', grade: '', size: '', region: ''},
    documents: [],
    address: {line1: '', line2: '', city: '', province: ''}}} as Iuser;

  defaultLangauge:string = 'ch';
  showdropdown:boolean = false;
  farm:string = "accountDetails";
  disabledButton:boolean = true;
  disabledFarmButton:boolean = true;

  constructor(public navCtrl:NavController,
              private actionSheetCtrl:ActionSheetController,
              private modalController:ModalController,
              private loadingCtrl:LoadingController,
              private toastService:ToastProvider,
              private uploadService:UploadProvider,
              private userService:UserService,
              private translateService:TranslateServiceProvider,
              private assetsService:AssetsService,
              private indexProvider:IndexProvider,
              private alertCtrl:AlertController) {


  }

  onChange(keyCode) {
    //console.log(keyCode)
    console.log(this.user.profiles);
    console.log(this.tempUser.profiles);

    if (JSON.stringify(this.user.profiles) === JSON.stringify(this.tempUser.profiles)) {
      this.disabledButton = true;
      console.log(true);
    } else {
      this.disabledButton = false;
      console.log(false);
    }

  }

  onFarmChange(keyCode) {
    //console.log(keyCode)
    console.log(this.user.profiles);
    console.log(this.tempUser.profiles);

    if (JSON.stringify(this.user.profiles) === JSON.stringify(this.tempUser.profiles)) {
      this.disabledFarmButton = true;
      console.log(true);
    } else {
      this.disabledFarmButton = false;
      console.log(false);
    }

  }


  showWelcomeMessage() {
    let alert = this.alertCtrl.create({
      title: 'Welcome to Agriledger',
      subTitle: 'Please verify your details and edit if any corrections are required',
      buttons: ['OK']
    });
    alert.present();
  }

  ionViewDidLoad() {
    if (this.indexProvider.selectedIndex === 4) {
      this.showWelcomeMessage();
    }

    this.subscribeUser();
    this.defaultLangauge = this.translateService.getDefaultLanguage() || 'ch';
  }

  updateProfile() {
    let loader = this.loadingCtrl.create({
      content: 'Upading profile..'
    });
    loader.present();

    this.userService.updateProfile(this.user).subscribe((data)=> {
      loader.dismiss();

      this.toastService.presentToast('Profile Updated...');
      //Adding code here. Start....
      this.disabledButton = true;
      this.tempUser = JSON.parse(JSON.stringify(this.user));
      //End..
    }, (err)=> {
      loader.dismiss();
      this.toastService.presentToast(err.message || 'Profile could not be Updated...')

    })
  }

  subscribeUser() {
    this.userService.user.subscribe((user:Iuser)=> {
      this.user = user;
      if (!this.user.profiles.farmDetails) {
        this.user.profiles.farmDetails = {farmName: '', products: '', crops: '', grade: '', size: '', region: ''}
      }
      this.tempUser = JSON.parse(JSON.stringify(this.user));//changing code here...

    });
  }

  verify(source:string,uploadType:string) {
    let passcodeModal = this.modalController.create(PasscodeLockPage, {passcode: this.user.profiles.passcode});
    passcodeModal.present();
    passcodeModal.onDidDismiss(data => {
      console.log(data);
      if (data && data.success === true) {
        this.upload(source,uploadType);
      }
      else {
      }
    });
  }

  async upload(source:string,uploadType:string) {
    const config:IUploadPageConfig = {
      uploadType:uploadType, //profile,field
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



  presentActionSheetDocs() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Add Documents/Images',
      buttons: [
        {
          text: 'From Gallery',
          icon: 'folder-open',
          handler: () => {
            this.verify('album','profile_documents')
            return;
          }
        },
        {
          text: 'From Camera',
          icon: 'camera',
          handler: () => {
            this.verify('camera','profile_documents')
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

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Change Profile',
      buttons: [
        {
          text: 'From Gallery',
          icon: 'folder-open',
          handler: () => {
            this.verify('album','profile')
            return;
          }
        },
        {
          text: 'From Camera',
          icon: 'camera',
          handler: () => {
            this.verify('camera','profile')

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

  changeLang() {
    this.defaultLangauge = this.defaultLangauge === 'ch' ? 'en' : 'ch';
    this.translateService.changeLang(this.defaultLangauge);
    this.showdropdown = false
    console.log(this.defaultLangauge)
  }

  updateFarm() {
    let loader = this.loadingCtrl.create({
      content: 'Upading Farm details..'
    });
    loader.present();

    this.userService.updateProfile(this.user).subscribe((data)=> {
      loader.dismiss();

      this.toastService.presentToast('Farm details Updated...')
      //Adding code here. Start....
      this.disabledFarmButton = true;
      this.tempUser = JSON.parse(JSON.stringify(this.user));
      //End..
    }, (err)=> {
      loader.dismiss();
      this.toastService.presentToast(err.message || 'Farm details could not be Updated...')

    })
  }


}
