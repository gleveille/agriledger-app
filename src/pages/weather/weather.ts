import {Component, Input} from '@angular/core';
import {NavController, NavParams, App} from 'ionic-angular';
import {WeatherProvider} from "../../providers/weather";
import {InformationPage} from "../information/information";


@Component({
  selector: 'page-weather',
  templateUrl: 'weather.html',
})
export class WeatherPage {
  @Input() showViewMoreButton:boolean = true;
  currentWeather:any = null;
  currentForecast:any = null;
  weatherHttpStatus:string = 'pending';

  constructor(public navCtrl:NavController, public navParams:NavParams, private weatherService:WeatherProvider, private app:App) {

    this.weatherService.loadCurrentWeather().subscribe(()=> {
      this.weatherHttpStatus = 'resolved';
    }, (err)=> {
      this.weatherHttpStatus = 'rejected';
    });

    this.weatherService.currentWeather.subscribe((data)=> {
      this.currentWeather = data;
    });

  }

  goToInfo() {
    this.app.getRootNav().push(InformationPage);
  }


}
