import { ethers } from "ethers";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import path from "path";
import * as fs from "fs/promises";

type TokenConfig = {
  chainId: number;
  name: string;
  rpcUrl: string;
  tokenAddresses: {
    address: string;
    name: string;
    startBlock: number;
  }[];
};

const config: TokenConfig[] = [
  {
    chainId: 11155111,
    name: "Ethereum Sepolia",
    rpcUrl: "https://ethereum-sepolia-rpc.publicnode.com",
    tokenAddresses: [
      {
        address: "0x6F60861d855966b1BCC68Ab56B187Ab98271D409",
        name: "opLend-1",
        startBlock: 8518597,
      },
      {
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
        address: "0x3eC9eAE6c5965c814f47B562Ac10b64cf428d71A",
        name: "opLend-2",
        startBlock: 26855667,
      },
    ],
  },
];

const abi = [
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "function decimals() view returns (uint8)",
];

async function processToken(
  provider: ethers.providers.JsonRpcProvider,
  chainId: number,
  tokenMeta: {
    address: string;
    name: string;
    startBlock: number;
  },
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
      const iface = new ethers.utils.Interface(abi);
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

  console.log(
    `✅ [${tokenMeta.name}] Found ${nonZero.length} non-zero holders`,
  );

  const leaves = nonZero.map(([address, amount]) =>
    keccak256(
      ethers.utils.solidityPack(
        ["address", "uint256"],
        [address, amount.toString()],
      ),
    ),
  );

  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  const merkleRoot = tree.getHexRoot();

  const claims: Record<string, any> = {};
  nonZero.forEach(([address, amount], index) => {
    const leaf = keccak256(
      ethers.utils.solidityPack(
        ["address", "uint256"],
        [address, amount.toString()],
      ),
    );
    claims[address] = {
      index,
      amount: amount.toString(),
      proof: tree.getHexProof(leaf),
    };
  });

  const output = {
    chainId,
    token: tokenMeta.address,
    name: tokenMeta.name,
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

async function main() {
  for (const chain of config) {
    const provider = new ethers.providers.JsonRpcProvider(chain.rpcUrl);

    for (const tokenMeta of chain.tokenAddresses) {
      try {
        await processToken(provider, chain.chainId, tokenMeta);
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
