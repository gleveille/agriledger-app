import {WelcomePage} from './../pages/welcome/welcome';
import {Component} from '@angular/core';
import {Platform, LoadingController, Content, ModalController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {TabsPage} from '../pages/tabs/tabs';
import {UserService} from "../providers/user.service";
import {CacheService} from 'ionic-cache';
import {ChangePasswordPage} from "../pages/change-password/change-password";
import {PasscodePage} from "../pages/passcode/passcode";
import {PasscodeLockPage} from "../pages/passcode-lock/passcode-lock";
import {AssetsService} from "../providers/assets.service";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = null;

  constructor(private platform:Platform,
              private modalController:ModalController,
              statusBar:StatusBar, splashScreen:SplashScreen,
              public loadingCtrl:LoadingController,
              private userService:UserService,
              private assetService:AssetsService,
              public cache:CacheService) {
    platform.ready().then(() => {

      splashScreen.hide();

      this.verify();

    });
  }

  async verify() {
    let loader = this.loadingCtrl.create({
      content: "Please wait checking credentials...",
      spinner: 'crescent'
    });
    loader.present();

    this.userService.loadUser().subscribe((user)=> {
      console.log(user)
      loader.dismiss();
      if (user && user.id) {
        if (!user.isPasswordChanged) {
          this.rootPage = ChangePasswordPage
        }
        else if (!user.profiles.passcode) {
          this.rootPage = PasscodePage;
        }
        else{
          let passcodeModal = this.modalController.create(PasscodeLockPage, { passcode: user.profiles.passcode });
          passcodeModal.present();
          passcodeModal.onDidDismiss(data => {
            console.log(data);
            if(data && data.success===true){
              this.rootPage=TabsPage;
            }
            else{
              this.platform.exitApp();
            }
          });
        }
      }

      else
        this.rootPage = WelcomePage
    }, (err)=> {
      loader.dismiss();
      this.rootPage = WelcomePage
    })
  }



}
