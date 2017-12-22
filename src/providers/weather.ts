import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {Geolocation} from '@ionic-native/geolocation';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/observable/of';

import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/retry';
import 'rxjs/add/observable/fromPromise';
import {WeatherApi} from '../../src/app/api.config';
import {ErrorHandlerService} from "./error-handler.service";

@Injectable()
export class WeatherProvider {


  currentWeather=null;
  currentForecast=null;

  constructor(public http:HttpClient, private geolocation:Geolocation,private errorHandler:ErrorHandlerService) {


  }


  getCurrentWeather() {

    if(this.currentWeather){
      return Observable.of(this.currentWeather);
    }
    return Observable.fromPromise(this.geolocation.getCurrentPosition())
      .concatMap((resp)=>{
        let lat = resp.coords.latitude;
        let lng = resp.coords.longitude;

        let url = `${WeatherApi.getCurrent.url()}?lat=${lat}&long=${lng}`;

        return this.http.get(url)
      })
      .do((data:any)=>{
        this.currentWeather=data;
      })
      .catch((err)=>{
        return this.errorHandler.handle(err);
      });



  }

  getCurrentForecast() {

    if(this.currentForecast){
      return Observable.of(this.currentForecast);
    }
    return Observable.fromPromise(this.geolocation.getCurrentPosition())
      .concatMap((resp)=>{
        let lat = resp.coords.latitude;
        let lng = resp.coords.longitude;

        let url = `${WeatherApi.getForecast.url()}?lat=${lat}&long=${lng}`;

        return this.http.get(url)
      })
      .do((data:any)=>{
        this.currentForecast=data;
      })
      .catch((err)=>{
        return this.errorHandler.handle(err);
      });



  }


}
