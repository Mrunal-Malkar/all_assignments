import bip39 from "bip39";

export const GetNewMnemonics = () => {
  const rawMnemonics = bip39.generateMnemonic(256);
  const mnemonics = rawMnemonics.split(" ");
  const masterSeedKey = bip39.mnemonicToSeedSync(rawMnemonics).toString("hex");
  console.log("the mawsterr keky",masterSeedKey);
  return mnemonics;
};

export const getEncryptedMasterSeedKey=async (UserPass:string,Mnemonics:string[])=>{
  const masterSeedKey = bip39.mnemonicToSeedSync(Mnemonics.join(" ")).toString("hex");
  return masterSeedKey;
};