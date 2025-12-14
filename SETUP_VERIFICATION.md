# Setup Verification - Project Vault

Panduan lengkap untuk setup halaman Verification agar bisa melakukan verifikasi on-chain.

## 📋 Prerequisites

1. **Smart Contract sudah di-deploy** (ke localhost atau Polygon Amoy)
2. **File `.env` sudah dibuat** dengan contract address

## 🚀 Langkah-langkah Setup

### Opsi 1: Deploy ke Local Network (Recommended untuk Testing)

#### Step 1: Start Hardhat Local Network

Buka terminal baru dan jalankan:

```bash
cd D:\Warzone\prototype
npx hardhat node
```

Biarkan terminal ini tetap berjalan. Anda akan melihat daftar akun test dengan private key.

#### Step 2: Deploy Contract ke Localhost

Buka terminal **baru** (jangan tutup terminal Hardhat Network) dan jalankan:

```bash
cd D:\Warzone\prototype
npx hardhat run scripts/deploy.ts --network localhost
```

Output akan menampilkan:
```
Deploying ProjectVault...
ProjectVault deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

**Catat alamat kontrak ini!** (contoh: `0x5FbDB2315678afecb367f032d93F642f64180aa3`)

#### Step 3: Setup Environment Variables

1. Di root folder project, buat file `.env` (jika belum ada)
2. Copy isi dari `.env.example` ke `.env`
3. Edit file `.env` dan isi:

```env
VITE_WALLETCONNECT_ID=your_walletconnect_id_here
VITE_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
VITE_USE_LOCALHOST=true
```

**Ganti `0x5FbDB2315678afecb367f032d93F642f64180aa3` dengan alamat kontrak yang Anda dapatkan dari Step 2.**

#### Step 4: Restart Dev Server

1. Di terminal yang menjalankan `npm run dev`, tekan `Ctrl + C` untuk stop
2. Jalankan lagi:

```bash
npm run dev
```

#### Step 5: Connect Wallet ke Local Network

1. Buka website di browser (`http://localhost:5173` atau `5174`)
2. Klik "Connect Wallet"
3. **Penting**: Pastikan wallet Anda terhubung ke **Localhost 8545** (Hardhat Network)
   - Di MetaMask, tambahkan network:
     - Network Name: `Hardhat Local`
     - RPC URL: `http://127.0.0.1:8545`
     - Chain ID: `1337`
     - Currency Symbol: `ETH`
4. Import salah satu private key dari output `npx hardhat node` ke MetaMask untuk testing

#### Step 6: Test Verification

1. Navigasi ke halaman `/verify`
2. Warning "Contract address not configured" seharusnya sudah hilang
3. Untuk test, Anda perlu:
   - **Mint diploma dulu** di halaman `/upload` (dengan wallet yang sudah connect)
   - **Copy SHA-256 hash** dari file yang di-upload
   - **Paste hash** di halaman `/verify` dan klik "Verify"

---

### Opsi 2: Deploy ke Polygon Amoy (Testnet)

#### Step 1: Siapkan Environment Variables untuk Hardhat

Buat atau edit file `.env` di root folder (sama dengan `.env` untuk frontend, tapi tambahkan):

```env
# Hardhat Deployment
PRIVATE_KEY=your_private_key_here
POLYGON_AMOY_RPC=https://rpc.amoy.polygon.technology
POLYGONSCAN_API_KEY=your_polygonscan_api_key_here
```

**Cara mendapatkan:**
- **PRIVATE_KEY**: Private key dari wallet yang akan digunakan untuk deploy (dari MetaMask: Account Details > Export Private Key)
- **POLYGON_AMOY_RPC**: Bisa pakai `https://rpc.amoy.polygon.technology` (gratis) atau daftar di Alchemy/Infura
- **POLYGONSCAN_API_KEY**: Daftar di [Polygonscan](https://polygonscan.com/apis) untuk mendapatkan API key (gratis)

#### Step 2: Dapatkan Testnet MATIC

1. Buka [Polygon Faucet](https://faucet.polygon.technology/) untuk Amoy
2. Masukkan alamat wallet Anda
3. Request testnet MATIC (gratis)

#### Step 3: Deploy Contract ke Amoy

```bash
cd D:\Warzone\prototype
npx hardhat run scripts/deploy.ts --network amoy
```

Output:
```
Deploying ProjectVault...
ProjectVault deployed to: 0xYourContractAddressOnAmoy
```

**Catat alamat kontrak ini!**

#### Step 4: Verify Contract (Optional tapi Recommended)

```bash
npx hardhat run scripts/verify.ts --network amoy
```

#### Step 5: Update Frontend `.env`

Edit file `.env`:

```env
VITE_WALLETCONNECT_ID=your_walletconnect_id_here
VITE_CONTRACT_ADDRESS=0xYourContractAddressOnAmoy
VITE_USE_LOCALHOST=false
```

#### Step 6: Restart Dev Server

```bash
# Stop server (Ctrl + C)
npm run dev
```

#### Step 7: Connect Wallet ke Polygon Amoy

1. Buka website
2. Klik "Connect Wallet"
3. Pastikan wallet terhubung ke **Polygon Amoy** (chainId: 80002)
4. Jika belum, wallet akan otomatis prompt untuk switch network

#### Step 8: Test Verification

1. Mint diploma di `/upload`
2. Copy hash dan verify di `/verify`

---

## ✅ Checklist Setup

- [ ] Smart contract sudah di-deploy (localhost atau Amoy)
- [ ] File `.env` sudah dibuat dengan `VITE_CONTRACT_ADDRESS`
- [ ] Dev server sudah di-restart setelah update `.env`
- [ ] Wallet sudah connect ke network yang benar (localhost 1337 atau Amoy 80002)
- [ ] Warning "Contract address not configured" sudah hilang di halaman `/verify`

## 🔍 Troubleshooting

### Warning masih muncul setelah setup

1. **Pastikan file `.env` ada di root folder** (sama level dengan `package.json`)
2. **Restart dev server** setelah edit `.env`
3. **Cek format `.env`**: Tidak ada spasi sebelum/sesudah `=`
   ```env
   # ✅ Benar
   VITE_CONTRACT_ADDRESS=0x123...
   
   # ❌ Salah
   VITE_CONTRACT_ADDRESS = 0x123...
   ```

### Verification tidak bekerja

1. **Pastikan contract sudah di-deploy** dan address benar
2. **Pastikan wallet connect ke network yang sama** dengan deployment
3. **Pastikan hash yang di-verify sudah di-mint** (cek di `/upload` atau Polygonscan)

### Error "Contract address not configured"

- File `.env` tidak ditemukan atau variable `VITE_CONTRACT_ADDRESS` kosong
- Dev server belum di-restart setelah edit `.env`

## 📚 Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Polygon Faucet](https://faucet.polygon.technology/)
- [Polygonscan API](https://polygonscan.com/apis)
- [WalletConnect Cloud](https://cloud.walletconnect.com)

---

**Need help?** Cek `LOCAL_DEPLOY_GUIDE.md` untuk panduan deploy ke local network.

