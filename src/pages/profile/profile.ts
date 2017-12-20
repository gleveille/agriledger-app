import {Component} from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {NavController, AlertController, Events} from "ionic-angular/index";
import {UploadPage} from "../upload/upload";
import {SocialSharing} from "@ionic-native/social-sharing";
import {ServerUrl} from '../../app/api.config'
import {ToastProvider} from "../../providers/toast";
import {IUploadPageConfig} from "../../interface/uploadPageConfig.interface";
import {UserService} from "../../providers/user.service";
import {Iuser} from "../../interface/user.interface";
import {TranslateServiceProvider} from "../../providers/translate-service";
import {Storage} from '@ionic/storage';


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  serverUrl = ServerUrl;
  user = {profileUrl: {}} as Iuser;
  defaultLangauge:string = 'ch';
  showdropdown:boolean = false;

  fingerPrintEnabled:boolean = false;

  constructor(public navCtrl:NavController, private events:Events, public alertCtrl:AlertController, private socialSharing:SocialSharing,
              private toastCtrl:ToastProvider, private userService:UserService, private translateService:TranslateServiceProvider,
              private storage:Storage) {

    this.events.subscribe('profileImage:uploaded', (url)=> {
      console.log(url)
      this.user.profileUrl.url = url;
    })
  }

  ionViewDidLoad() {

    this.defaultLangauge = this.translateService.getDefaultLanguage() || 'ch';
    this.userService.getUser().subscribe((user:Iuser)=> {
      this.user = user;
      console.log(this.user)
    }, (err)=> {
      console.log(err);
    });
  }


  async isFingerPrintEnabled() {
    try {
      this.isFingerPrintEnabled = await this.userService.isFingerPrintEnabled();
    }
    catch (err) {

    }
  }

  upload() {
    this.navCtrl.push(UploadPage, {config: {uploadType: 'profile', id: this.user.id}});
  }

  changeLang() {
    this.defaultLangauge = this.defaultLangauge === 'ch' ? 'en' : 'ch';
    this.translateService.changeLang(this.defaultLangauge);
    this.showdropdown = false
    console.log(this.defaultLangauge)

  }

  async changeToggle() {
    let val;
    try {
      val = await this.storage.get('fingerPrintEnabled');
    }
    catch (err) {

    }
    if (val) {
      try {
        await this.storage.remove('fingerPrintEnabled')
        this.fingerPrintEnabled = false;
      }
      catch (err) {

      }
    }
    else {
      try {
        val = await this.storage.set('fingerPrintEnabled', true);
        this.fingerPrintEnabled = true;
      }
      catch (err) {

      }
    }
  }


}
