import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController} from 'ionic-angular';
import {WeatherProvider} from "../../providers/weather";
import {Storage} from '@ionic/storage';
import {Observable} from 'rxjs/Observable';
import {InAppBrowser, InAppBrowserOptions} from "@ionic-native/in-app-browser";
import {Events} from 'ionic-angular';
import {CompleteWeatherPage} from "../complete-weather/complete-weather";

@Component({
  selector: 'page-information',
  templateUrl: 'information.html',
})


export class InformationPage {

  pet:string = "puppies";
  currentWeather={};
  currentForecast={};


  constructor(public navCtrl:NavController, public navParams:NavParams,
              private weatherProvider:WeatherProvider, public events:Events,
              private storage:Storage, private inAppBrowser:InAppBrowser) {



  }

  ionViewDidLoad() {
    this.getCurrentWeather();
    this.getCurrentWeather();
  }

  getCurrentWeather() {
    this.weatherProvider.getCurrentWeather().subscribe(
      data => {
       this.currentWeather=data;
      }
    )
  }

  getCurrentForecast() {
    this.weatherProvider.getCurrentForecast().subscribe(
      data => {
        this.currentForecast=data;
      }
    )
  }




}
