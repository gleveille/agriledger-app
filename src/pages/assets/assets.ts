import {Component} from '@angular/core';
import {NavController, NavParams, Events, IonicPage} from 'ionic-angular';
import {AssetsService} from "../../providers/assets.service";
import {UserService} from "../../providers/user.service";
import {CreateAssetPage} from "../create-asset/create-asset";
import {AssetInfoPage} from "../asset-info/asset-info";

@Component({
  selector: 'page-assets',
  templateUrl: 'assets.html',
})
export class AssetsPage {

  assets = [];
  pet: string = "puppies";


  constructor(public navCtrl:NavController,
              private events:Events,
              public navParams:NavParams, private assetService:AssetsService) {

    this.events.subscribe('new-asset',(asset)=>{
      console.log('asset got from event')
      console.log(asset)
      this.assets.unshift(asset)
    })

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
      refresher.complete();

    },(err)=>{
      console.log(err)
      refresher.complete();

    })

  }


}
