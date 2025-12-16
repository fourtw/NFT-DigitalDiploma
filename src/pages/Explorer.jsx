import { useEffect, useMemo, useState } from 'react'
import GlassCard from '../components/GlassCard.jsx'
import NeonButton from '../components/NeonButton.jsx'
import { useVerifyHash } from '../hooks/useContract.js'

const Explorer = () => {
  const [inputHash, setInputHash] = useState('')
  const [searchHash, setSearchHash] = useState(null)
  const [metadata, setMetadata] = useState(null)
  const [isMetaLoading, setIsMetaLoading] = useState(false)
  const [metaError, setMetaError] = useState(null)

  const { result, isLoading, error } = useVerifyHash(searchHash)

  const normalizeHash = (hashInput) => {
    let hashBytes32 = hashInput.trim()

    if (!hashBytes32.startsWith('0x')) {
      if (/^[0-9a-fA-F]{64}$/.test(hashBytes32)) {
        hashBytes32 = `0x${hashBytes32}`
      } else {
        hashBytes32 = hashBytes32.replace(/^0x/, '')
        hashBytes32 = `0x${hashBytes32.padStart(64, '0')}`
      }
    } else {
      const clean = hashBytes32.replace(/^0x/, '')
      hashBytes32 = `0x${clean.padStart(64, '0')}`
    }

    return hashBytes32
  }

  const handleSearch = () => {
    if (!inputHash.trim()) return
    const hashBytes32 = normalizeHash(inputHash)
    setSearchHash(hashBytes32)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  useEffect(() => {
    const fetchMetadata = async () => {
      if (!result?.metadataURI) {
        setMetadata(null)
        return
      }
      setIsMetaLoading(true)
      setMetaError(null)
      try {
        const gatewayUrl = result.metadataURI.replace('ipfs://', 'https://ipfs.io/ipfs/')
        const res = await fetch(gatewayUrl)
        if (!res.ok) throw new Error(`Failed to load metadata (${res.status})`)
        const json = await res.json()
        setMetadata(json)
      } catch (err) {
        console.error('Metadata fetch error:', err)
        setMetaError(err.message || 'Failed to load metadata')
        setMetadata(null)
      } finally {
        setIsMetaLoading(false)
      }
    }

    fetchMetadata()
  }, [result?.metadataURI])

  const name = useMemo(() => {
    if (!metadata) return 'Unknown'
    const attrName = metadata.attributes?.find((a) => a.trait_type === 'Student Name')?.value
    return attrName || metadata.name || 'Unknown'
  }, [metadata])

  const institution = useMemo(() => {
    if (!metadata) return 'Unknown'
    const attrInstitution =
      metadata.attributes?.find((a) => ['Institution', 'University', 'School'].includes(a.trait_type))?.value
    return attrInstitution || metadata.name || 'Unknown'
  }, [metadata])

  const status = result
    ? result.exists
      ? 'Verified'
      : 'Not Found'
    : '—'

  const formatDiplomaId = (hash) => {
    if (!hash) return '—'
    if (hash.length <= 12) return hash
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`
  }

  return (
    <section className="space-y-10">
      <div>
        <p className="text-white/60 uppercase text-xs tracking-[0.5em]">NFT Diploma</p>
        <h1 className="text-4xl font-semibold mt-4">Blockchain Explorer</h1>
        <p className="text-white/60 mt-2">
        Search diploma based on the Diploma ID (hash of the uploaded file). The result is retrieved directly from the contract.
        </p>
      </div>

      <GlassCard className="p-6 space-y-6" reveal="instant">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            value={inputHash}
            onChange={(e) => setInputHash(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Masukkan Diploma ID (hash)"
            className="flex-1 rounded-2xl bg-white/5 border border-white/10 px-4 py-3 focus:outline-none focus:border-neon-blue"
          />
          <NeonButton className="w-full md:w-auto" onClick={handleSearch} disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </NeonButton>
        </div>

        {(error || metaError) && (
          <div className="text-red-300 text-sm bg-red-500/10 border border-red-500/30 rounded-2xl p-3">
            {error?.message || metaError}
          </div>
        )}

        {isLoading && <div className="text-white/70 text-sm">Mengambil data on-chain...</div>}

        {result && !isLoading && (
          <div className="overflow-x-auto rounded-2xl border border-white/10 mt-4">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-white/70">
                  <th className="px-6 py-4 font-semibold">Diploma ID</th>
                  <th className="px-6 py-4 font-semibold">Student Name</th>
                  <th className="px-6 py-4 font-semibold">Institution</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-white/85 border-t border-white/10">
                  <td className="px-6 py-4 font-mono text-xs">{formatDiplomaId(searchHash)}</td>
                  <td className="px-6 py-4">{isMetaLoading ? 'Loading metadata...' : name}</td>
                  <td className="px-6 py-4">{isMetaLoading ? 'Loading metadata...' : institution}</td>
                  <td className="px-6 py-4">
                    {result.exists ? (
                      <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-emerald-500/15 text-emerald-300 text-sm border border-emerald-500/30">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-yellow-500/15 text-yellow-300 text-sm border border-yellow-500/30">
                        <span className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
                        Not Found
                      </span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {!result && searchHash && !isLoading && !error && (
          <div className="text-white/60 text-sm">Tidak ada hasil untuk hash tersebut.</div>
        )}
      </GlassCard>
    </section>
  )
}

export default Explorer

