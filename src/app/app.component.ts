import { WelcomePage } from './../pages/welcome/welcome';
import { Component } from '@angular/core';
import {Platform, LoadingController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { Storage } from '@ionic/storage';
import {changeURL} from './api'
import {LoopbackProfileProvider} from "../providers/loopback-profile/loopback-profile";
import {Iprofile} from "../interfaces/profile.interface";
import {UserProvider} from "../providers/user/user";

declare var agrichainJS;
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
    rootPage:any=WelcomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,private storage:Storage,
              public loadingCtrl:LoadingController,private userService:UserProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      statusBar.overlaysWebView(true);

      statusBar.backgroundColorByHexString('#576293');
      splashScreen.hide();
      this.verify();

    });
  }

  async verify(){
    let loader = this.loadingCtrl.create({
      content: "Please wait checking credentials...",
      spinner: 'crescent'
    });
    loader.present();

    let accessToken;
    let userId;
    let profile;

    try{
      accessToken= await this.storage.get('accessToken');
      console.log('access token', accessToken)
    }

    catch (err){
      console.log(err);

    }



    try{
      userId= await this.storage.get('userId')
      console.log('userId', userId)

    }
    catch (err){
      console.log(err);

    }

    if(accessToken &&  userId){
      try{
        profile = await this.userService.getUser(userId,accessToken);
        console.log(profile)
        loader.dismiss();

        this.rootPage=TabsPage;
        return true;
      }

      catch (err){
        console.log(err);

      }

    }

    loader.dismiss();
    this.rootPage=WelcomePage;
    return false;
  }
}
