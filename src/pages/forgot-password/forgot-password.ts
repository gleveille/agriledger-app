import {Component} from '@angular/core';
import {LoadingController, NavController, NavParams} from 'ionic-angular';
import {ResetPasswordPage} from "../reset-password/reset-password";
import {ToastProvider} from "../../providers/toast";
import {WelcomePage} from "../welcome/welcome";
import {NgForm} from "@angular/forms/forms";
import {UserService} from "../../providers/user.service";
import {LoginPage} from "../login/login";
import {EmailSentPage} from "../email-sent/email-sent";

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

  email:string='';
  constructor(public navCtrl:NavController,
              private loadingCtrl:LoadingController,
              public userService: UserService,
              public navParams:NavParams, public toastService:ToastProvider) {
  }

  ionViewDidLoad() {
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
      content: 'Sending reset token...'
    });
    loader.present();
    this.userService.forgotPassword(form.value.email).subscribe((data)=> {
      loader.dismiss();
      this.navCtrl.setRoot(EmailSentPage,{email:form.value.email});
    }, (err)=> {
      loader.dismiss();
      this.toastService.presentToast(err.message);
    })
  }

}
