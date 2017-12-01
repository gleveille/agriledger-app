
// This  file contains list of all the api this angular application uses.
// This file also documenting how to use the api

import {environment} from './environments/environment';
export const ServerUrl=environment.apiURL+':'+environment.apiPORT;
export const BlockChainServerUrl=environment.blockchainURL;



const ContainerApi={
  ProfileUploadUrl:()=>ServerUrl+'/api/containers/profiles/upload',
  FieldUploadUrl:()=>ServerUrl+'/api/containers/fields/upload'

};
const UserApi={
    login:{
        url:()=>ServerUrl+'/api/users/login',
        method:'POST'

    },
    logout:{
        url:()=>ServerUrl+'/api/users/logout',
        method:'POST'

    },
    changePassword:{
        url:()=>ServerUrl+'/api/users/change-password',
        method:'POST'

    },
    findById:{
        url:()=>ServerUrl+'/api/users',
        method:'POST'

    },
    list:{
        url:()=>ServerUrl+'/api/users',
        method:'GET'

    },
  getAssets:{
    url:()=>ServerUrl+'/api/users',
    method:'GET',
    params:['filterType','filterName']
  }
}


const AssetApi={
    getAssets:{
        url:()=>ServerUrl+'/api/assets',
        method:'GET',
        params:['filterType','filterName']
    }

};


export {UserApi,AssetApi,ContainerApi}