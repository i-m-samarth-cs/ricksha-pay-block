import AutoRideFareArtifact from '../contracts/AutoRideFare.json';

export const CONTRACT_ADDRESS = "0x0CB2585fb28a5729801F37CF20D11a88C48da07F";

export const CONTRACT_ABI = AutoRideFareArtifact.abi;

export const NETWORK_CONFIG = {
  chainId: 11155111,
  chainName: "Sepolia Testnet",
  rpcUrls: ["https://sepolia.infura.io/v3/5577fee8b8dd4ea4b501fd581abf9266"],
  blockExplorerUrls: ["https://sepolia.etherscan.io"]
};

export const ETHERSCAN_URL = `https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`;
