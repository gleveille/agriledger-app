import { Injectable } from '@angular/core';
import { Http,Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import {AzureApiSubscriptionKey,ProfileApi} from "../../app/api";
import { Storage } from '@ionic/storage';
import {Iprofile} from "../../interfaces/profile.interface";

@Injectable()
export class LoopbackProfileProvider {
  headers = new Headers();
  profile:Iprofile={id:null,address:null,privateKey:null,publicKey:null,passcode:null};

  constructor(public http: Http,public storage:Storage) {
    this.headers.append('Ocp-Apim-Subscription-Key',AzureApiSubscriptionKey);
  }

  public getProfileByPasscode(passcode?:string):Promise<Iprofile>{

    return new Promise((resolve,reject)=>{
      this.http.get(`${ProfileApi.getProfileByPasscode()}=${passcode}`,{headers:this.headers})
        .subscribe((response:any)=>{
          this.profile=response.json();
          resolve(response.json());

        },(response)=>{
          console.log(response)
          if(response.status===404)
            reject('Profile not found');
          else
            reject(response.statusText)

        })
    })


  }

  public getProfile(id?:string):Promise<Iprofile>{

    let agriId=id || this.profile.id;
    return new Promise((resolve,reject)=>{
      this.http.get(`${ProfileApi.getProfileById()}/${agriId}`,{headers:this.headers})
        .subscribe((response:any)=>{
          this.profile=response.json();
          resolve(response.json());

        },(response)=>{
          console.log(response)
          if(response.status===404)
            reject('User not found');
          else
            reject(response.statusText)

        })
    })


  }

  public updateProfile(profile:Iprofile):Promise<Iprofile>{
    return new Promise((resolve,reject)=>{
      this.http.put(`${ProfileApi.updateProfile()}/${profile.id}`,profile,{headers:this.headers})
        .subscribe((response)=>{
          this.profile=response.json();
          resolve(response.json())
        },(err)=>{
          reject(err)
        })
    })



  }

  public createProfile(profile:Iprofile):Promise<Iprofile>{
    return new Promise((resolve,reject)=>{
      this.http.post(ProfileApi.createProfile(),profile,{headers:this.headers})
        .subscribe((response)=>{
          this.profile=response.json();
          resolve(response.json())
        },(err)=>{
          reject(err)
        })
    })


  }

  logout(){

    return new Promise((resolve,reject)=>{
      this.storage.remove('agriId').then(()=>{
        for(let i in this.profile){
          this.profile[i]=null;
        }
        return this.storage.remove('market-credential');
      }).then(()=>{
        resolve();

      }).catch((err)=>{
        reject(err);
      })
    });
  }

}
