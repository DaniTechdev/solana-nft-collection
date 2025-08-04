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

// const collectionAddress = new PublicKey(
//   "GHP4ghPiXXn4wMHeyp72yRuA16QCFq8YdHvrgnQW9NzT"
// ); //using solana/web3.js which will require us converting it to umi public key function type later on. Better to use it directly as shown below

//or using the public key function from umi
const collectionAddress = publicKey(
  "GHP4ghPiXXn4wMHeyp72yRuA16QCFq8YdHvrgnQW9NzT"
);

console.log("Creating NFT...");

//this signer mint will unique.
const mint = generateSigner(umi);

const transaction = await createNft(umi, {
  mint,
  name: "My NFT",
  uri: "https://raw.githubusercontent.com/DaniTechDev/solana-nft2-metadata/main/nft2metadata.json",
  sellerFeeBasisPoints: percentAmount(0),
  collection: {
    key: collectionAddress,
    verified: false,
  },
});

await transaction.sendAndConfirm(umi);

const createdNFT = await fetchDigitalAsset(umi, mint.publicKey);

console.log(
  `# Created NFT: Address is ${getExplorerLink(
    "address",
    createdNFT.mint.publicKey,
    "devnet"
  )}`
);
