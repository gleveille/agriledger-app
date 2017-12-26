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
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class WeatherProvider {

  private _currentWeather: BehaviorSubject<any[]>;
  private _currentForecast: BehaviorSubject<any[]>;

  private dataStore = { currentWeather:{},currentForecast:{}};

  currentWeather: Observable<any[]>;
  currentForecast: Observable<any[]>;

  constructor(public http:HttpClient, private geolocation:Geolocation,private errorHandler:ErrorHandlerService) {
    this._currentWeather = <BehaviorSubject<any[]>>new BehaviorSubject({});
    this.currentWeather = this._currentWeather.asObservable();
    this._currentForecast = <BehaviorSubject<any[]>>new BehaviorSubject({});
    this.currentForecast = this._currentForecast.asObservable();
  }


  loadCurrentWeather() {

    if(this.dataStore.currentWeather && this.dataStore.currentWeather.main){
      return Observable.of(this.dataStore.currentWeather);
    }
    return Observable.fromPromise(this.geolocation.getCurrentPosition())
      .concatMap((resp)=>{
        let lat = resp.coords.latitude;
        let lng = resp.coords.longitude;

        let url = `${WeatherApi.getCurrent.url()}?lat=${lat}&long=${lng}`;

        return this.http.get(url)
      })
      .do((data:any)=>{
        if(data && data.main){
          data.main.temp=(data.main.temp-273.15).toFixed(1);
        }
        if(data && data.wind){
          data.wind.speed=(data.wind.speed*3.6).toFixed(1);
        }

        this.dataStore.currentWeather=data;
        this._currentWeather.next(this.dataStore.currentWeather);

      })
      .catch((err)=>{
        return this.errorHandler.handle(err);
      });



  }


  loadCurrentWeatherWithoutLat() {
    let url = `${WeatherApi.getCurrent.url()}?lat=12.9716&long=77.5946`;

        return this.http.get(url)
      .do((data:any)=>{
        if(data && data.main){
          data.main.temp=(data.main.temp-273.15).toFixed(1);
        }
        if(data && data.wind){
          data.wind.speed=(data.wind.speed*3.6).toFixed(1);
        }
        this.dataStore.currentWeather=data;
        this._currentWeather.next(this.dataStore.currentWeather);
      })
      .catch((err)=>{
        return this.errorHandler.handle(err);
      });



  }

  loadCurrentForecast() {

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
        this.dataStore.currentForecast=data;
        this._currentForecast.next(this.dataStore.currentForecast);

      })
      .catch((err)=>{
        return this.errorHandler.handle(err);
      });



  }


  loadCurrentForecastWithoutLat() {

    let url = `${WeatherApi.getForecast.url()}?lat=12.9716&long=77.5946`;

    return this.http.get(url)
      .do((data:any)=>{
        this.dataStore.currentWeather=data;
        this._currentWeather.next(this.dataStore.currentWeather);
      })
      .catch((err)=>{
        return this.errorHandler.handle(err);
      });



  }


}
