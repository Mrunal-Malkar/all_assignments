"use client";
import React, { useEffect, useState } from "react";
import { GetNewMnemonics } from "../functions/getFunctions";
import { toast, ToastContainer } from "react-toastify";
import { get } from "http";

const GenerateModel = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [UserPass, setUserPass] = useState<string>();
  const [Mnemonics, setMnemonics] = useState<string[]>();
  const [ModelPage, setModelPage] = useState<number>(1);
  const [isAgreed, setIsAgreed] = useState(false);

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

  function handlePasswordSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();

    const inputField = document.getElementsByName(
      "userEnteredPass",
    )[0] as HTMLInputElement;

    const userEnteredPass = inputField.value;

    if (userEnteredPass.length !== 6) {
      toast.error("Password must be exactly 6 characters long"); // 2. Error Toast
      return;
    }

    setUserPass(userEnteredPass);
    const mnemonics = GetNewMnemonics();

    if (!mnemonics) {
      toast.error("Error generating master seed key. Please try again."); // 3. Error Toast
      return;
    }

    setMnemonics(mnemonics);
    setModelPage(2);
  }

  async function handleCopyToClipboard(
    e: React.MouseEvent<HTMLButtonElement>,
    mnemonics: string[],
  ) {
    e.preventDefault();
    try {
      const mnemonicString = mnemonics.join(" ");
      await navigator.clipboard.writeText(mnemonicString);
      toast.success("Mnemonics copied to clipboard!"); 
    } catch (err) {
      toast.error("Failed to copy. Please copy manually.");
    }
  }

  async function handleFinishSetup(){
    if(!UserPass || !Mnemonics) {
      return toast.error("Missing password or mnemonics. Please try again.");
  }
  const ecryptedMasterSeedKey=await getEncryptedMasterSeedKey(UserPass,Mnemonics);
  if(!ecryptedMasterSeedKey){
    return toast.error("Error encrypting master seed key. Please try again.");
  }
  return toast.success("Setup complete! You can now generate new Wallets.");
}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 w-screen">
      <ToastContainer />
      <div className="relative w-full bg-black border border-white/10 rounded-3xl p-8 shadow-2xl  md:max-w-[80dvh] max-w-full overflow-auto minimal-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
        >
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

        {/* page 1 of model */}
        {ModelPage === 1 && (
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold tracking-tight mb-2 text-white">
              Set a Password
            </h2>
            <p className="text-white/50 text-sm mb-8">
              This password will encrypt your keys locally.
            </p>

            <form onSubmit={handlePasswordSubmit} className="w-full space-y-6">
              <input
                type="password"
                placeholder="••••••"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 px-6 text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-white/10 text-white"
                minLength={6}
                maxLength={6}
                name="userEnteredPass"
                autoFocus
              />
              <button
                type="submit"
                className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all active:scale-95"
              >
                Continue
              </button>
              <p className="text-[10px] uppercase tracking-widest text-white/30">
                Enter 6 characters
              </p>
            </form>
          </div>
        )}

        {/* page 2 of model */}
        {ModelPage === 2 && Mnemonics && (
          <div className="flex flex-col items-center max-h-[80vh] w-fit">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
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
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold tracking-tight mb-2 text-white">
                Secret Recovery Phrase
              </h2>
              <p className="text-white/50 text-sm leading-relaxed max-w-[280px]">
                Save these words in a secure location. This is the{" "}
                <span className="text-white">only way</span> to recover your
                assets.
              </p>
            </div>

            <div className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-8">
              <div className="grid grid-cols-3 gap-3">
                {Mnemonics.map((word, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 bg-black/40 border border-white/5 p-2 rounded-lg"
                  >
                    <span className="text-[10px] text-white/20 font-mono w-4">
                      {index + 1}
                    </span>
                    <span className="text-sm font-mono text-blue-500/90">
                      {word}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={(e) => {
                  handleCopyToClipboard(e, Mnemonics);
                }}
                className="mt-4 w-full py-2 text-[10px] uppercase tracking-[0.2em] text-white/30 hover:text-blue-500 transition-colors font-bold"
              >
                Copy to clipboard
              </button>
            </div>

            <div className="w-full space-y-6">
              <label className="flex items-start space-x-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    onChange={(e) => setIsAgreed(e.target.checked)}
                    className="peer appearance-none w-5 h-5 border border-white/20 rounded bg-transparent checked:bg-blue-500 checked:border-blue-500 transition-all cursor-pointer"
                  />
                  <svg
                    className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none left-[3px]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span className="text-xs text-white/50 leading-tight group-hover:text-white/70 transition-colors">
                  I have written down my secret recovery phrase and stored it in
                  a safe place.
                </span>
              </label>

              <button
                disabled={!isAgreed}
                onClick={handleFinishSetup}
                className="w-full py-4 bg-white text-black disabled:bg-white/10 disabled:text-white/20 rounded-xl font-bold text-sm uppercase tracking-widest transition-all hover:bg-blue-500 hover:text-white active:scale-[0.98]"
              >
                Finish Setup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateModel;
