import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import GlassCard from '../components/GlassCard.jsx'
import NeonButton from '../components/NeonButton.jsx'
import FileUploader from '../components/FileUploader.jsx'
import { useUploadToIPFS } from '../hooks/useUploadToIPFS.js'
import { useMintProofWithContract } from '../hooks/useMintProof.js'
import { useContract, useContractOwner } from '../hooks/useContract.js'

const UNIVERSITY_NAME = 'University of Blockchain'

const UploadPage = () => {
  const { address } = useAccount()
  const { contractAddress } = useContract()
  const { owner: contractOwner, isLoading: isLoadingOwner } = useContractOwner()
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    program: '',
    year: '2024',
  })
  const [hashPayload, setHashPayload] = useState({ file: null, hash: '' })
  const [ipfsResult, setIpfsResult] = useState(null)
  const [shouldMint, setShouldMint] = useState(false)
  const { uploadMetadata, isUploading } = useUploadToIPFS()
  const [message, setMessage] = useState('')

  // Check if connected wallet is the contract owner
  const isOwner = address && contractOwner && address.toLowerCase() === contractOwner.toLowerCase()

  const formatAddress = (addr) => {
    if (!addr) return 'N/A'
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

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

  // Trigger mint only after IPFS upload is done and state sudah terbarui
  useEffect(() => {
    if (!shouldMint) return
    if (!metadataURI || !fileHashBytes32 || !address) return

    const runMint = async () => {
      try {
        console.log('📤 Step 2: Minting NFT...')
        console.log('  - fileHashBytes32:', fileHashBytes32)
        console.log('  - metadataURI:', metadataURI)
        console.log('  - to:', address)
        await executeMint()
        console.log('✅ Step 2 complete: Mint transaction sent')
      } catch (err) {
        console.error('❌ Mint error:', err)
        setMessage(`❌ Error: ${err.message || 'Failed to mint'}`)
      } finally {
        setShouldMint(false)
      }
    }

    runMint()
  }, [shouldMint, metadataURI, fileHashBytes32, address, executeMint])

  const handleIssue = async (event) => {
    event.preventDefault()
    setMessage('')
    
    console.log('🔵 Issue Diploma clicked')
    console.log('  - hashPayload:', hashPayload)
    console.log('  - address:', address)
    console.log('  - contractAddress:', contractAddress)
    console.log('  - isOwner:', isOwner)
    console.log('  - contractOwner:', contractOwner)

    if (!hashPayload.hash) {
      const msg = '⚠️ Upload a diploma file to calculate the hash first.'
      setMessage(msg)
      console.log('❌', msg)
      return
    }

    if (!address) {
      const msg = '⚠️ Please connect your wallet first.'
      setMessage(msg)
      console.log('❌', msg)
      return
    }

    if (!contractAddress) {
      const msg = '⚠️ Contract address not configured. Set VITE_CONTRACT_ADDRESS in .env'
      setMessage(msg)
      console.log('❌', msg)
      return
    }

    if (!isOwner) {
      const msg = `⚠️ Only contract owner can mint. Your wallet: ${address}, Owner: ${contractOwner}`
      setMessage(msg)
      console.log('❌', msg)
      return
    }

    try {
      // Step 1: Upload metadata to IPFS
      console.log('📤 Step 1: Uploading metadata to IPFS...')
      setMessage('📤 Uploading metadata to IPFS...')
      const metadata = {
        ...formData,
        hash: hashPayload.hash,
        fileName: hashPayload.file?.name,
        university: UNIVERSITY_NAME,
      }
      console.log('  Metadata:', metadata)
      
      const uploaded = await uploadMetadata(metadata)
      console.log('  Upload result:', uploaded)

      if (!uploaded || !uploaded.cid) {
        const msg = '❌ Failed to upload to IPFS'
        setMessage(msg)
        console.log('❌', msg)
        return
      }

      setIpfsResult(uploaded)
      console.log('✅ Step 1 complete: Metadata uploaded to IPFS')
      setMessage('✅ Metadata uploaded! Minting NFT...')
      setShouldMint(true)
    } catch (err) {
      console.error('❌ Issue error:', err)
      const errorMsg = err.message || 'Failed to issue diploma'
      setMessage(`❌ Error: ${errorMsg}`)
    }
  }

  return (
    <section className="space-y-10">
      <div>
        <p className="text-white/60 uppercase text-xs tracking-[0.5em]">University Portal</p>
        <h1 className="text-4xl font-semibold mt-3">Issue & manage NFT Diplomas</h1>
        <p className="text-white/60 mt-2">Metadata is pinned to IPFS and minted under your university wallet.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <GlassCard className="lg:col-span-2 p-5 flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Connected Wallet</p>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="font-semibold text-white">{formatAddress(address) || 'Not connected'}</p>
              <p className="text-white/60 text-sm">{UNIVERSITY_NAME}</p>
            </div>
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs ${
                isOwner
                  ? 'border-emerald-400/60 text-emerald-200 bg-emerald-500/10'
                  : 'border-yellow-400/60 text-yellow-200 bg-yellow-500/10'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isOwner ? 'bg-emerald-300' : 'bg-yellow-300'
                }`}
              />
              {isOwner ? 'University Owner' : 'Not owner — connect owner wallet'}
            </span>
          </div>
        </GlassCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
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
              disabled={isUploading || isMinting || !address || !contractAddress || !isOwner || !hashPayload.hash}
              onClick={(e) => {
                // Debug logging
                if (!hashPayload.hash) {
                  console.log('❌ No file hash - upload file first')
                }
                if (!address) {
                  console.log('❌ No wallet connected')
                }
                if (!contractAddress) {
                  console.log('❌ No contract address')
                }
                if (!isOwner) {
                  console.log('❌ Not owner - Connected:', address, 'Owner:', contractOwner)
                }
              }}
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
          
          {/* Debug info */}
          {(!address || !contractAddress || !isOwner || !hashPayload.hash) && (
            <div className="text-xs text-yellow-400 bg-yellow-500/10 p-3 rounded-xl border border-yellow-500/30 space-y-1">
              <p className="font-semibold">⚠️ Button disabled. Missing requirements:</p>
              <ul className="list-disc list-inside ml-2 space-y-0.5">
                {!hashPayload.hash && <li>Upload a diploma file first</li>}
                {!address && <li>Connect your wallet</li>}
                {!contractAddress && <li>Contract address not configured</li>}
                {address && contractAddress && (
                  <li>
                    {isLoadingOwner ? (
                      <span>Loading owner information...</span>
                    ) : contractOwner ? (
                      isOwner ? (
                        <span className="text-green-400">✅ You are the owner!</span>
                      ) : (
                        <>
                          Wallet is not contract owner
                          <br />
                          <span className="text-white/60 text-xs">
                            Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                            <br />
                            Owner: {contractOwner.slice(0, 6)}...{contractOwner.slice(-4)}
                            <br />
                            {address.toLowerCase() === contractOwner.toLowerCase() ? (
                              <span className="text-green-400">✅ Addresses match (case sensitive check)</span>
                            ) : (
                              <span className="text-red-400">❌ Addresses don't match</span>
                            )}
                          </span>
                        </>
                      )
                    ) : (
                      <span className="text-red-400">
                        ❌ Could not load owner. Check contract address and network.
                      </span>
                    )}
                  </li>
                )}
              </ul>
            </div>
          )}
          
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
                href={`https://amoy.polygonscan.com/tx/${txHash}`}
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
          {contractAddress && address && !isLoadingOwner && !isOwner && (
            <div className="text-xs text-red-400 bg-red-500/10 p-3 rounded-xl border border-red-500/30 space-y-3">
              <div>
                ⚠️ Only contract owner can mint NFTs. 
                <br />
                <span className="text-white/60">
                  {contractOwner ? (
                    <>
                      Owner: {contractOwner.slice(0, 6)}...{contractOwner.slice(-4)}
                      <br />
                      Connected: {address.slice(0, 6)}...{address.slice(-4)}
                      <br />
                      {address.toLowerCase() === contractOwner.toLowerCase() ? (
                        <span className="text-green-400 text-xs">✅ Addresses match (but owner check failed - check case sensitivity)</span>
                      ) : (
                        <span className="text-red-400 text-xs">❌ Addresses don't match</span>
                      )}
                    </>
                  ) : (
                    <>
                      ❌ Could not load contract owner
                      <br />
                      <span className="text-white/50 text-xs">
                        Check browser console for errors. Possible issues:
                        <br />• Contract address incorrect
                        <br />• Contract not deployed
                        <br />• Wrong network (localhost vs Amoy)
                      </span>
                    </>
                  )}
                </span>
              </div>
              {contractOwner && (
                <div className="pt-2 border-t border-red-500/30">
                  <p className="text-white/80 mb-2 font-semibold">Solution:</p>
                  <p className="text-white/70 text-xs mb-2">
                    Contract was deployed with wrong owner. Deploy again with your PRIVATE_KEY:
                  </p>
                  <ol className="list-decimal list-inside text-white/70 text-xs space-y-1 ml-2">
                    <li>Add PRIVATE_KEY to .env file</li>
                    <li>Stop current dev server (Ctrl+C)</li>
                    <li>Run: <code className="bg-white/10 px-1 rounded">npm run dev</code></li>
                    <li>Contract will be deployed with your wallet as owner</li>
                  </ol>
                  <p className="text-yellow-300 text-xs mt-2">
                    💡 Your wallet address from PRIVATE_KEY will automatically become the contract owner.
                  </p>
                </div>
              )}
            </div>
          )}
        </GlassCard>
        <div className="h-full">
          <FileUploader onHashGenerated={setHashPayload} />
        </div>
      </div>
    </section>
  )
}

export default UploadPage

