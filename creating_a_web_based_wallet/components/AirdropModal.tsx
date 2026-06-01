import processAirdrop from "@/functions/processAirdrop";
import { CloudLightning, X } from "lucide-react";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

interface AirdropModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPublicKey: string;
}

export default function AirdropModal({ isOpen, onClose, targetPublicKey }: AirdropModalProps) {
  const [amount, setAmount] = useState<number | string>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleAirdrop = async () => {
    setIsProcessing(true);
    try {
      console.log(`Requesting ${amount} SOL to ${targetPublicKey}`);
      // Simulate network request for UI demo purposes
      await processAirdrop(targetPublicKey,parseFloat(amount as string));

      toast.success(`Successfully airdropped ${amount} SOL to ${targetPublicKey}`);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to request airdrop");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
        <ToastContainer/>
      <div className="w-full max-w-md bg-zinc-900 border-4 border-white shadow-[10px_10px_0px_0px_rgba(168,85,247,1)] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <header className="bg-white text-black px-6 py-4 flex justify-between items-center border-b-4 border-white">
          <h3 className="font-black text-xl uppercase tracking-tighter flex items-center gap-2">
            <CloudLightning className="w-5 h-5 stroke-[3px]" />
            Request_Airdrop
          </h3>
          <button 
            onClick={onClose} 
            disabled={isProcessing}
            className="hover:text-purple-600 transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6 stroke-[3px]" />
          </button>
        </header>
        
        <div className="p-6 space-y-6">
           {/* Target Address Display */}
           <div className="space-y-2">
             <label className="text-xs font-black uppercase tracking-tighter text-zinc-500">
               Target_Address
             </label>
             <div className="font-mono text-xs break-all bg-black border-2 border-zinc-800 p-3 text-zinc-400">
               {targetPublicKey}
             </div>
           </div>
           
           {/* Amount Input */}
           <div className="space-y-2">
             <label className="text-xs font-black uppercase tracking-tighter text-zinc-500">
               Amount (SOL)
             </label>
             <input 
               type="number" 
               min="0.1"
               step="0.1"
               value={amount}
               onChange={(e) => setAmount(e.target.value)}
               disabled={isProcessing}
               className="w-full bg-black border-2 border-zinc-800 p-4 text-purple-400 font-mono text-2xl focus:border-purple-500 focus:outline-none transition-colors disabled:opacity-50 shadow-[inset_0px_0px_15px_rgba(168,85,247,0.1)]"
             />
           </div>

           {/* Actions */}
           <div className="pt-4 flex gap-4">
             <button
               onClick={onClose}
               disabled={isProcessing}
               className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white border-2 border-black p-4 font-black uppercase tracking-widest text-sm transition-all disabled:opacity-50"
             >
               Cancel
             </button>
             <button
               onClick={handleAirdrop}
               disabled={isProcessing}
               className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] p-4 font-black uppercase tracking-widest text-sm transition-all disabled:opacity-50 disabled:shadow-none disabled:translate-x-[4px] disabled:translate-y-[4px]"
             >
               {isProcessing ? "Processing..." : "Confirm"}
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}