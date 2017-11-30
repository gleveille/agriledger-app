import { Component } from '@angular/core';
import {NavController, NavParams, Form} from 'ionic-angular';
import {UserProvider} from "../../providers/user/user";
import {NgForm} from "@angular/forms/forms";
import {ToastProvider} from "../../providers/toast/toast";
import {TabsPage} from "../tabs/tabs";

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private userService:UserProvider,private toastService:ToastProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login(f:NgForm){

    this.userService.login({email:f.value.email,password:f.value.password}).subscribe((data:any)=>{
      console.log(data);
      this.navCtrl.push(TabsPage);
    },(err)=>{
      console.log(err);
      this.toastService.presentToast('Login failed');
    })

  }
}
