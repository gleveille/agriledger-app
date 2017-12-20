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
  public localWeather:any;
  public currentWeather:any = [];
  public dailyWeatherOne:any;
  public dailyWeatherFive:any;
  public DailyForecasts:any = [];
  weather:any;
  location:{
    city:string
  }
  city:string;
  url:string;

  private appId = 'PGa0BTAnTqEI0mb9MsYSVMH6lM4rG40d';
  private currentConditions = 'http://dataservice.accuweather.com/currentconditions/v1/';
  private dayOne = 'http://dataservice.accuweather.com/forecasts/v1/daily/1day/';
  private dayFive = 'http://dataservice.accuweather.com/forecasts/v1/daily/5day/';


  constructor(public navCtrl:NavController, public navParams:NavParams,
              private weatherProvider:WeatherProvider, public events:Events,
              private storage:Storage, private inAppBrowser:InAppBrowser) {



  }

  ionViewDidLoad() {
    this.getLocalWeather();
  }

  getLocalWeather() {
    this.weatherProvider.local().subscribe(
      data => {
        this.localWeather = data;
        this.current();
        this.OneDayWeatherDetails();
        this.FiveDayWeatherDetails();
      }
    )
  }

  current() {
    let url = `${this.currentConditions}${this.localWeather.Key}?apikey=${this.appId}`

    this.weatherProvider.currentCond(url).subscribe(
      data => {
        this.currentWeather = data;
        this.events.publish('hello',{currentWeather:data});
      }
    )
  }

  OneDayWeatherDetails() {
    let url = `${this.dayOne}${this.localWeather.Key}?apikey=${this.appId}`

    this.weatherProvider.dailyOne(url).subscribe(
      data => {
        console.log('1 day weather');
        console.log(data);
        this.dailyWeatherOne = data;
      }
    )
  }

  FiveDayWeatherDetails() {
    let url = `${this.dayFive}${this.localWeather.Key}?apikey=${this.appId}`

    this.weatherProvider.dailyFive(url).subscribe(
      data => {
        console.log('5 day weather');
        console.log(data);
        this.dailyWeatherFive = data;
      }
    )
  }

  weatherInfo(dailyWeatherFive) {
    this.navCtrl.push(CompleteWeatherPage, {dailyWeatherFive: dailyWeatherFive})
  }



}
