import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
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

  constructor(public navCtrl:NavController,public userService: UserService, public navParams:NavParams, public toastService:ToastProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }


  forgotPassword(form:any):void {
    this.userService.forgotPassword(form.value.email).subscribe((data)=> {
      console.log('suhas');
      console.log(data);
      this.navCtrl.push(ResetPasswordPage);
    }, (err)=> {
      this.toastService.presentToast(err.message);
      console.log(err)
    })
  }

}
