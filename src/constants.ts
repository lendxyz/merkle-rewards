import { RewardsData, TokenConfig } from "./types";

export const BLOCK_INTERVAL = 25000;

export const TOKEN_EVENT_ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 value)",
];

export const CHAINS_CONFIG: TokenConfig[] = [];

// TODO: move this to a json data file
export const rewardsPerOpId: RewardsData[] = [];
