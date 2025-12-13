import { useMemo, useEffect } from 'react'
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'

const PROJECT_VAULT_ABI = [
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'bytes32', name: 'fileHash', type: 'bytes32' },
      { internalType: 'string', name: 'metadataURI', type: 'string' },
    ],
    name: 'mintProof',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'fileHash', type: 'bytes32' }],
    name: 'verifyHash',
    outputs: [
      { internalType: 'bool', name: 'exists', type: 'bool' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'string', name: 'metadataURI', type: 'string' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    name: 'hashToTokenId',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
      { indexed: true, internalType: 'bytes32', name: 'fileHash', type: 'bytes32' },
      { indexed: false, internalType: 'string', name: 'metadataURI', type: 'string' },
      { indexed: false, internalType: 'uint256', name: 'timestamp', type: 'uint256' },
    ],
    name: 'ProofMinted',
    type: 'event',
  },
]

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || ''

// Validate Ethereum address format
const isValidAddress = (address) => {
  if (!address) return false
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export const useContract = () => {
  const contractConfig = useMemo(
    () => {
      const address = CONTRACT_ADDRESS.trim()
      if (!address || !isValidAddress(address)) {
        return null
      }
      return {
        address: address,
        abi: PROJECT_VAULT_ABI,
      }
    },
    [],
  )

  return {
    contractAddress: CONTRACT_ADDRESS,
    contractConfig,
    abi: PROJECT_VAULT_ABI,
    isValid: isValidAddress(CONTRACT_ADDRESS),
  }
}

export const useMintProofContract = (to, fileHash, metadataURI) => {
  const { contractConfig } = useContract()
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  const mint = async () => {
    if (!contractConfig.address) {
      throw new Error('Contract address not configured. Set VITE_CONTRACT_ADDRESS in .env')
    }

    if (!fileHash || !metadataURI) {
      throw new Error('File hash and metadata URI are required')
    }

    try {
      await writeContract({
        ...contractConfig,
        functionName: 'mintProof',
        args: [to, fileHash, metadataURI],
      })
    } catch (err) {
      console.error('Mint error:', err)
      throw err
    }
  }

  return {
    mint,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    isLoading: isPending || isConfirming,
    error,
  }
}

export const useVerifyHash = (fileHash) => {
  const { contractConfig } = useContract()

  // Validate fileHash format (must be bytes32 = 66 chars with 0x prefix)
  const isValidHash = fileHash && 
    typeof fileHash === 'string' && 
    fileHash.startsWith('0x') && 
    fileHash.length === 66

  const { data, isLoading, error, refetch } = useReadContract({
    ...(contractConfig || {}),
    functionName: 'verifyHash',
    args: isValidHash ? [fileHash] : undefined,
    query: {
      enabled: isValidHash && !!contractConfig?.address,
      retry: false, // Don't retry on error
    },
  })

  // Enhanced error handling
  let displayError = error
  if (error) {
    const errorMessage = error.message || String(error)
    if (errorMessage.includes('returned no data') || errorMessage.includes('0x')) {
      displayError = new Error(
        'Contract not found or invalid address. Please check:\n' +
        '1. Contract address in .env is correct\n' +
        '2. Contract is deployed to this address\n' +
        '3. You are connected to the correct network (localhost or Mumbai)'
      )
    } else if (errorMessage.includes('invalid address')) {
      displayError = new Error('Invalid contract address. Check VITE_CONTRACT_ADDRESS in .env')
    }
  }

  return {
    result: data
      ? {
          exists: data[0],
          tokenId: data[1],
          owner: data[2],
          metadataURI: data[3],
        }
      : null,
    isLoading,
    error: displayError,
    refetch,
  }
}

export const useTotalSupply = () => {
  const { contractConfig } = useContract()

  const { data, isLoading, error } = useReadContract({
    ...contractConfig,
    functionName: 'totalSupply',
    query: {
      enabled: !!contractConfig.address,
    },
  })

  return {
    totalSupply: data || 0n,
    isLoading,
    error,
  }
}

export const useContractOwner = () => {
  const { contractConfig } = useContract()

  const { data, isLoading, error } = useReadContract({
    ...(contractConfig || {}),
    functionName: 'owner',
    query: {
      enabled: !!contractConfig?.address,
      retry: 1, // Retry once if failed
    },
  })

  // Log for debugging
  useEffect(() => {
    if (contractConfig?.address) {
      console.log('🔍 Checking contract owner:', {
        contractAddress: contractConfig.address,
        isLoading,
        owner: data,
        error: error?.message,
      })
    } else {
      console.log('⚠️ No contract address configured')
    }
  }, [contractConfig?.address, isLoading, data, error])

  return {
    owner: data,
    isLoading,
    error,
  }
}

export const useTransferOwnership = () => {
  const { contractConfig } = useContract()
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  const transferOwnership = async (newOwner) => {
    if (!contractConfig.address) {
      throw new Error('Contract address not configured. Set VITE_CONTRACT_ADDRESS in .env')
    }

    if (!newOwner || newOwner === '0x0000000000000000000000000000000000000000') {
      throw new Error('Invalid owner address')
    }

    try {
      await writeContract({
        ...contractConfig,
        functionName: 'transferOwnership',
        args: [newOwner],
      })
    } catch (err) {
      console.error('Transfer ownership error:', err)
      throw err
    }
  }

  return {
    transferOwnership,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    isLoading: isPending || isConfirming,
    error,
  }
}

