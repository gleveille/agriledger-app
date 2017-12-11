import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController} from 'ionic-angular';
import {WeatherProvider} from "../../providers/weather";
import {Storage} from '@ionic/storage';
import {Observable} from 'rxjs/Observable';


@Component({
  selector: 'page-information',
  templateUrl: 'information.html',
})
export class InformationPage {

  pet:string = "puppies";
  public localWeather: any;
  public currentWeather: any;
  weather:any;
  location:{
    city:string
  }
  city:string;

  private appId = 'PGa0BTAnTqEI0mb9MsYSVMH6lM4rG40d';
  private currentConditions = 'http://dataservice.accuweather.com/currentconditions/v1/';
  /*private dayOne = 'http://dataservice.accuweather.com/forecasts/v1/daily/1day/';*/


  constructor(public navCtrl:NavController, public navParams:NavParams,
              private weatherProvider:WeatherProvider,
              private storage:Storage) {

    this.getLocalWeather();

  }


  getLocalWeather() {
    this.weatherProvider.local().subscribe(
      data => {
        this.localWeather = data;
        this.current();
        /*this.OneDayWeatherDetails();*/
      }
    )
  }

  current() {
    let url = `${this.currentConditions}${this.localWeather.Key}?apikey=${this.appId}`

    this.weatherProvider.currentCond(url).subscribe(
      data => {
        this.currentWeather = data;
      }
    )
  }

 /* OneDayWeatherDetails() {

    let url = `${this.dayOne}${this.localWeather.Key}?apikey=${this.appId}`

    this.weatherProvider.dailyOne(url).subscribe(
      data => {
        console.log('aaaaaaaaaaaaaaaaaaaa');
        console.log(data);
        this.dailyWeatherOne = data;
      }
    )

  }*/


}
