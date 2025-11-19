import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import GlassCard from '../components/GlassCard.jsx'
import NeonButton from '../components/NeonButton.jsx'
import FileUploader from '../components/FileUploader.jsx'
import { useUploadToIPFS } from '../hooks/useUploadToIPFS.js'
import { useMintProofWithContract } from '../hooks/useMintProof.js'
import { useContract } from '../hooks/useContract.js'

const metrics = [
  { label: 'Total Issued', value: 42 },
  { label: 'Pending', value: 7 },
  { label: 'Smart Contract', value: '0xCONTRACT...ABCD' },
]

const UploadPage = () => {
  const { address } = useAccount()
  const { contractAddress } = useContract()
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    program: '',
    year: '2024',
  })
  const [hashPayload, setHashPayload] = useState({ file: null, hash: '' })
  const [ipfsResult, setIpfsResult] = useState(null)
  const { uploadMetadata, isUploading } = useUploadToIPFS()
  const [message, setMessage] = useState('')

  // Convert hex string to bytes32
  const hashToBytes32 = (hexString) => {
    if (!hexString) return '0x0000000000000000000000000000000000000000000000000000000000000000'
    const clean = hexString.replace(/^0x/, '')
    const padded = clean.padStart(64, '0')
    return `0x${padded}`
  }

  // Setup contract mint hook when we have all data
  const fileHashBytes32 = hashPayload.hash ? hashToBytes32(hashPayload.hash) : null
  const metadataURI = ipfsResult?.cid ? `ipfs://${ipfsResult.cid.replace('ipfs://', '')}` : null
  const { executeMint, txHash, status, error: mintError, isLoading: isMinting } =
    useMintProofWithContract(address, fileHashBytes32, metadataURI)

  useEffect(() => {
    if (status === 'confirmed') {
      setMessage('✅ Diploma NFT minted successfully!')
    } else if (status === 'failed') {
      setMessage(`❌ Mint failed: ${mintError || 'Unknown error'}`)
    }
  }, [status, mintError])

  const handleIssue = async (event) => {
    event.preventDefault()
    setMessage('')

    if (!hashPayload.hash) {
      setMessage('⚠️ Upload a diploma file to calculate the hash first.')
      return
    }

    if (!address) {
      setMessage('⚠️ Please connect your wallet first.')
      return
    }

    if (!contractAddress) {
      setMessage('⚠️ Contract address not configured. Set VITE_CONTRACT_ADDRESS in .env')
      return
    }

    try {
      // Step 1: Upload metadata to IPFS
      setMessage('📤 Uploading metadata to IPFS...')
      const metadata = {
        ...formData,
        hash: hashPayload.hash,
        fileName: hashPayload.file?.name,
      }
      const uploaded = await uploadMetadata(metadata)

      if (!uploaded || !uploaded.cid) {
        setMessage('❌ Failed to upload to IPFS')
        return
      }

      setIpfsResult(uploaded)
      setMessage('✅ Metadata uploaded! Minting NFT...')

      // Step 2: Mint NFT (executeMint will be called automatically via the hook)
      // But we need to trigger it manually
      await executeMint()
    } catch (err) {
      console.error('Issue error:', err)
      setMessage(`❌ Error: ${err.message || 'Failed to issue diploma'}`)
    }
  }

  return (
    <section className="space-y-10">
      <div>
        <p className="text-white/60 uppercase text-xs tracking-[0.5em]">University Portal</p>
        <h1 className="text-4xl font-semibold mt-3">Issue & manage NFT Diplomas</h1>
        <p className="text-white/60 mt-2">Metadata is pinned to IPFS and minted under your university wallet.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {metrics.map((metric, idx) => (
          <GlassCard key={metric.label} className="p-6" delay={idx * 0.05}>
            <p className="text-sm text-white/50">{metric.label}</p>
            <p className="text-3xl font-semibold mt-3">
              {typeof metric.value === 'number' ? metric.value : metric.value}
            </p>
          </GlassCard>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <GlassCard className="p-8 space-y-6">
          <h2 className="text-2xl font-semibold">Issue Diploma</h2>
          <p className="text-sm text-white/60">
            Mint a single diploma NFT. Metadata will be pinned to IPFS and minted under the university issuer wallet.
          </p>
          <form className="space-y-4" onSubmit={handleIssue}>
            {[
              { key: 'name', label: 'Full Name', type: 'text' },
              { key: 'studentId', label: 'Student ID', type: 'text' },
              { key: 'program', label: 'Program', type: 'text' },
              { key: 'year', label: 'Year', type: 'number' },
            ].map((field) => (
              <div key={field.key}>
                <label className="text-sm text-white/60">{field.label}</label>
                <input
                  type={field.type}
                  value={formData[field.key]}
                  onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                  className="mt-2 w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 focus:outline-none focus:border-neon-blue"
                />
              </div>
            ))}
            <NeonButton
              type="submit"
              className="w-full"
              disabled={isUploading || isMinting || !address || !contractAddress}
            >
              {isUploading
                ? 'Uploading to IPFS...'
                : isMinting
                  ? status === 'pending'
                    ? 'Waiting for confirmation...'
                    : status === 'confirming'
                      ? 'Confirming transaction...'
                      : 'Minting...'
                  : 'Issue Diploma'}
            </NeonButton>
          </form>
          {message && (
            <div
              className={`text-sm p-3 rounded-2xl ${
                message.includes('✅')
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                  : message.includes('⚠️')
                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50'
                    : 'bg-red-500/20 text-red-300 border border-red-500/50'
              }`}
            >
              {message}
            </div>
          )}
          {ipfsResult?.cid && (
            <div className="text-xs text-white/60 space-y-2">
              <p className="text-white/80">IPFS CID</p>
              <p className="font-mono break-all text-neon-blue bg-white/5 p-2 rounded-xl">
                {ipfsResult.cid}
              </p>
              <a
                href={ipfsResult.gatewayUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neon-blue hover:underline inline-block"
              >
                View on IPFS →
              </a>
            </div>
          )}
          {txHash && (
            <div className="text-xs text-white/60 space-y-2">
              <p className="text-white/80">Transaction Hash</p>
              <p className="font-mono break-all text-neon-blue bg-white/5 p-2 rounded-xl">
                {txHash}
              </p>
              <a
                href={`https://mumbai.polygonscan.com/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neon-blue hover:underline inline-block"
              >
                View on Polygonscan →
              </a>
            </div>
          )}
          {!contractAddress && (
            <div className="text-xs text-yellow-400 bg-yellow-500/10 p-3 rounded-xl border border-yellow-500/30">
              ⚠️ Contract not configured. Add VITE_CONTRACT_ADDRESS to .env file
            </div>
          )}
        </GlassCard>
        <GlassCard className="p-8 space-y-6">
          <h2 className="text-2xl font-semibold">Batch Upload</h2>
          <p className="text-sm text-white/60">
            Upload a CSV file to issue multiple diplomas at once. Gas fees apply for on-chain issuance.
          </p>
          <div className="space-y-4">
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6 text-center text-white/70">
              Coming soon — drag CSV here.
            </div>
            <NeonButton variant="secondary" className="w-full">
              Upload
            </NeonButton>
          </div>
        </GlassCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <FileUploader onHashGenerated={setHashPayload} />
        <GlassCard className="p-8 space-y-4">
          <h3 className="text-xl font-semibold">Issued Diplomas</h3>
          <div className="space-y-4 text-sm">
            {[
              {
                tokenId: '0x273_24FB',
                name: 'Jane Doc',
                program: 'CS',
                year: '2023',
                status: 'verified',
              },
              {
                tokenId: '0x9F2E_E71C',
                name: 'John Smin',
                program: 'InfoSoc',
                year: '2024',
                status: 'pending',
              },
            ].map((row) => (
              <div key={row.tokenId} className="flex items-center justify-between border-b border-white/5 pb-3">
                <div>
                  <p className="font-medium">{row.name}</p>
                  <p className="text-white/50 text-xs">{row.tokenId}</p>
                </div>
                <div className="text-right">
                  <p>{row.program}</p>
                  <p className="text-white/50 text-xs capitalize">{row.status}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  )
}

export default UploadPage

