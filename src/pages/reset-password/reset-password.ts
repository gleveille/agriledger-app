import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UserService} from "../../providers/user.service";
import {ToastProvider} from "../../providers/toast";
import {NgForm} from "@angular/forms";
import {LoginPage} from "../login/login";


@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {


  constructor(public navCtrl:NavController, public navParams:NavParams, private toastService:ToastProvider,
              private userService:UserService) {
  }

  ionViewDidLoad() {

  }

  resetPassword(form:NgForm) {
    if (!form.value.accessToken) {
      this.toastService.presentToast('Code can not be left blank');
      return;
    }
    if (form.value.newPassword !== form.value.rePassword) {
      this.toastService.presentToast('Password does not match');
      return;
    }

    this.userService.resetPassword(form.value.accessToken, form.value.newPassword)
      .subscribe((data:any)=> {
        form.value.newPassword = null;
        form.value.rePassword = null;
        this.toastService.presentToast('Password Changed Sucessfully');
        this.navCtrl.setRoot(LoginPage);

      }, (err)=> {
        console.log(err)
        this.toastService.presentToast(err.message || 'Password could not be changed');
      });
  }

}
