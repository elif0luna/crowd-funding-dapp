import * as dotenv from "dotenv";
import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { defineConfig } from "hardhat/config";

dotenv.config();

function getSepoliaAccounts() {
  const privateKey = (process.env.SEPOLIA_PRIVATE_KEY ?? process.env.PRIVATE_KEY ?? "")
    .trim()
    .replace(/^0x/i, "");

  if (!privateKey) {
    return [];
  }

  if (!/^[0-9a-fA-F]+$/.test(privateKey)) {
    throw new Error("SEPOLIA_PRIVATE_KEY or PRIVATE_KEY must be a valid hex string.");
  }

  if (privateKey.length !== 64) {
    throw new Error("SEPOLIA_PRIVATE_KEY or PRIVATE_KEY must be 64 hex characters.");
  }

  return [`0x${privateKey}`];
}

export default defineConfig({
  plugins: [hardhatToolboxMochaEthersPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: 'https://eth-sepolia.g.alchemy.com/v2/-s1EQGuYS0Q2jkvMx64Dc',
      accounts: getSepoliaAccounts(),
    },
  },
});
