export interface Iuser {
  profiles?: {
    id?:string,
    phone?: string,
    passcode?: number,
    name?: string,
    registration?:string,
    address?:{
      line1?:string,
      line2?:string,
      city?:string,
      province?:string
    },
    farmDetails?:{
      farmName?:string,
      products?: string,
      crops?:string,
      grade?:string,
      size?:string,
      region?:string
    },
    company?:string,
    profileUrl?: {
      url: string,
      lat: number,
      long: number,
      hash:string
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
