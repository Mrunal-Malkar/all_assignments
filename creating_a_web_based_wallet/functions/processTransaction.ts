import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

export default async function processTransaction({
  fromPublicKey,
  toAddress,
  amount,
  privateKey
}: {
  fromPublicKey: string;
  toAddress: string;
  amount: number;
  privateKey: string;
}) {
  try {
    const connection = new Connection(
      "https://api.devnet.solana.com",
      "confirmed",
    );
    const fromPubKey = new PublicKey(fromPublicKey);
    console.log(
      "this is the publick key object from the input string(public key)",
      fromPubKey,
    );

    const toPubKey = new PublicKey(toAddress);
    const fromKeyPair = Keypair.fromSecretKey(
      Uint8Array.from(JSON.parse(privateKey)),
    );
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromPubKey,
        toPubkey: toPubKey,
        lamports: amount * 1e9, // Convert SOL to lamports
      }),
    );
    console.log("the transaction object is ", transaction);

    const latestBlockHash = await connection.getLatestBlockhash();
    console.log("this is the latest block hash", latestBlockHash);

    transaction.recentBlockhash = latestBlockHash.blockhash;

    const signature = await sendAndConfirmTransaction(connection, transaction, [
      fromKeyPair,
    ]);

    console.log("the signature of the transaction is", signature);

    return signature;
  } catch (error) {
    console.log("the error occured while processing the transaction",error);
    throw new Error(`An error occurred while processing the transaction ${error instanceof Error ?error.message: ""}`);
  }
}
