import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {UserService} from "../../providers/user.service";
import {ToastProvider} from "../../providers/toast";
import {PasscodePage} from "../passcode/passcode";

@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

  credential = {oldPassword: null, newPassword: null, rePassword: null};
  passwordChangeRequestStatus = 'resolved';

  constructor(public navCtrl:NavController,
              private loadingCtrl:LoadingController,
              public navParams:NavParams, private toastService:ToastProvider,
              private userService:UserService) {

  }

  changePassword() {
    if (this.credential.newPassword !== this.credential.rePassword) {
      this.toastService.presentToast('Password does not match');
      return;
    }

    this.passwordChangeRequestStatus = 'pending';
    let loader = this.loadingCtrl.create({
      content: 'Changing Password..'
    });
    loader.present();

    this.userService.changePassword(this.credential.oldPassword, this.credential.newPassword)
      .subscribe((data:any)=> {
      loader.dismiss();
        this.passwordChangeRequestStatus = 'resolved';
        this.credential.oldPassword = null;
        this.credential.newPassword = null;
        this.credential.rePassword = null;
        this.navCtrl.setRoot(PasscodePage)
        this.toastService.presentToast('Password Changed Sucessfully');

      }, (err)=> {
        console.log(err)
        loader.dismiss();
        this.passwordChangeRequestStatus = 'rejected';

        this.toastService.presentToast('Password could not be changed');
      });
  }

}
