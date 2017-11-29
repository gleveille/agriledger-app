import { Component } from '@angular/core';
import {NavController, NavParams, LoadingController} from 'ionic-angular';
import {WalletPage} from "../wallet/wallet";
import { Storage } from '@ionic/storage';
import {WelcomePage} from "../welcome/welcome";
import {ToastProvider} from "../../providers/toast/toast";
import {LoopbackProfileProvider} from "../../providers/loopback-profile/loopback-profile";


@Component({
  selector: 'page-information',
  templateUrl: 'information.html',
})
export class InformationPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private loadingCtrl:LoadingController,
              private loopbackService:LoopbackProfileProvider,
              private storage:Storage,
              private toastProvider:ToastProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InformationPage');
  }
  private goToWalletPage() {
    this.navCtrl.push(WalletPage);
  }

  logout(){
    let loader = this.loadingCtrl.create({
      content: "Logging you out",
      spinner: 'crescent'
    });

    loader.present();


    this.loopbackService.logout().then(()=>{
      loader.dismiss();
      this.navCtrl.parent.parent.setRoot(WelcomePage);
    }).catch((err)=>{
      loader.dismiss();
      this.toastProvider.presentToast(err);
    })
  }
}
