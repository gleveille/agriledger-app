import { Component,Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { ToastProvider } from '../../providers/toast/toast';
import { LoopbackProfileProvider } from '../../providers/loopback-profile/loopback-profile';
import { WelcomePage } from '../welcome/welcome';
import {WalletPage} from "../wallet/wallet";



@Component({
  selector: 'page-header',
  templateUrl: 'header.html',
})
export class HeaderPage {

  @Input('title') title :string='';
  constructor(public navCtrl: NavController, private loadingCtrl:LoadingController,
    private toastService:ToastProvider,private loopbackService:LoopbackProfileProvider,
     public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HeaderPage');
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
      this.toastService.presentToast(err);
    })
  }

  wallet() {
    this.navCtrl.push(WalletPage);
  }
}
