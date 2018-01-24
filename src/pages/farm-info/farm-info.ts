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
  selector: 'page-farm-info',
  templateUrl: 'farm-info.html',
})
export class FarmInfoPage {

  user={} as Iuser;
  tempUser={} as Iuser;
  index:number=0;
  defaultLangauge:string = 'ch';
  disableFarmButton:boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams,
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
    this.user=this.navParams.get('user');
    this.tempUser=JSON.parse(JSON.stringify(this.navParams.get('user')));
    this.index=this.navParams.get('index');

  }

  ionViewDidLoad() {
    this.defaultLangauge = this.translateService.getDefaultLanguage() || 'ch';
  }

  onChange(key){
    if (JSON.stringify(this.user) === JSON.stringify(this.tempUser)) {
      this.disableFarmButton = true;
      console.log(true);
    } else {
      this.disableFarmButton = false;
      console.log(false);
    }
  }

  updateFarm() {
    let loader = this.loadingCtrl.create({
      content: 'Upading Farm details..'
    });
    loader.present();

    this.userService.updateProfile(this.user).subscribe((data)=> {
      loader.dismiss();

      this.toastService.presentToast('Farm details Updated...');

      this.navCtrl.pop();
      
      //Adding code here. Start....
      this.disableFarmButton = true;
      this.tempUser = JSON.parse(JSON.stringify(this.user));
      //End..

    }, (err)=> {
      loader.dismiss();
      this.toastService.presentToast(err.message || 'Farm details could not be Updated...')
      this.navCtrl.pop();

    })
  }




}
