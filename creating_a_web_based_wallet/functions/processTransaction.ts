import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import bs58 from "bs58";
import nacl from "tweetnacl";

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
    
    console.log("the private key",privateKey);

    const decodedPrivateKey = bs58.decode(privateKey);
    console.log("this is the decoded private key in uint8array format", decodedPrivateKey,"its length",decodedPrivateKey.length);
    console.log("till here")
    // const decodedPublicKey= bs58.decode(fromPublicKey);
    // console.log("this is the decoded private key in uint8array format", decodedPrivateKey);
    // console.log("this is the decoded public key in uint8array format", decodedPublicKey);
    // const secretKey=new Uint8Array([...decodedPrivateKey, ...decodedPublicKey]);
    // console.log("this is the length of secret key in uint8array format", secretKey.length);

const SecretKey= nacl.sign.keyPair.fromSeed(decodedPrivateKey).secretKey // returns 64 bytes
const keypair = Keypair.fromSecretKey(SecretKey);
    console.log("this is the keypair object from the input private key", keypair);

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
      keypair
    ]);

    console.log("the signature of the transaction is", signature);

    return signature;
  } catch (error) {
    console.log("the error occured while processing the transaction",error);
    throw new Error(`An error occurred while processing the transaction ${error instanceof Error ?error.message: ""}`);
  }
}
