var CryptoJS = require("crypto-js");
var request=require('request')


var date=new Date().toUTCString()+'/n';
// construct input value
var inputvalue = "GET\n\n\n\n\n\n\n\n\n\n\n\nx-ms-date:"+date+"x-ms-version:2009-09-19\n/agriledgerstorage/images\ncomp:metadata\nrestype:container\ntimeout:20"
var key = "v/j/iXiWM/I85TGMjZurHjWylnR1Y76mmN19C2ndqj6sxD7vTVLM+RLOW4ZCLGi2dM130WmqpwwbEuvHP4/6BA==";
var strTime = (new Date()).toUTCString();
var strToSign = 'GET\n\n\n\n\n\n\n\n\n\n\n\nx-ms-date:' + strTime + '\nx-ms-version:2015-12-11\n/agriledgerstorage/\ncomp:list';
var secret = CryptoJS.enc.Base64.parse(key);
var hash = CryptoJS.HmacSHA256(strToSign, secret);
var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
var auth = "SharedKey agriledgerstorage:"+hashInBase64;
console.log(auth)
var options = {
  url: 'https://agriledgerstorage.blob.core.windows.net/images/1503616518232.jpg',
  headers: {
    'x-ms-date': date,
    'Authroziation':auth
  }
};

function callback(error, response, body) {
  if(error){
    console.log('error occurred')
    console.log(error)
  }
  else {
    console.log('success')
    console.log(body)
  }

}

request(options, callback);
