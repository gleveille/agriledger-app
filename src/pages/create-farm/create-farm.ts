import { Component } from '@angular/core';
import {
  NavController, NavParams, LoadingController, ModalController, ActionSheetController,
  AlertController
} from 'ionic-angular';
import {Iuser} from "../../interface/user.interface";
import {ServerUrl} from "../../app/api.config";
import {IndexProvider} from "../../providers/index/index";
import {AssetsService} from "../../providers/assets.service";
import {TranslateServiceProvider} from "../../providers/translate-service";
import {UserService} from "../../providers/user.service";
import {UploadProvider} from "../../providers/upload";
import {ToastProvider} from "../../providers/toast";


@Component({
  selector: 'page-create-farm',
  templateUrl: 'create-farm.html',
})
export class CreateFarmPage {
  farmDetails={farmName: '', products: '', crops: '', grade: '', size: '', region: ''};
  defaultLangauge:string = 'ch';
  user={} as Iuser;

  constructor(public navCtrl: NavController, public navParams: NavParams,  private actionSheetCtrl:ActionSheetController,
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

  ionViewDidLoad() {
    this.subscribeUser();
    this.defaultLangauge = this.translateService.getDefaultLanguage() || 'ch';
  }

  subscribeUser() {
    console.log('inside ')
    this.userService.user.subscribe((user:Iuser)=> {
      this.user = user;

    });
  }

  updateFarm() {
    let isValid=true;
    Object.keys(this.farmDetails).forEach((prop)=>{
      if(!this.farmDetails[prop] || !this.farmDetails[prop].length){
        isValid=false;
      }
    });

    if(!isValid){
      return this.toastService.presentToast('Fill all the field');
    }
    if(!this.user.profiles.farmDetails || !this.user.profiles.farmDetails.length){
      this.user.profiles.farmDetails=[];
    }

    this.user.profiles.farmDetails.push(this.farmDetails);
    let loader = this.loadingCtrl.create({
      content: 'Upading Farm details..'
    });
    loader.present();

    this.userService.updateProfile(this.user).subscribe((data)=> {
      loader.dismiss();

      this.toastService.presentToast('Farm details Updated...')
      this.navCtrl.pop();

      Object.keys(this.farmDetails).forEach((prop)=>{
        prop='';
      })

    }, (err)=> {
      loader.dismiss();
      this.toastService.presentToast(err.message || 'Farm details could not be Updated...')
      this.navCtrl.pop();

    })
  }

}
