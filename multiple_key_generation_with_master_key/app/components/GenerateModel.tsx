"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import bip39 from "bip39";
import GetNewMasterSeedKey from "../functions/getNewMasterSeedKey";

const GenerateModel = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [UserPass, setUserPass] = useState<string>();
  const [MasterSeedKey, seteMasterSeedKey] = useState<string>();
  const [ModelPage, setModelPage] = useState<number>(1);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  if (
    !isOpen ||
    localStorage.getItem("userPass") ||
    localStorage.getItem("masterSeedKey")
  ) {
    return null;
  }

  function handlePasswordSubmit() {
    const inputField = document.getElementById(
      "userEnteredPass",
    ) as HTMLInputElement;
    const userEnteredPass = inputField.value;
    if (userEnteredPass.length < 6 || userEnteredPass.length > 6) {
      alert("Password must be 6 characters long");
      return;
    }
    setUserPass(userEnteredPass);
    const masterSeedKey = GetNewMasterSeedKey();
    setModelPage(2);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-black border border-white/10 rounded-3xl p-8 shadow-2xl">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {ModelPage === 1 && (
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              Set a Password
            </h2>
            <p className="text-white/50 text-sm mb-8">
              This password will encrypt your keys locally.
            </p>

            <form onSubmit={handlePasswordSubmit} className="w-full">
              <input
                type="password"
                placeholder="••••••"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 px-6 text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-white/10"
                minLength={6}
                maxLength={6}
                name="userEnteredPass"
              />
              <p className="mt-4 text-[10px] uppercase tracking-widest text-white/30">
                Enter 6 characters
              </p>
            </form>
          </div>
        )}

        {ModelPage === 2 && (
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="text-blue-500"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>

            <h2 className="text-2xl font-bold tracking-tight mb-3">
              Store this Key Safely
            </h2>
            <p className="text-white/50 text-sm leading-relaxed mb-8">
              This is your <span className="text-white">Master Seed Key</span>.
              It provides access to all derived wallets. If lost, it cannot be
              recovered.
            </p>

            <div className="w-full">
              <div className="relative group">
                <input
                  type="text"
                  readOnly
                  value="abandon ability able about above absent absorb abstract absurd abuse"
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl p-5 font-mono text-sm text-blue-500/90 cursor-not-allowed text-center"
                />
                <div className="absolute inset-0 rounded-xl bg-transparent pointer-events-none border border-white/5 group-hover:border-blue-500/20 transition-colors"></div>
              </div>
              <button className="mt-6 w-full py-4 text-sm font-bold text-white/40 hover:text-white transition-all uppercase tracking-widest">
                Copy to Clipboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateModel;
