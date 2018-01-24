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
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Storage} from '@ionic/storage'

@Injectable()
export class UserService {
  private _user:BehaviorSubject<Iuser>;
  dataStore = {user: {profiles:{}}} as any

  user:Observable<Iuser>;


  constructor(private http:HttpClient, private errorHandler:ErrorHandlerService, private storage:Storage) {
    this._user = <BehaviorSubject<Iuser>>new BehaviorSubject(null);
    this.user = this._user.asObservable();


  }

  login(credential:any) {
    let accessToken = null;
    return this.http.post(`${UserApi.login.url()}`, credential)
      .concatMap((result:any)=> {
        accessToken = result.id;
        return this.http.get(`${UserApi.findById.url()}/${result.userId}?access_token=${accessToken}&filter[include]=profiles`)
      })
      .do((user:any)=> {
        console.log(user);
        this.dataStore.user = user;
        if (!this.dataStore.user.profiles || !this.dataStore.user.profiles.id)
          this.dataStore.user.profiles = {};
        this._user.next(this.dataStore.user);

        this.storage.set('userId', user.id);
        this.storage.set('accessToken', accessToken);
      })
      .catch((err)=> {
        console.log(err)
        return this.errorHandler.handle(err);
      })
  }

  getUserIdFromLocalStorage() {
    return this.storage.get('userId');
  }


  profilePicChanged(data:any) {
    this.dataStore.user.profiles.profileUrl = data;
    this._user.next(this.dataStore.user);
  }

  updateProfile(user:Iuser) {

    let profiles = user.profiles;
    return this.http.put(`${UserApi.updateProfile.url()}/${this.dataStore.user.id}/profiles`, profiles).do((profile:any)=> {
      this.dataStore.user.profiles = profile;
      this._user.next(JSON.parse(JSON.stringify(this.dataStore.user)));
    })
      .catch((err)=> {

        return this.errorHandler.handle(err);
      })

  };

  loadUser() {

    console.log('insise loadddddd')

    return Observable.fromPromise(this.getUserIdFromLocalStorage())
      .concatMap((userId)=> {
        console.log('userId ', userId)
        if (!userId) {
          return Observable.throw('no userId')
        }
        else {
          return this.http.get(`${UserApi.findById.url()}/${userId}?filter[include]=profiles`)
        }
      })
      .do((user:Iuser)=> {
        console.log('...................')
        console.log(user)
        this.dataStore.user = user;
        this._user.next(JSON.parse(JSON.stringify(this.dataStore.user)));
      })
      .catch((err)=> {
        return this.errorHandler.handle(err);
      })

  };

  changePassword(oldPassword:string, newPassword:string) {
    return this.http.post(`${UserApi.changePassword.url()}`,
      {oldPassword: oldPassword, newPassword: newPassword}).do((data)=> {
      this.dataStore.user.isPasswordChanged = true;
      this._user.next(this.dataStore.user);
    }).catch((res)=> {
      return this.errorHandler.handle(res);
    });
  };

  forgotPassword(email:any) {
    return this.http.post(`${UserApi.sendResetPasswordToken.url()}`, {email: email}).do((res)=> {
    })
      .catch((err)=> {
        return this.errorHandler.handle(err);
      })
  };

  resetPassword(accessToken:string, newPassword:string) {
    return this.http.post(`${UserApi.resetPassword.url()}?access_token=${accessToken}`,
      {newPassword: newPassword}).do((data)=> {
    }).catch((res)=> {
      return this.errorHandler.handle(res);
    });
  };

  logout() {
    return this.http.post(`${UserApi.logout.url()}`,
      {}).do((data)=> {
      this.resetState();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userId');

    });
  }

  resetState() {

    this.dataStore.user = JSON.parse(JSON.stringify({profileUrl: {}}))
  }

  profileDocumentsUploaded(data:{url:string,lat:number,long:number,hash:string}){
    if(!this.dataStore.user.profiles.documents){
      this.dataStore.user.profiles.documents=[];
    }

    this.dataStore.user.profiles.documents.push(data);
    this._user.next(this.dataStore.user);
  }


}
