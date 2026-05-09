import { json } from "stream/consumers";

export type WalletType = {
  publicKey: string;
  privateKey: string;
  derivationPath: string;
};

export default function getWallets():WalletType[] {
  const wallets: WalletType[] = [];
  console.log("running the getWallets...")
  let emptySearches = 0;
  for (let i = 0; i < parseInt(localStorage.getItem("lastIndex") ?? "0"); i++) {
    console.log("running the forloop for ",i, "time");
    if (emptySearches > 20) break;
    const wallet: WalletType | null = JSON.parse(
      localStorage.getItem(`wallet-${i}`) ?? "",
    );
    if (!wallet) {
      emptySearches += 1;
      continue;
    }
    wallets.push(wallet);
  }
  console.log("this is the wallets",wallets);
  return wallets;
}
