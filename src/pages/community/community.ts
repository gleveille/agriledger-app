import { Component } from '@angular/core';
import { NavController, NavParams,LoadingController } from 'ionic-angular';
import {LoopbackProfileProvider} from "../../providers/loopback-profile/loopback-profile";
import {ToastProvider} from "../../providers/toast/toast";
import {WelcomePage} from "../welcome/welcome";


@Component({
  selector: 'page-community',
  templateUrl: 'community.html',
})
export class CommunityPage {

  constructor(private navCtrl: NavController,
              private loadingCtrl:LoadingController,
              private loopbackService:LoopbackProfileProvider,
              private toastProvider:ToastProvider,
              private navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommunityPage');
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
