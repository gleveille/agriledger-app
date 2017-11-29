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

declare var agrichainJS;
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
    rootPage:any=WelcomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,storage:Storage,
              public loadingCtrl:LoadingController,private loopbackservice:LoopbackProfileProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      statusBar.overlaysWebView(true);

      statusBar.backgroundColorByHexString('#576293');
      splashScreen.hide();

      let loader = this.loadingCtrl.create({
        content: "Please wait checking credentials...",
        spinner: 'crescent'
      });

      loader.present();
      storage.get('urlconfig').then((urls)=>{
        console.log('manually entered urls are')
        console.log(urls)
        if(urls)
        changeURL(urls.lbURL,urls.bcURL);
        storage.get('agriId').then((agriId:string)=>{
          console.log('agriId from local storage is')
          console.log(agriId)
          if(agriId){
            this.loopbackservice.getProfile(agriId).then((profile:Iprofile)=>{
              loader.dismiss();
              this.rootPage=TabsPage;

            }).catch((err)=>{
              loader.dismiss();
              this.rootPage=WelcomePage;

            })
          }


          else{
            loader.dismiss();
            this.rootPage=WelcomePage;


          }
        }).catch((err)=>{
          console.log(err)
          loader.dismiss();
          this.rootPage=WelcomePage;
        })
      }).catch(()=>{
        loader.dismiss();
        this.rootPage=WelcomePage;
      })

    });
  }
}
