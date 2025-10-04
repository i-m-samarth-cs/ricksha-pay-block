import "dotenv/config"; // Standard way to load .env variables in ESM projects
import "@nomicfoundation/hardhat-toolbox"; 

// Access environment variables using process.env
const INFURA_API_KEY = process.env.INFURA_API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

// The Hardhat config object must be exported as the default export
const config = {
    // Paths are relative to the 'ricksha-pay-block' root directory
    paths: {
        // Correctly points to the contracts folder in the sibling directory
        sources: "./auto-rickshaw-contracts/contracts", 
        // Correctly points the artifacts folder to the sibling directory
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
            // This is the line failing because PRIVATE_KEY is undefined
            url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
            accounts: [PRIVATE_KEY] 
        }
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY
    }
};

export default config;