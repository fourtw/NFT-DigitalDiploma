import { useMemo } from 'react'
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'

// ProjectVault ABI (minimal untuk fungsi yang kita pakai)
const PROJECT_VAULT_ABI = [
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

export const useContract = () => {
  const contractConfig = useMemo(
    () => ({
      address: CONTRACT_ADDRESS,
      abi: PROJECT_VAULT_ABI,
    }),
    [],
  )

  return {
    contractAddress: CONTRACT_ADDRESS,
    contractConfig,
    abi: PROJECT_VAULT_ABI,
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

  const { data, isLoading, error, refetch } = useReadContract({
    ...contractConfig,
    functionName: 'verifyHash',
    args: fileHash ? [fileHash] : undefined,
    query: {
      enabled: !!fileHash && !!contractConfig.address,
    },
  })

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
    error,
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

