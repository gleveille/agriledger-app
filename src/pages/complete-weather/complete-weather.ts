import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {WeatherProvider} from "../../providers/weather";

@Component({
  selector: 'page-complete-weather',
  templateUrl: 'complete-weather.html',
})
export class CompleteWeatherPage {

  currentWeather:any = null;
  currentForecast:any = null;
  weatherHttpStatus:string = 'pending';

  constructor(public navCtrl:NavController, public navParams:NavParams, private weatherService:WeatherProvider) {

    this.weatherService.loadCurrentForecast().subscribe(()=> {
      this.weatherHttpStatus = 'resolved';
    }, (err)=> {
      this.weatherHttpStatus = 'rejected';
    });

    this.weatherService.currentForecast.subscribe((data)=> {
      this.currentForecast = data;
      console.log(data);
    });
  }

  ionViewDidLoad() {
    this.currentForecast = this.navParams.get('currentForecast');
    console.log(this.currentForecast)
  }

}
