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
  private _myAssets: BehaviorSubject<any[]>;
  private dataStore = { myAssets: [],categories:[] };

  myAssets: Observable<any[]>;


  categories:any[]=[];

  constructor(private http:HttpClient, private errorHandler:ErrorHandlerService, private userService:UserService) {
    this._myAssets = <BehaviorSubject<any[]>>new BehaviorSubject([]);
    this.myAssets = this._myAssets.asObservable();

  }



  loadMyAssets(){
    this.userService.getUser().concatMap((user:Iuser)=> {
      const url = `${UserApi.getAssets.url()}/${user.id}/assets`;

      return this.http.get(`${url}`)
        .retry(3)
        .catch((err) => {
          return this.errorHandler.handle(err);
        });
    })
      .subscribe((assets:any[])=>{
        this.dataStore.myAssets=assets;
        this._myAssets.next(this.dataStore.myAssets);
      },(err)=>{

      })
  }




  createAsset(asset:any) {

    return this.userService.getUser().concatMap((user:Iuser)=> {
      console.log(user)
      const url = `${UserApi.getAssets.url()}/${user.id}/assets`;
      return this.http.post(`${url}`, asset)
        .do((createdAsset:any)=>{
        this.dataStore.myAssets.push(createdAsset);
        this._myAssets.next(this.dataStore.myAssets);

        })
        .catch((res) => {
          return this.errorHandler.handle(res);
        });
    })
  }

  updateAsset(asset:any) {

    return this.userService.getUser().concatMap((user:Iuser)=> {
      console.log(user)
      const url = `${UserApi.getAssets.url()}/${user.id}/assets/${asset.id}`;
      return this.http.put(`${url}`, asset)
        .do((asset:any)=>{
          this.dataStore.myAssets.forEach((t, i) => {
            if (t.id === asset.id)
            {
              this.dataStore.myAssets[i] = asset;
            }
          });
          this._myAssets.next(this.dataStore.myAssets);

        })
        .catch((res) => {
          return this.errorHandler.handle(res);
        });
    })
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
