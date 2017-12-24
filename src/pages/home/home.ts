import {ChangeDetectorRef, Component, NgZone, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Events, AlertController} from 'ionic-angular';
import {AssetsPage} from "../assets/assets";
import {InformationPage} from "../information/information";
import {UserService} from "../../providers/user.service";
import {Iuser} from "../../interface/user.interface";
import {ToastProvider} from "../../providers/toast";
import {AssetsService} from "../../providers/assets.service";
import { Chart } from 'chart.js';
import {WeatherProvider} from "../../providers/weather";

import {ServerUrl} from '../../app/api.config'
import {CreateAssetPage} from "../create-asset/create-asset";
import {BaseChartDirective} from "ng2-charts";
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  @ViewChild("mychart") chart: BaseChartDirective;

  serverUrl=ServerUrl;
  user:Iuser = {profiles:{}};
  currentWeather={weather:[]};
  currentForecast=null;

  assets:any[]=[];
  doughnutChartLabels:string[] = [];
  doughnutChartData:number[] = [];
  doughnutChartType:string = 'doughnut';




  constructor(public navCtrl:NavController,
              private assetService:AssetsService,
              private weatherService:WeatherProvider,
              public navParams:NavParams, private events:Events,
              public alertCtrl:AlertController,
              private ref:ChangeDetectorRef,
              private toastCtrl:ToastProvider, private userService:UserService) {

    this.events.subscribe('profileImage:uploaded', (data)=> {
      this.user.profiles.profileUrl = data;
    });

    this.subscribeMyAssets();
    this.getUser();
    this.getCurrentWeather();
    this.getCurrentForecast();
  }

  ionViewDidLoad() {


  }

  getUser(){
    this.userService.getUser().subscribe((user:Iuser)=> {
      this.user = user || this.user;
      console.log(this.user)
    }, (err)=> {
      console.log(err);
    });

  }

  drawChart(assets:any[]) {

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


    let doughnutChartLabels=[];
    let doughnutChartData=[];
    doughnutChartLabels.push(`Available (${availableAssetNumber})`);
    doughnutChartLabels.push(`Pooled (${pooledAssetNumber})`);
    doughnutChartLabels.push(`Rejected (${rejectedAssetNumber})`);

    doughnutChartData.push(availableAssetNumber);
    doughnutChartData.push(pooledAssetNumber);
    doughnutChartData.push(rejectedAssetNumber);
    this.doughnutChartData = doughnutChartData;
    this.doughnutChartLabels = doughnutChartLabels;

  }
  subscribeMyAssets(){
    this.assetService.myAssets.subscribe((assets:any[])=>{

      this.assets=assets;
      this.drawChart(assets);
    },(err)=>{

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



  goToCreateAssetPage(){
    this.navCtrl.push(CreateAssetPage);

  }
}
