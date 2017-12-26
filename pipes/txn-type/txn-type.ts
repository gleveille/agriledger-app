import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the TxnTypePipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'txnType',
})
export class TxnTypePipe implements PipeTransform {
  transactionType:any = {
    0:'SEND',
    1:'SIGNATURE',
    2:'DELEGATE',
    3:'VOTE' ,
    4:'MULTI',
    5:'DAPP',
    6:'IN_TRANSFER',
    7:'OUT_TRANSFER',
    8:'APPROVAL',
    9:'UIA_ISSUER',
    10:'UIA_ASSET',
    11:'UIA_ISSUE',
    12:'UIA_EXERCISE'
  }
  transform(value: string, ...args) {
    return this.transactionType[value];
  }
}
