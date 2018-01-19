import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServerUrl } from '../../app/api.config';
import { Iuser } from '../../interface/user.interface';
import { ViewController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { ToastProvider } from '../../providers/toast';
import { UserService } from '../../providers/user.service';


@IonicPage()
@Component({
  selector: 'page-user-document-dialog',
  templateUrl: 'user-document-dialog.html',
})
export class UserDocumentDialogPage {
  serverUrl = ServerUrl;
  description='';
  user={profiles:{
    farmDetails: {farmName: '', products: '', crops: '', grade: '', size: '', region: ''},
    documents: [],
    address: {line1: '', line2: '', city: '', province: ''}}} as Iuser;
  type='evidences';
  index=0;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl:ViewController,
    private loadingCtrl:LoadingController,
    private toastService:ToastProvider,
    private userService:UserService) {

    console.log(this.navParams.data);
    console.log(this.navParams.get('user'));
    console.log(this.navParams.get('type'));
    console.log(this.navParams.get('index'));
    this.user =  this.navParams.get('user');
    this.type = this.navParams.get('type');
    this.index = this.navParams.get('index');
    this.description=this.user.profiles[this.type][this.index].description;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserDocumentDialogPage');
  }

  onCloseClick(){
    this.viewCtrl.dismiss();
  }

  save(){
    let loader = this.loadingCtrl.create({
      content: 'Upading..'
    });
    loader.present();
      this.user.profiles[this.type][this.index].description=this.description;
      this.userService.updateProfile(this.user).subscribe(()=>{
        loader.dismiss();
        this.toastService.presentToast('Updated')
      },(err)=>{
        this.toastService.presentToast(err.message || 'Could not be updated');
      })

  }

}
