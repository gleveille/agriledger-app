import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { FileUploader } from 'ng2-file-upload';
import {AzureApiSubscriptionKey} from '../../../src/app/api'
import {Events} from "ionic-angular/index";


@Injectable()
export class UploadProvider {
  uploader:FileUploader;

  constructor(public http: Http,private events:Events) {

  }
  initUploader(url,config){
    this.uploader= new FileUploader({
      url: url,
      headers:[{name:"Ocp-Apim-Subscription-Key",value:AzureApiSubscriptionKey},
        {name:'x-id',value:config.id},{name:'Ocp-Apim-Trace',value:'true'}],
    });

    this.uploader.onAfterAddingFile = (file:any)=> {
      console.log(file)
      file.withCredentials = false;
      if(config.uploadType==='profile')
      {
        this.uploader.clearQueue()
        this.uploader.queue.push(file);
      }
    };


    this.uploader.onSuccessItem=(item:any,response:any)=>{
      let data:any;
      let url='';
      try{
        data= JSON.parse(response);
        url=data.result.url;
        this.events.publish('profileImage:uploaded',url);

      }
      catch (e){

      }
    };

    return this.uploader;
  }

}
