import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

@Component({
  selector: 'page-complete-weather',
  templateUrl: 'complete-weather.html',
})
export class CompleteWeatherPage {

  currentForecast:any;

  constructor(public navCtrl:NavController, public navParams:NavParams) {

  }

  ionViewDidLoad() {
    this.currentForecast = this.navParams.get('currentForecast');
    console.log(this.currentForecast)
  }

}
