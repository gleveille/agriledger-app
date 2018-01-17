interface Idocument{
  url?:string,
  lat?:number,
  long?:number,
  hash?:string,
  date?:string,
  status?:string,
  description?:string
}

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
      lat: number,
      long: number,
      hash:string
    },
    documents?:Idocument[]
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
