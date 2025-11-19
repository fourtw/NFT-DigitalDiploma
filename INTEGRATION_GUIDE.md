# Project Vault - Integration Guide

## 🔗 Menghubungkan Frontend dengan Smart Contract

Setelah deploy smart contract, ikuti langkah ini untuk menghubungkannya dengan frontend.

### 1. Deploy Smart Contract

Ikuti instruksi di `HARDHAT_README.md` untuk deploy contract ke Polygon Mumbai.

Setelah deploy, **simpan contract address** yang muncul.

### 2. Setup Environment Variables

Buat file `.env` di root project (sama level dengan `package.json`):

```env
# Contract address dari deployment
VITE_CONTRACT_ADDRESS=0xYourContractAddressHere

# WalletConnect Project ID (optional, untuk production)
VITE_WALLETCONNECT_ID=your_walletconnect_project_id
```

### 3. Restart Dev Server

Setelah update `.env`, restart dev server:

```bash
# Stop server (Ctrl+C)
npm run dev
```

### 4. Test Integration

#### Test Minting (Upload Page)

1. Buka `http://localhost:5173/upload`
2. Connect wallet (harus owner contract atau akan error)
3. Upload file diploma → hash akan muncul
4. Isi form (Name, Student ID, Program, Year)
5. Klik "Issue Diploma"
6. Approve transaction di wallet
7. Tunggu konfirmasi → NFT akan di-mint!

#### Test Verification (Verify Page)

1. Buka `http://localhost:5173/verify`
2. Paste SHA-256 hash dari file yang sudah di-mint
3. Klik "Verify"
4. Hasil akan muncul: Token ID, Owner, Metadata URI

### 5. Troubleshooting

#### Error: "Contract address not configured"

- Pastikan `.env` file ada di root project
- Pastikan variable name: `VITE_CONTRACT_ADDRESS` (harus pakai prefix `VITE_`)
- Restart dev server setelah update `.env`

#### Error: "User rejected the request"

- User cancel transaction di wallet
- Coba lagi dan approve transaction

#### Error: "Hash already exists"

- Hash file sudah pernah di-mint
- Setiap hash hanya bisa di-mint sekali (unik)

#### Error: "Only owner can mint"

- Wallet yang connect bukan owner contract
- Deploy contract dengan wallet yang akan digunakan untuk minting
- Atau transfer ownership ke wallet lain

### 6. Production Checklist

Sebelum deploy ke production:

- [ ] Deploy contract ke Polygon Mainnet (bukan Mumbai)
- [ ] Update `VITE_CONTRACT_ADDRESS` dengan mainnet address
- [ ] Setup real IPFS service (Pinata/NFT.Storage)
- [ ] Update `src/utils/ipfs.js` dengan real IPFS API
- [ ] Test semua fitur di mainnet
- [ ] Setup monitoring untuk contract events

### 7. Real IPFS Integration

Saat ini IPFS masih mock. Untuk production, ganti `src/utils/ipfs.js` dengan service real:

#### Option A: Pinata (Recommended)

```bash
npm install pinata-sdk
```

Update `uploadJSONToIPFS`:

```js
import pinataSDK from '@pinata/sdk'

const pinata = pinataSDK(process.env.VITE_PINATA_API_KEY, process.env.VITE_PINATA_SECRET_KEY)

export const uploadJSONToIPFS = async (payload) => {
  const metadata = formatMetadata(payload)
  const options = {
    pinataMetadata: { name: `diploma-${payload.hash.slice(0, 8)}` },
    pinataOptions: { cidVersion: 1 },
  }
  
  const result = await pinata.pinJSONToIPFS(metadata, options)
  return {
    cid: `ipfs://${result.IpfsHash}`,
    gatewayUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
    payload: metadata,
    rawPayload: payload,
    timestamp: new Date().toISOString(),
  }
}
```

#### Option B: NFT.Storage

```bash
npm install nft.storage
```

Update dengan NFT.Storage API.

### 8. Contract Events

Frontend bisa listen ke event `ProofMinted` untuk real-time updates:

```js
import { useWatchContractEvent } from 'wagmi'
import { useContract } from './hooks/useContract.js'

const { contractConfig } = useContract()

useWatchContractEvent({
  ...contractConfig,
  eventName: 'ProofMinted',
  onLogs(logs) {
    console.log('New diploma minted!', logs)
    // Update UI, show notification, etc.
  },
})
```

## ✅ Status Integration

Setelah setup ini, semua fitur sudah terhubung:

- ✅ **Minting**: Upload → IPFS → Mint NFT ke contract
- ✅ **Verification**: Query contract untuk verify hash
- ✅ **Wallet**: Auto switch ke Polygon Mumbai
- ✅ **Transaction**: Real on-chain transactions

Website sekarang **fully functional** dengan blockchain! 🚀

