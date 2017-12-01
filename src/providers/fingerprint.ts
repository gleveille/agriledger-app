import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {FingerprintAIO, FingerprintOptions} from '@ionic-native/fingerprint-aio';
import {ToastProvider} from "./toast";
import {PinDialogProvider} from "./pin-dialog";
import { ActionSheetController } from 'ionic-angular';
import {HttpClient} from "@angular/common/http";


@Injectable()
export class FingerprintProvider {

  fingerprintOption:FingerprintOptions={
    clientId: 'agriledger',
    disableBackup:false,
    clientSecret: 'agriledgerPassword', //Only necessary for Android
    localizedFallbackTitle: 'Use Pin', //Only for iOS
    localizedReason: 'Please authenticate' //Only for iOS
  };

  constructor(public http: HttpClient,
              public actionSheetCtrl: ActionSheetController,

              private faio: FingerprintAIO,private toastProvider:ToastProvider,private pinService:PinDialogProvider) {
    console.log('Hello FingerprintProvider Provider');
  }


  isFingerPrintAvailable(){
    return this.faio.isAvailable()
  }

  fingerprintVerification(){

    return this.faio.show(this.fingerprintOption);

  }


  passcodeVerfication(){
       return this.pinService.show();
    }

  async presentActionSheet(cb:{(params:any): void;},scope,passcode:number,params:any){

    if(typeof cb!=='function' || !scope || !passcode){

      this.toastProvider.presentToast('Invalid argument');
      return false;
    }

    params=params||null;

    try{
      await this.isFingerPrintAvailable();
      this.presentActionSheetWithFingerprint(cb,scope,passcode,params);
    }
    catch(err){
      this.presentActionSheetWithoutFingerprint(cb,scope,passcode,params);
    }

  }



  presentActionSheetWithFingerprint(cb,scope,passcode,params) {

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Authenticate using',
      buttons: [
        {
          text: '6 digit Passcode',
          icon:'unlock',
          handler: () => {
            this.passcodeVerfication().then((pcode:string)=>{
              console.log(pcode)

              if(pcode===null)
                return;
              if(pcode==''+passcode){
                cb.call(scope,params);

              }
              else{
                this.toastProvider.presentToast('Invalid passcode');
              }
            }).catch((err)=>{
              this.toastProvider.presentToast('Something went wrong.restart the app and try again');

            })
          }
        },
        {
          text: 'Fingerprint',
          icon:'finger-print',
          handler: () => {
            this.fingerprintVerification().then((data)=>{
              cb.call(scope,params);
            }).catch((err)=>{
              console.log(err);
            })
          }
        }
        ,{
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

  presentActionSheetWithoutFingerprint(cb,scope,passcode,params) {

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Authenticate using',
      buttons: [
        {
          text: '6 digit Passcode',
          icon:'unlock',
          handler: () => {
            this.passcodeVerfication().then((pcode:string)=>{
              console.log(pcode)
              if(pcode===null)
                return;
              if(pcode==''+passcode){
                cb.call(scope,params);

              }
              else{
                this.toastProvider.presentToast('Invalid passcode');
              }
            })
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


}
