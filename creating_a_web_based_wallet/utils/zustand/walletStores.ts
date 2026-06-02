import { create } from "zustand";

type WalletStore={
    publicKey:string|null,
    privateKey:string|null,
    setPublicKey:(publicKey:string)=>void,
    setPrivateKey:(privateKey:string)=>void,
}

type ShowAppBooleanStore={showApp:boolean,setShowApp:(showApp:boolean)=>void,shouldGetWallets:boolean,setShouldGetWallets:(shouldGetWallets:boolean)=>void}

export const CurrentWalletStore=create<WalletStore>((set) => ({
    publicKey:null,
    privateKey:null,
    setPublicKey:(publicKey:string)=>set({publicKey:publicKey}),
    setPrivateKey:(privateKey:string)=>set({privateKey:privateKey})
}))

export const showAppBooleanStore=create<ShowAppBooleanStore>((set)=>({
    showApp:false,
    setShowApp:(showApp:boolean)=>set({showApp:showApp}),
    shouldGetWallets:false,
    setShouldGetWallets:(shouldGetWallets:boolean)=>set({shouldGetWallets:shouldGetWallets})
}))