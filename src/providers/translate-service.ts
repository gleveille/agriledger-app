import { Injectable } from '@angular/core';
import {Storage} from '@ionic/storage';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class TranslateServiceProvider {

  constructor(private translate:TranslateService,private storage:Storage) {
    this.storage.get('appLanguage').then((lang)=>{
      console.log('val us is ', lang)
      if(lang){
        translate.setDefaultLang(lang);
        this.translate.use(lang);

      }
      else{
        translate.setDefaultLang('ch');

        this.translate.use('ch');

      }

    }).catch((err)=>{
      console.log(err)
      translate.setDefaultLang('ch');
      this.translate.use('ch');


    })

  }

  changeLang(lang:string) {
    this.translate.use(lang);

    this.translate.setDefaultLang(lang);
    this.storage.set('appLanguage',lang);

  }

  dynamicTranslation(name:string){
    let msg=this.translate.instant(name);
    return msg;

  }

}
