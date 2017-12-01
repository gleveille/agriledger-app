import { Component } from '@angular/core';
import { NavController, NavParams,LoadingController } from 'ionic-angular';
import {ToastProvider} from "../../providers/toast";
import {WelcomePage} from "../welcome/welcome";


@Component({
  selector: 'page-community',
  templateUrl: 'community.html',
})
export class CommunityPage {

  constructor(private navCtrl: NavController,
              private loadingCtrl:LoadingController,
              private toastProvider:ToastProvider,
              private navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommunityPage');
  }
}
