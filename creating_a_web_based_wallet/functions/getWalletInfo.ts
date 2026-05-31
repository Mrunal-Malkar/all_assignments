export default async function getWalletBalance(publicKey: string) {
  try {
    const KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
    const req = await fetch(`https://solana-devnet.g.alchemy.com/v2/${KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getAccountInfo",
        params: [
          publicKey,
          {
            commitment: "processed",
            encoding: "base58",
            dataSlice: { length: 1, offset: 1 },
            minContextSlot: 1,
          },
        ],
      }),
    });
    const data = await req.json();
    console.log("this is the data",data);
    const sol =data.result.value!=null ? (parseInt(data.result.value.lamports) / 1000000000) : 0;
    console.log("this is the sol", sol);
    return sol;
  } catch (err) {
    console.error("Error fetching wallet info:", err);
    throw new Error("Failed to fetch wallet info");
  }
}
