require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox");

console.log("INFURA_API_KEY:", process.env.INFURA_API_KEY ? "✓ Loaded" : "✗ Missing");
console.log("PRIVATE_KEY:", process.env.PRIVATE_KEY ? "✓ Loaded" : "✗ Missing");
console.log("ETHERSCAN_API_KEY:", process.env.ETHERSCAN_API_KEY ? "✓ Loaded" : "✗ Missing");

const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

module.exports = {
    paths: {
        sources: "./auto-rickshaw-contracts/contracts",
        artifacts: "./auto-rickshaw-contracts/artifacts",
        cache: "./auto-rickshaw-contracts/cache",
    },
    solidity: {
        compilers: [
            { version: "0.8.19" },
            { version: "0.8.28" }
        ],
    },
    networks: {
        sepolia: {
            url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
            accounts: PRIVATE_KEY ? [PRIVATE_KEY] : []
        }
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY
    }
};