import {Injectable} from '@angular/core';
import {Iuser} from "../interface/user.interface";

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/concatMap';

import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/retry';
import 'rxjs/add/observable/forkJoin';

import 'rxjs/add/operator/share'
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import {HttpClient} from "@angular/common/http";
import {ErrorHandlerService} from "./error-handler.service";
import {UserService} from "./user.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import { AddressApi } from '../app/api.config';

@Injectable()
export class AddressService {

  constructor(private http:HttpClient, private errorHandler: ErrorHandlerService) { }


    getCountry(){
        const url=`${AddressApi.getCountry.url()}`;

        return this.http.get(`${url}`)
            .retry(3)
            .catch((res) => {
                return this.errorHandler.handle(res);
            });
    }


    getProvinceByCountry(countryName:string){
        const url=`${AddressApi.getProvince.url()}?filter[where][country]=${countryName}`;

        return this.http.get(`${url}`)
            .retry(3)
            .catch((res) => {
                return this.errorHandler.handle(res);
            });
    }

    getCityByProvince(provinceName:string){
        const url=`${AddressApi.getCity.url()}?filter[where][province]=${provinceName}`;

        return this.http.get(`${url}`)
            .retry(3)
            .catch((res) => {
                return this.errorHandler.handle(res);
            });
    }

    getDistrictByCity(cityName:string){
        const url=`${AddressApi.getDistrict.url()}?filter[where][city]=${cityName}`;

        return this.http.get(`${url}`)
            .retry(3)
            .catch((res) => {
                return this.errorHandler.handle(res);
            });
    }


}