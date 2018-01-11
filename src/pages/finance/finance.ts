import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Iuser} from "../../interface/user.interface";
import {UserService} from "../../providers/user.service";

@Component({
  selector: 'page-finance',
  templateUrl: 'finance.html',
})
export class FinancePage {

  user = {profileUrl: {}} as Iuser;
  segmentName: string = 'loan';
  overlayHidden: boolean = false;



  constructor(public navCtrl:NavController, public navParams:NavParams,
              private userService:UserService) {


  }

  ionViewDidLoad() {
    this.userService.user.subscribe((user:Iuser)=>{
      this.user=user;
    });

  }


}
