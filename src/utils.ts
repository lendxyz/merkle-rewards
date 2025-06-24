import { CHAINS_CONFIG, rewardsPerOpId } from "./constants";
import { Epoch } from "./types";

export function buildRewardMap() {
  const tokensByOpId: Record<
    number,
    {
      token: {
        opId: number;
        address: string;
        name: string;
        startBlock: number;
      };
      chain: {
        chainId: number;
        name: string;
        rpcUrl: string;
      };
    }[]
  > = {};

  for (const chain of CHAINS_CONFIG) {
    for (const token of chain.tokenAddresses) {
      if (!tokensByOpId[token.opId]) tokensByOpId[token.opId] = [];
      tokensByOpId[token.opId].push({
        token,
        chain: {
          chainId: chain.chainId,
          name: chain.name,
          rpcUrl: chain.rpcUrl,
        },
      });
    }
  }

  const rewardMap: Record<string, Epoch> = {};

  for (const { opId, epoch, rewardsAmount } of rewardsPerOpId) {
    const tokens = tokensByOpId[opId];
    if (!tokens || tokens.length === 0) continue;

    const total = BigInt(rewardsAmount);
    const share = total / BigInt(tokens.length);

    for (const { chain, token } of tokens) {
      const key = `${chain.chainId}-${token.address.toLowerCase()}`;
      rewardMap[key] = { epoch, rewardsAmount: share.toString() };
    }
  }

  return rewardMap;
}
