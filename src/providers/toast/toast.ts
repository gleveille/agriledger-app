import { Injectable } from '@angular/core';
import {ToastController} from "ionic-angular/index";
import {TranslateServiceProvider} from "../../providers/translate-service/translate-service";


@Injectable()
export class ToastProvider {

  constructor(public toastCtrl: ToastController,private translateService:TranslateServiceProvider) {
    console.log('Hello ToastProvider Provider');
  }
  public presentToast(text:string,position:string='bottom',duration:number=3000,showCloseButton:boolean=false) {
    text=text && text.length ? text :'Something went wrong';
    text=this.translateService.dynamicTranslation(text);
    this.toastCtrl.create({
      message: text,
      duration: duration,
      position: position,
      showCloseButton:showCloseButton

    }).present();
  }
}
