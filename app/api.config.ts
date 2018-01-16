// This  file contains list of all the api this angular application uses.
// This file also documenting how to use the api

import {environment} from './environments/environment';
export const ServerUrl = environment.apiURL + ':' + environment.apiPORT;


const ContainerApi = {
  ProfileUploadUrl: ()=>ServerUrl + '/api/containers/profiles/upload',
  EvidencesUploadUrl: ()=>ServerUrl + '/api/containers/evidences/upload',
  AssetDocumentsUploadUrl: ()=>ServerUrl + '/api/containers/asset_documents/upload',
  ProfileDocumentsUploadUrl: ()=>ServerUrl + '/api/containers/profile_documents/upload'

};
const UserApi = {
  login: {
    url: ()=>ServerUrl + '/api/users/login',
    method: 'POST'

  },
  logout: {
    url: ()=>ServerUrl + '/api/users/logout',
    method: 'POST'

  },
  changePassword: {
    url: ()=>ServerUrl + '/api/users/change-password',
    method: 'POST'

  },
  updateProfile: {
    url: ()=>ServerUrl + '/api/users',
    method: 'POST'
  },
  findById: {
    url: ()=>ServerUrl + '/api/users',
    method: 'GET'

  },
  list: {
    url: ()=>ServerUrl + '/api/users',
    method: 'GET'

  },
  getAssets: {
    url: ()=>ServerUrl + '/api/users',
    method: 'GET',
    params: ['filterType', 'filterName']
  },
  resetPassword: {
    url: ()=>ServerUrl + '/api/users/reset',
    method: 'GET',
    params: ['filterType', 'filterName']
  }
}


const AssetApi = {
  getAssets: {
    url: ()=>ServerUrl + '/api/assets',
    method: 'GET',
    params: ['filterType', 'filterName']
  },
  getCategories: {
    url: ()=>ServerUrl + '/api/blockchain/asset/category',
    method: 'GET',
    params: ['level']
  }
};

const WeatherApi = {
  getCurrent: {
    url: ()=>ServerUrl + '/api/weather/current',
    method: 'GET',
    params: ['lat', 'long']
  },
  getForecast: {
    url: ()=>ServerUrl + '/api/weather/forecast',
    method: 'GET',
    params: ['lat', 'long']
  }
};
export {UserApi, AssetApi, ContainerApi,WeatherApi}
