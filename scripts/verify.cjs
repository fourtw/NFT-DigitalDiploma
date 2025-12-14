const { run } = require("hardhat");
require("dotenv").config();

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!contractAddress) {
    throw new Error("❌ CONTRACT_ADDRESS not set in .env file");
  }

  const network = process.env.NETWORK || "amoy";

  console.log(`🔍 Verifying contract on ${network}...`);
  console.log("  Contract Address:", contractAddress);
  console.log("  Network:", network, "\n");

  try {
    await run("verify:verify", {
      address: contractAddress,
      network,
      constructorArguments: [],
    });

    const explorer =
      network === "amoy"
        ? "amoy.polygonscan.com"
        : network === "amoy"
          ? "amoy.polygonscan.com"
          : "polygonscan.com";

    console.log("\n✅ Contract verified successfully!");
    console.log(`   View on explorer: https://${explorer}/address/${contractAddress}`);
  } catch (error) {
    if (error.message && error.message.includes("Already Verified")) {
      console.log("\n✅ Contract is already verified!");
    } else {
      console.error("\n❌ Verification failed:");
      console.error(error);
      process.exit(1);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

