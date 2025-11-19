/**
 * Upload JSON metadata to IPFS
 * 
 * Note: This uses a public IPFS gateway. For production, consider:
 * - Pinata (https://pinata.cloud)
 * - Web3.Storage (https://web3.storage)
 * - NFT.Storage (https://nft.storage)
 * 
 * Current implementation uses mock for development.
 * Replace with real IPFS service in production.
 */

const delay = (ms = 1200) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Format metadata according to ERC721 metadata standard
 */
const formatMetadata = (payload) => {
  return {
    name: `Diploma Proof - ${payload.name || 'Unknown'}`,
    description: `Verifiable diploma proof for ${payload.name || 'student'}`,
    image: payload.fileHash ? `https://via.placeholder.com/512?text=${encodeURIComponent(payload.name || 'Diploma')}` : '',
    attributes: [
      { trait_type: 'Student Name', value: payload.name || '' },
      { trait_type: 'Student ID', value: payload.studentId || '' },
      { trait_type: 'Program', value: payload.program || '' },
      { trait_type: 'Year', value: payload.year || '' },
      { trait_type: 'File Hash', value: payload.hash || '' },
      { trait_type: 'File Name', value: payload.fileName || '' },
      { trait_type: 'Issued At', value: new Date().toISOString() },
    ],
    external_url: 'https://projectvault.io',
  }
}

/**
 * Upload JSON to IPFS (mock implementation)
 * 
 * TODO: Replace with real IPFS service:
 * 
 * Example with Pinata:
 * ```js
 * const formData = new FormData()
 * formData.append('file', new Blob([JSON.stringify(metadata)], { type: 'application/json' }))
 * const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
 *   method: 'POST',
 *   headers: { 'Authorization': `Bearer ${PINATA_JWT}` },
 *   body: formData
 * })
 * const data = await res.json()
 * return { cid: `ipfs://${data.IpfsHash}`, ... }
 * ```
 */
export const uploadJSONToIPFS = async (payload) => {
  await delay(1500) // Simulate upload time
  
  const metadata = formatMetadata(payload)
  
  // Generate a deterministic CID-like string from hash for consistency
  const hashPrefix = payload.hash ? payload.hash.slice(0, 16) : crypto.randomUUID().slice(0, 16)
  const mockCid = `Qm${hashPrefix}${crypto.randomUUID().replace(/-/g, '').slice(0, 32)}`
  
  return {
    cid: `ipfs://${mockCid}`,
    gatewayUrl: `https://ipfs.io/ipfs/${mockCid}`,
    payload: metadata,
    rawPayload: payload,
    timestamp: new Date().toISOString(),
  }
}

/**
 * Upload file to IPFS (for future use)
 */
export const uploadFileToIPFS = async (file) => {
  // TODO: Implement real file upload
  // For now, return mock
  await delay(2000)
  const mockCid = `Qm${crypto.randomUUID().replace(/-/g, '')}`
  return {
    cid: `ipfs://${mockCid}`,
    gatewayUrl: `https://ipfs.io/ipfs/${mockCid}`,
    fileName: file.name,
    fileSize: file.size,
  }
}

