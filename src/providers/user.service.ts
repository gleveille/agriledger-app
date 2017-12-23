import {Injectable} from '@angular/core';
import {Iuser} from "../interface/user.interface";
import {UserApi,ServerUrl} from '../../src/app/api.config';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/observable/of';

import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/retry';
import 'rxjs/add/observable/fromPromise';
import {Storage} from '@ionic/storage';

import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/throw';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ErrorHandlerService} from "./error-handler.service";


@Injectable()
export class UserService {

  user = null as Iuser;
  accessToken:string = null;

  constructor(private http:HttpClient, private errorHandler:ErrorHandlerService, private storage:Storage) {
  }

  login(credential:any) {
    let accessToken=null;
    return this.http.post(`${UserApi.login.url()}`, credential)
      .concatMap((result:any)=> {
      accessToken=result.id;
        return this.http.get(`${UserApi.findById.url()}/${result.userId}?access_token=${accessToken}&filter[include]=profiles`)
      })
      .do((user:any)=> {
      console.log(user);
        this.user = user;
        this.storage.set('userId', user.id);
        this.storage.set('accessToken', accessToken);
      })
      .catch((err)=> {

        console.log(err)
        return this.errorHandler.handle(err);
      })
  }

  getAccessTokenFromLocalStorage() {
    return this.storage.get('accessToken');
  }

  getUserIdFromLocalStorage() {
    return this.storage.get('userId');
  }

  createProfile(user:Iuser) {

    let profile=user.profiles;
    console.log('creating profile is')
    console.log(profile)
    return this.http.post(`${UserApi.updateProfile.url()}/${user.id}/profiles`, profile).do((res)=> {
      this.user.profiles=profile;
      console.log('created')
      console.log(res);
    })
      .catch((err)=> {

        console.log(err)
        return this.errorHandler.handle(err);
      })

  };

  updateProfile(user:Iuser) {

    let profiles=user.profiles;
    if(!profiles.id)
    {
      return this.createProfile(user);
    }
    console.log('updating profile is')
    console.log(profiles)
    return this.http.put(`${UserApi.updateProfile.url()}/${user.id}/profiles`, profiles).do((profile:any)=> {
      this.user.profiles=profile;
      console.log('updated')
    })
      .catch((err)=> {

        return this.errorHandler.handle(err);
      })

  };

  getUser() {

    if (this.user && this.user.id) {
      return Observable.of(this.user);
    }
    return Observable.fromPromise(this.getUserIdFromLocalStorage())
      .concatMap((userId)=> {
        console.log('userId ', userId)
        if (!userId) {
          return Observable.throw('no userId')
        }
        else {
          return this.http.get(`${UserApi.findById.url()}/${userId}?filter[include]=profiles`)
        }
      }).map((user)=>{
        let user2=user;

        if(!user2.profiles)
          user2.profiles={};

        return user2;
      })
      .do((user)=> {
        this.user = user;
        console.log(this.user)

      })
      .catch((err)=> {
        return this.errorHandler.handle(err);
      })

  };

  getAssets() {
    return this.getUser().concatMap((user:Iuser)=> {
      return this.http.get(`${UserApi.list.url()}/${user.id}/assets`)
        .catch((err)=> {
          return this.errorHandler.handle(err);
        })
    })
  }

  getAssetsCount() {
    return this.getUser().concatMap((user:Iuser)=> {
      return this.http.get(`${UserApi.list.url()}/${user.id}/assets/count`)
        .catch((err)=> {
          return this.errorHandler.handle(err);
        })
    })
  }

  changePassword(oldPassword:string, newPassword:string) {
    return this.http.post(`${UserApi.changePassword.url()}`,
      {oldPassword: oldPassword, newPassword: newPassword}).do((data)=> {
      this.user.isPasswordChanged = true;
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

    this.user = JSON.parse(JSON.stringify({profileUrl: {}}))
  }

  forgotPassword(email:any) {
    if (!email) {
      return Observable.throw('no email');
    }
    return this.http.post(`${UserApi.resetPassword.url()}`, {email: email}).do((res)=> {

    })
      .catch((err)=> {
        return this.errorHandler.handle(err);
      })
  };


}
