import {Component} from '@angular/core';
import {NavController, NavParams, Events, IonicPage} from 'ionic-angular';
import {AssetsService} from "../../providers/assets.service";
import {CreateAssetPage} from "../create-asset/create-asset";
import {AssetInfoPage} from "../asset-info/asset-info";

@Component({
  selector: 'page-assets',
  templateUrl: 'assets.html',
})
export class AssetsPage {

  assets = [];
  status: string = "all";

  availableAssets:any[]=[];
  pooledAssets:any[]=[];
  rejectedAssets:any[]=[];

  constructor(public navCtrl:NavController,
              public navParams:NavParams, private assetService:AssetsService) {

  }


  ionViewDidLoad() {
    this.subscribeMyAssets();
    console.log(this.assets);
  }


  subscribeMyAssets(){
    this.assetService.myAssets.subscribe((assets:any[])=>{
      this.assets=assets;
      this.availableAssets= [];
      this.pooledAssets= [];
      this.rejectedAssets= [];
console.log(assets)
      assets.forEach((asset)=>{
        if(asset.status==='available'){
          this.availableAssets.push(asset);
        }
        else if(asset.status==='pooled'){
          this.pooledAssets.push(asset);
        }
        else if(asset.status==='rejected'){
          this.rejectedAssets.push(asset);
        }
      });

    });
  }
  assetInfo(asset) {
    this.navCtrl.push(AssetInfoPage,{asset:asset});
  }

  createAsset() {
    this.navCtrl.push(CreateAssetPage);
  }



}
