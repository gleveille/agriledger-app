import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AssetInfoPage } from './asset-info';

@NgModule({
  declarations: [
    AssetInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(AssetInfoPage),
  ],
})
export class AssetInfoPageModule {}
