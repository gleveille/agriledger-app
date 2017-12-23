import {Component, Input} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {FingerprintProvider} from "../../providers/fingerprint";

@Component({
  selector: 'page-passcode-lock',
  templateUrl: 'passcode-lock.html',
})
export class PasscodeLockPage {

  passcode:number=null;
  enteredPasscode = '';
  passcodeWrong:boolean=false;
  passcodeLabel:string='Enter passcode';

  constructor(public navCtrl: NavController,private viewController:ViewController,public navParams: NavParams,private fingerprintService:FingerprintProvider) {
    this.passcode=navParams.get('passcode');
    this.checkForFingerprint();

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

  digit(input:number){
    let digit=''+input;
    this.enteredPasscode+=digit;
    console.log(this.enteredPasscode)
    if(this.enteredPasscode.length===6){
      let pass=parseInt(this.enteredPasscode);
      if(pass!==this.passcode){
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

  all_clear(){
    this.enteredPasscode = '';

  }

  delete(){
    this.enteredPasscode = this.enteredPasscode.slice(0,-1);

  }

}
