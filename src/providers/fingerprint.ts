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
  async securityCheck(passcode:number){
    // uncomment if not in browser env
    return true;
/*    let isEnabled=await this.isFingerPrintEnabled();
    if(isEnabled){
      let isVerified=await this.fingerprintVerification();
      if(isVerified){
        return true;
      }
      else {
        return false;
      }

    }

    else{
      let isVerified=await this.passcodeVerfication(passcode);
      if(isVerified){
        return true;
      }
      else {
        return false;
      }
    }*/
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
      await this.faio.show(this.fingerprintOption);
      return true;
    }
    catch (err) {
      return false;
    }

  }


  async passcodeVerfication(passcode:number) {
    try {
      const code:any=await this.pinService.show();
      if (code === null){
        return false;
      }
      if (code == '' + passcode) {
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

  async presentActionSheet(cb:{(param:any[]):void;}, scope, passcode:number,shouldExit=false, ...params:any[]) {
    if (typeof cb !== 'function' || !scope || !passcode) {
      this.toastProvider.presentToast('Invalid argument');
      return false;
    }
    console.log('%c params are', 'color:red')
    console.log(params)
    params = params || [];

    let isEnabled;
    try{

      isEnabled=await this.isFingerPrintEnabled();
      if(!isEnabled){
        this.presentActionSheetWithoutFingerprint(cb, scope, passcode, shouldExit,params);
        return;
      }
    }
    catch (err){
      this.presentActionSheetWithoutFingerprint(cb, scope, passcode, shouldExit,params);
      return;
    }
    try {
      await this.isFingerPrintAvailable();
      this.presentActionSheetWithFingerprint(cb, scope, passcode,shouldExit, params);
    }
    catch (err) {
      this.presentActionSheetWithoutFingerprint(cb, scope, passcode, shouldExit,params);
    }

  }


  presentActionSheetWithFingerprint(cb, scope, passcode,shouldExit, params) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Authenticate using',
      buttons: [
        {
          text: '6 digit Passcode',
          icon: 'unlock',
          handler: () => {
            this.passcodeVerfication(1).then((pcode:any)=> {
              console.log(pcode)

              if (pcode === null){
                if(shouldExit)
                  return this.platform.exitApp();
                else
                  return;
              }
              if (pcode == '' + passcode) {
                cb.call(scope, params);

              }
              else {
                this.toastProvider.presentToast('Invalid passcode');
              }
            }).catch((err)=> {
              this.toastProvider.presentToast('Something went wrong.restart the app and try again');

            })
          }
        },
        {
          text: 'Fingerprint',
          icon: 'finger-print',
          handler: () => {
            this.fingerprintVerification().then((data)=> {
              cb.call(scope, params);
            }).catch((err)=> {
              if(shouldExit)
                return this.platform.exitApp();
              else
              console.log(err);
            })
          }
        }
        , {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            if(shouldExit)
              return this.platform.exitApp();
            else
              return;
          }
        }
      ]
    });
    actionSheet.present();
  }

  presentActionSheetWithoutFingerprint(cb, scope, passcode,shouldExit, params) {

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Authenticate using',
      buttons: [
        {
          text: '6 digit Passcode',
          icon: 'unlock',
          handler: () => {
            this.passcodeVerfication(1).then((pcode:any)=> {
              console.log(pcode)
              if (pcode === null){
                if(shouldExit)
                  return this.platform.exitApp();
                else
                  return;
              }

              if (pcode == '' + passcode) {
                cb.call(scope, params);

              }
              else {
                this.toastProvider.presentToast('Invalid passcode');
              }
            })
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            if(shouldExit)
              return this.platform.exitApp();
            else
              return;
          }
        }
      ]
    });
    actionSheet.present();
  }


}
