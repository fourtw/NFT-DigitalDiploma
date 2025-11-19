import { useState } from 'react'
import { motion } from 'framer-motion'
import GlassCard from '../components/GlassCard.jsx'
import NeonButton from '../components/NeonButton.jsx'
import { useVerifyHash, useContract } from '../hooks/useContract.js'

const VerifyPage = () => {
  const [inputHash, setInputHash] = useState('')
  const [searchHash, setSearchHash] = useState(null)
  const { contractAddress } = useContract()
  const { result, isLoading, error, refetch } = useVerifyHash(searchHash)

  const handleVerify = () => {
    if (!inputHash.trim()) {
      return
    }

    // Convert input to bytes32 format
    let hashBytes32 = inputHash.trim()
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

    setSearchHash(hashBytes32)
    refetch()
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
          Enter the SHA-256 file hash to verify on-chain. Results are fetched from Polygon Mumbai.
        </p>
        {!contractAddress && (
          <p className="text-yellow-400 text-sm mt-2">
            ⚠️ Contract address not configured. Set VITE_CONTRACT_ADDRESS in .env
          </p>
        )}
      </div>

      <GlassCard className="p-8 space-y-6">
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

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/50 rounded-2xl p-4 text-red-300 text-sm"
          >
            Error: {error.message || 'Failed to verify'}
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

