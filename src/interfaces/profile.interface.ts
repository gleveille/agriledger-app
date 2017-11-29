/**
 * Created by admin on 30-08-2017.
 */
export interface Iprofile{
  id?:string,
  name?:string,
  location?:string,
  privateKey:string,
  publicKey:string,
  address:string,
  secondPublicKey?:string,
  profileUrl?:string,
  passcode?:number
}
