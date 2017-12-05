import {Injectable} from '@angular/core';
import {Iuser} from "../interface/user.interface";
import {UserApi, AssetApi} from '../app/api.config';
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
@Injectable()
export class AssetsService {

  assets:any[] = [];

  constructor(private http:HttpClient, private errorHandler:ErrorHandlerService, private userService:UserService) {
  }

  getAssets(filterType, filterName) {

    let url;
    if (!filterName || !filterType) {
      url = `${AssetApi.getAssets.url()}?filter[include]=user`;

    }
    else {
      url = `${AssetApi.getAssets.url()}?filter[where][${filterType}]=${filterName}&filter[include]=user`;

    }
    return this.http.get(`${url}`)
      .retry(3)
      .catch((res) => {
        return this.errorHandler.handle(res);
      });
  }


  getMyAssets() {

    console.log('isndie getmy aseetets')
    return this.userService.getUser().concatMap((user:Iuser)=> {
      console.log(user)
      const url = `${UserApi.getAssets.url()}/${user.id}/assets`;

      return this.http.get(`${url}`)
        .retry(3)
        .catch((res) => {
          return this.errorHandler.handle(res);
        });
    })

  }

  createAsset(asset:any) {

    return this.userService.getUser().concatMap((user:Iuser)=> {
      console.log(user)
      const url = `${UserApi.getAssets.url()}/${user.id}/assets`;
      return this.http.post(`${url}`, asset)
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
      .retry(3)
      .catch((res) => {
        return this.errorHandler.handle(res);
      });
  }


}
