"use client";

import "@solana/wallet-adapter-react-ui/styles.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Coins,
  Rocket,
  Type,
  Hash,
  Image as ImageIcon,
  Database,
  ArrowLeft,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { createInitializeMint2Instruction, getMintLen, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

const CreateToken = () => {
  const router = useRouter();
  const wallets = useWallet();
  const [isMinting, setIsMinting] = useState(false);

  // Token State
  const [tokenData, setTokenData] = useState({
    name: "",
    symbol: "",
    decimals: "9",
    supply: "",
    imageUrl: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTokenData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMint = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (!tokenData.name || !tokenData.symbol || !tokenData.supply) {
        return toast.error("Missing_Required_Fields");
      }
      if (!wallets.connected || !wallets.publicKey) {
       return toast.error("Wallet_Not_Connected");
      }

      setIsMinting(true);

      console.log("here 0")
      const connection = new Connection(
        "https://api.devnet.solana.com",
        "confirmed",
      );
      const balance = await connection.getMinimumBalanceForRentExemption(getMintLen([]));
      const keyPair = await Keypair.generate();
console.log("here 1")
      const transaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: wallets.publicKey,
          newAccountPubkey: keyPair.publicKey,
          lamports: balance,
          space: getMintLen([]),
          programId: TOKEN_2022_PROGRAM_ID,
        }),
        createInitializeMint2Instruction(
          keyPair.publicKey,
          9,
          wallets.publicKey,
          wallets.publicKey,
TOKEN_2022_PROGRAM_ID
        ),
      );

      transaction.feePayer = wallets.publicKey;
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;
      transaction.partialSign(keyPair);
      const SignedTransaction = await wallets.sendTransaction(
        transaction,
        connection,
      );
      console.log(
        "Created New Mint account, Transaction_Signature:",
        SignedTransaction,
      );

      setIsMinting(false);
      return toast.success("Token_Minted_Successfully");
      // Optional: router.push('/dashboard')
    } catch (e) {
      console.log("the error:", e);
      setIsMinting(false);
      return toast.error("Failed to Create Token Mint Account");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-auto flex flex-col justify-center p-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <ToastContainer />

      <div className="absolute top-5 right-5">
        <WalletMultiButton />
      </div>

      {/* Back Navigation */}
      <button
        onClick={() => router.push("/")}
        aria-label="Return to Index"
        className="mb-3 self-start text-zinc-500 hover:text-white font-black uppercase text-xs tracking-widest flex items-center gap-2 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        {"< Return_To_Index"}
      </button>

      {/* Main Form Container */}
      <section className="bg-zinc-900 border-4 border-white shadow-[10px_10px_0px_0px_rgba(168,85,247,1)] overflow-hidden">
        {/* Header */}
        <header className="bg-white text-black px-6 py-4 flex justify-between items-center border-b-4 border-white">
          <h3 className="font-black text-xl uppercase tracking-tighter flex items-center gap-2">
            <Rocket className="w-6 h-6" />
            Initialize_Mint
          </h3>
          <span className="bg-black text-white text-[10px] font-black px-2 py-0.5">
            SPL_TOKEN
          </span>
        </header>

        <form onSubmit={handleMint} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Token Name */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-purple-500" />
                <label className="text-xs font-black uppercase tracking-tighter text-zinc-500">
                  Token_Name *
                </label>
              </div>
              <input
                type="text"
                name="name"
                value={tokenData.name}
                onChange={handleInputChange}
                placeholder="e.g. Solana"
                className="w-full font-mono text-sm bg-black border-2 border-zinc-800 p-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-purple-500 transition-colors"
                required
              />
            </div>

            {/* Token Symbol */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-purple-500" />
                <label className="text-xs font-black uppercase tracking-tighter text-zinc-500">
                  Ticker_Symbol *
                </label>
              </div>
              <input
                type="text"
                name="symbol"
                value={tokenData.symbol}
                onChange={handleInputChange}
                placeholder="e.g. SOL"
                maxLength={10}
                className="w-full font-mono text-sm bg-black border-2 border-zinc-800 p-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-purple-500 transition-colors uppercase"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Initial Supply */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-purple-500" />
                <label className="text-xs font-black uppercase tracking-tighter text-zinc-500">
                  Initial_Supply *
                </label>
              </div>
              <input
                type="number"
                name="supply"
                min="1"
                value={tokenData.supply}
                onChange={handleInputChange}
                placeholder="1000000"
                className="w-full font-mono text-sm bg-black border-2 border-zinc-800 p-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-purple-500 transition-colors"
                required
              />
            </div>

            {/* Decimals */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-500" />
                <label className="text-xs font-black uppercase tracking-tighter text-zinc-500">
                  Decimals
                </label>
              </div>
              <input
                type="number"
                name="decimals"
                min="0"
                max="9"
                value={tokenData.decimals}
                onChange={handleInputChange}
                className="w-full font-mono text-sm bg-black border-2 border-zinc-800 p-4 text-purple-400 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          {/* Image URL (Metadata) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-purple-500" />
              <label className="text-xs font-black uppercase tracking-tighter text-zinc-500">
                Image_URI [ Optional ]
              </label>
            </div>
            <input
              type="url"
              name="imageUrl"
              value={tokenData.imageUrl}
              onChange={handleInputChange}
              placeholder="https://arweave.net/..."
              className="w-full font-mono text-sm bg-black border-2 border-zinc-800 p-4 text-blue-400 placeholder:text-zinc-700 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Divider */}
          <hr className="border-t-2 border-dashed border-zinc-800 my-8" />

          {/* ACTION BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isMinting || !wallets.connected}
              className="w-full flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] disabled:shadow-none disabled:translate-x-[6px] disabled:translate-y-[6px] p-5 font-black uppercase tracking-widest text-lg transition-all active:bg-white active:text-black"
            >
              <Rocket
                className={`w-6 h-6 stroke-[3px] ${isMinting ? "animate-bounce" : ""}`}
              />
              {isMinting ? "Deploying_Contract..." : `Deploy_Token`}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default CreateToken;
