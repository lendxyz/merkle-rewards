import { ethers } from "ethers";
import { CHAINS_CONFIG } from "./constants";
import { processToken } from "./lib";
import { buildRewardMap } from "./utils";

async function main() {
  const rewardMap = buildRewardMap();

  for (const chain of CHAINS_CONFIG) {
    const provider = new ethers.providers.JsonRpcProvider(chain.rpcUrl);

    for (const tokenMeta of chain.tokenAddresses) {
      try {
        await processToken(provider, chain.chainId, tokenMeta, rewardMap);
      } catch (err) {
        console.error(
          `❌ Error processing ${tokenMeta.name} on ${chain.name}:`,
          err,
        );
      }
    }
  }
}

main();
