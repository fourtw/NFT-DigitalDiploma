# Project Vault - Smart Contract & Hardhat Setup

## Overview

Smart contract ERC721 untuk NFT Diploma dengan verifikasi hash SHA-256. Deploy ke Polygon Mumbai (nanti bisa migrasi ke Amoy/Mainnet).

## Contract Features

- **Standard**: ERC721URIStorage (OpenZeppelin 5.x)
- **Name**: "Project Vault Proof"
- **Symbol**: "PVPROOF"
- **Storage**: `mapping(bytes32 => uint256) hashToTokenId` untuk verifikasi unik
- **Functions**:
  - `mintProof(address to, bytes32 fileHash, string metadataURI)` - Mint diploma NFT
  - `verifyHash(bytes32 fileHash)` - Verify hash & return token data
- **Events**: `ProofMinted` dengan indexed fields

## Setup

### 1. Fix Dependency Issues (IMPORTANT!)

Karena project ini menggunakan `"type": "module"` untuk Vite, ada konflik dengan Hardhat. Lakukan salah satu:

**Opsi A: Install dengan --legacy-peer-deps (Recommended)**

```bash
npm install -D hardhat@^3.0.0 @nomicfoundation/hardhat-toolbox @openzeppelin/contracts@^5.0.0 dotenv --legacy-peer-deps
npm install -D @nomicfoundation/hardhat-ethers@^3.1.0 --legacy-peer-deps
```

**Opsi B: Buat Hardhat Project Terpisah (Jika masih error)**

Jika masih ada masalah, buat folder terpisah untuk Hardhat:

```bash
mkdir hardhat-project
cd hardhat-project
npm init -y
npm install -D hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts@^5.0.0 dotenv
# Copy contracts/, scripts/, dan hardhat.config.ts ke sini
```

### 2. Install Dependencies (Jika belum)

```bash
npm install
```

### 3. Setup Environment Variables

Buat file `.env` di root project dengan isi:

```env
# Private key of the deployer account (WITHOUT 0x prefix)
PRIVATE_KEY=your_private_key_here

# Polygon Mumbai RPC endpoint
POLYGON_MUMBAI_RPC=https://rpc.ankr.com/polygon_mumbai

# Polygon Amoy RPC endpoint (optional)
POLYGON_AMOY_RPC=https://rpc.ankr.com/polygon_amoy

# Polygon Mainnet RPC endpoint (optional)
POLYGON_MAINNET_RPC=https://polygon-rpc.com

# Polygonscan API key for contract verification
# Get one at: https://polygonscan.com/apis
POLYGONSCAN_API_KEY=your_polygonscan_api_key_here

# Contract address (set after deployment)
CONTRACT_ADDRESS=

# Network name for verification
NETWORK=mumbai
```

### 4. Compile Contract

```bash
npx hardhat compile
```

## 📤 Deploy Contract

### Deploy ke Polygon Mumbai

```bash
npx hardhat run scripts/deploy.ts --network mumbai
```

Setelah deploy, **simpan contract address** yang muncul di output.

### Deploy ke Polygon Amoy (future)

```bash
npx hardhat run scripts/deploy.ts --network amoy
```

### Deploy ke Polygon Mainnet (production)

```bash
npx hardhat run scripts/deploy.ts --network polygon
```

## ✅ Verify Contract

### Cara 1: Menggunakan verify script

1. Update `.env` dengan `CONTRACT_ADDRESS` yang sudah di-deploy
2. Jalankan:

```bash
npx hardhat run scripts/verify.ts
```

### Cara 2: Manual verify

```bash
npx hardhat verify --network mumbai <CONTRACT_ADDRESS>
```

## 🔗 Update Frontend

Setelah deploy, update file `.env` di folder frontend:

```env
VITE_CONTRACT_ADDRESS=0x...your_contract_address...
```

## 📝 Contract Functions

### mintProof (Owner Only)

```solidity
function mintProof(
    address to,
    bytes32 fileHash,
    string memory metadataURI
) public onlyOwner returns (uint256)
```

**Parameters:**
- `to`: Address penerima NFT
- `fileHash`: SHA-256 hash dari file diploma (harus unik)
- `metadataURI`: IPFS/Arweave URI untuk metadata

**Returns:** Token ID yang baru di-mint

### verifyHash (Public)

```solidity
function verifyHash(bytes32 fileHash)
    public view
    returns (
        bool exists,
        uint256 tokenId,
        address owner,
        string memory metadataURI
    )
```

**Parameters:**
- `fileHash`: SHA-256 hash yang ingin di-verify

**Returns:**
- `exists`: Apakah hash ada di contract
- `tokenId`: Token ID terkait (0 jika tidak ada)
- `owner`: Owner token saat ini
- `metadataURI`: URI metadata token

## 🧪 Testing

```bash
npx hardhat test
```

## 📚 Network Configuration

### Polygon Mumbai
- **Chain ID**: 80001
- **RPC**: https://rpc.ankr.com/polygon_mumbai
- **Explorer**: https://mumbai.polygonscan.com
- **Faucet**: https://faucet.polygon.technology/

### Polygon Amoy (New Testnet)
- **Chain ID**: 80002
- **RPC**: https://rpc.ankr.com/polygon_amoy
- **Explorer**: https://amoy.polygonscan.com

### Polygon Mainnet
- **Chain ID**: 137
- **RPC**: https://polygon-rpc.com
- **Explorer**: https://polygonscan.com

## 🔒 Security Notes

1. **JANGAN commit file `.env`** ke Git
2. **JANGAN share private key** ke siapa pun
3. Gunakan **hardware wallet** untuk production deployment
4. **Test thoroughly** di testnet sebelum mainnet

## 📞 Support

Jika ada masalah:
1. Check balance deployer account (perlu MATIC untuk gas)
2. Verify RPC endpoint masih aktif
3. Check Polygonscan API key valid
4. Pastikan contract sudah compile tanpa error

