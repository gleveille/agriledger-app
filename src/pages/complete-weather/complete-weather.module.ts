import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompleteWeatherPage } from './complete-weather';

@NgModule({
  declarations: [
    CompleteWeatherPage,
  ],
  imports: [
    IonicPageModule.forChild(CompleteWeatherPage),
  ],
})
export class CompleteWeatherPageModule {}
