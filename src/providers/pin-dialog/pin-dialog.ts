import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { PinDialog } from '@ionic-native/pin-dialog';


@Injectable()
export class PinDialogProvider {

  constructor(private pinDialog: PinDialog) {
    console.log('Hello PinDialogProvider Provider');
  }


  show(){

    return new Promise((resolve,reject)=>{
      this.pinDialog.prompt('Enter your Agriledger Passcode', 'Verify Passcode', ['OK', 'Cancel'])
      .then(
        (result: any) => {
          if (result.buttonIndex == 1){
            resolve(result.input1)
          }
          else if(result.buttonIndex == 2) {
            resolve(null);
          }
      }
      ).catch((err=>{
        reject(err);
      }))

    })

  }
}
