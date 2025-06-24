import { ethers } from "ethers";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import path from "path";
import * as fs from "fs/promises";
import { TOKEN_EVENT_ABI } from "./constants";

export async function processToken(
  provider: ethers.providers.JsonRpcProvider,
  chainId: number,
  tokenMeta: {
    address: string;
    name: string;
    startBlock: number;
    opId: number;
  },
  rewardMap: Record<string, string>,
) {
  const balances = new Map<string, bigint>();
  const blockStep = 5000;
  const endBlockNumber = await provider.getBlockNumber();

  let fromBlock = tokenMeta.startBlock;
  while (fromBlock <= endBlockNumber) {
    const toBlock = Math.min(fromBlock + blockStep, endBlockNumber);
    console.log(
      `🔍 [${tokenMeta.name}] Scanning blocks ${fromBlock}–${toBlock}...`,
    );

    const logs = await provider.getLogs({
      address: tokenMeta.address,
      fromBlock,
      toBlock,
      topics: [ethers.utils.id("Transfer(address,address,uint256)")],
    });

    logs.forEach((log) => {
      const iface = new ethers.utils.Interface(TOKEN_EVENT_ABI);
      const { args } = iface.parseLog(log);
      const from = args.from.toLowerCase();
      const to = args.to.toLowerCase();
      const value = args.value.toBigInt();

      if (from !== ethers.constants.AddressZero) {
        balances.set(from, (balances.get(from) || 0n) - value);
      }
      if (to !== ethers.constants.AddressZero) {
        balances.set(to, (balances.get(to) || 0n) + value);
      }
    });

    fromBlock = toBlock + 1;
  }

  const nonZero = [...balances.entries()].filter(([_, v]) => v > 0n);
  const totalSupply = nonZero.reduce((acc, [_, v]) => acc + v, 0n);

  const rewardKey = `${chainId}-${tokenMeta.address.toLowerCase()}`;
  const totalRewards = BigInt(rewardMap[rewardKey]);

  if (!totalRewards) {
    throw new Error(`❌ No rewards found for key ${rewardKey}`);
  }

  console.log(`✅ [${tokenMeta.name}] Total holders: ${nonZero.length}`);
  console.log(`🧮 [${tokenMeta.name}] Total token supply: ${totalSupply}`);
  console.log(`🎁 Total rewards to distribute: ${totalRewards}`);

  const claims: Record<string, any> = {};
  const leaves: Buffer[] = [];

  let index = 0;
  for (const [address, balance] of nonZero) {
    const rewardAmount = (balance * totalRewards) / totalSupply;

    const leaf = keccak256(
      ethers.utils.solidityPack(
        ["uint256", "address", "uint256"],
        [index, address, rewardAmount.toString()],
      ),
    );
    leaves.push(leaf);

    claims[address] = {
      index,
      amount: rewardAmount.toString(),
      proof: [],
    };
    index++;
  }

  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  const merkleRoot = tree.getHexRoot();

  Object.entries(claims).forEach(([address, claim]) => {
    const leaf = keccak256(
      ethers.utils.solidityPack(
        ["uint256", "address", "uint256"],
        [claim.index, address, claim.amount],
      ),
    );
    claim.proof = tree.getHexProof(leaf);
  });

  const output = {
    opId: tokenMeta.opId,
    chainId,
    token: tokenMeta.address,
    name: tokenMeta.name,
    totalRewards: totalRewards.toString(),
    blockHeight: endBlockNumber,
    merkleRoot,
    claims,
  };

  const safeName = `${tokenMeta.name}-${chainId}`.replace(/[^a-z0-9]/gi, "-");
  const filename = `claims-${safeName}-${endBlockNumber}.json`;
  await fs.writeFile(
    path.join("proofs", filename),
    JSON.stringify(output, null, 2),
  );
  console.log(`📁 [${tokenMeta.name}] Output written to ${filename}`);
}
