#!/bin/bash
# Setup script untuk Hardhat dependencies

echo "🔧 Setting up Hardhat dependencies..."

# Uninstall conflicting packages
npm uninstall ethers

# Reinstall with correct versions
npm install -D hardhat@^3.0.0 @nomicfoundation/hardhat-toolbox @openzeppelin/contracts@^5.0.0 dotenv --legacy-peer-deps

echo "✅ Setup complete! Try: npx hardhat compile"

