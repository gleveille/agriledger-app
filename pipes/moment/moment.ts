

import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'moment'
})
export class MomentPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(value){
      if(args && args===true)
        return moment(value).fromNow(true);
      else
        return moment(value).fromNow();
    }
    else{
      return '';

    }
  }

}
