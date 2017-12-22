import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform, Events, ActionSheetController} from 'ionic-angular';
import {AssetsService} from "../../providers/assets.service";
import {Iuser} from "../../interface/user.interface";
import {UserService} from "../../providers/user.service";
import {ServerUrl} from "../../app/api.config";
import {UploadProvider} from "../../providers/upload";
import {IUploadPageConfig} from "../../interface/uploadPageConfig.interface";
import {ToastProvider} from "../../providers/toast";
import {FingerprintProvider} from "../../providers/fingerprint";

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

  constructor(public navCtrl:NavController,
              private actionSheetCtrl:ActionSheetController,
              private uploadService:UploadProvider,
              private toastService:ToastProvider,
              private userService:UserService,
              public navParams:NavParams,
              private assetsService: AssetsService, platform:Platform, private events:Events,
              public fingerprintProvider: FingerprintProvider) {

    this.isAndroid = platform.is('android');

    this.userService.getAssets();

    this.events.subscribe('evidences:uploaded', (url)=> {
      console.log(url);
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

    this.presentActionSheet()
  }


  async upload(source:string){
    const config:IUploadPageConfig={
      assetId:this.asset.id,
      uploadType:'evidences', //profile,field
      id:this.user.id
    };
    let isUploaded;
    if(source==='camera'){
      isUploaded=await this.uploadService.takePhotoFromCamera(config);

    }
    else {
      isUploaded=await this.uploadService.takePhotoFromAlbum(config);

    }
    if(isUploaded){
      this.toastService.presentToast('Upload successfully');
      return true;

    }
    else{
      this.toastService.presentToast('Upload failed.try again');
      return false;
    }
  }


  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Modify your album',
      buttons: [
        {
          text: 'From Gallery',
          handler: () => {
            this.upload('album')
            console.log('Destructive clicked');
          }
        },
        {
          text: 'From Camera',
          handler: async() => {
            await this.upload('camera')

            console.log('Archive clicked');
          }
        },

        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }

  async verify() {
    let asset = JSON.parse(JSON.stringify(this.asset));
    console.log(this.asset)
    /*for (let level in this.asset.category) {

      if (this.asset.category[level].attrs && this.asset.category[level].attrs.length)
        asset.category[level] = this.asset.category[level].attrs[this.chosenLang];
      else
        asset.category[level] = '';
    }*/

    let isVerified=await  this.fingerprintProvider.securityCheck(this.user.passcode);
    if(isVerified){
      this.updateAsset(asset);
    }
    else{

    }

  }

  updateAsset(asset:any) {
    console.log(asset)
    this.assetsService.updateAsset(asset).subscribe((data)=> {
      console.log('saved succesfully')
      this.toastService.presentToast('Saved Succesfully');
    }, (err)=> {
      console.log(err)
      this.toastService.presentToast('Something went wrong');
    })
  }


}
