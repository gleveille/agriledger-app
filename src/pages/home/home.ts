import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Events, AlertController} from 'ionic-angular';
import {AssetsPage} from "../assets/assets";
import {InformationPage} from "../information/information";
import {UserService} from "../../providers/user.service";
import {Iuser} from "../../interface/user.interface";
import {ToastProvider} from "../../providers/toast";
import {AssetsService} from "../../providers/assets.service";
import { Chart } from 'chart.js';
import {WeatherProvider} from "../../providers/weather";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  user = {profileUrl: {}} as Iuser;
  currentWeather={weather:[]};
  currentForecast=null;

  assetHttpStatus:string='resolved';
  assets:any[]=[];
  doughnutChartLabels:string[] = [];
  doughnutChartData:number[] = [];
  doughnutChartType:string = 'doughnut';

  // lineChart
  public lineChartData:Array<any> = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'},
    {data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C'}
  ];
  public lineChartLabels:Array<any> = ['January', 'February', 'March'];
  public lineChartOptions:any = {
    responsive: true
  };
  public lineChartColors:Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';


  constructor(public navCtrl:NavController,
              private assetService:AssetsService,
              private weatherService:WeatherProvider,
              public navParams:NavParams, private events:Events,
              public alertCtrl:AlertController,
              private toastCtrl:ToastProvider, private userService:UserService) {

    this.events.subscribe('profileImage:uploaded', (url)=> {
      console.log(url)
      this.user.profileUrl.url = url;
    })

    this.events.subscribe('hello', (currentWeather)=>{
      console.log('tessssssssssssssssssss')
      console.log(currentWeather)
    });



  }
  ionViewDidLoad() {
    this.getUser();
    this.getCurrentWeather();
    this.getCurrentForecast();
    this.getAsset();
  }

  getUser(){
    this.userService.getUser().subscribe((user:Iuser)=> {
      this.user = user;
      console.log(this.user)
    }, (err)=> {
      console.log(err);
    });

  }

  getAssetsCount(){
    this.userService.getAssetsCount().subscribe((data:any)=> {
    }, (err)=> {
      console.log(err);
    });

  }
  public randomize():void {
    let _lineChartData:Array<any> = new Array(this.lineChartData.length);
    for (let i = 0; i < this.lineChartData.length; i++) {
      _lineChartData[i] = {data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label};
      for (let j = 0; j < this.lineChartData[i].data.length; j++) {
        _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
      }
    }
    this.lineChartData = _lineChartData;
  }


  getAsset(){
    this.assetHttpStatus='pending';
    this.assetService.getMyAssets().subscribe((assets:any[])=>{
      assets=assets||[];
      this.assets=assets;

      console.log(assets)
      let availableAssetNumber:number=0;
      let pooledAssetNumber:number=0;
      let rejectedAssetNumber:number=0;

      assets.forEach((asset)=>{
          if(asset.status==='available'){
            availableAssetNumber++;
          }
          else if(asset.status==='pooled'){
            pooledAssetNumber++;
          }
          else if(asset.status==='rejected'){
            rejectedAssetNumber++;
          }
        });

        this.doughnutChartLabels.push(`Available (${availableAssetNumber})`);
        this.doughnutChartLabels.push(`Pooled (${pooledAssetNumber})`);
      this.doughnutChartLabels.push(`Rejected (${rejectedAssetNumber})`);

      this.doughnutChartData.push(availableAssetNumber);
      this.doughnutChartData.push(pooledAssetNumber);
      this.doughnutChartData.push(rejectedAssetNumber);




      this.assetHttpStatus='resolved';

    },(err)=>{
      this.assetHttpStatus='rejected';
      this.doughnutChartLabels.push(`Available (0)`);
      this.doughnutChartLabels.push(`Pooled (0)`);
      this.doughnutChartLabels.push(`Rejected (0)`);
      this.doughnutChartData.push(0);
      this.doughnutChartData.push(0);
      this.doughnutChartData.push(0);
      console.log(err)
    })
  }

  getCurrentWeather() {
    this.weatherService.getCurrentWeather().subscribe(
      data => {
        this.currentWeather=data;
        console.log(this.currentWeather)
      }
    )
  }

  getCurrentForecast() {
    this.weatherService.getCurrentForecast().subscribe(
      data => {
        this.currentForecast=data;
        console.log(this.currentForecast)

      }
    )
  }

  information() {
    /*this.navCtrl.push(InformationPage);*/
  }



}
