import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateAssetPage } from './create-asset';

@NgModule({
  declarations: [
    CreateAssetPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateAssetPage),
  ],
})
export class CreateAssetPageModule {}
