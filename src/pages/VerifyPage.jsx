import { useState } from 'react'
import { motion } from 'framer-motion'
import GlassCard from '../components/GlassCard.jsx'
import NeonButton from '../components/NeonButton.jsx'
import QRScanner from '../components/QRScanner.jsx'
import QRGenerator from '../components/QRGenerator.jsx'
import { useVerifyHash, useContract } from '../hooks/useContract.js'

const VerifyPage = () => {
  const [mode, setMode] = useState('manual') // 'manual' or 'scan'
  const [inputHash, setInputHash] = useState('')
  const [searchHash, setSearchHash] = useState(null)
  const { contractAddress, isValid: isValidContract } = useContract()
  const { result, isLoading, error, refetch } = useVerifyHash(searchHash)

  const normalizeHash = (hashInput) => {
    let hashBytes32 = hashInput.trim()
    
    // Try to parse as JSON first (in case QR contains JSON)
    try {
      const parsed = JSON.parse(hashBytes32)
      if (parsed.hash) {
        hashBytes32 = parsed.hash
      }
    } catch (e) {
      // Not JSON, continue with raw hash
    }

    if (!hashBytes32.startsWith('0x')) {
      // If it's a hex string without 0x, add it
      if (/^[0-9a-fA-F]{64}$/.test(hashBytes32)) {
        hashBytes32 = `0x${hashBytes32}`
      } else {
        // If it's not 64 chars, pad it
        hashBytes32 = hashBytes32.replace(/^0x/, '')
        hashBytes32 = `0x${hashBytes32.padStart(64, '0')}`
      }
    } else {
      // Ensure it's 66 chars (0x + 64 hex)
      const clean = hashBytes32.replace(/^0x/, '')
      hashBytes32 = `0x${clean.padStart(64, '0')}`
    }

    return hashBytes32
  }

  const handleVerify = () => {
    if (!inputHash.trim()) {
      return
    }

    const hashBytes32 = normalizeHash(inputHash)
    setSearchHash(hashBytes32)
  }

  const handleQRScan = (scannedData) => {
    // Switch to manual mode to show the result
    setMode('manual')
    
    // Extract hash from scanned data
    const hashBytes32 = normalizeHash(scannedData)
    setInputHash(hashBytes32)
    setSearchHash(hashBytes32)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleVerify()
    }
  }

  const formatAddress = (addr) => {
    if (!addr || addr === '0x0000000000000000000000000000000000000000') return 'N/A'
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <section className="space-y-10">
      <div>
        <p className="text-white/60 uppercase text-xs tracking-[0.5em]">Verification</p>
        <h1 className="text-4xl font-semibold mt-4">Instant diploma validation</h1>
        <p className="text-white/60 mt-2">
          Enter the SHA-256 file hash to verify on-chain. Results are fetched from Polygon Amoy.
        </p>
        {(!contractAddress || !isValidContract) && (
          <div className="text-yellow-400 text-sm mt-2 space-y-1">
            <p>⚠️ Contract address not configured or invalid.</p>
            {contractAddress && !isValidContract && (
              <p className="text-xs text-yellow-300/80">
                Invalid address format: {contractAddress}
              </p>
            )}
            <p className="text-xs text-yellow-300/80">
              Set VITE_CONTRACT_ADDRESS in .env with a valid contract address (0x...)
            </p>
          </div>
        )}
      </div>

      <GlassCard className="p-8 space-y-6">
        {/* Tab Switcher */}
        <div className="flex gap-2 border-b border-white/10 pb-4">
          <button
            onClick={() => setMode('manual')}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              mode === 'manual'
                ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/50'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            Manual Input
          </button>
          <button
            onClick={() => setMode('scan')}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              mode === 'scan'
                ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/50'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            Scan QR Code
          </button>
        </div>

        {/* Manual Input Mode */}
        {mode === 'manual' && (
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={inputHash}
              onChange={(e) => setInputHash(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Paste SHA-256 hash (64 hex chars or 0x...)"
              className="flex-1 rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-neon-blue font-mono text-sm"
              disabled={!contractAddress}
            />
            <NeonButton
              onClick={handleVerify}
              disabled={!contractAddress || isLoading || !inputHash.trim()}
              className="w-full md:w-auto"
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </NeonButton>
          </div>
        )}

        {/* QR Scan Mode */}
        {mode === 'scan' && (
          <QRScanner
            onScanSuccess={handleQRScan}
            onError={(err) => console.error('QR Scan error:', err)}
          />
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/50 rounded-2xl p-4 text-red-300 text-sm space-y-2"
          >
            <p className="font-semibold">❌ Error: {error.message || 'Failed to verify'}</p>
            {error.message?.includes('Contract not found') && (
              <div className="mt-2 text-xs text-red-200/80 space-y-1">
                <p>Possible solutions:</p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li>Check if contract address in .env matches deployed contract</li>
                  <li>Ensure contract is deployed to the correct network</li>
                  <li>Restart dev server after updating .env</li>
                  <li>Verify you're connected to the correct network (localhost:8545 or Amoy)</li>
                </ul>
                {contractAddress && (
                  <p className="mt-2 pt-2 border-t border-red-500/30">
                    Current contract address: <span className="font-mono text-xs">{contractAddress}</span>
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {result.exists ? (
              <>
                <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-2xl p-4">
                  <p className="text-emerald-300 font-semibold flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-300" />
                    ✓ Verified on-chain
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-2xl border border-white/5 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">Token ID</p>
                    <p className="mt-2 text-white font-medium font-mono">
                      #{result.tokenId?.toString() || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-2xl border border-white/5 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">Owner</p>
                    <p className="mt-2 text-white font-medium font-mono">
                      {formatAddress(result.owner)}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-2xl border border-white/5 px-4 py-3 sm:col-span-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">Metadata URI</p>
                    <p className="mt-2 text-white font-medium font-mono text-xs break-all">
                      {result.metadataURI || 'N/A'}
                    </p>
                    {result.metadataURI && (
                      <a
                        href={result.metadataURI.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neon-blue text-xs mt-2 inline-block hover:underline"
                      >
                        View on IPFS →
                      </a>
                    )}
                  </div>
                </div>
                
                {/* QR Code Generator */}
                <div className="pt-4 border-t border-white/10">
                  <QRGenerator
                    hash={searchHash}
                    tokenId={result.tokenId}
                    metadataURI={result.metadataURI}
                  />
                </div>
              </>
            ) : (
              <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-2xl p-4">
                <p className="text-yellow-300 font-semibold">
                  ⚠️ Hash not found on-chain. This diploma may not have been minted yet.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {!result && !isLoading && !error && searchHash && (
          <div className="text-white/60 text-sm text-center py-4">
            No results found. Try a different hash.
          </div>
        )}
      </GlassCard>
    </section>
  )
}

export default VerifyPage

