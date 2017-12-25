import {WelcomePage} from './../pages/welcome/welcome';
import {Component} from '@angular/core';
import {Platform, LoadingController, Content, ModalController, AlertController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {TabsPage} from '../pages/tabs/tabs';
import {UserService} from "../providers/user.service";
import {CacheService} from 'ionic-cache';
import {ChangePasswordPage} from "../pages/change-password/change-password";
import {PasscodeLockPage} from "../pages/passcode-lock/passcode-lock";
import {AssetsService} from "../providers/assets.service";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = null;
  confirmation:string='resolved';

  constructor(private platform:Platform,
              private modalController:ModalController,
              private alertCtrl:AlertController,
              private statusBar:StatusBar, splashScreen:SplashScreen,
              public loadingCtrl:LoadingController,
              private userService:UserService,
              private assetService:AssetsService,
              public cache:CacheService) {
    platform.ready().then(() => {
      platform.registerBackButtonAction(() => {
        if(this.confirmation==='resolved'){
          this.confirmation='pending';
          this.presentConfirm();

        }
      }, 0)


      splashScreen.hide();

      this.verify();

    });
  }
  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Confirm Exit',
      message: 'Do you want Exit?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.confirmation='resolved'

          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.confirmation='resolved'

            this.platform.exitApp();
          }
        }
      ]
    });
    alert.present().then(()=>{
    }).catch((err)=>{

    })
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
          console.log('go to passcode lock page')
          this.rootPage = PasscodeLockPage;
        }
        else{
          let passcodeModal = this.modalController.create(PasscodeLockPage);
          passcodeModal.present();
          passcodeModal.onDidDismiss(data => {
            console.log(data);
            if(data && data.success===true){
              this.rootPage=TabsPage;
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
