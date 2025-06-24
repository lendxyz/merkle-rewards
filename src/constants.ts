import { TokenConfig } from "./types";

export const TOKEN_EVENT_ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 value)",
];

export const CHAINS_CONFIG: TokenConfig[] = [
  {
    chainId: 11155111,
    name: "Ethereum Sepolia",
    rpcUrl: "https://ethereum-sepolia-rpc.publicnode.com",
    tokenAddresses: [
      {
        opId: 1,
        address: "0x6F60861d855966b1BCC68Ab56B187Ab98271D409",
        name: "opLend-1",
        startBlock: 8518597,
      },
      {
        opId: 2,
        address: "0x9C5dE8fAF936F0E1EfD72e25444FA1e07edF082e",
        name: "opLend-2",
        startBlock: 8518598,
      },
    ],
  },
  {
    chainId: 84532,
    name: "Base sepolia",
    rpcUrl: "https://base-sepolia-rpc.publicnode.com",
    tokenAddresses: [
      {
        opId: 2,
        address: "0x3eC9eAE6c5965c814f47B562Ac10b64cf428d71A",
        name: "opLend-2",
        startBlock: 26855667,
      },
    ],
  },
];

// TODO: move this to a json data file
export const rewardsPerOpId = [
  { opId: 1, rewardsAmount: "108232394698" },
  { opId: 2, rewardsAmount: "8232394698" },
];
