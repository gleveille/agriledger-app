import {ChangeDetectorRef, Component} from '@angular/core';
import {NavController, NavParams, Events,} from 'ionic-angular';
import {UserService} from "../../providers/user.service";
import {Iuser} from "../../interface/user.interface";
import {ToastProvider} from "../../providers/toast";
import {AssetsService} from "../../providers/assets.service";
import { Chart } from 'chart.js';
import {WeatherProvider} from "../../providers/weather";

import {ServerUrl} from '../../app/api.config'
import {CreateAssetPage} from "../create-asset/create-asset";
import {AssetsPage} from "../assets/assets";
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {


  serverUrl=ServerUrl;
  user:Iuser = {profiles:{}};
  currentWeather={weather:[]};
  currentForecast=null;

  loadingAssetHttpRequest:string='resolved';
  assets:any[]=[];
  doughnutChartLabels:string[] = [];
  doughnutChartData:number[] = [];
  doughnutChartType:string = 'doughnut';

  loanAmount:number=0;
  loanInterest:number=1;
  loanTenure:number=1;
  emiCalculated:number=0;



  constructor(public navCtrl:NavController,
              private assetService:AssetsService,
              private weatherService:WeatherProvider,
              public navParams:NavParams, private events:Events,
              private ref:ChangeDetectorRef,
              private toastCtrl:ToastProvider, private userService:UserService) {


  }

  ionViewDidLoad() {

    console.log(setTimeout)
    this.subscribeUser();
    this.loadMyAssets();
    this.getCurrentWeather();
    this.getCurrentForecast();

  }

  sliderChange($event,type:string){

    if(type==='rate'){
      this.loanInterest=$event._value;
    }
    if(type==='tenure'){
      this.loanTenure=$event._value;
    }
    if(type==='amount'){
      this.loanAmount=$event._value;
    }

    let emi=(this.loanAmount*this.loanInterest*this.loanTenure)/100;
    this.emiCalculated=emi;

    console.log($event)
    console.log(type)
  }
  loadMyAssets(){
    this.loadingAssetHttpRequest='pending';
    this.assetService.loadMyAssets().subscribe((assets:any[])=>{
      this.subscribeMyAssets();

    },(err)=>{
      this.loadingAssetHttpRequest='rejected';

    })

  }
  subscribeUser(){
    this.userService.user.subscribe((user:Iuser)=> {
      this.user = user;
      console.log(this.user)
    });

  }

  drawChart(assets:any[]) {

    if(!assets.length){
      return;
    }
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
    doughnutChartLabels.push(`Total (${assets.length})`);

    doughnutChartLabels.push(`Available (${availableAssetNumber})`);
    doughnutChartLabels.push(`Pooled (${pooledAssetNumber})`);
    doughnutChartData.push(assets.length);

    doughnutChartData.push(availableAssetNumber);
    doughnutChartData.push(pooledAssetNumber);
    this.doughnutChartData = doughnutChartData.slice();
    this.doughnutChartLabels = doughnutChartLabels.slice();

    this.ref.detectChanges();
    console.log(this.doughnutChartData )
    console.log(this.doughnutChartLabels )

  }
  subscribeMyAssets(){
    this.assetService.myAssets.subscribe((assets:any[])=>{
      this.loadingAssetHttpRequest='pending';

      this.assets=assets;
      this.drawChart(assets)
      setTimeout(()=>{
        this.loadingAssetHttpRequest='resolved';

      },100)

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

  goToViewAssetPage(){
    this.navCtrl.push(AssetsPage);

  }
}
