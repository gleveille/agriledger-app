import {Component} from '@angular/core';
import { NavController, NavParams, Events, LoadingController, ModalController} from 'ionic-angular';
import {AssetsService} from "../../providers/assets.service";
import {ToastProvider} from "../../providers/toast";
import {FingerprintProvider} from "../../providers/fingerprint";
import {UserService} from "../../providers/user.service";
import {Iuser} from "../../interface/user.interface";
import {PasscodeLockPage} from "../passcode-lock/passcode-lock";
import moment from 'moment';

@Component({
  selector: 'page-create-asset',
  templateUrl: 'create-asset.html',
})
export class CreateAssetPage {

  startDate:string;
  endDate:string = '2100-12-01';

  asset:any = {
    name: null,
    categoryId: null,
    inputDetails: null,
    expectedHarvestAmount: null,
    expectedHarvestDate: null,
    category: {level1: {}, level2: {}, level3: {}, level4: {}, level5: {}},
  };

  chosenLang = 1;
  selectedIndexOnLevelOne = null;
  selectedIndexOnLevelTwo = null;
  selectedIndexOnLevelThree = null;
  selectedIndexOnLevelFour = null;
  selectedIndexOnLevelFive = null;

  assetCategoriesLevelOne = [];
  assetCategoriesLevelTwo = [];
  assetCategoriesLevelThree = [];
  assetCategoriesLevelFour = [];
  assetCategoriesLevelFive = [];
  deepestCategorySelected = false;
  lastCategoryId = null;
  user={} as Iuser;

  constructor(public navCtrl:NavController,
              private modalController:ModalController,
              public navParams:NavParams,
              private assetsService:AssetsService,
              private events:Events,
              private toastService:ToastProvider,
              private fingerprintProvider:FingerprintProvider,
              public userService: UserService,  private loadingCtrl: LoadingController) {
                
              let date = new Date();
              this.startDate = date.getFullYear()+'-'+('0'+(date.getMonth()+1)).slice(-2)+'-'+('0'+date.getDate()).slice(-2).toString();            
  }

  ionViewDidLoad() {
    this.getCategories(0);
    this.userService.user.subscribe((user)=>{
      this.user=user;
    });
  }

  onAssetCategoryLevelChange(category:any, level:number, index:number) {
    console.log(category)
    console.log(level)

    if (!category.hasChildren) {
      this.deepestCategorySelected = true;
      this.lastCategoryId = category.id;
      this.asset.categoryId = this.lastCategoryId;
      return;
    }
    this.deepestCategorySelected = false;

    if (level === 0) {
      
      this.assetCategoriesLevelThree = [];
      this.assetCategoriesLevelFour = [];
      this.assetCategoriesLevelFive = [];

    }
    if (level === 1) {
      this.assetCategoriesLevelFour = [];
      this.assetCategoriesLevelFive = [];

    }
    if (level === 2) {
      this.assetCategoriesLevelFive = [];

    }

    this.assetsService.getCategories(category.id)
      .subscribe((assetCategory:Array<any>) => {
        console.log(assetCategory)
        if (level === 0) {
          this.assetCategoriesLevelTwo = assetCategory;

        }
        if (level === 1) {
          this.assetCategoriesLevelThree = assetCategory;

        }
        if (level === 2) {
          this.assetCategoriesLevelFour = assetCategory;

        }

        if (level === 3) {
          this.assetCategoriesLevelFive = assetCategory;
        }


      }, (err) => {
        this.toastService.presentToast('Something went wrong');
      })


  }

  getCategories(level:number) {
    return this.assetsService.getCategories(level)
      .subscribe((assetCategory:Array<any>) => {
        this.assetCategoriesLevelOne = assetCategory;
      }, (err) => {
        this.toastService.presentToast('Something went wrong');
      })
  }



  verifyBeforeregister(){
    let passcodeModal = this.modalController.create(PasscodeLockPage, { passcode: this.user.profiles.passcode });
    passcodeModal.present();
    passcodeModal.onDidDismiss(data => {
      console.log(data);
      if(data && data.success===true){
        this.registerAsset();
      }
      else{
      }
    });
  }


  registerAsset() {
    let asset = JSON.parse(JSON.stringify(this.asset));
    console.log(this.asset)
    for (let level in this.asset.category) {

      if (this.asset.category[level].attrs && this.asset.category[level].attrs.length)
        asset.category[level] = this.asset.category[level].attrs[this.chosenLang];
      else
        asset.category[level] = '';
    }
    let loader = this.loadingCtrl.create({
      content: 'Creating Asset..'
    });
    loader.present();

    this.assetsService.createAsset(asset).subscribe((data)=> {
      loader.dismiss();
      this.toastService.presentToast('Created Succesfully');
      this.navCtrl.pop();
    }, (err)=> {
      console.log(err)
      loader.dismiss();
      this.toastService.presentToast('Asset could not be created');
    })
  }

  uploadPage() {
    //this.navCtrl.push(UploadPage, {config: {uploadType: 'field'}});
  }


}
