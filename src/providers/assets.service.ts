import {Injectable} from '@angular/core';
import {Iuser} from "../interface/user.interface";
import {UserApi, AssetApi, ServerUrl} from '../app/api.config';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/concatMap';

import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/retry';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import {HttpClient} from "@angular/common/http";
import {ErrorHandlerService} from "./error-handler.service";
import {UserService} from "./user.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class AssetsService {
  private _myAssets:BehaviorSubject<any[]>;
  private dataStore = {myAssets: [], categories: []};
  myAssets:Observable<any[]>;
  categories:any[] = [];

  constructor(private http:HttpClient, private errorHandler:ErrorHandlerService, private userService:UserService) {
    this._myAssets = <BehaviorSubject<any[]>>new BehaviorSubject([]);
    this.myAssets = this._myAssets.asObservable();

  }

  loadMyAssets(refresh:boolean = false) {
    console.log('load my asset')
    const url = `${UserApi.getAssets.url()}/${this.userService.dataStore.user.id}/assets`;
    return this.http.get(`${url}`)
      .do((assets:any[])=> {
        this.dataStore.myAssets = assets;
        this._myAssets.next(this.dataStore.myAssets.slice());
      })
      .retry(3)
      .catch((err) => {
        return this.errorHandler.handle(err);
      })
  }

  evidencesUploaded(assetId:string, data:{url:string,lat:number,long:number,hash:string}) {

    console.log('inside upload')
    console.log(assetId)
    this.dataStore.myAssets.forEach((asset, i) => {
      if (asset.id === assetId) {
        console.log('id match')
        if (asset.evidences && asset.evidences.length) {
          asset.evidences.unshift(data)
        }
        else {
          asset.evidences = [];
          asset.evidences.unshift(data)

        }
        this.dataStore.myAssets[i] = asset;

        console.log('after pushing')
        console.log(this.dataStore.myAssets)
      }
    });
    this._myAssets.next(this.dataStore.myAssets.slice());

  }

  documentsUploaded(assetId:string, data:{url:string,lat:number,long:number,hash:string}) {

    console.log('inside upload')
    console.log(assetId)
    this.dataStore.myAssets.forEach((asset, i) => {
      if (asset.id === assetId) {
        console.log('id match')
        if (asset.documents && asset.documents.length) {
          asset.documents.unshift(data)
        }
        else {
          asset.documents = [];
          asset.documents.unshift(data)

        }
        this.dataStore.myAssets[i] = asset;

        console.log('after pushing')
        console.log(this.dataStore.myAssets)
      }
    });
    this._myAssets.next(this.dataStore.myAssets.slice());

  }

  createAsset(asset:any) {

    const url = `${UserApi.getAssets.url()}/${this.userService.dataStore.user.id}/assets`;
    return this.http.post(`${url}`, asset)
      .do((createdAsset:any)=> {
        this.dataStore.myAssets.push(createdAsset);
        this._myAssets.next(this.dataStore.myAssets.slice());

      })
      .catch((res) => {
        return this.errorHandler.handle(res);
      });
  }

  updateAsset(asset:any) {
    const url = `${UserApi.getAssets.url()}/${this.userService.dataStore.user.id}/assets/${asset.id}`;
    return this.http.put(`${url}`, asset)
      .do((asset:any)=> {
        this.dataStore.myAssets.forEach((t, i) => {
          if (t.id === asset.id) {
            this.dataStore.myAssets[i] = asset;
          }
        });
        this._myAssets.next(this.dataStore.myAssets.slice());
      })
      .catch((res) => {
        return this.errorHandler.handle(res);
      });
  }

  deleteAsset(asset:any) {
    const url = `${UserApi.getAssets.url()}/${asset.userId}/assets/${asset.id}`;
    return this.http.delete(`${url}`)
      .do(()=> {
        let index=-1;
        this.dataStore.myAssets.forEach((t, i) => {
          if (t.id === asset.id) {
            index=i;
          }
        });
        if(index>-1){
          this.dataStore.myAssets.splice(index,1);
        }
        this._myAssets.next(this.dataStore.myAssets.slice());
      })
      .catch((res) => {
        return this.errorHandler.handle(res);
      });
  }

  getCategories(level:number) {
    const url = `${AssetApi.getCategories.url()}?level=${level}`;
    console.log(url)


    return this.http.get(`${url}`).do((categories:any[])=> {
      console.log(categories)
      this.categories = categories;
    })
      .catch((res) => {
        return this.errorHandler.handle(res);
      });
  }

}
