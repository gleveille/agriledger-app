import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AssetsService} from "../../providers/assets.service";
import {ToastProvider} from "../../providers/toast";
import {UploadPage} from "../upload/upload";
import {FingerprintProvider} from "../../providers/fingerprint";
import {UserService} from "../../providers/user.service";
import {Iuser} from "../../interface/user.interface";


@IonicPage()
@Component({
  selector: 'page-create-asset',
  templateUrl: 'create-asset.html',
})
export class CreateAssetPage {

  startDate:string = '2017-12-01';
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

  constructor(public navCtrl:NavController, public navParams:NavParams, private assetsService:AssetsService, private toastService:ToastProvider,
              private fingerprintProvider:FingerprintProvider, public userService: UserService) {

  }

  ionViewDidLoad() {
    this.getCategories(0);
    this.userService.getUser().subscribe((user)=>{
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
        this.toastService.presentToast('Category', 'Something went wrong');
      })


  }

  getCategories(level:number) {
    return this.assetsService.getCategories(level)
      .subscribe((assetCategory:Array<any>) => {
        this.assetCategoriesLevelOne = assetCategory;
      }, (err) => {
        this.toastService.presentToast('Category', 'Something went wrong');
      })
  }

  async verify() {
    let asset = JSON.parse(JSON.stringify(this.asset));
    console.log(this.asset)
    for (let level in this.asset.category) {

      if (this.asset.category[level].attrs && this.asset.category[level].attrs.length)
        asset.category[level] = this.asset.category[level].attrs[this.chosenLang];
      else
        asset.category[level] = '';
    }
    this.fingerprintProvider.presentActionSheet(this.registerAsset, this, this.user.passcode,false, asset);

  }


  registerAsset(params:any[]) {
    const asset=params[0];
    console.log(asset)
    this.assetsService.createAsset(asset).subscribe((data)=> {
      console.log('saveed succesfully')
      this.toastService.presentToast('Saved Succesfully');
      this.navCtrl.pop();
    }, (err)=> {
      console.log(err)
      this.toastService.presentToast('Something went wrong');
    })
  }

  uploadPage() {
    this.navCtrl.push(UploadPage, {config: {uploadType: 'field'}});
  }


}
