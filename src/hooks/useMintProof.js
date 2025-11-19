import { useCallback, useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useWallet } from './useWallet.js'
import { useMintProofContract } from './useContract.js'
import { hexToBytes } from 'viem'

export const useMintProof = () => {
  const { address, isConnected } = useAccount()
  const { ensurePolygon } = useWallet()
  const [error, setError] = useState(null)

  // Convert hex string hash to bytes32
  const hashToBytes32 = (hexString) => {
    if (!hexString) return '0x0000000000000000000000000000000000000000000000000000000000000000'
    // Remove 0x prefix if present, pad to 64 chars, add 0x back
    const clean = hexString.replace(/^0x/, '')
    const padded = clean.padStart(64, '0')
    return `0x${padded}`
  }

  const mintProof = useCallback(
    async (payload) => {
      if (!isConnected || !address) {
        setError('Wallet is not connected')
        return null
      }

      if (!payload.hash || !payload.metadata?.cid) {
        setError('File hash and IPFS CID are required')
        return null
      }

      await ensurePolygon()

      try {
        setError(null)
        const fileHashBytes32 = hashToBytes32(payload.hash)
        const metadataURI = `ipfs://${payload.metadata.cid.replace('ipfs://', '')}`

        // This will be handled by the contract hook
        return {
          fileHash: fileHashBytes32,
          metadataURI,
          to: address,
        }
      } catch (err) {
        console.error('Mint preparation error:', err)
        setError(err.message || 'Failed to prepare mint')
        return null
      }
    },
    [address, isConnected, ensurePolygon],
  )

  return {
    mintProof,
    error,
  }
}

// Separate hook for actual contract interaction
export const useMintProofWithContract = (to, fileHash, metadataURI) => {
  const { ensurePolygon } = useWallet()
  const [error, setError] = useState(null)
  const [status, setStatus] = useState('idle')

  // Always call hook with valid values (use null/empty string if not ready)
  const validTo = to || '0x0000000000000000000000000000000000000000'
  const validHash = fileHash || '0x0000000000000000000000000000000000000000000000000000000000000000'
  const validURI = metadataURI || ''

  const { mint, hash, isPending, isConfirming, isConfirmed, isLoading, error: contractError } =
    useMintProofContract(validTo, validHash, validURI)

  useEffect(() => {
    if (isPending) setStatus('pending')
    else if (isConfirming) setStatus('confirming')
    else if (isConfirmed) setStatus('confirmed')
    else if (contractError) {
      setStatus('failed')
      setError(contractError.message)
    } else setStatus('idle')
  }, [isPending, isConfirming, isConfirmed, contractError])

  const executeMint = useCallback(async () => {
    if (!to || to === '0x0000000000000000000000000000000000000000') {
      setError('Recipient address is required')
      setStatus('failed')
      return
    }

    if (!fileHash || fileHash === '0x0000000000000000000000000000000000000000000000000000000000000000') {
      setError('File hash is required')
      setStatus('failed')
      return
    }

    if (!metadataURI) {
      setError('Metadata URI is required')
      setStatus('failed')
      return
    }

    await ensurePolygon()
    setError(null)
    setStatus('pending')

    try {
      await mint()
    } catch (err) {
      setError(err.message || 'Mint failed')
      setStatus('failed')
    }
  }, [to, fileHash, metadataURI, mint, ensurePolygon])

  return {
    executeMint,
    txHash: hash,
    status,
    error: error || contractError?.message,
    isLoading,
  }
}

