import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
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

  constructor(public navCtrl:NavController, public navParams:NavParams, private toastService:ToastProvider,
              private userService:UserService) {

  }

  changePassword() {
    if (this.credential.newPassword !== this.credential.rePassword) {
      this.toastService.presentToast('Password does not match');
      return;
    }

    this.passwordChangeRequestStatus = 'pending';
    this.userService.changePassword(this.credential.oldPassword, this.credential.newPassword)
      .subscribe((data:any)=> {
        this.passwordChangeRequestStatus = 'resolved';
        this.credential.oldPassword = null;
        this.credential.newPassword = null;
        this.credential.rePassword = null;
        this.navCtrl.setRoot(PasscodePage)
        this.toastService.presentToast('Changed Sucessfully');

      }, (err)=> {
        console.log(err)
        this.passwordChangeRequestStatus = 'rejected';

        this.toastService.presentToast('Password did not Match');
      });
  }

}
