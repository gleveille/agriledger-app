import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform, Events} from 'ionic-angular';
import {AssetsService} from "../../providers/assets.service";
import {UploadPage} from "../upload/upload";
import {Iuser} from "../../interface/user.interface";
import {UserService} from "../../providers/user.service";
import {ServerUrl} from "../../app/api.config";

@IonicPage()
@Component({
  selector: 'page-asset-info',
  templateUrl: 'asset-info.html',
})
export class AssetInfoPage {

  serverUrl = ServerUrl;
  asset = {category: {}} as any;
  assets = [];
  pet:string = "puppies";
  isAndroid:boolean = false;
  user = {} as Iuser;

  constructor(public navCtrl:NavController, private userService:UserService, public navParams:NavParams,
              private assetService:AssetsService, platform:Platform, private events:Events) {

    this.isAndroid = platform.is('android');

    this.events.subscribe('evidences:uploaded', (url)=> {

      this.asset.evidences.push(url);

    })
  }

  ionViewDidLoad() {
    this.userService.getUser().subscribe((user:Iuser)=> {
      this.user = user;
      console.log(this.user)
    }, (err)=> {
      console.log(err);
    });

    this.asset = this.navParams.get('asset');
    console.log(this.asset);
  }

  uploadPage() {
    console.log(this.asset)
    this.navCtrl.push(UploadPage, {config: {uploadType: 'evidences', assetId: this.asset.id, id: this.user.id}});
  }


}
