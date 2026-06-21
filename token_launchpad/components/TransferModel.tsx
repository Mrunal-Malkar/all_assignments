import React, { useState } from "react";
import { 
  ArrowRight, 
  KeyIcon, 
  CheckCircle2, 
  X, 
  Eye, 
  EyeOff, 
  Send,
  Loader2
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import processTransaction from "@/functions/processTransaction";

export default function TransferModal({ 
  isOpen, 
  onClose, 
  fromPublicKey 
}:{isOpen:boolean,onClose:()=>void,fromPublicKey:string}) {
  const [step, setStep] = useState(1);
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState<number | null>(null);
  const [privateKey, setPrivateKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // If the modal isn't open, render nothing
  if (!isOpen) return null;

  // Handle the transition from Step 1 to Step 2
  const handleProceed = (e) => {
    e.preventDefault();
    if (!toAddress || !amount) return;
    setStep(2);
  };

  // Handle the final transaction submission
  const handleSubmit = async (e) => {
    try{
      e.preventDefault();
      if (!privateKey || !amount) return;
      setIsProcessing(true);
      await processTransaction({fromPublicKey, toAddress, amount, privateKey})
      setIsProcessing(false);
      setStep(3);
    }catch(e){
      setIsProcessing(false);
      console.log("the error in the transfer modal is",e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred while processing the transaction.";
      toast.error(errorMessage);
    }
  };

  // Reset state and close modal
  const handleClose = () => {
    setStep(1);
    setToAddress("");
    setAmount("");
    setPrivateKey("");
    setShowKey(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <ToastContainer/>
      {/* Modal Container */}
      <div className="w-full max-w-lg bg-zinc-900 border-4 border-white shadow-[10px_10px_0px_0px_rgba(59,130,246,1)] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <header className="bg-white text-black px-6 py-4 flex justify-between items-center border-b-4 border-white">
          <h3 className="font-black text-xl uppercase tracking-tighter">
            {step === 1 && "TX_Configuration"}
            {step === 2 && "TX_Authorization"}
            {step === 3 && "TX_Complete"}
          </h3>
          <button 
            onClick={handleClose}
            className="text-black hover:text-red-600 transition-colors bg-zinc-200 hover:bg-zinc-300 p-1 active:scale-95"
          >
            <X className="w-5 h-5 stroke-[3px]" />
          </button>
        </header>

        <div className="p-8">
          
          {/* STEP 1: CONFIGURATION */}
          {step === 1 && (
            <form onSubmit={handleProceed} className="space-y-6">
              
              {/* From Address (Read Only) */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-tighter text-zinc-500">
                  Origin_Address (From)
                </label>
                <div className="font-mono text-sm truncate bg-black border-2 border-zinc-800 p-4 text-zinc-500 cursor-not-allowed">
                  {fromPublicKey}
                </div>
              </div>

              {/* To Address */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-tighter text-blue-500">
                  Destination_Address (To)
                </label>
                <input
                  type="text"
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                  placeholder="Enter recipient public key..."
                  required
                  className="w-full font-mono text-sm bg-black border-2 border-zinc-700 p-4 text-blue-400 placeholder:text-zinc-700 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-tighter text-yellow-500">
                  Transfer_Volume (SOL)
                </label>
                <input
                  type="number"
                  step="any"
                  value={amount??""}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || null)}
                  placeholder="0.00"
                  required
                  className="w-full font-mono text-2xl bg-black border-2 border-zinc-700 p-4 text-yellow-400 placeholder:text-zinc-800 focus:border-yellow-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-200 text-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] p-5 font-black uppercase tracking-widest text-lg transition-all active:bg-zinc-300"
                >
                  Proceed_To_Sign
                  <ArrowRight className="w-6 h-6 stroke-[3px]" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: AUTHORIZATION (Private Key) */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              
              <div className="bg-red-950/30 border-2 border-red-900/50 p-4 flex items-start gap-3">
                <KeyIcon className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <p className="text-xs text-red-400/90 font-mono leading-relaxed">
                  <strong className="text-red-500 block mb-1">CRITICAL AUTHORIZATION REQUIRED</strong>
                  Please provide your secret key to cryptographically sign and broadcast this transaction to the network.
                </p>
              </div>

              {/* Private Key Input */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-tighter text-red-500">
                  Private_KEY_Data
                </label>
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    value={privateKey}
                    onChange={(e) => setPrivateKey(e.target.value)}
                    placeholder="Enter Private Key..."
                    required
                    className="w-full font-mono text-sm bg-black border-2 border-red-900/50 p-4 pr-12 text-red-400 placeholder:text-red-950 focus:border-red-500 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500/50 hover:text-red-500 transition-colors"
                  >
                    {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isProcessing}
                  className="flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-white border-4 border-black p-5 font-black uppercase tracking-widest transition-all disabled:opacity-50"
                >
                  {"< Back"}
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] p-5 font-black uppercase tracking-widest text-lg transition-all active:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-6 h-6 stroke-[3px] animate-spin" />
                      Transmitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-6 h-6 stroke-[3px]" />
                      Sign_&_Transmit
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: SUCCESS */}
          {step === 3 && (
            <div className="flex flex-col items-center justify-center text-center space-y-6 py-8 animate-in zoom-in-95 duration-300">
              <div className="w-24 h-24 bg-green-950/30 border-4 border-green-500 flex items-center justify-center rounded-full shadow-[0px_0px_40px_rgba(34,197,94,0.2)]">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              
              <div className="space-y-2">
                <h4 className="font-black text-2xl uppercase tracking-tighter text-white">
                  Payload_Delivered
                </h4>
                <p className="text-zinc-500 text-sm font-mono">
                  Successfully transferred <span className="text-yellow-400">{amount} SOL</span> to destination.
                </p>
              </div>

              <button
                onClick={handleClose}
                className="mt-4 w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-200 text-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] p-5 font-black uppercase tracking-widest text-lg transition-all active:bg-zinc-300"
              >
                Acknowledge
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}