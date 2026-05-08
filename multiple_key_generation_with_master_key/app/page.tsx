import Image from "next/image";
import Wallet from "./components/Wallet";

export default function Home() {
  return (
<>
         <nav className="flex items-center justify-between px-8 py-6 border-b border-white/10">
        <h1 className="text-lg font-bold tracking-tight">SOLANA_GEN</h1>
        <div className="text-xs uppercase tracking-widest text-white/40">Network: Demo-Wallet</div>
      </nav>

    <Wallet/> 
    </>
  );
}
