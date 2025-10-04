import hre from "hardhat"; // ESM import

async function main() {
  // Use the correct contract name: "AutoRideFare"
  const AutoRideFare = await hre.ethers.getContractFactory("AutoRideFare");
  
  // Update the deployment variable name to match the factory variable for consistency
  const autoFare = await AutoRideFare.deploy(); 
  await autoFare.waitForDeployment();
  
  const address = await autoFare.getAddress();
  console.log("AutoRideFare deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});