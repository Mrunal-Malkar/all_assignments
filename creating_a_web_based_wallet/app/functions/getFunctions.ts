import bip39 from "bip39";
import React from "react";

export const GetNewMnemonics = () => {
  const rawMnemonics = bip39.generateMnemonic(256);
  const mnemonics = rawMnemonics.split(" ");
  const masterSeedKey = bip39.mnemonicToSeedSync(rawMnemonics).toString("hex");
  console.log("the mawsterr keky",masterSeedKey);
  return mnemonics;
};