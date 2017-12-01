import { WelcomePage } from './../pages/welcome/welcome';
import { Component } from '@angular/core';
import {Platform, LoadingController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { Storage } from '@ionic/storage';
import {UserService} from "../providers/user.service";

declare var agrichainJS;
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
    rootPage:any=WelcomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,private storage:Storage,
              public loadingCtrl:LoadingController,private userService:UserService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      statusBar.overlaysWebView(true);

      statusBar.backgroundColorByHexString('#576293');
      splashScreen.hide();
      this.verify();

    });
  }

  verify(){
    let loader = this.loadingCtrl.create({
      content: "Please wait checking credentials...",
      spinner: 'crescent'
    });
    loader.present();

    this.userService.getUser().subscribe((user)=>{
      console.log(user)
      loader.dismiss();
      this.rootPage=TabsPage
    },(err)=>{
      console.log(err);
      loader.dismiss();
      this.rootPage=WelcomePage
    })
  }
}
