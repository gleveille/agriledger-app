import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import 'rxjs/add/operator/toPromise';
import {TranslateServiceProvider} from "../../providers/translate-service";
import {LoginPage} from "../login/login";
import {Storage} from '@ionic/storage';


@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {
  lastTappedTimestamp:number = 0;
  totalTapCount:number = 0;
  defaultLangauge:string = 'ch';
  showdropdown:boolean = false;
  msg1 = 'Agriledger, Revolutionising the Supply Chain';
  msg2 = 'Creating opportunities across the value chain';
  msg3 = 'Guaranteeing Authenticity and Quantity';
  msg4 = 'Creating Transparency and Traceability';

  constructor(public navCtrl:NavController,
              private translateService:TranslateServiceProvider, private storage:Storage) {

  }

  changeLang() {
    this.defaultLangauge = this.defaultLangauge === 'ch' ? 'en' : 'ch';
    this.translateService.changeLang(this.defaultLangauge);
    this.showdropdown = false
    console.log(this.defaultLangauge)
  }

  ionViewDidLoad() {
    this.defaultLangauge = this.translateService.getDefaultLanguage() || 'ch';
    this.translateService.changeLang(this.defaultLangauge)
  }

  signIn() {
    this.navCtrl.push(LoginPage,{selectedIndex:0});
  }


}
