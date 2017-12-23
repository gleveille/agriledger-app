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

  // barChart
  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels:string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;

  public barChartData:any[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
  ];


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
      },(err)=>{
        console.log(err)
      }
    )
  }

  getCurrentForecast() {
    this.weatherService.getCurrentForecast().subscribe(
      data => {
        this.currentForecast=data;
        console.log(this.currentForecast)

      }
      ,(err)=>{
        console.log(err)
      }
    )
  }

  information() {
    /*this.navCtrl.push(InformationPage);*/
  }



}
