/**
 * Upload JSON/file to IPFS via Pinata (JWT)
 */

const PINATA_JWT = import.meta.env.VITE_PINATA_JWT
const PINATA_BASE_URL = import.meta.env.VITE_PINATA_BASE_URL || 'https://api.pinata.cloud'
const PINATA_GATEWAY =
  (import.meta.env.VITE_PINATA_GATEWAY || 'https://gateway.pinata.cloud/ipfs').replace(/\/$/, '')

const ensurePinataJwt = () => {
  if (!PINATA_JWT) {
    throw new Error('Missing VITE_PINATA_JWT. Tambahkan JWT Pinata di .env')
  }
}

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
 * Upload JSON to IPFS (Pinata)
 */
export const uploadJSONToIPFS = async (payload) => {
  ensurePinataJwt()

  const metadata = formatMetadata(payload)

  const res = await fetch(`${PINATA_BASE_URL}/pinning/pinJSONToIPFS`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metadata),
  })

  if (!res.ok) {
    const message = await res.text()
    throw new Error(`Pinata JSON upload failed: ${message}`)
  }

  const data = await res.json()
  const cid = data.IpfsHash || data.cid || data.hash
  if (!cid) throw new Error('Pinata JSON upload failed: missing CID')

  const gatewayUrl = `${PINATA_GATEWAY}/${cid}`

  return {
    cid: `ipfs://${cid}`,
    gatewayUrl,
    payload: metadata,
    rawPayload: payload,
    timestamp: new Date().toISOString(),
  }
}

/**
 * Upload file to IPFS (Pinata)
 */
export const uploadFileToIPFS = async (file) => {
  ensurePinataJwt()

  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${PINATA_BASE_URL}/pinning/pinFileToIPFS`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: formData,
  })

  if (!res.ok) {
    const message = await res.text()
    throw new Error(`Pinata file upload failed: ${message}`)
  }

  const data = await res.json()
  const cid = data.IpfsHash || data.cid || data.hash
  if (!cid) throw new Error('Pinata file upload failed: missing CID')

  const gatewayUrl = `${PINATA_GATEWAY}/${cid}`

  return {
    cid: `ipfs://${cid}`,
    gatewayUrl,
    fileName: file.name,
    fileSize: file.size,
  }
}
