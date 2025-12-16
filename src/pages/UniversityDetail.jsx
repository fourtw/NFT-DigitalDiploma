import { useMemo } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import GlassCard from '../components/GlassCard.jsx'
import NeonButton from '../components/NeonButton.jsx'

const registry = {
  'university-of-blockchain': {
    name: 'University of Blockchain',
    overview:
      'Pioneering smart-contract education with dedicated labs for zero-knowledge proofs and decentralized identity.',
  },
  'decentralized-university': {
    name: 'Decentralized University',
    overview:
      'Focuses on token engineering, DAO governance, and enterprise NFT credentialing across three continents.',
  },
  'institute-of-crypto-studies': {
    name: 'Institute of Crypto Studies',
    overview:
      'Elite graduate school for distributed systems security, specializing in verifiable computing research.',
  },
}

const UniversityDetail = () => {
  const { slug } = useParams()

  const data = useMemo(() => registry[slug], [slug])

  if (!data) return <Navigate to="/universities" replace />

  return (
    <section className="space-y-10 pt-6">
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

    </section>
  )
}

export default UniversityDetail

