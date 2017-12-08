import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Events, AlertController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {InformationPage} from "../information/information";
import {Iuser} from "../../interface/user.interface";
import {ServerUrl} from "../../app/api.config";
import {ToastProvider} from "../../providers/toast";
import {UserService} from "../../providers/user.service";

@IonicPage()
@Component({
  selector: 'page-finance',
  templateUrl: 'finance.html',
})
export class FinancePage {

  city: string;
  serverUrl = ServerUrl;
  user = {profileUrl: {}} as Iuser
  pet: string = "puppies";

  constructor(public navCtrl:NavController, public navParams:NavParams,
              private storage:Storage, private events:Events, public alertCtrl:AlertController,
              private toastCtrl:ToastProvider, private userService:UserService) {

    
  }

  ionViewDidLoad() {
    this.userService.getUser().subscribe((user:Iuser)=>{
      this.user=user;
      console.log(this.user)
    },(err)=>{
      console.log(err);
    });
  }


}
