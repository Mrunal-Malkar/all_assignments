"use client"
import * as Solana from "@solana/web3.js";
import bip39 from "bip39";
import { useState } from "react";
import GenerateModel from "./GenerateModel";

const Wallet = () => {

    const [ShowGenerateModel, setShowGenerateModel] = useState<boolean>(false);

  async function generateWallet(){
    const userPass=localStorage.getItem("userPass")?localStorage.getItem("userPass")
    : false;
    console.log(userPass)
    const masterSeedKey=localStorage.getItem("masterSeedKey");
    if(!userPass || !masterSeedKey){
    return setShowGenerateModel(true);
    }

  }

  return (
    <div className={`min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 $`}>
 
      <main className="max-w-3xl mx-auto px-6 py-20 flex flex-col items-center">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 tracking-tight">Generate Wallets</h2>
          <p className="text-white/60 text-lg max-w-md mx-auto">
            Securely derive multiple keypairs from a single master mnemonic.
          </p>
        </div>

        {/* Action Button */}
        <button onClick={generateWallet} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-10 rounded-full transition-all active:scale-95 mb-16 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
          Generate New Wallet
        </button>

        {/* Wallet Display Area */}
        <div className="w-full space-y-4">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <div className="flex justify-between items-start mb-8">
              <span className="text-xs font-mono text-blue-500 uppercase tracking-widest">Wallet #01</span>
              <span className="bg-blue-500/10 text-blue-500 text-[10px] px-2 py-1 rounded border border-blue-500/20">ED25519</span>
            </div>

            <div className="space-y-6">
              {/* Public Key */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-white/40 mb-2">Public Key</label>
                <div className="font-mono text-sm break-all bg-black/40 p-4 rounded-lg border border-white/5 select-all">
                  7xkx...89pL2vNqW4Z5rT9mJ3hK6sY1
                </div>
              </div>

              {/* Private Key */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-white/40 mb-2">Private Key</label>
                <div className="font-mono text-sm break-all bg-black/40 p-4 rounded-lg border border-white/5 flex justify-between items-center group cursor-pointer">
                  <span className="text-white/20 blur-[4px] group-hover:blur-none transition-all">
                    ••••••••••••••••••••••••••••••••••••••••••••••••
                  </span>
                  <span className="text-[10px] text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">CLICK TO REVEAL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <GenerateModel isOpen={ShowGenerateModel} onClose={() => setShowGenerateModel(false)} />
    </div>
  );
};

export default Wallet;