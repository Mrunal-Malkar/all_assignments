import * as sol from "@solana/web3.js";

const connection = new sol.Connection(sol.clusterApiUrl("devnet"), "confirmed");

const info=await connection.getAccountInfo("5MbLxXmH3MsQ5yh3iXdddxYNwXuPt97vYFotffzZ7DjF").then((val)=>{console.log("the value",val)}).catch((err)=>{console.log("the error",err)})

console.log("the  info is ",info);