import {Component} from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {NavController, AlertController} from "ionic-angular/index";
import {UploadPage} from "../upload/upload";
import {SocialSharing} from "@ionic-native/social-sharing";
import {ServerUrl} from '../../app/api.config'
import {ToastProvider} from "../../providers/toast";
import {IUploadPageConfig} from "../../interface/uploadPageConfig.interface";

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  serverUrl=ServerUrl;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, private socialSharing: SocialSharing,
              private toastCtrl: ToastProvider) {

  }

  upload() {
    this.navCtrl.push(UploadPage,{config:{uploadType:'profile'}});
  }

}
