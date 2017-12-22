import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {Events, LoadingController} from "ionic-angular/index";
import {HttpClient} from "@angular/common/http";
import {Geolocation} from '@ionic-native/geolocation';

import {ContainerApi} from '../app/api.config';

import {FileTransfer, FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer';
import {Camera,CameraOptions} from "@ionic-native/camera";

@Injectable()
export class UploadProvider {
  loader:any;

  constructor(public http:HttpClient, private events:Events,
              private loadingCtrl:LoadingController,
              private camera:Camera,
              private geolocation:Geolocation,
              private transfer:FileTransfer) {

  }


  async takePhotoFromCamera(config:any) {
    let base64Image=null;
    const options:CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType:this.camera.PictureSourceType.CAMERA,
      targetWidth: 450,
      targetHeight: 450,
      correctOrientation: true,
    };

    try{
      const imageData=await this.camera.getPicture(options);
      base64Image = "data:image/jpeg;base64," + imageData;
      console.log('try')
    }
    catch (err){
      return null;
    }

    if(base64Image){
      const isSuccess=await this.upload(base64Image,config);
      if(isSuccess){
        return true;
      }
      else{
        return false;
      }

    }


    return false;
  }

  async takePhotoFromAlbum(config:any) {
    let base64Image=null;
    const options:CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType:this.camera.PictureSourceType.PHOTOLIBRARY,
      targetWidth: 450,
      targetHeight: 450,
      correctOrientation: true
    };

    try{
      const imageData=await this.camera.getPicture(options);
      base64Image = "data:image/jpeg;base64," + imageData;
    }
    catch (err){
      return null;
    }

    if(base64Image){
      const isSuccess=await this.upload(base64Image,config);
      if(isSuccess){
        return true;
      }
      else{
        return false;
      }

    }


    return false;
  }


  async upload(base64, config) {
    let url;
    if (config.uploadType === 'profile')
      url= ContainerApi.ProfileUploadUrl();
    else if (config.uploadType === 'evidences')
      url= ContainerApi.FieldUploadUrl();

    let lat='',long='';

    try{
      const resp:any=await this.geolocation.getCurrentPosition();
      lat=resp.coords.latitude;
      long= resp.coords.longitude;
    }
    catch (err){

    }
    try{

      const fileTransfer:FileTransferObject = this.transfer.create();
      const timestamp = Date.now();
      const options:FileUploadOptions = {
        fileKey: 'file',
        fileName: timestamp + '.jpg',
        headers: {'x-assetId': config.assetId, 'x-id': config.id, lat: lat, long: long}
      };

      this.uploadInProgress();
      const result= await fileTransfer.upload(base64, url, options);
      console.log('result is')
      console.log(result)
      let data:any = JSON.parse(result.response);
      url = data.result.url;
      if (config.uploadType === 'profile')
        this.events.publish('profileImage:uploaded', url);

      if (config.uploadType === 'evidences')
        this.events.publish('evidences:uploaded', url);

      this.uploadFinish();

      return true;
    }
    catch (err){
      console.log('from catch ')
      console.log(err);
      this.uploadFinish();

      return false;
    }

  }

  uploadInProgress(){
    this.loader = this.loadingCtrl.create({
      content: 'Uploading...'
    });

    this.loader.present();


  }

  uploadFinish(){
    if(this.loader){
      this.loader.dismiss();
      this.loader=null;
    }
  }
}
