import {Injectable} from '@angular/core';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/retry';
import {UserApi} from "../../app/api";
import {Storage} from '@ionic/storage';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import {retry} from "rxjs/operator/retry";
import {Http, Headers} from "@angular/http";

@Injectable()
export class UserProvider {

  constructor(public http:Http, private storage:Storage) {
    console.log('Hello UserProvider Provider');
  }

  login(user:{email,password}) {
    return this.http.post(`${UserApi.login.url()}`, user)
      .map((res=>res.json()))
      .do((res:any)=> {
        this.saveUserIdInLocalstorage(res.userId);
        this.saveAccessTokenInLocalstorage(res.id);

      });
  }


  getUser(userId:string, accessToken:string) {
    // first time ,this method will be called from authorization guard

    let headers = new Headers({'X-Access-Token': accessToken})
    return new Promise((resolve, reject)=> {
      this.http.get(`${UserApi.findById.url()}/${userId}`, {headers: headers}).map(res=>res.json()).subscribe((data)=> {

        resolve(data);
      }, ((err)=> {

        reject(err);
      }))
    })
  };


  saveUserIdInLocalstorage(userId) {
    this.storage.set('userId', userId)
  }

  saveAccessTokenInLocalstorage(accessToken) {
    this.storage.set('accessToken', accessToken);
  }
}
