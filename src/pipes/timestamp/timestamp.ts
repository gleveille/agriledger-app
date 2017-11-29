import { Pipe, PipeTransform } from '@angular/core';

declare var agrichainJS;
@Pipe({
  name: 'timestamp',
})
export class TimestampPipe implements PipeTransform {
  transform(timestamp: string, ...args) {
    console.log(timestamp)
    console.log(agrichainJS.utils.format.fullTimestamp(timestamp))
    return agrichainJS.utils.format.fullTimestamp(timestamp)

  }
}
