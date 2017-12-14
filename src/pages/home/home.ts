import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Events, AlertController} from 'ionic-angular';
import {AssetsPage} from "../assets/assets";
import {InformationPage} from "../information/information";
import {UserService} from "../../providers/user.service";
import {Iuser} from "../../interface/user.interface";
import {ToastProvider} from "../../providers/toast";
import {ServerUrl} from "../../app/api.config";
import {UploadPage} from "../upload/upload";

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  serverUrl = ServerUrl;
  user = {profileUrl: {}} as Iuser;
  totalAssets:number=null;

  constructor(public navCtrl:NavController, public navParams:NavParams, private events:Events, public alertCtrl:AlertController,
              private toastCtrl:ToastProvider, private userService:UserService) {

    this.events.subscribe('profileImage:uploaded', (url)=> {
      console.log(url)
      this.user.profileUrl.url = url;
    })

    this.events.subscribe('hello', (currentWeather)=>{
      console.log('tessssssssssssssssssss')
      console.log(currentWeather)
    });

  }

  ionViewDidLoad() {
    this.userService.getUser().subscribe((user:Iuser)=> {
      this.user = user;
      console.log(this.user)
    }, (err)=> {
      console.log(err);
    });

    this.userService.getAssetsCount().subscribe((data:any)=> {
      this.totalAssets=data.count;
    }, (err)=> {
      console.log(err);
    });

  }

  assets() {
    /*this.navCtrl.push(AssetsPage);*/
  }

  information() {
    /*this.navCtrl.push(InformationPage);*/
  }

  upload() {
    this.navCtrl.push(UploadPage, {config: {uploadType: 'profile', id: this.user.id}});
  }

}
