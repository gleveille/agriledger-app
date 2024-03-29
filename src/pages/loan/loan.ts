import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-loan',
  templateUrl: 'loan.html',
})
export class LoanPage {

  loanAmount:number=100;
  loanInterest:number=1;
  loanTenure:number=1;
  loanFee:number=12;
  emiCalculated:number|string=0;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.emiCalculated=(this.loanAmount*this.loanInterest*this.loanTenure)/100;
    this.emiCalculated=this.emiCalculated+this.loanFee;
    console.log(this.emiCalculated)
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
    this.emiCalculated=this.emiCalculated+this.loanFee;
    this.emiCalculated=this.emiCalculated.toFixed(2)

    console.log($event)
    console.log(type)
  }



}
