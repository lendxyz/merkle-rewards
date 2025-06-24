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

export type RewardsData = {
  opId: number;
  epoch: number;
  rewardsAmount: string;
};

export type Epoch = {
  epoch: number;
  rewardsAmount: string;
};
