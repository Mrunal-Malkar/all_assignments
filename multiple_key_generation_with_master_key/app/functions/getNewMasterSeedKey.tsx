import bip39 from "bip39";
import React from "react";

const GetNewMasterSeedKey = () => {
  const mnemonics = bip39.generateMnemonic();
  const masterSeedKey = bip39.mnemonicToSeedSync(mnemonics).toString("hex");
  console.log("the mawsterr keky",masterSeedKey);
  return masterSeedKey;
};

export default GetNewMasterSeedKey;
