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
          "3XsyYv8aF6uzX71AaaGdznSdLR679cv7mXzLCVAcxs1r",
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
    const sol = parseInt(data.result.value.lamports) / 1000000000;
    console.log("this is the sol", sol);
    return sol;
  } catch (err) {
    console.error("Error fetching wallet info:", err);
    throw new Error("Failed to fetch wallet info");
  }
}
