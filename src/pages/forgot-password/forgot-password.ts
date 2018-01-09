import {Component} from '@angular/core';
import {LoadingController, NavController, NavParams} from 'ionic-angular';
import {ResetPasswordPage} from "../reset-password/reset-password";
import {ToastProvider} from "../../providers/toast";
import {WelcomePage} from "../welcome/welcome";
import {NgForm} from "@angular/forms/forms";
import {UserService} from "../../providers/user.service";

/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  constructor(public navCtrl:NavController,
              private loadingCtrl:LoadingController,
              public userService: UserService,
              public navParams:NavParams, public toastService:ToastProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }
  alreadyHaveCode(){
    this.navCtrl.push(ResetPasswordPage);

  }

  forgotPassword(form:any):void {
    console.log(form)
    if(!form.value.email){
      this.toastService.presentToast('Email can not be left blank');
      return
    }
    let loader = this.loadingCtrl.create({
      content: 'Checking...'
    });
    loader.present();
    this.userService.forgotPassword(form.value.email).subscribe((data)=> {
      console.log(data);
      loader.dismiss();
      this.navCtrl.push(ResetPasswordPage);
    }, (err)=> {
      console.log(err)
      loader.dismiss();
      this.toastService.presentToast(err.message);
      console.log(err)
    })
  }

}
