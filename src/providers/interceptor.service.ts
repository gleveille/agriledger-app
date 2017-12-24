import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor, HttpErrorResponse, HttpResponse
} from '@angular/common/http';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/concatMap';

import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/retry';
import 'rxjs/add/observable/fromPromise';
import {Storage} from '@ionic/storage';

import { Observable } from "rxjs/Observable";
@Injectable()
export class InterceptorService implements HttpInterceptor {

    constructor(private storage:Storage) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

      return Observable.fromPromise(this.storage.get('accessToken'))
        .concatMap((accessToken)=>{


          if(request.url.indexOf('http://dataservice.accuweather.com')===-1)
          request = request.clone({
            setHeaders: {
              'X-Access-Token': `${accessToken}`
            }
          });

          return next.handle(request).do((event: HttpEvent<any>) => {

            if (event instanceof HttpResponse) {
              // do stuff with response if you want
            }
          }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
              if (err.status === 401) {
                // redirect to the login route
                // or show a modal

                this.storage.remove('accessToken')
                this.storage.remove('userId')


              }
            }
          });

        });

    }
}
