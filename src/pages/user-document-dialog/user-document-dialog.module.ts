import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserDocumentDialogPage } from './user-document-dialog';

@NgModule({
  declarations: [
    UserDocumentDialogPage,
  ],
  imports: [
    IonicPageModule.forChild(UserDocumentDialogPage),
  ],
})
export class UserDocumentDialogPageModule {}
