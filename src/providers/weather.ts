import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class WeatherProvider {

  apikey = '7d2dbf9e4616314a';
  url;

  constructor(public http: HttpClient) {
    console.log('Hello WeatherProvider Provider');

    this.url = 'http://api.wunderground.com/api/'+this.apikey+'/conditions/q';
  }

  getWeather(city) {
    return this.http.get(this.url+'/'+'/'+city+'.json');
  }

}
