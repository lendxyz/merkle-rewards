import { RewardsData, TokenConfig } from "./types";

export const BLOCK_INTERVAL = 25000;

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
      {
        opId: 3,
        address: "0x308e9AC53886Da2D78D54C8E575a52573035E4A5",
        name: "opLend-3",
        startBlock: 8711264,
      },
      {
        opId: 4,
        address: "0x4BB650be88EF091BCE911a0415D272E67A339070",
        name: "opLend-4",
        startBlock: 8726538,
      },
      {
        opId: 5,
        address: "0xcd17781c958d01C2f17475011ffD49eC991d313b",
        name: "opLend-5",
        startBlock: 8736117,
      },
      {
        opId: 6,
        address: "0xF5E78BF1497F248832d2d6F1016749694d96F562",
        name: "opLend-6",
        startBlock: 8741292,
      },
      {
        opId: 8,
        address: "0x97DD31354fD6EC67549FE86c9D128198CE75a72d",
        name: "opLend-8",
        startBlock: 8748546,
      },
    ],
  },
  {
    chainId: 84532,
    name: "Base sepolia",
    rpcUrl: "https://base-sepolia-rpc.publicnode.com",
    tokenAddresses: [
      {
        opId: 1,
        address: "0x490a75f4758a7d93f66e46779733d9Ec6517a2E7",
        name: "opLend-1",
        startBlock: 28140640,
      },
      {
        opId: 2,
        address: "0x3eC9eAE6c5965c814f47B562Ac10b64cf428d71A",
        name: "opLend-2",
        startBlock: 26855667,
      },
      {
        opId: 3,
        address: "0xCB4aedE789D4D80D3b27DF0Fe1E40b14213bec21",
        name: "opLend-3",
        startBlock: 28059060,
      },
      {
        opId: 4,
        address: "0xEb7c6573084E9e4f0e0a1101a05014F631Ec0AC6",
        name: "opLend-4",
        startBlock: 28149073,
      },
      {
        opId: 6,
        address: "0xcA88B2473D96d743d8cfAE92140c8eC3242B1B3f",
        name: "opLend-6",
        startBlock: 28237595,
      },
    ],
  },
  {
    chainId: 421614,
    name: "Arbitrum sepolia",
    rpcUrl: "https://arbitrum-sepolia.gateway.tenderly.co",
    tokenAddresses: [
      {
        opId: 1,
        address: "0xE7493De4702499E4d38293Fe35FC9811fD6bcC39",
        name: "opLend-1",
        startBlock: 171779124,
      },
      {
        opId: 2,
        address: "0x08227874137d2A38F3c908C456C5b33e20fa2aBE",
        name: "opLend-2",
        startBlock: 171782449,
      },
      {
        opId: 4,
        address: "0x5aA12Eb0D864E089723681146c91D5F17ED6Fa21",
        name: "opLend-4",
        startBlock: 171845659,
      },
      {
        opId: 6,
        address: "0x7D8FC44B9D6562A5a1DBc76Bf693D0DF679028f6",
        name: "opLend-6",
        startBlock: 172502259,
      },
    ],
  },
  {
    chainId: 10143,
    name: "Monad Testnet",
    rpcUrl: "https://testnet-rpc.monad.xyz",
    tokenAddresses: [
      {
        opId: 2,
        address: "0x54585517BBA619F74107581D0aF828EA40C25A7F",
        name: "opLend-2",
        startBlock: 23267910,
      },
    ],
  },
];

// TODO: move this to a json data file
export const rewardsPerOpId: RewardsData[] = [
  { opId: 1, epoch: 1, rewardsAmount: "108232394698" },
  { opId: 2, epoch: 1, rewardsAmount: "8232394698" },
];
