import {Component} from '@angular/core';
import {Events} from 'ionic-angular';
import {ContainerApi} from '../../../src/app/api.config'
import {FileUploader} from 'ng2-file-upload';
import {NavParams, ViewController} from "ionic-angular/index";
import {IUploadPageConfig} from "../../interface/uploadPageConfig.interface";
import {UploadProvider} from "../../providers/upload";
import { Geolocation } from '@ionic-native/geolocation';


@Component({
  selector: 'page-uploads',
  templateUrl: 'upload.html',
})

export class UploadPage {
  url = '';
  lat = 0;
  long = 0;
  pageConfigData:IUploadPageConfig;
  uploader:FileUploader;

  constructor(public params:NavParams,
              public viewCtrl:ViewController,
              private events:Events, private uploadProvider:UploadProvider, private geolocation: Geolocation) {

    this.pageConfigData = params.get('config') || {};
    console.log('pageConfigData', params.get('config'));
    this.url = this.getApi();
    this.uploader = this.uploadProvider.initUploader(this.url, this.pageConfigData, this.lat, this.long);

    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp.coords.latitude);
      this.lat = resp.coords.latitude;
      console.log(resp.coords.longitude);
      this.long = resp.coords.longitude;
      this.uploader = this.uploadProvider.initUploader(this.url, this.pageConfigData, this.lat, this.long);

    }).catch((error) => {
      console.log('Error getting location', error);

    });
  }

  ionViewDidLoad() {


  }

  getApi() {
    if (this.pageConfigData.uploadType === 'profile')
      return ContainerApi.ProfileUploadUrl();
    else if (this.pageConfigData.uploadType === 'field')
      return ContainerApi.FieldUploadUrl();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }






}
