import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';
import {UserService} from "../../providers/user.service";
import {ToastProvider} from "../../providers/toast";
import {Iuser} from "../../interface/user.interface";
import {TabsPage} from "../tabs/tabs";
import {FingerprintPage} from "../fingerprint/fingerprint";
import {FingerprintProvider} from "../../providers/fingerprint";



@Component({
  selector: 'page-passcode',
  templateUrl: 'passcode.html',
})
export class PasscodePage {

  isFingerPrintAvailable:boolean=false;
  authForm:FormGroup;

  user={} as Iuser;
  constructor(public nav:NavController, public navParams:NavParams,private loadingCtrl:LoadingController,
              private fingerprintService:FingerprintProvider,
              private toastService:ToastProvider,private userService:UserService,public formBuilder:FormBuilder) {


    this.authForm = formBuilder.group({
      passcode: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(6),
                 Validators.pattern('^[0-9]{6,6}$')])],
      passcode1: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(6),
        Validators.pattern('^[0-9]{6,6}$')])]
    });
  }

  ionViewDidLoad(){
    this.userService.user.subscribe((user:Iuser)=>{
      this.user=user;
      console.log(this.user)
    })
  }


  async checkIfFingerprintAvailable(){
      let isAvailable=await this.fingerprintService.isFingerPrintAvailable();
      if(isAvailable){
        this.nav.setRoot(FingerprintPage);

      }
      else{
        this.nav.setRoot(TabsPage);
      }
  }

  onSubmit(value:any):void {
    if (this.authForm.valid) {
      if(value.passcode !==value.passcode1){
        return this.toastService.presentToast('Passcode does not match');
      }

      console.log(this.user)

      this.user.profiles.passcode=value.passcode;
      let loader = this.loadingCtrl.create({
        content: 'Setting Passcode..'
      });
      loader.present();

      this.userService.updateProfile(this.user).subscribe(()=>{
        loader.dismiss();

        this.checkIfFingerprintAvailable();

      },(err)=>{
        loader.dismiss();

        this.toastService.presentToast(err.message || 'Passcode could not be set');
      })

    }
  }

}
