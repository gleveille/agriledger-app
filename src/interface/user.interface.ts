export interface Iuser {
  profiles?: {
    id?:string,
    phone?: string,
    passcode?: number,
    name?: string,
    registration?:String,
    address?:string,
    company?:string,
    profileUrl?: {
      url: string,
      lat: string,
      long: string
    },
  },
  id?:string,
  username?:string,
  email?:string,
  role?:string,
  password?:string,
  walletAddress?:string,
  publicKey?:string,
  isPasswordChanged?:boolean,
  isRegisteredOnBlockchain?:boolean,
  isIssuerOnBlockchain?:boolean

}
