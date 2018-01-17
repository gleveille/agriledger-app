import {Component, ViewChild} from '@angular/core';
import {ProfilePage} from "../profile/profile";
import {InformationPage} from "../information/information";
import {AssetsPage} from "../assets/assets";
import {CommunityPage} from "../community/community";
import {FinancePage} from "../finance/finance";
import {HomePage} from "../home/home";
import {UserService} from "../../providers/user.service";
import { NavParams } from 'ionic-angular';
import { IndexProvider } from '../../providers/index/index';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AssetsPage;
  tab3Root = InformationPage;
  tab4Root = FinancePage;
  tab5Root = ProfilePage;
  selectedIndex:number;


  constructor(private userService:UserService,private indexProvider:IndexProvider) {
    this.selectedIndex = this.indexProvider.selectedIndex;
  }

  ionViewDidEnter() {
/*
    this.tabRef.select(5);
*/
  }
}
