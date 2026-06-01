export default async function processAirdrop(targetPublicKey: string, amount: number) {
  if (amount > 5) {
    throw new Error("Airdrop amount exceeds the maximum limit of 5 SOL");
  }

  const response = await fetch(
    `https://solana-devnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`, // replace with real key
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "requestAirdrop",
        params: [
          targetPublicKey,
          amount * 1000000000,
          { commitment: "processed" },
        ],
      }),
    }
  );

  const data = await response.json();

  if (data.error) {
    throw new Error(`Airdrop failed: ${data.error.message}`);
  }

  console.log("Airdrop signature:", data.result);
  return true; // transaction signature
}