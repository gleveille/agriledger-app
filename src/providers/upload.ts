import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {FileUploader} from 'ng2-file-upload';
import {Events} from "ionic-angular/index";
import {HttpClient} from "@angular/common/http";
import {Geolocation} from '@ionic-native/geolocation';

import {FileTransfer, FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer';
import {File} from '@ionic-native/file';

@Injectable()
export class UploadProvider {
  uploader:FileUploader;

  constructor(public http:HttpClient, private events:Events, private geolocation:Geolocation, private transfer:FileTransfer, private file:File) {

  }

  uploadFromCamera(photo:any, url, config, lat, long) {
    const fileTransfer:FileTransferObject = this.transfer.create();
    const timestamp = Date.now();
    let options:FileUploadOptions = {
      fileKey: 'file',
      fileName: timestamp + '.jpg',
      headers: {'x-assetId': config.assetId, 'x-id': config.id, lat: lat, long: long}
    };

    return new Promise((resolve, reject)=> {
      fileTransfer.upload(photo, url, options).then((result:any)=> {
        try {
          let data:any = JSON.parse(result.response);
          url = data.result.url;
          console.log(config.uploadType)
          if (config.uploadType === 'profile')
            this.events.publish('profileImage:uploaded', url);

          if (config.uploadType === 'evidences')
            this.events.publish('evidences:uploaded', url);

          resolve(url);

        }
        catch (err) {
          console.log('%c errrrrrrrrrrreeeeeeeeeeeeeee','color:red')
          console.log(err)
          resolve(null);
        }
      }).catch((err)=> {
        reject(err);
      })
    })
  }

  initUploader(url, config, lat, long) {
    this.uploader = new FileUploader({
      url: url,
      headers: [{name: 'x-id', value: config.id},
        {name: 'x-assetId', value: config.assetId},
        {name: 'lat', value: lat}, {name: 'long', value: long}],
    });

    this.uploader.onAfterAddingFile = (file:any)=> {
      console.log(file)
      file.withCredentials = false;
      if (config.uploadType === 'profile') {
        this.uploader.clearQueue()
        this.uploader.queue.push(file);
      }
      else if (config.uploadType === 'evidences') {
        this.uploader.clearQueue()
        this.uploader.queue.push(file);
      }
    };

    this.uploader.onSuccessItem = (item:any, response:any)=> {
      let data:any;
      let url = '';
      try {
        data = JSON.parse(response);
        console.log(data)
        url = data.result.url;
        if (config.uploadType === 'profile')
          this.events.publish('profileImage:uploaded', url);

        if (config.uploadType === 'evidences')
          this.events.publish('evidences:uploaded', url);
      }
      catch (e) {

      }
    };
    return this.uploader;
  }

}
