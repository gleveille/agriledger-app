import { Injectable } from '@angular/core';
import {Iuser} from "../interface/user.interface";
import {UserApi} from '../../src/app/api.config';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/observable/of';

import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/retry';
import 'rxjs/add/observable/fromPromise';
import {Storage} from '@ionic/storage';

import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/throw';
import {HttpClient} from "@angular/common/http";
import {ErrorHandlerService} from "./error-handler.service";
@Injectable()
export class UserService {

  user={} as Iuser;
  accessToken:string=null;
  constructor(private http:HttpClient,private errorHandler:ErrorHandlerService,private storage:Storage) {
    console.log('access token is',localStorage.getItem('accessToken') ,'userId is ',localStorage.getItem('userId'));
  }

  login(user:Iuser){
    return this.http.post(`${UserApi.login.url()}?include=User`,user)
        .do((user:any)=>{
          this.user=user;
          this.accessToken=user.id;
          this.storage.set('userId',user.userId);
          this.storage.set('accessToken',user.id);
    });
  }



  getAccessTokenFromLocalStorage(){
    return this.storage.get('accessToken');
  }


  getUserIdFromLocalStorage(){
    return this.storage.get('userId');
  }
  getUser(){


    return Observable.fromPromise(this.getUserIdFromLocalStorage())
      .concatMap((userId)=>{
        console.log('userId ',userId)
        if(!userId)
        {
          return Observable.throw('no userId')
        }
        else{
          return this.http.get(`${UserApi.findById.url()}/${userId}`)
        }
      })
      .do((user)=>{
        this.user=user;
      })
      .catch((err)=>{
        return this.errorHandler.handle(err);
      })

  };


  changePassword(oldPassword:string,newPassword:string) {
      return this.http.post(`${UserApi.changePassword.url()}`,
          {oldPassword:oldPassword,newPassword:newPassword}).do((data)=>{
          this.user.isPasswordChanged=true;
      }).catch((res)=> {
          return this.errorHandler.handle(res);
      });
  };

    logout(){
        return this.http.post(`${UserApi.logout.url()}`,
            {}).do((data)=>{
          this.resetState();
          localStorage.removeItem('accessToken');
          localStorage.removeItem('userId');

        });
    }

    resetState(){

      this.user=JSON.parse(JSON.stringify({profileUrl:{}}))
    }





}
