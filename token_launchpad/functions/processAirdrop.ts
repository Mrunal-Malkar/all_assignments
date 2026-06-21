import { Connection, PublicKey } from "@solana/web3.js";

export default async function processAirdrop(
  targetPublicKey: string,
  amount: number,
) {
  try {
    if (amount > 5) {
      throw new Error("Airdrop amount exceeds the maximum limit of 5 SOL");
    }
    
    console.log(
      "processing airdrop, the alchemy api key is",
      process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,"the target public key is",targetPublicKey,"the amount is",amount
    );
    
    const targetedPublicKey = new PublicKey(targetPublicKey);
      const connection = new Connection("https://api.devnet.solana.com", "confirmed");

      const requestAirdrop=await connection.requestAirdrop(targetedPublicKey, amount * 1e9);
      console.log("requestAirdrop response",requestAirdrop);

      console.log("Waiting for airdrop confirmation..."); 
      const latestBlockHash = await connection.getLatestBlockhash();
        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature:requestAirdrop,
        });
        console.log("Airdrop confirmed!");
        
        return true;

  } catch (err) {
    throw new Error(
      `Airdrop failed: ${err instanceof Error ? err.message : err}`,
    );
  }
}
