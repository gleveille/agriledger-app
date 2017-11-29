
import {Component} from '@angular/core';
import { Events } from 'ionic-angular';
import {ContainerApi} from '../../../src/app/api'

import { FileUploader } from 'ng2-file-upload';
import {NavParams, ViewController} from "ionic-angular/index";
import {IUploadPageConfig} from "../../interfaces/uploadPageConfig.interface";
import {UploadProvider} from "../../providers/upload/upload";

@Component({
  selector: 'page-uploads',
  templateUrl: 'upload.html',
})


export class UploadPage {
  url='';
  pageConfigData:IUploadPageConfig;
  uploader:FileUploader;


  constructor(public params: NavParams,
              public viewCtrl: ViewController,
              private events:Events,private uploadProvider:UploadProvider)
  {

    this.pageConfigData=params.get('config')||{};
    console.log('pageConfigData', params.get('config'));

    this.url=this.getApi();
    this.uploader=this.uploadProvider.initUploader(this.url,this.pageConfigData);


  }



  getApi(){
    if(this.pageConfigData.uploadType==='profile')
      return ContainerApi.ProfileUploadUrl();
    else if(this.pageConfigData.uploadType==='field')
      return ContainerApi.FieldUploadUrl();
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }
}
