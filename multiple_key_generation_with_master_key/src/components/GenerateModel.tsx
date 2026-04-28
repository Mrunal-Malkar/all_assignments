import React from 'react'
import { useState } from 'react';
import bip39 from "bip39";

const GenerateModel = () => {
    const [UserPass, setUserPass] = useState<string>();
    const [MasterSeedKey, seteMasterSeedKey] = useState<string>();
    cosnt [ModelPage, setModelPage] = useState<number>(1);

    if(localStorage.getItem("userPass") || localStorage.getItem("masterSeedKey")){
        return null;
    }

    function handlePasswordSubmit(){
        const inputField=document.getElementById("userEnteredPass") as HTMLInputElement;
        const userEnteredPass=inputField.value;
        if((userEnteredPass.length<6) || (userEnteredPass.length>6)){
            alert("Password must be 6 characters long");
            return;
        }
        setUserPass(userEnteredPass);
        const mnemonics=bip39.generateMnemonic();
        const masterSeedKey=bip39.mnemonicToSeedSync(mnemonics).toString("hex");
        setModelPage(2);
    }
    
  return (
    <div className='w-screen p-3 bg-transparent/80 text-white font-semibold flex justify-center items-center'>
        {ModelPage === 1 && (
            <div className='w-fit p-2 flex flex-col items-center justify-around'>
                <h2 className=''>Set a Password</h2>
                <form onSubmit={handlePasswordSubmit}>
                    <input type="text" placeholder="Enter your password" minLength={6} maxLength={6} name="userEnteredPass"/>
                </form>
            </div>
        )}
        {ModelPage === 2 && (
            <div className='w-fit p-2 flex flex-col items-center justify-around'>
                <h2 className=''>Store this Key Safely</h2>
                <p className='text-sm text-white/50'>This is your Master Seed Key. You can use this key to generate multiple wallets. Make sure to store it safely as it cannot be retrieved again.</p>
                <div className='flex justify-center items-center p-2'>
                    <input type="text" value={} />
                </div>
            </div>
        )}    </div>
  )
}

export default GenerateModel