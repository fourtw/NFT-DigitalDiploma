const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🚀 Deploying ProjectVault contract...\n");

  const network = await ethers.provider.getNetwork();
  let deployer;
  let deployerAddress;

  // ALWAYS use PRIVATE_KEY if available, regardless of network
  if (process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.trim() !== '') {
    console.log("📋 Using PRIVATE_KEY from .env for deployment");
    const privateKey = process.env.PRIVATE_KEY.trim();
    
    // Remove 0x prefix if present
    const cleanPrivateKey = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey;
    const wallet = new ethers.Wallet('0x' + cleanPrivateKey, ethers.provider);
    deployer = wallet;
    deployerAddress = await wallet.getAddress();
    console.log("  ✅ Wallet Address:", deployerAddress);
    console.log("  ✅ Using your wallet as contract owner");
  } else {
    console.log("⚠️  PRIVATE_KEY not found in .env, using default account #0");
    console.log("   Add PRIVATE_KEY to .env to use your wallet as owner");
    const signers = await ethers.getSigners();
    deployer = signers[0];
    deployerAddress = await deployer.getAddress();
    console.log("  Using account #0:", deployerAddress);
  }

  const balance = await ethers.provider.getBalance(deployerAddress);

  console.log("📋 Deployment Details:");
  console.log("  Network:", network.name, `(Chain ID: ${network.chainId})`);
  console.log("  Deployer:", deployerAddress);
  console.log("  Balance:", ethers.formatEther(balance), network.chainId === 1337n ? "ETH" : "MATIC");
  
  // Verify PRIVATE_KEY usage
  if (process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.trim() !== '') {
    try {
      const privateKey = process.env.PRIVATE_KEY.trim();
      const cleanPrivateKey = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey;
      const privateKeyAddress = new ethers.Wallet('0x' + cleanPrivateKey).address;
      if (deployerAddress.toLowerCase() === privateKeyAddress.toLowerCase()) {
        console.log("  ✅ Verified: Deployer matches PRIVATE_KEY wallet");
      } else {
        console.log("  ⚠️  WARNING: Deployer address doesn't match PRIVATE_KEY!");
        console.log("     Expected from PRIVATE_KEY:", privateKeyAddress);
        console.log("     Actual deployer:", deployerAddress);
        console.log("     This should not happen - check your PRIVATE_KEY in .env");
      }
    } catch (err) {
      console.log("  ⚠️  Could not verify PRIVATE_KEY:", err.message);
    }
  }
  console.log("");

  // For localhost, fund the account if balance is 0
  if (network.chainId === 1337n && balance === 0n) {
    console.log("⚠️  Account has no balance. Attempting to fund from Hardhat node...");
    try {
      const signers = await ethers.getSigners();
      if (signers.length > 0) {
        // Use account #0 from Hardhat node as funder
        const funder = signers[0];
        const funderAddress = await funder.getAddress();
        const funderBalance = await ethers.provider.getBalance(funderAddress);
        
        console.log(`  Funding from Hardhat account #0: ${funderAddress}`);
        console.log(`  Funder balance: ${ethers.formatEther(funderBalance)} ETH`);
        
        if (funderBalance > 0n) {
          const fundAmount = ethers.parseEther("100"); // Send 100 ETH
          console.log(`  Sending ${ethers.formatEther(fundAmount)} ETH to ${deployerAddress}...`);
          
          const tx = await funder.sendTransaction({
            to: deployerAddress,
            value: fundAmount,
          });
          await tx.wait();
          
          const newBalance = await ethers.provider.getBalance(deployerAddress);
          console.log(`  ✅ Account funded! New balance: ${ethers.formatEther(newBalance)} ETH`);
        } else {
          throw new Error("❌ Funder account also has no balance. Hardhat node may not be running properly.");
        }
      } else {
        throw new Error("❌ No signers available. Hardhat node may not be running.");
      }
    } catch (fundError) {
      console.error("  ❌ Failed to fund account:", fundError.message);
      throw new Error("❌ Deployer has no balance and could not be funded. Make sure Hardhat node is running.");
    }
  } else if (balance === 0n) {
    throw new Error("❌ Deployer has no balance. Please fund your account.");
  }

  // Deploy contract using the deployer wallet
  console.log("📦 Deploying ProjectVault...");
  const ProjectVault = await ethers.getContractFactory("ProjectVault", deployer);
  const projectVault = await ProjectVault.deploy();

  await projectVault.waitForDeployment();
  const contractAddress = await projectVault.getAddress();
  
  // Verify owner is correct
  const owner = await projectVault.owner();
  console.log("  Contract deployed by:", deployerAddress);
  console.log("  Contract owner:", owner);
  
  if (owner.toLowerCase() !== deployerAddress.toLowerCase()) {
    console.log("  ⚠️  WARNING: Owner mismatch!");
  } else {
    console.log("  ✅ Owner verified: matches deployer address");
  }

  console.log("\n✅ Deployment successful!");
  console.log("  Contract Address:", contractAddress);
  console.log("  Transaction Hash:", projectVault.deploymentTransaction()?.hash);
  console.log("\n🔑 IMPORTANT: Contract Owner");
  console.log("  Owner Address:", deployerAddress);
  console.log("  ⚠️  Only this address can mint NFTs!");
  console.log("  Make sure to connect this wallet in the frontend.");
  console.log("\n📝 Next steps:");
  console.log("  1. Save the contract address above");
  console.log("  2. Update your frontend .env with:");
  console.log(`     VITE_CONTRACT_ADDRESS=${contractAddress}`);
  console.log("  3. Connect wallet with owner address:", deployerAddress);
  console.log("  4. Verify the contract (optional):");
  console.log(`     npx hardhat verify --network mumbai ${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });

