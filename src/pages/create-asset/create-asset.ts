import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AssetsService} from "../../providers/assets.service";


@IonicPage()
@Component({
  selector: 'page-create-asset',
  templateUrl: 'create-asset.html',
})
export class CreateAssetPage {

  constructor(public navCtrl:NavController, public navParams:NavParams, private assetService:AssetsService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateAssetPage');
  }

  private updateAssets() {
    
  }
  


}
