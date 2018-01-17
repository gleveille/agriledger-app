
import { Injectable } from '@angular/core';

@Injectable()
export class IndexProvider {
selectedIndex:number = 0;
  constructor() {
    console.log('Hello IndexProvider Provider');
  }
}
