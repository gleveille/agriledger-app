import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AssetInfoPage} from "../asset-info/asset-info";
import {CreateAssetPage} from "../create-asset/create-asset";
import {AssetsService} from "../../providers/assets.service";
import {UploadPage} from "../upload/upload";

@Component({
  selector: 'page-assets',
  templateUrl: 'assets.html',
})
export class AssetsPage {

  assets = [];
  pet: string = "puppies";


  constructor(public navCtrl:NavController, public navParams:NavParams, private assetService:AssetsService) {

  }

  assetInfo(asset) {
    this.navCtrl.push(AssetInfoPage,{asset:asset});
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

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.assetService.getMyAssets().subscribe((data)=>{
      console.log(data)
      this.assets=data;
    },(err)=>{
      console.log(err)
    })

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }


}
