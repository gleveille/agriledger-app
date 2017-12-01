export interface Iuser{
    id?:string,
    username?:string,
    email?:string,
    role?:string,
    password?:string,
    name?:string,
    phone?:string,
    walletAddress?:string,
    publicKey?:string,
    isPasswordChanged?:boolean,
    isRegisteredOnBlockchain?:boolean,
    isIssuerOnBlockchain?:boolean,
    lastLoggedIn?:any

}