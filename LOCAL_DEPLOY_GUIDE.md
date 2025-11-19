# 🏠 Deploy ke Localhost - Step by Step

Guide lengkap untuk deploy contract ke Hardhat local network untuk testing.

## 📋 Prerequisites

- Node.js & npm sudah terinstall
- Hardhat dependencies sudah terinstall (`npm install`)

## 🚀 Step-by-Step

### Step 1: Start Local Hardhat Node

Buka **Terminal 1** dan jalankan:

```bash
npx hardhat node
```

Ini akan:
- Start local blockchain di `http://127.0.0.1:8545`
- Generate 20 test accounts dengan balance 10000 ETH
- Tampilkan private keys dan addresses

**JANGAN TUTUP TERMINAL INI** - biarkan running selama testing!

### Step 2: Deploy Contract ke Localhost

Buka **Terminal 2** (terminal baru) dan jalankan:

```bash
npx hardhat run scripts/deploy.ts --network localhost
```

Output akan menampilkan:
```
✅ Deployment successful!
  Contract Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
  Transaction Hash: 0x...
```

**SALIN CONTRACT ADDRESS** yang muncul!

### Step 3: Setup Frontend untuk Localhost

Buat/update file `.env` di root project:

```env
# Contract address dari deployment localhost
VITE_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3

# Enable localhost mode
VITE_USE_LOCALHOST=true
```

### Step 4: Import Test Account ke MetaMask

1. Buka MetaMask
2. Klik network dropdown → "Add Network" → "Add a network manually"
3. Isi:
   - **Network Name**: Hardhat Local
   - **RPC URL**: http://127.0.0.1:8545
   - **Chain ID**: 1337
   - **Currency Symbol**: ETH
4. Klik "Save"
5. Import test account:
   - Klik account icon → "Import Account"
   - Paste **private key** dari Terminal 1 (yang pertama, biasanya account #0)
   - Account akan muncul dengan balance 10000 ETH

### Step 5: Start Frontend

Di **Terminal 3** (atau terminal baru):

```bash
npm run dev
```

Buka `http://localhost:5173`

### Step 6: Test!

1. **Connect Wallet**:
   - Klik "Connect Wallet" di navbar
   - Pilih MetaMask
   - Pilih account yang sudah di-import (balance 10000 ETH)
   - Network akan auto switch ke "Hardhat Local"

2. **Test Minting**:
   - Buka `/upload`
   - Upload file diploma
   - Isi form
   - Klik "Issue Diploma"
   - Approve transaction di MetaMask
   - NFT akan ter-mint! 🎉

3. **Test Verification**:
   - Buka `/verify`
   - Paste hash dari file yang sudah di-mint
   - Klik "Verify"
   - Hasil on-chain akan muncul!

## 🔍 Check Transaction di Local Node

Di Terminal 1 (hardhat node), kamu akan lihat:
- Setiap transaction yang terjadi
- Gas used
- Block number
- Logs dari contract events

## 🛑 Stop Local Node

Untuk stop:
- Di Terminal 1, tekan `Ctrl+C`
- Semua data akan hilang (temporary blockchain)

## 💡 Tips

### Reset Local Node

Jika ingin reset:
1. Stop node (`Ctrl+C`)
2. Start lagi (`npx hardhat node`)
3. Deploy ulang contract
4. Update `.env` dengan address baru

### Get Test Account Private Keys

Dari Terminal 1, copy private keys yang muncul. Format:
```
Account #0: 0x... (private key: 0x...)
```

### Check Contract di Hardhat Console

```bash
npx hardhat console --network localhost
```

Lalu di console:
```js
const ProjectVault = await ethers.getContractFactory("ProjectVault")
const contract = await ProjectVault.attach("0xYourContractAddress")
const totalSupply = await contract.totalSupply()
console.log("Total Supply:", totalSupply.toString())
```

## ⚠️ Troubleshooting

### Error: "Cannot connect to localhost:8545"

- Pastikan `npx hardhat node` masih running di Terminal 1
- Check apakah port 8545 tidak dipakai aplikasi lain

### Error: "Contract address not configured"

- Pastikan `.env` file ada di root project
- Pastikan `VITE_CONTRACT_ADDRESS` sudah di-set
- Restart dev server setelah update `.env`

### MetaMask tidak connect ke localhost

- Pastikan network "Hardhat Local" sudah ditambahkan
- Pastikan Chain ID = 1337
- Refresh halaman setelah add network

### Transaction stuck

- Check Terminal 1 untuk error messages
- Pastikan account punya cukup ETH (harusnya 10000 ETH)
- Coba reset node dan deploy ulang

## 🎯 Next Steps

Setelah testing di localhost berhasil:

1. **Deploy ke Polygon Mumbai** (testnet):
   ```bash
   npx hardhat run scripts/deploy.ts --network mumbai
   ```

2. **Update `.env`**:
   ```env
   VITE_CONTRACT_ADDRESS=0xMumbaiContractAddress
   VITE_USE_LOCALHOST=false  # atau hapus line ini
   ```

3. **Test di Mumbai** dengan real MATIC (dapat dari faucet)

4. **Deploy ke Mainnet** saat siap production!

## ✅ Checklist

- [ ] Local node running (`npx hardhat node`)
- [ ] Contract deployed (`npx hardhat run scripts/deploy.ts --network localhost`)
- [ ] `.env` file dengan `VITE_CONTRACT_ADDRESS` dan `VITE_USE_LOCALHOST=true`
- [ ] MetaMask connected dengan test account
- [ ] Network "Hardhat Local" (Chain ID 1337) ditambahkan
- [ ] Frontend running (`npm run dev`)
- [ ] Test minting berhasil
- [ ] Test verification berhasil

Selamat testing! 🚀

