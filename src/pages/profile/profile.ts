import {Component} from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {NavController, AlertController, Events} from "ionic-angular/index";
import {UploadPage} from "../upload/upload";
import {SocialSharing} from "@ionic-native/social-sharing";
import {ServerUrl} from '../../app/api.config'
import {ToastProvider} from "../../providers/toast";
import {IUploadPageConfig} from "../../interface/uploadPageConfig.interface";
import {UserService} from "../../providers/user.service";
import {Iuser} from "../../interface/user.interface";

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  serverUrl = ServerUrl;
  user = {profileUrl: {}} as Iuser

  constructor(public navCtrl:NavController, private events:Events, public alertCtrl:AlertController, private socialSharing:SocialSharing,
              private toastCtrl:ToastProvider, private userService:UserService) {

    this.events.subscribe('profileImage:uploaded', (url)=> {
      console.log(url)
      this.user.profileUrl.url = url;
    })
  }

  ionViewDidLoad() {
    this.userService.getUser().subscribe((user:Iuser)=> {
      this.user = user;
      console.log(this.user)
    }, (err)=> {
      console.log(err);
    });
  }

  upload() {
    this.navCtrl.push(UploadPage, {config: {uploadType: 'profile', id: this.user.id}});
  }

}
