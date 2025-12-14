# Project Vault

## Quick start (lokal)
1) Install dependencies  
   `npm install`
2) Satu perintah untuk semua (otomatis, Windows):  
   `npm run dev`
   - Membuka window baru untuk `npx hardhat node`
   - Deploy kontrak ke localhost
   - Menuliskan `VITE_CONTRACT_ADDRESS` dan `VITE_USE_LOCALHOST=true` ke `.env`
   - Menjalankan Vite di http://localhost:5173
3) Manual (opsional):  
   - Terminal 1: `npx hardhat node`  
   - Terminal 2: `npx hardhat run scripts/deploy.cjs --network localhost`  
   - Buat `.env` berisi:
     ```
     VITE_CONTRACT_ADDRESS=0xALAMAT_KONTRAK
     VITE_USE_LOCALHOST=true
     VITE_WALLETCONNECT_ID=demo
     PRIVATE_KEY=
     POLYGON_AMOY_RPC=https://rpc.amoy.polygon.technology
     POLYGON_AMOY_RPC=https://rpc.ankr.com/polygon_amoy
     POLYGON_MAINNET_RPC=https://polygon-rpc.com
     POLYGONSCAN_API_KEY=
     ```
   - Terminal 3: `npm run dev:vite`

## Catatan
- Kontrak hanya bisa mint oleh owner (alamat deployer).
- Jika frontend menampilkan “cannot found”, pastikan Vite berjalan di port 5173 dan `VITE_CONTRACT_ADDRESS` sudah terisi.