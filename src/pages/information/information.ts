import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController} from 'ionic-angular';
import {WeatherProvider} from "../../providers/weather";
import {Storage} from '@ionic/storage';


@Component({
  selector: 'page-information',
  templateUrl: 'information.html',
})
export class InformationPage {

  pet: string = "puppies";

  weather:any;
  location:{
    city:string
  }

  constructor(public navCtrl:NavController, public navParams:NavParams,
              private weatherProvider:WeatherProvider,
              private storage:Storage) {

  }

  ionViewWillEnter() {
    this.storage.get('location').then((val) => {
      if (val != null) {
        this.location = JSON.parse(val);
      } else {
        this.location = {
          city: 'Heilongji'
        }
      }
      this.weatherProvider.getWeather(this.location.city)
        .subscribe((weather:any) => {
          this.weather = weather.current_observation;
        });
    });
  }

}
