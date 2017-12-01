import { Injectable } from '@angular/core';

import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class TranslateServiceProvider {

  constructor(private translate:TranslateService) {
    translate.setDefaultLang('ch');

  }

  changeLang(lang:string) {
    this.translate.use(lang);

    this.translate.setDefaultLang(lang);

  }

  dynamicTranslation(name:string){
    let msg=this.translate.instant(name);
    return msg;

  }

}
