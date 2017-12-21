import { Component } from '@angular/core';
import {NavController, NavParams, IonicPage} from 'ionic-angular';
import {FingerprintProvider} from "../../providers/fingerprint";
import {TabsPage} from "../tabs/tabs";


@Component({
  selector: 'page-fingerprint',
  templateUrl: 'fingerprint.html',
})
export class FingerprintPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private fingerprintService:FingerprintProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FingerprintPage');
  }


  async enable(){
    try {
      let result=await this.fingerprintService.fingerprintVerification();
      let enable=await this.fingerprintService.setFingerPrintEnabled();
      this.navCtrl.setRoot(TabsPage);
    }
    catch (err){

    }
  }

  skip(){
    this.navCtrl.setRoot(TabsPage)
  }
}
