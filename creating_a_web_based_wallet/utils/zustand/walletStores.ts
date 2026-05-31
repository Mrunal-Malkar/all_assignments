import { create } from "zustand";

type WalletStore={
    publicKey:string|null,
    privateKey:string|null,
    setPublicKey:(publicKey:string)=>void,
    setPrivateKey:(privateKey:string)=>void,
}

export const CurrentWalletStore=create<WalletStore>((set) => ({
    publicKey:null,
    privateKey:null,
    setPublicKey:(publicKey:string)=>set({publicKey:publicKey}),
    setPrivateKey:(privateKey:string)=>set({privateKey:privateKey})
}))