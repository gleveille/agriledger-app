import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {InformationPage} from "../information/information";

@IonicPage()
@Component({
  selector: 'page-finance',
  templateUrl: 'finance.html',
})
export class FinancePage {

  city: string;
  state: string;

  constructor(public navCtrl:NavController, public navParams:NavParams,
              private storage:Storage) {
    this.storage.get('location').then((val) => {
      if (val != null) {
        let location = JSON.parse(val);
        this.city = location.city;
        this.state = location.state;
      } else {
        this.city = 'Miami';
        this.state = 'FL';
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FinancePage');
  }

  saveForm() {
    let location = {
      city: this.city,
      state: this.state
    }
    this.storage.set('location', JSON.stringify(location));
    this.navCtrl.push(InformationPage);
  }
}
