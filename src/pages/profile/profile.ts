import {Component} from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {
  NavController, ActionSheetController, ModalController,
  LoadingController, App
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
import {UserDocumentDialogPage} from '../user-document-dialog/user-document-dialog';
import {CreateFarmPage} from "../create-farm/create-farm";
import {FarmInfoPage} from "../farm-info/farm-info";
import { AddressService } from '../../providers/address.service';


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  serverUrl = ServerUrl;
  address={country:[],province:[],city:[],district:[]};
  user:Iuser;
  tempUser:Iuser;
  isFormValid=false;


  defaultLangauge:string = 'ch';
  showdropdown:boolean = false;
  farm:string = "accountDetails";
  disabledSaveButton:boolean = true;




  constructor(public navCtrl: NavController,
    private actionSheetCtrl: ActionSheetController,
    private modalController: ModalController,
    private loadingCtrl: LoadingController,
    private toastService: ToastProvider,
    private uploadService: UploadProvider,
    private userService: UserService,
    private translateService: TranslateServiceProvider,
    private assetsService: AssetsService,
    private indexProvider: IndexProvider,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private app:App,
    private addressService:AddressService) {

      this.user=this.userService.dataStore.user;
  }




  private onCountryChange(event){
    console.log('country change')
    this.user.profiles.address.province='';
    this.user.profiles.address.city='';
    this.user.profiles.address.district='';
    this.address.province=[];
    this.address.city=[];
    this.address.district=[];
    
    this.getProvinceByCountry(event);
  
    this.checkStatus();
}



private onProvinceChange(event){
  console.log('province change')
  this.user.profiles.address.city='';
  this.user.profiles.address.district='';
  this.address.city=[];
  this.address.district=[];
    this.getCityByProvince(event);
    this.checkStatus();
}

private onCityChange(event){
  console.log('city change')
  this.user.profiles.address.district='';
  this.address.district=[];
    this.getDistrictByCity(event)
    this.checkStatus();
}

  private onDistrictChange(event){
    console.log('district change')
    this.checkStatus();
  }


private getCountry(){
    this.addressService.getCountry().subscribe((data:any[])=>{
        this.address.country=data;
        console.log(this.address.country)
    },(err)=>{

    })
}


private getProvinceByCountry(countryName:string){
    this.addressService.getProvinceByCountry(countryName).subscribe((data:any[])=>{
        this.address.province=data;
        console.log(this.address.province)
    },(err)=>{

    })
}

private getCityByProvince(provinceName:string){
    this.addressService.getCityByProvince(provinceName).subscribe((data:any[])=>{
        this.address.city=data;
        console.log(this.address.city)

    },(err)=>{

    })
}

private getDistrictByCity(cityName:string){
    this.addressService.getDistrictByCity(cityName).subscribe((data:any[])=>{
        this.address.district=data;
        console.log(this.address.district)

    },(err)=>{

    })
}



  checkStatus() {
    if (JSON.stringify(this.user.profiles) === JSON.stringify(this.tempUser.profiles)) {
      this.disabledSaveButton = true;
      console.log(true);
    } else {

      this.disabledSaveButton = this.formValidate();
      console.log(false);
      // validation
    }
  }

  formValidate():boolean{
    //name
    //phone
    //address country province city line1
    if(this.user.profiles.name!="" &&
      this.user.profiles.phone!="" &&
      this.user.profiles.address.country!="" &&
      this.user.profiles.address.province!="" &&
      this.user.profiles.address.city!="" &&
      this.user.profiles.address.line1!=""){
        return false;
      }
      else{
        return true;
      }
  }

  onImageClick(i:number, type:string) {
    let modal = this.modalCtrl.create(UserDocumentDialogPage, {user: this.user, index: i, type}, {
      showBackdrop: true,
      enableBackdropDismiss: true
    });
    modal.present();
  }


  onChange(keyCode) {

    console.log(this.user.profiles);
    console.log(this.tempUser.profiles);

    this.checkStatus();

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
      this.indexProvider.selectedIndex = 0;
    }

    this.subscribeUser();
    this.defaultLangauge = this.translateService.getDefaultLanguage() || 'ch';

    console.log('Profile details');
    console.log(this.user);

    //this.allCountry = this.address.getCountry();

  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.userService.loadUser().subscribe(()=>{
      refresher.complete();

    },(err)=>{
      refresher.complete();

    });
  }

  updateProfile() {

    



    let loader = this.loadingCtrl.create({
      content: 'Upading profile...'
    });
    loader.present();

    //start..
    this.userService.updateProfile(this.user).subscribe((data) => {
      loader.dismiss();

      this.toastService.presentToast('Profile Updated...');
      //Adding code here. Start....
      this.disabledSaveButton = true;
      this.tempUser = JSON.parse(JSON.stringify(this.user));
      //End..
    }, (err) => {
      loader.dismiss();
      this.toastService.presentToast(err.message || 'Profile could not be Updated...')

    }); //End
  }
  
  subscribeUser() {
    console.log('inside ')
    this.userService.user.subscribe((user:Iuser) => {
      this.user = user;
      this.getCountry()
      this.getProvinceByCountry(this.user.profiles.address.country)
      this.getCityByProvince(this.user.profiles.address.province)
      this.getDistrictByCity(this.user.profiles.address.city)

      console.log(this.user)
      this.tempUser = JSON.parse(JSON.stringify(this.user));//changing code here...
    });
  }

  verify(source:string, uploadType:string) {
    let passcodeModal = this.modalController.create(PasscodeLockPage, {passcode: this.user.profiles.passcode});
    passcodeModal.present();
    passcodeModal.onDidDismiss(data => {
      console.log(data);
      if (data && data.success === true) {
        this.upload(source, uploadType);
      }
      else {
      }
    });
  }

  async upload(source:string, uploadType:string) {
    const config:IUploadPageConfig = {
      uploadType: uploadType, //profile,field
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
            this.verify('album', 'profile_documents')
            return;
          }
        },
        {
          text: 'From Camera',
          icon: 'camera',
          handler: () => {
            this.verify('camera', 'profile_documents')
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
            this.verify('album', 'profile')
            return;
          }
        },
        {
          text: 'From Camera',
          icon: 'camera',
          handler: () => {
            this.verify('camera', 'profile')

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
      content: 'Upading Farm details'
    });
    loader.present();

    this.userService.updateProfile(this.user).subscribe((data) => {
      loader.dismiss();

      this.toastService.presentToast('Farm details Updated')

    }, (err) => {
      loader.dismiss();
      this.toastService.presentToast(err.message || 'Farm details could not be Updated')

    })
  }

  createFarm() {
    //this.navCtrl.push(CreateFarmPage);
    this.app.getRootNav().push(CreateFarmPage);
  }

  farmInfo(index:number) {
    this.app.getRootNav().push(FarmInfoPage, {user: this.user, index: index});
  }


}
