import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImageDialogPage } from './image-dialog';

@NgModule({
  declarations: [
    ImageDialogPage,
  ],
  imports: [
    IonicPageModule.forChild(ImageDialogPage),
  ],
})
export class ImageDialogPageModule {}
