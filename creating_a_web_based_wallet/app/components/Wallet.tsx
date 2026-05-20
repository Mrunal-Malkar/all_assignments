"use client";
import * as Solana from "@solana/web3.js";
import bs58 from "bs58";
import bip39 from "bip39";
import { useEffect, useState } from "react";
import GenerateModel from "./GenerateModel";
import { arrayBuffer } from "stream/consumers";
import { toast, ToastContainer } from "react-toastify";
import { derivePath } from "ed25519-hd-key";
import { useQuery } from "@tanstack/react-query";
import getWallets, { WalletType } from "../functions/getWallets";
import {
  Divide,
  Eye,
  KeyIcon,
  Plus,
  ShieldCheck,
  Trash2,
  WalletIcon,
} from "lucide-react";
import UserPassModel from "./UserPassModel";

const Wallet = () => {
  const [ShowGenerateModel, setShowGenerateModel] = useState<boolean>(false);
  const [shouldGetWallets, setShouldGetWallets] = useState(false);
  const [showApp, setShowApp] = useState(false);

  const {
    data: Wallets,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["wallets"],
    queryFn: getWallets,
    enabled: shouldGetWallets,
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

    refetch();

    return toast.success("Created new wallet successfully!");
  }

  function deleteWallet(publicKey: string) {
    let emptyWallets = 0;
    let Index = 0;
    console.log("finding delete",publicKey);
    
    for (let i = 0; emptyWallets <20; i++) {
      const wallet = localStorage.getItem(`wallet-${i}`);
      if (wallet) {
        const walletData: WalletType = JSON.parse(wallet);
        if (walletData.publicKey == publicKey) {
          Index = i;
          break;
        }
      } else {
        emptyWallets++;
      }
    }

    localStorage.removeItem(`wallet-${Index}`);
    toast.success("removed wallet");

    refetch();
  }

  function openApp() {
    const seedKey = localStorage.getItem("masterSeedKey");
    const userPass = localStorage.getItem("userPass");
    if (!seedKey || !userPass) {
      console.log("seeting generatew true model");
      setShowGenerateModel(true);
    } else {
      setShowApp(true);
    }
  }

  if (!showApp && !ShowGenerateModel) {
    return (
      <div
        onClick={openApp}
        className="w-screen h-screen flex justify-center items-center"
      >
        Open App
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono selection:bg-white selection:text-black">
      <main className="max-w-3xl mx-auto px-6 py-20 flex flex-col items-center">
        <ToastContainer />

        {/* Header Section */}

        <div className="w-full border-4 border-white p-8 mb-12 bg-zinc-900 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
          <div className="flex items-center gap-4 mb-4">
            <WalletIcon className="w-10 h-10 text-blue-500" strokeWidth={2.5} />

            <h2 className="text-4xl font-black uppercase tracking-tighter">
              Key_Gen_v1.0
            </h2>
          </div>

          <p className="text-zinc-400 text-sm border-t-2 border-zinc-800 pt-4 uppercase tracking-widest">
            Securely derive keypairs // Master Mnemonic Protocol
          </p>
        </div>

        {/* Action Button */}

        <button
          onClick={generateWallet}
          className="group relative w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase py-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:bg-white active:text-black mb-16"
        >
          <Plus className="w-6 h-6 stroke-[3px]" />

          <span className="text-xl tracking-tight">Generate New Wallet</span>
        </button>

        {/* Wallet Display Area */}

        <div className="w-full space-y-10">
          {isLoading && (
            <div className="text-blue-500 font-black animate-pulse text-center py-10 border-4 border-dashed border-blue-500">
              [ SYSTEM_BUSY: DERIVING_KEYS ]
            </div>
          )}

          {Wallets &&
            Wallets?.map((wallet: WalletType, i) => {
              return (
                <div
                  key={wallet.publicKey}
                  className="bg-zinc-900 border-4 border-white shadow-[10px_10px_0px_0px_rgba(59,130,246,1)] overflow-hidden"
                >
                  {/* Card Header */}

                  <div className="bg-white text-black px-4 py-2 flex justify-between items-center border-b-4 border-white">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm uppercase">
                        Index_0{i}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="bg-black text-white text-[10px] font-black px-2 py-0.5">
                        ED25519
                      </span>

                      {/* Delete Icon */}

                      <button
                      type="button"
                        onClick={(e) =>{e.stopPropagation(); deleteWallet(wallet.publicKey)}}
                        className="hover:text-red-600 transition-colors active:scale-90"
                      >
                        <Trash2 className="w-4 h-4 stroke-[3px]" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Public Key */}

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-blue-500" />

                        <label className="text-[10px] font-black uppercase tracking-tighter text-zinc-500">
                          Public_Address
                        </label>
                      </div>

                      <div className="font-mono text-xs break-all bg-black border-2 border-zinc-800 p-4 select-all text-blue-400">
                        {wallet.publicKey}
                      </div>
                    </div>

                    {/* Private Key */}

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <KeyIcon className="w-4 h-4 text-red-500" />

                        <label className="text-[10px] font-black uppercase tracking-tighter text-zinc-500">
                          Secret_Key_Data
                        </label>
                      </div>

                      <div className="relative group cursor-crosshair">
                        <div className="font-mono text-xs break-all bg-black border-2 border-zinc-800 p-4 flex justify-between items-center overflow-hidden">
                          <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-75 z-10">
                            {wallet.privateKey}
                          </span>

                          {/* Masking Layer */}

                          <div className="absolute inset-0 flex items-center px-4 bg-black group-hover:hidden">
                            <span className="text-zinc-700 font-black tracking-[0.5em]">
                              ••••••••••••••••••••••••••••••••
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[10px] font-black text-blue-500 group-hover:hidden">
                            <Eye className="w-4 h-4" />

                            <span>HOVER_TO_REVEAL</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </main>

      {/* model which does=>userPass , mnemonics , seed key generation. */}
      <GenerateModel
        isOpen={ShowGenerateModel}
        onClose={() => setShowGenerateModel(false)}
      />

      {/* get the userPass */}
      <UserPassModel
        isOpen={!shouldGetWallets && !ShowGenerateModel}
        onClose={() => setShouldGetWallets(true)}
      />
    </div>
  );
};

export default Wallet;
