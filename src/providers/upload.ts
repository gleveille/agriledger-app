import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {FileUploader} from 'ng2-file-upload';
import {Events} from "ionic-angular/index";
import {HttpClient} from "@angular/common/http";


@Injectable()
export class UploadProvider {
  uploader:FileUploader;

  constructor(public http:HttpClient, private events:Events) {

  }

  initUploader(url, config) {
    this.uploader = new FileUploader({
      url: url,
      headers: [{name: 'x-id', value: config.id}],
    });

    this.uploader.onAfterAddingFile = (file:any)=> {
      console.log(file)
      file.withCredentials = false;
      if (config.uploadType === 'profile') {
        this.uploader.clearQueue()
        this.uploader.queue.push(file);
      }
      else if (config.uploadType === 'field') {
        this.uploader.clearQueue()
        this.uploader.queue.push(file);
      }
    };

    this.uploader.onSuccessItem = (item:any, response:any)=> {
      let data:any;
      let url = '';
      try {
        data = JSON.parse(response);
        url = data.result.url;
        this.events.publish('profileImage:uploaded', url);

      }
      catch (e) {

      }
    };

    return this.uploader;
  }

}
