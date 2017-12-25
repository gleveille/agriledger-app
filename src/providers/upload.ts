import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {Events, LoadingController} from "ionic-angular/index";
import {HttpClient} from "@angular/common/http";
import {Geolocation} from '@ionic-native/geolocation';

import {ContainerApi,ServerUrl} from '../app/api.config';

import {FileTransfer, FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer';
import {Camera,CameraOptions} from "@ionic-native/camera";
import {ToastProvider} from "./toast";
import {UserService} from "./user.service";
import {AssetsService} from "./assets.service";

@Injectable()
export class UploadProvider {
  loader:any;

  constructor(public http:HttpClient, private events:Events,
              private loadingCtrl:LoadingController,
              private camera:Camera,
              private userService:UserService,
              private assetService:AssetsService,
              private toastService:ToastProvider,
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
      url= ContainerApi.EvidencesUploadUrl();

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
      let data;

      try{
        data = JSON.parse(result.response);
        let obj={url:null,lat:null,long:null,hash:null};
        console.log('..................')
        console.log(data)
        if(data.result.files && data.result.files.file[0].data) {
          obj=data.result.files.file[0].data
        }
        console.log(obj)


        console.log(config.uploadType)
          if (config.uploadType === 'profile'){
          this.userService.profilePicChanged(obj);
          }

          if (config.uploadType === 'evidences'){
            this.assetService.evidencesUploaded(config.assetId,obj);
          }

        this.toastService.presentToast('Uploaded');

      }
      catch (err){
        console.log(err);
        this.toastService.presentToast('Uploaded please refresh to view it');

      }


      this.uploadFinish();

      return true;
    }
    catch (err){
      this.toastService.presentToast('upload failed');

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
