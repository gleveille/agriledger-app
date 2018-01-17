import {Component, Input} from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams, ViewController} from 'ionic-angular';
import {FingerprintProvider} from "../../providers/fingerprint";
import {FingerprintPage} from "../fingerprint/fingerprint";
import {TabsPage} from "../tabs/tabs";
import {UserService} from "../../providers/user.service";
import {ToastProvider} from "../../providers/toast";
import {Iuser} from "../../interface/user.interface";

@Component({
  selector: 'page-passcode-lock',
  templateUrl: 'passcode-lock.html',
})
export class PasscodeLockPage {

  user:Iuser={};
  enteredPasscode = '';
  passcodeWrong:boolean=false;
  passcodeLabel:string='Enter Passcode To Verify';

  constructor(public navCtrl: NavController,
              private viewController:ViewController,
              public navParams: NavParams,
              private userService:UserService,
              private toastService:ToastProvider,
              private loadingCtrl:LoadingController,
              private alertController:AlertController,
              private fingerprintService:FingerprintProvider) {

    this.user=this.userService.dataStore.user;
    this.userService.user.subscribe((user:Iuser)=> {
      this.user = user;
    });


    console.log(this.user.profiles.passcode)
    if(!this.user.profiles.passcode){
      this.passcodeLabel='Set your 6 digit passcode';

    }
    else{
      this.passcodeLabel='Enter Passcode To Verify'
      this.checkForFingerprint();


    }
  }
  presentConfirm(passcode:number) {
    let alert = this.alertController.create({
      title: 'Warning',
      message: 'This PIN you have created is extremely common and my be easily guessed by someone with access to your phone.would you like to use this PIN anyway?',
      buttons: [
        {
          text: 'TRY AGAIN',
          role: 'cancel',
          handler: () => {
            this.all_clear();
            console.log('Cancel clicked');
          }
        },
        {
          text: 'CONTINUE',
          handler: () => {
            this.createPasscode(passcode);
            console.log('Buy clicked');
          }
        }
      ]
    });
    alert.present();
  }


  isPasscodeAreTooEasy(passcode){
    if(/^([0-9])\1*$/.test(passcode)) {
      return true
    }

    else{
      return false;

    }
  }
  ionViewDidLoad() {
  }

  dismiss(isVerfied:boolean) {
    this.viewController.dismiss({success:isVerfied});
  }


  async checkForFingerprint(){
    const  isEnabled=await this.fingerprintService.isFingerPrintEnabled();
    console.log('from line 33')
    console.log(isEnabled)
    if(isEnabled){
      const isVerified=await this.fingerprintService.fingerprintVerification();
      if(isVerified){
        console.log('from passcode-lock page ..line 36')
        console.log('verfied')
        this.dismiss(true);
      }
      else
      {
        console.log('could not verified ohhh')
      }
    }
  }
  async checkIfFingerprintAvailable(){
    let isAvailable=await this.fingerprintService.isFingerPrintAvailable();
    if(isAvailable){
      this.navCtrl.setRoot(FingerprintPage);

    }
    else{
      this.navCtrl.setRoot(TabsPage);
    }
  }

  createPasscode(passcode:number):void {

      let loader = this.loadingCtrl.create({
        content: 'Setting Passcode..'
      });
      loader.present();

      this.user.profiles.passcode=passcode
      this.userService.updateProfile(this.user).subscribe(()=>{
        loader.dismiss();

        this.checkIfFingerprintAvailable();

      },(err)=>{
        loader.dismiss();
        this.user.profiles.passcode=null;

        this.toastService.presentToast(err.message || 'Passcode could not be set');
      })

  }
  digit(input:number){
    let digit=''+input;
    this.enteredPasscode+=digit;
    console.log(this.enteredPasscode)
    if(this.enteredPasscode.length===6){
      let passcode=parseInt(this.enteredPasscode);

      if(!this.user.profiles.passcode){
        let isTooEasy=this.isPasscodeAreTooEasy(passcode)
        if(isTooEasy){
          console.log('password are to easy')
          this.presentConfirm(passcode)
        }
        else{
          console.log('not too easy')
          this.createPasscode(passcode)
        }
        }
        else {
        if(passcode!==this.user.profiles.passcode){
          this.passcodeWrong=true;
          setTimeout(()=>{
            this.passcodeWrong=false;
            this.all_clear();
          },800)
        }
        else{
          this.dismiss(true);

        }

        }

    }
  }

  all_clear(){
    this.enteredPasscode = '';

  }

  delete(){
    this.enteredPasscode = this.enteredPasscode.slice(0,-1);

  }

}
