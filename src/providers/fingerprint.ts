import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {FingerprintAIO, FingerprintOptions} from '@ionic-native/fingerprint-aio';
import {ToastProvider} from "./toast";
import {PinDialogProvider} from "./pin-dialog";
import {ActionSheetController, Platform} from 'ionic-angular';

import {Storage} from '@ionic/storage';

@Injectable()
export class FingerprintProvider {

  fingerprintOption:FingerprintOptions = {
    clientId: 'agriledger',
    disableBackup: false,
    clientSecret: 'agriledgerPassword', //Only necessary for Android
    localizedFallbackTitle: 'Use Pin', //Only for iOS
    localizedReason: 'Please authenticate' //Only for iOS
  };

  constructor(public platform:Platform,
              public actionSheetCtrl:ActionSheetController,
              private storage:Storage,
              private faio:FingerprintAIO, private toastProvider:ToastProvider, private pinService:PinDialogProvider) {
    console.log('Hello FingerprintProvider Provider');
  }


  async isFingerPrintAvailable() {
    try {
      let isAvailable=await this.faio.isAvailable();
      console.log(isAvailable)
      return true;
    }
    catch (err) {
      console.log(err)
      return false;
    }
  }
  async isFingerPrintEnabled(){

    let isAvailable;

    try{
      await this.isFingerPrintAvailable();
      isAvailable=true
    }

    catch (err){
      isAvailable=false
    }

    if(!isAvailable){
      try{
        await this.setFingerPrintDisabled();
        return false;
      }

      catch (err){
        return false;

      }
    }
    else {
      try {
        let val=await this.storage.get('fingerPrintEnabled');
        if(val==1){
          return true;
        }
        else {
          return false;
        }

      }
      catch (err) {
        return false;
      }
    }

  }

  async setFingerPrintEnabled(){
    try {
      await this.storage.set('fingerPrintEnabled',1);
      return true;
    }
    catch (err) {
      return false;
    }

  }

  async setFingerPrintDisabled(){

    try {
      await this.storage.set('fingerPrintEnabled',0);
      return true;
    }
    catch (err) {
      return false;
    }
  }



  async fingerprintVerification() {
    try {
      let result=await this.faio.show(this.fingerprintOption);
      console.log('finger print result')
      console.log(result)
      return true;
    }
    catch (err) {
      console.log('xxx')
      console.log(err)
      return false;
    }

  }


}
