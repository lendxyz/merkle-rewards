export type TokenConfig = {
  chainId: number;
  name: string;
  rpcUrl: string;
  tokenAddresses: {
    opId: number;
    address: string;
    name: string;
    startBlock: number;
  }[];
};
