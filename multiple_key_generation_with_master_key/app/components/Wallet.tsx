"use client";
import * as Solana from "@solana/web3.js";
import bs58 from "bs58";
import bip39 from "bip39";
import { useEffect, useState } from "react";
import GenerateModel from "./GenerateModel";
import { arrayBuffer } from "stream/consumers";
import { toast } from "react-toastify";
import { derivePath } from "ed25519-hd-key";
import { useQuery } from "@tanstack/react-query";
import getWallets, { WalletType } from "../functions/getWallets";

const Wallet = () => {
  const [ShowGenerateModel, setShowGenerateModel] = useState<boolean>(false);
  const isBrowser =
    typeof window !== "undefined" &&
    typeof window.localStorage?.getItem == "function";
  const { data: Wallets, isLoading } = useQuery({
    queryKey: ["wallets"],
    queryFn: getWallets,
    enabled: isBrowser && !ShowGenerateModel,
  });

  async function generateWallet() {
    const userPass = localStorage.getItem("userPass")
      ? localStorage.getItem("userPass")
      : false;
    console.log(userPass);
    const masterSeedKey = localStorage.getItem("masterSeedKey");
    if (!userPass || !masterSeedKey) {
      return setShowGenerateModel(true);
    }
    const MasterSeedKeyArrayBuffer = Buffer.from(masterSeedKey);
    const lastWalletIndex = localStorage.getItem("lastIndex");
    const derivationPath = `m/44'/501'/${lastWalletIndex ? parseInt(lastWalletIndex) + 1 : 0}'/0'`;
    const derivedSeed = await derivePath(derivationPath, masterSeedKey).key;
    const keyPair = Solana.Keypair.fromSeed(derivedSeed);
    const privateKey = bs58.encode(keyPair.secretKey);
    const publicKey = keyPair.publicKey.toBase58();
    localStorage.setItem(
      "lastIndex",
      lastWalletIndex ? parseInt(lastWalletIndex) + 1 + "" : "0",
    );
    localStorage.setItem(
      `wallet-${lastWalletIndex ? parseInt(lastWalletIndex) + 1 : 0}`,
      JSON.stringify({
        publicKey: publicKey,
        privateKey: Buffer.from(privateKey).toString("hex"),
        derivationPath,
      }),
    );
    return toast.success("Created new wallet successfully!");
  }

  useEffect(() => {
    console.log("this is the wallets frontend", Wallets);
  }, [Wallets]);
  if (
    isBrowser
      ? !localStorage.getItem("masterSeedKey") ||
        !localStorage.getItem("userPass")
      : false
  ) {
    ShowGenerateModel == true ? null : setShowGenerateModel(true);
  }

  return (
    <div
      className={`min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 $`}
    >
      <main className="max-w-3xl mx-auto px-6 py-20 flex flex-col items-center">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 tracking-tight">
            Generate Wallets
          </h2>
          <p className="text-white/60 text-lg max-w-md mx-auto">
            Securely derive multiple keypairs from a single master mnemonic.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={generateWallet}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-10 rounded-full transition-all active:scale-95 mb-16 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
        >
          Generate New Wallet
        </button>

        {/* Wallet Display Area */}
        <div className="w-full space-y-4">
          {isLoading && <div className="text-gray-200 text-xl">Loading...</div>}
          {Wallets &&
            Wallets?.map((wallet: WalletType, i) => {
              return (
                <div
                  key={i}
                  className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
                >
                  <div className="flex justify-between items-start mb-8">
                    <span className="text-xs font-mono text-blue-500 uppercase tracking-widest">
                      Wallet #{i}
                    </span>
                    <span className="bg-blue-500/10 text-blue-500 text-[10px] px-2 py-1 rounded border border-blue-500/20">
                      ED25519
                    </span>
                  </div>

                  <div className="space-y-6">
                    {/* Public Key */}
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-white/40 mb-2">
                        Public Key
                      </label>
                      <div className="font-mono text-sm break-all bg-black/40 p-4 rounded-lg border border-white/5 select-all">
                        {wallet.publicKey}
                      </div>
                    </div>

                    {/* Private Key */}
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-white/40 mb-2">
                        Private Key
                      </label>
                      <div className="font-mono text-sm break-all bg-black/40 p-4 rounded-lg border border-white/5 flex justify-between items-center group cursor-pointer">
                        <span className="text-white/20 blur-[4px] group-hover:blur-none transition-all">
                          {wallet.privateKey}
                        </span>
                        <span className="text-[10px] text-blue-500 opacity-100 transition-opacity">
                          HOVER TO REVEAL
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </main>
      <GenerateModel
        isOpen={ShowGenerateModel}
        onClose={() => setShowGenerateModel(false)}
      />
    </div>
  );
};

export default Wallet;
