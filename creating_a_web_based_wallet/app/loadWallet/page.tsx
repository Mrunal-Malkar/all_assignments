"use client"
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import getWalletInfo from "../functions/getWalletInfo"
import { Coins, Eye, KeyIcon, Send, ShieldCheck, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { WalletType } from '@/app/functions/getWallets';

const LoadWallet = () => {
  const searchParams= useSearchParams();
  const publicKey=searchParams?.get("publicKey")? searchParams.get("publicKey") : null;

  const {
    data: WalletBalance,
    isLoading: isWalletBalanceLoading,
    refetch: refetchWalletBalance,
  } = useQuery({
    queryKey: ["WalletBalance", publicKey],
    queryFn: () =>
      publicKey
        ? getWalletInfo(publicKey)
        : Promise.resolve(null),
    enabled: publicKey!=null,
  });
  const router=useRouter();

  const privateKey="hardcoded_for_now_not_real" //fix later

  
    function deleteWallet(publicKey: string) {
      let emptyWallets = 0;
      let Index = 0;
      console.log("finding delete", publicKey);
  
      for (let i = 0; emptyWallets < 20; i++) {
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
  
      router.push("/")
    }
  

  return (
    <>
   {/* Render this when a wallet IS loaded */}
{publicKey ? (
  <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
    
    {/* Optional: A back button to return to the list */}
    <button 
      onClick={() => router.push("/")} 
      className="mb-6 text-zinc-500 hover:text-white font-black uppercase text-xs tracking-widest flex items-center gap-2 transition-colors"
    >
      {"< Return_To_Index"}
    </button>

    <div className="bg-zinc-900 border-4 border-white shadow-[10px_10px_0px_0px_rgba(59,130,246,1)] overflow-hidden">
      {/* Header */}
      <div className="bg-white text-black px-6 py-4 flex justify-between items-center border-b-4 border-white">
        <h3 className="font-black text-xl uppercase tracking-tighter">
          Active_Wallet
        </h3>
        <span className="bg-black text-white text-[10px] font-black px-2 py-0.5">
          ED25519
        </span>
      </div>

      <div className="p-6 space-y-8">
        
        {/* Public Key */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <label className="text-xs font-black uppercase tracking-tighter text-zinc-500">
              Public_Address
            </label>
          </div>
          <div className="font-mono text-sm break-all bg-black border-2 border-zinc-800 p-4 select-all text-blue-400">
            {publicKey}
          </div>
        </div>

        {/* SOL Balance */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-yellow-500" />
            <label className="text-xs font-black uppercase tracking-tighter text-zinc-500">
              Network_Balance
            </label>
          </div>
          <div className="font-mono text-2xl bg-black border-2 border-zinc-800 p-6 text-yellow-400 flex items-center justify-between shadow-[inset_0px_0px_20px_rgba(234,179,8,0.1)]">
            <span>
              {isWalletBalanceLoading ? "..." : WalletBalance}
            </span>
            <span className="text-sm bg-zinc-800 text-white px-3 py-1 font-black tracking-widest">
              SOL
            </span>
          </div>
        </div>

        {/* SEND SOL ACTION */}
        <div className="pt-2">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] p-5 font-black uppercase tracking-widest text-lg transition-all active:bg-white active:text-black"
          >
            <Send className="w-6 h-6 stroke-[3px]" />
            Initiate_Transfer
          </button>
        </div>

        {/* Divider */}
        <hr className="border-t-2 border-dashed border-zinc-800 my-8" />

        {/* Danger Zone: Private Key */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <KeyIcon className="w-4 h-4 text-red-500" />
            <label className="text-xs font-black uppercase tracking-tighter text-red-500/80">
              Secret_Key_Data [ RESTRICTED ]
            </label>
          </div>
          <div className="relative group cursor-crosshair">
            <div className="font-mono text-xs break-all bg-black border-2 border-red-900/30 p-4 flex justify-between items-center overflow-hidden">
              <span className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-75 z-10">
                {privateKey}
              </span>
              {/* Masking Layer */}
              <div className="absolute inset-0 flex items-center px-4 bg-black group-hover:hidden">
                <span className="text-zinc-700 font-black tracking-[0.5em]">
                  ••••••••••••••••••••••••••••••••
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-red-500 group-hover:hidden">
                <Eye className="w-4 h-4" />
                <span>HOVER_TO_REVEAL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone: Delete Button */}
        <div className="pt-2">
          <button
            onClick={() => publicKey!=null?deleteWallet(publicKey):null}
            type="button"
            className="w-full flex items-center justify-center gap-2 bg-red-950/30 hover:bg-red-600 text-red-500 hover:text-white border-2 border-red-900 hover:border-red-600 p-4 font-black uppercase tracking-widest text-sm transition-colors active:scale-[0.98]"
          >
            <Trash2 className="w-5 h-5 stroke-[3px]" />
            Purge_Wallet
          </button>
        </div>

      </div>
    </div>
  </div>
  ):<div className="text-center text-zinc-500" onClick={()=>router.back()}>go back</div>}
  </>
  )
}

export default LoadWallet