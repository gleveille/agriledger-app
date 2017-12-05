import {Component} from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {NavController, AlertController} from "ionic-angular/index";
import {UploadPage} from "../upload/upload";
import {SocialSharing} from "@ionic-native/social-sharing";


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, private socialSharing: SocialSharing) {

  }

  upload() {
    this.navCtrl.push(UploadPage,{config:{uploadType:'profile'}});
  }

  contactUs() {
    let alert = this.alertCtrl.create({
      title: 'Hi!',
      subTitle: 'To make changes to your details please Contact Us!',
      buttons: ['OK']
    });
    alert.present();
  }

}
