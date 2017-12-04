import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {AssetsService} from "../../providers/assets.service";


@IonicPage()
@Component({
  selector: 'page-asset-info',
  templateUrl: 'asset-info.html',
})
export class AssetInfoPage {

  asset = {};

  pet: string = "puppies";

  constructor(public navCtrl:NavController, public navParams:NavParams, private assetService:AssetsService) {

  }

  ionViewDidLoad() {
    this.asset = this.navParams.get('asset');
    console.log(this.asset)
  }
}
