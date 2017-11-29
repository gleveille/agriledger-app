import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AssetInfoPage} from "../asset-info/asset-info";
import {CreateAssetPage} from "../create-asset/create-asset";

@Component({
  selector: 'page-assets',
  templateUrl: 'assets.html',
})
export class AssetsPage {


  constructor(public navCtrl:NavController, public navParams:NavParams)
  {

  }

  assetInfo() {
    this.navCtrl.push(AssetInfoPage);
  }

  createAsset() {
    this.navCtrl.push(CreateAssetPage);
  }

}
