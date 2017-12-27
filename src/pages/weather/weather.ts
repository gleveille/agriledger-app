import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {WeatherProvider} from "../../providers/weather";


@Component({
  selector: 'page-weather',
  templateUrl: 'weather.html',
})
export class WeatherPage {
  currentWeather:any = null;
  currentForecast:any = null;
  weatherHttpStatus:string = 'pending';

  constructor(public navCtrl:NavController, public navParams:NavParams, private weatherService:WeatherProvider) {

    this.weatherService.loadCurrentWeather().subscribe(()=> {
      this.weatherHttpStatus = 'resolved';
    }, (err)=> {
      this.weatherHttpStatus = 'rejected';
    });

    this.weatherService.currentWeather.subscribe((data)=> {
      this.currentWeather = data;
    });

  }


}
