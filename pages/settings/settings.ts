import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateServiceProvider } from '../../providers/translate-service';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { FingerprintProvider } from '../../providers/fingerprint';



@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  testRadioOpen;
  testRadioResult;
  language:string;
  fingerPrintEnabled:boolean = false;
  defaultLangauge:string = 'ch';
  constructor(public navCtrl: NavController, public navParams: NavParams,
            private translateService:TranslateServiceProvider,private fingerprintService:FingerprintProvider,
            private alertCtrl:AlertController) {

              this.isFingerPrintEnabled();
  }

  ionViewDidLoad() {
    this.defaultLangauge = this.translateService.getDefaultLanguage() || 'ch';
    this.displayLang();
    console.log('ionViewDidLoad SettingsPage : -'+this.defaultLangauge);

  }

  async isFingerPrintEnabled() {
      let isAvailable=await this.fingerprintService.isFingerPrintEnabled();
    if(isAvailable){
      this.fingerPrintEnabled=true;
    }
    else
      this.fingerPrintEnabled=false;

  }

  displayLang(){
    if(this.defaultLangauge==='ch'){
      this.language="中文";
    }else{
      this.language="English";
    }
  }

  changeLang(){

    let alert = this.alertCtrl.create();
    alert.setTitle(this.translateService.dynamicTranslation('Languages'));

    if(this.defaultLangauge==='en'){
      alert.addInput({
        type: 'radio',
        label: 'English',
        value: 'en',
        checked: true
      });
      alert.addInput({
        type: 'radio',
        label: this.translateService.dynamicTranslation('Chinese'),
        value: 'ch',
        checked: false
      });
    }else{
      alert.addInput({
        type: 'radio',
        label: 'English',
        value: 'en',
        checked: false
      });
      alert.addInput({
        type: 'radio',
        label: this.translateService.dynamicTranslation('Chinese'),
        value: 'ch',
        checked: true
      });
    }

    alert.addButton(this.translateService.dynamicTranslation('CANCEL'));
    alert.addButton({
      text: this.translateService.dynamicTranslation('OK'),
      handler: data => {
        this.defaultLangauge = data;
        this.displayLang();
        this.translateService.changeLang(this.defaultLangauge);
        console.log(data);
      }
    });
    alert.present();
  }

  async changeToggle() {
    let val;
    try {
      val = await this.fingerprintService.isFingerPrintEnabled()
    }
    catch (err) {

    }
    if (val) {
      try {
        await this.fingerprintService.setFingerPrintDisabled();
        this.fingerPrintEnabled = false;
      }
      catch (err) {

      }
    }
    else {
      try {
        await this.fingerprintService.setFingerPrintEnabled();
        this.fingerPrintEnabled = true;
      }
      catch (err) {

      }
    }
  }

}
