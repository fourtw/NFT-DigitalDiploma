import { useMemo } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import GlassCard from '../components/GlassCard.jsx'
import NeonButton from '../components/NeonButton.jsx'

const registry = {
  'university-of-blockchain': {
    name: 'University of Blockchain',
    overview:
      'Pioneering smart-contract education with dedicated labs for zero-knowledge proofs and decentralized identity.',
    stats: { issued: 230, pending: 4, wallet: '0xFA92...D0C1' },
  },
  'decentralized-university': {
    name: 'Decentralized University',
    overview:
      'Focuses on token engineering, DAO governance, and enterprise NFT credentialing across three continents.',
    stats: { issued: 182, pending: 9, wallet: '0x8B42...AA21' },
  },
  'institute-of-crypto-studies': {
    name: 'Institute of Crypto Studies',
    overview:
      'Elite graduate school for distributed systems security, specializing in verifiable computing research.',
    stats: { issued: 87, pending: 12, wallet: '0x91AA...9920' },
  },
}

const UniversityDetail = () => {
  const { slug } = useParams()

  const data = useMemo(() => registry[slug], [slug])

  if (!data) return <Navigate to="/universities" replace />

  return (
    <section className="space-y-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-white/60 uppercase text-xs tracking-[0.5em]">University</p>
          <h1 className="text-4xl font-semibold mt-4">{data.name}</h1>
          <p className="text-white/60 mt-2 max-w-2xl">{data.overview}</p>
        </div>
        <Link to="/universities">
          <NeonButton variant="secondary">Back</NeonButton>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {Object.entries(data.stats).map(([label, value]) => (
          <GlassCard key={label} className="p-6">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">{label}</p>
            <p className="text-3xl font-semibold mt-4">{value}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  )
}

export default UniversityDetail

