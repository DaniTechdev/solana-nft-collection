import {
  createNft,
  fetchDigitalAsset,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";

import {
  airdropIfRequired,
  getExplorerLink,
  getKeypairFromFile,
} from "@solana-developers/helpers";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";

// import { web3JsRpc } from "@metaplex-foundation/umi-rpc-web3js";
import {
  generateSigner,
  keypairIdentity,
  percentAmount,
  publicKey,
} from "@metaplex-foundation/umi";

// const connection = new Connection(clusterApiUrl("devnet"));
const connection = new Connection("https://api.devnet.solana.com");

// console.log("connection", connection);

const user = await getKeypairFromFile();

// console.log("user", user.publicKey);

await airdropIfRequired(
  connection,
  user.publicKey,
  1 * LAMPORTS_PER_SOL,
  0.5 * LAMPORTS_PER_SOL
);

console.log("Loaded user", user.publicKey.toBase58());

//initialise umi packages designed by mpl company for easy nft

const rpcEndpoint = clusterApiUrl("devnet");
const umi = createUmi(connection.rpcEndpoint);

umi.use(mplTokenMetadata());

const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey);

umi.use(keypairIdentity(umiUser));

console.log("Set up Umi instance for user");

//get the nft address we want to verify if it belongs to a collection
const nftAddress = publicKey("2igcir2Hd5rLkcxHjaeYGbbHkQDXR4kn7xZK1UyksH88");

//verify

const transaction = await verif;
