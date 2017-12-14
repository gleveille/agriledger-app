import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-complete-weather',
  templateUrl: 'complete-weather.html',
})
export class CompleteWeatherPage {

  dailyWeatherFive:any;

  constructor(public navCtrl:NavController, public navParams:NavParams) {

  }

  ionViewDidLoad() {
    this.dailyWeatherFive = this.navParams.get('dailyWeatherFive');
  }

}
