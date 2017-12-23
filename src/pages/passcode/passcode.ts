import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  constructor(public nav:NavController, public navParams:NavParams,
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
    this.userService.getUser().subscribe((user:Iuser)=>{
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
      this.userService.updateProfile(this.user).subscribe(()=>{

        this.checkIfFingerprintAvailable();

      },(err)=>{
        this.toastService.presentToast(err.message);
      })

    }
  }

}
