import {Component, Input} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {LoadingController} from 'ionic-angular/components/loading/loading-controller';
import {ToastProvider} from '../../providers/toast';
import {WelcomePage} from '../welcome/welcome';
import {WalletPage} from "../wallet/wallet";
import {UserService} from "../../providers/user.service";


@Component({
  selector: 'page-header',
  templateUrl: 'header.html',
})
export class HeaderPage {

  @Input('title') title:string = '';

  constructor(public navCtrl:NavController, private loadingCtrl:LoadingController,
              private toastService:ToastProvider,
              public navParams:NavParams, private user: UserService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HeaderPage');
  }

  logout() {
    let loader = this.loadingCtrl.create({
      content: "Logging you out",
      spinner: 'crescent'
    });

    loader.present();


    this.user.logout().subscribe(()=> {
      loader.dismiss();
      this.navCtrl.parent.parent.setRoot(WelcomePage);
    },(err)=>{
      loader.dismiss();
      this.toastService.presentToast(err);
    })
  }

  wallet() {
    this.navCtrl.push(WalletPage);
  }
}
