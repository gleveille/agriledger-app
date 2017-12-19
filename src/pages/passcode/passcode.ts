import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';
import {UserService} from "../../providers/user.service";
import {ToastProvider} from "../../providers/toast";
import {Iuser} from "../../interface/user.interface";
import {TabsPage} from "../tabs/tabs";



@IonicPage()
@Component({
  selector: 'page-passcode',
  templateUrl: 'passcode.html',
})
export class PasscodePage {

  authForm:FormGroup;

  user={} as Iuser;
  constructor(public nav:NavController, public navParams:NavParams,private toastService:ToastProvider,private userService:UserService,public formBuilder:FormBuilder) {


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
    })
  }

  onSubmit(value:any):void {
    if (this.authForm.valid) {
      this.userService.updatePasscode(value.passcode).subscribe(()=>{
        this.nav.setRoot(TabsPage);

      },(err)=>{
        this.toastService.presentToast(err.message);
      })

    }
  }

}
