import {Component, ViewChild} from '@angular/core';
import {ProfilePage} from "../profile/profile";
import {InformationPage} from "../information/information";
import {AssetsPage} from "../assets/assets";
import {CommunityPage} from "../community/community";
import {FinancePage} from "../finance/finance";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ProfilePage;
  tab2Root = AssetsPage;
  tab3Root = InformationPage;
  tab4Root = CommunityPage;
  tab5Root = FinancePage;


  constructor() {

  }

  ionViewDidEnter() {
/*
    this.tabRef.select(5);
*/
  }
}
