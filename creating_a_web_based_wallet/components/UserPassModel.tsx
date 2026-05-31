"use client";

import { useEffect, useRef, useState } from "react";
import { X, Wallet, ShieldCheck } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

const UserPassModel = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [passcode, setPasscode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Dummy function
  const checkPass = (pass: string) => {
    console.log("Checking pass:", pass);
    if(pass==localStorage.getItem("userPass")){
      return onClose();
    }else{
      return toast.error("wrong password")
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...passcode];
    updated[index] = value;
    setPasscode(updated);

    // Move forward
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    const fullPass = updated.join("");

    if (fullPass.length === 6 && !updated.includes("")) {
      checkPass(fullPass);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !passcode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#111111] p-8 shadow-2xl">
        <ToastContainer/>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
        >
          <X size={20} />
        </button>

        {/* Wallet Icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/15 border border-purple-500/20">
          <Wallet className="text-purple-400" size={30} />
        </div>

        {/* Heading */}
        <h2 className="text-center text-2xl font-bold text-white">
          Unlock Wallet
        </h2>

        <p className="mt-2 text-center text-sm text-zinc-400">
          Enter your 6-digit security passcode
        </p>

        {/* Passcode Inputs */}
        <div className="mt-8 flex items-center justify-center gap-3">
          {passcode.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="h-14 w-12 rounded-xl border border-white/10 bg-zinc-900 text-center text-xl font-semibold text-white outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
            />
          ))}
        </div>

        {/* Security Note */}
        <div className="mt-7 flex items-center justify-center gap-2 text-xs text-zinc-500">
          <ShieldCheck size={14} />
          Your passcode is encrypted locally
        </div>
      </div>
    </div>
  );
};

export default UserPassModel;