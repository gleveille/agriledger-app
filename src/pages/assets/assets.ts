import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AssetInfoPage} from "../asset-info/asset-info";
import {CreateAssetPage} from "../create-asset/create-asset";
import {AssetsService} from "../../providers/assets.service";

@Component({
  selector: 'page-assets',
  templateUrl: 'assets.html',
})
export class AssetsPage {

  assets = [];

  constructor(public navCtrl:NavController, public navParams:NavParams, private assetService:AssetsService) {

  }

  assetInfo() {
    this.navCtrl.push(AssetInfoPage);
  }

  createAsset() {
    this.navCtrl.push(CreateAssetPage);
  }

  ionViewDidLoad() {
    this.assetService.getMyAssets().subscribe((data)=>{
      console.log(data)
      this.assets=data;
    },(err)=>{
      console.log(err)
    })
  }

}
