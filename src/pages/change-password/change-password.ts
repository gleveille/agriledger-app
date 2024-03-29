import {Component} from '@angular/core';
import {LoadingController, NavController, NavParams} from 'ionic-angular';
import {UserService} from "../../providers/user.service";
import {ToastProvider} from "../../providers/toast";
import {PasscodeLockPage} from "../passcode-lock/passcode-lock";
import { IndexProvider } from '../../providers/index/index';

@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

  credential = {oldPassword: '', newPassword: '', rePassword: ''};
  passwordChangeRequestStatus = 'resolved';

  constructor(public navCtrl:NavController,
              private loadingCtrl:LoadingController,
              public navParams:NavParams, private toastService:ToastProvider,
              private userService:UserService,
              private indexProvider:IndexProvider) {

              /*
              * This selected index value will be 4 for First time only...
              */
              this.indexProvider.selectedIndex = 4;

  }

  changePassword() {

    if (this.credential.newPassword === this.credential.oldPassword) {
      this.toastService.presentToast('New Password should not be same as old Password');
      return;
    }

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
        this.credential.oldPassword = '';
        this.credential.newPassword = '';
        this.credential.rePassword = '';
        this.navCtrl.setRoot(PasscodeLockPage)
        this.toastService.presentToast('Password Changed Sucessfully');

      }, (err)=> {
        console.log(err)
        loader.dismiss();
        this.passwordChangeRequestStatus = 'rejected';

        this.toastService.presentToast('Password could not be changed');
      });
  }

}
