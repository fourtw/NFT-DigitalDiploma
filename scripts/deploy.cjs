const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🚀 Deploying ProjectVault contract...\n");

  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  const balance = await ethers.provider.getBalance(deployerAddress);

  console.log("📋 Deployment Details:");
  console.log("  Network:", (await ethers.provider.getNetwork()).name);
  console.log("  Deployer:", deployerAddress);
  console.log("  Balance:", ethers.formatEther(balance), "MATIC\n");

  if (balance === 0n) {
    throw new Error("❌ Deployer has no balance. Please fund your account.");
  }

  // Deploy contract
  console.log("📦 Deploying ProjectVault...");
  const ProjectVault = await ethers.getContractFactory("ProjectVault");
  const projectVault = await ProjectVault.deploy();

  await projectVault.waitForDeployment();
  const contractAddress = await projectVault.getAddress();

  console.log("\n✅ Deployment successful!");
  console.log("  Contract Address:", contractAddress);
  console.log("  Transaction Hash:", projectVault.deploymentTransaction()?.hash);
  console.log("\n📝 Next steps:");
  console.log("  1. Save the contract address above");
  console.log("  2. Verify the contract:");
  console.log(`     npx hardhat verify --network mumbai ${contractAddress}`);
  console.log("\n💡 Update your frontend .env with:");
  console.log(`   VITE_CONTRACT_ADDRESS=${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });

