import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Component, Renderer } from '@angular/core';
import {   ViewController } from 'ionic-angular';
import {ServerUrl} from '../../app/api.config'
import { AssetsService } from '../../providers/assets.service';
import { ToastProvider } from '../../providers/toast';
import { LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-image-dialog',
  templateUrl: 'image-dialog.html',
})
export class ImageDialogPage {
  serverUrl = ServerUrl;
  description='';
  asset={evidences:[],documents:[]};
  type='evidences';
  index=0;
  constructor(private navParams:NavParams ,
    private toastService:ToastProvider,
    private assetService:AssetsService,
    public renderer: Renderer, public viewCtrl: ViewController,
    private loadingCtrl:LoadingController) {
    // this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'page-image-dialog', true);
    console.log(this.navParams.data)
    console.log(this.navParams.get('asset'));
    console.log(this.navParams.get('type'));
    console.log(this.navParams.get('index'));
    this.asset =  this.navParams.get('asset');
    this.type = this.navParams.get('type');
    this.index = this.navParams.get('index');
    this.description=this.asset[this.type][this.index].description;
    
  }

  ionViewDidLoad() {
    
    console.log('ionViewDidLoad ImageDialogPage');
  }


  onCloseClick(){
    this.viewCtrl.dismiss();
  }

  save(){
    let loader = this.loadingCtrl.create({
      content: 'Upading..'
    });
    loader.present();
      this.asset[this.type][this.index].description=this.description;
      this.assetService.updateAsset(this.asset).subscribe(()=>{
        loader.dismiss();
        this.toastService.presentToast('Updated')
      },(err)=>{
        this.toastService.presentToast(err.message || 'Could not be updated');
      })

  }

}
