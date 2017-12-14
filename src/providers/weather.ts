import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {Geolocation} from '@ionic-native/geolocation';


@Injectable()
export class WeatherProvider {

  private appId = 'PGa0BTAnTqEI0mb9MsYSVMH6lM4rG40d';
  private baseUrl = 'http://dataservice.accuweather.com/locations/v1/cities/geoposition/search';


  constructor(public http:HttpClient, private geolocation:Geolocation) {

    
  }


  local() {
    let Obs = Observable.create(observer => {

      this.geolocation.getCurrentPosition().then((resp => {
        let lat = resp.coords.latitude;
        let lng = resp.coords.longitude;

        let url = `${this.baseUrl}?apikey=${this.appId}&q=${lat},${lng}`


        this.http.get(url)
          .subscribe(data => {
              observer.next(data);
            },
            err => observer.error(err),
            () => observer.complete()
          )
      }))
    })

    return Obs;
  }

  currentCond(url) {
    return this.http.get(url);
  }

  dailyOne(url) {
    return this.http.get(url);
  }

  dailyFive(url) {
    return this.http.get(url);
  }


}
