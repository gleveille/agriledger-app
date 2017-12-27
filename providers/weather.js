"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
require("rxjs/add/operator/map");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/do");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/concatMap");
require("rxjs/add/observable/of");
require("rxjs/add/observable/interval");
require("rxjs/add/operator/retry");
require("rxjs/add/observable/fromPromise");
var api_config_1 = require("../../src/app/api.config");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var WeatherProvider = (function () {
    function WeatherProvider(http, geolocation, errorHandler) {
        this.http = http;
        this.geolocation = geolocation;
        this.errorHandler = errorHandler;
        this.dataStore = { currentWeather: {}, currentForecast: {} };
        this._currentWeather = new BehaviorSubject_1.BehaviorSubject({});
        this.currentWeather = this._currentWeather.asObservable();
        this._currentForecast = new BehaviorSubject_1.BehaviorSubject({});
        this.currentForecast = this._currentForecast.asObservable();
    }
    WeatherProvider.prototype.loadCurrentWeather = function () {
        var _this = this;
        if (this.dataStore.currentWeather && this.dataStore.currentWeather.main) {
            return Observable_1.Observable.of(this.dataStore.currentWeather);
        }
        return Observable_1.Observable.fromPromise(this.geolocation.getCurrentPosition())
            .concatMap(function (resp) {
            var lat = resp.coords.latitude;
            var lng = resp.coords.longitude;
            var url = api_config_1.WeatherApi.getCurrent.url() + "?lat=" + lat + "&long=" + lng;
            return _this.http.get(url);
        })
            .do(function (data) {
            if (data && data.main) {
                data.main.temp = (data.main.temp - 273.15).toFixed(1);
            }
            if (data && data.wind) {
                data.wind.speed = (data.wind.speed * 3.6).toFixed(1);
            }
            _this.dataStore.currentWeather = data;
            _this._currentWeather.next(_this.dataStore.currentWeather);
        })
            .catch(function (err) {
            return _this.errorHandler.handle(err);
        });
    };
    WeatherProvider.prototype.loadCurrentWeatherWithoutLat = function () {
        var _this = this;
        var url = api_config_1.WeatherApi.getCurrent.url() + "?lat=12.9716&long=77.5946";
        return this.http.get(url)
            .do(function (data) {
            if (data && data.main) {
                data.main.temp = (data.main.temp - 273.15).toFixed(1);
            }
            if (data && data.wind) {
                data.wind.speed = (data.wind.speed * 3.6).toFixed(1);
            }
            _this.dataStore.currentWeather = data;
            _this._currentWeather.next(_this.dataStore.currentWeather);
        })
            .catch(function (err) {
            return _this.errorHandler.handle(err);
        });
    };
    WeatherProvider.prototype.loadCurrentForecast = function () {
        var _this = this;
        if (this.currentForecast) {
            return Observable_1.Observable.of(this.currentForecast);
        }
        return Observable_1.Observable.fromPromise(this.geolocation.getCurrentPosition())
            .concatMap(function (resp) {
            var lat = resp.coords.latitude;
            var lng = resp.coords.longitude;
            var url = api_config_1.WeatherApi.getForecast.url() + "?lat=" + lat + "&long=" + lng;
            return _this.http.get(url);
        })
            .do(function (data) {
            _this.dataStore.currentForecast = data;
            _this._currentForecast.next(_this.dataStore.currentForecast);
        })
            .catch(function (err) {
            return _this.errorHandler.handle(err);
        });
    };
    WeatherProvider.prototype.loadCurrentForecastWithoutLat = function () {
        var _this = this;
        var url = api_config_1.WeatherApi.getForecast.url() + "?lat=12.9716&long=77.5946";
        return this.http.get(url)
            .do(function (data) {
            _this.dataStore.currentWeather = data;
            _this._currentWeather.next(_this.dataStore.currentWeather);
        })
            .catch(function (err) {
            return _this.errorHandler.handle(err);
        });
    };
    WeatherProvider = __decorate([
        core_1.Injectable()
    ], WeatherProvider);
    return WeatherProvider;
}());
exports.WeatherProvider = WeatherProvider;
