import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {ForgotPasswordPage} from "../forgot-password/forgot-password";
import {LoginPage} from "../login/login";

/**
 * Generated class for the EmailSentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-email-sent',
  templateUrl: 'email-sent.html',
})
export class EmailSentPage {

  email:string=null;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.email=this.navParams.get('email')||null;
  }

  ionViewDidLoad() {
  }
  goToLoginPage(){
    this.navCtrl.setRoot(LoginPage)
  }

  goToForgetPasswordPage(){
    this.navCtrl.setRoot(ForgotPasswordPage)
  }
}
