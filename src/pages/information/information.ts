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
  currentWeather:any;
  currentForecast=null;


  constructor(public navCtrl:NavController, public navParams:NavParams,
              private weatherProvider:WeatherProvider, public events:Events,
              private storage:Storage, private inAppBrowser:InAppBrowser) {



  }

  gotoComplete(){
    this.navCtrl.push(CompleteWeatherPage,{currentForecast:this.currentForecast})
  }

  ionViewDidLoad() {
    this.getCurrentWeather();
    this.getCurrentForecast();
  }

  getCurrentWeather() {
    this.weatherProvider.getCurrentWeather().subscribe(
      data => {
       this.currentWeather=data;
        console.log(this.currentWeather)
        this.currentWeather.main.temp=(this.currentWeather.main.temp-273.15).toFixed(1);
        this.currentWeather.main.temp=(this.currentWeather.wind.speed*3.6).toFixed(1);
      },(err)=>{
        console.log(err)
      }
    )
  }

  getCurrentForecast() {
    this.weatherProvider.getCurrentForecast().subscribe(
      data => {
        this.currentForecast=data;
        console.log(this.currentForecast)

      },(err)=>{
        console.log(err)
      }
    )
  }




}
