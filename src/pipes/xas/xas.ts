import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'xas',
})
export class XasPipe implements PipeTransform {

  transform(fee: string, ...args) {
    if (!fee) {
      return 0;
    }

    fee = fee.toString();

    while (fee.length < 7) {
      fee = '0'.concat(fee);
    }

    fee = fee.slice(0, -6).concat('.', fee.slice(-6));

    var clearView = false;

    while (!clearView) {
      if (fee[fee.length - 1] == '0') {
        fee = fee.slice(0, fee.length - 1);
      }
      else {
        clearView = true;
      }
    }

    if (fee[fee.length - 1] == '.') {
      fee = fee.slice(0, fee.length - 1);
    }

    return fee;

  }
}
