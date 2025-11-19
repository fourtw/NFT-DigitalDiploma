import GlassCard from '../components/GlassCard.jsx'
import { Link } from 'react-router-dom'
import NeonButton from '../components/NeonButton.jsx'

const universities = [
  {
    name: 'University of Blockchain',
    slug: 'university-of-blockchain',
    programs: 'Computer Science, Cryptography',
    status: 'Verified',
  },
  {
    name: 'Decentralized University',
    slug: 'decentralized-university',
    programs: 'DeFi, Token Engineering',
    status: 'Verified',
  },
  {
    name: 'Institute of Crypto Studies',
    slug: 'institute-of-crypto-studies',
    programs: 'Distributed Systems, Governance',
    status: 'Pending',
  },
]

const Universities = () => (
  <section className="space-y-10">
    <div>
      <p className="text-white/60 uppercase text-xs tracking-[0.5em]">Partners</p>
      <h1 className="text-4xl font-semibold mt-4">University network</h1>
      <p className="text-white/60 mt-2">
        Institutions issuing diplomas through Project Vault with Polygon Mumbai.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      {universities.map((uni, idx) => (
        <GlassCard key={uni.slug} className="p-6 space-y-4" delay={idx * 0.08}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-semibold">{uni.name}</p>
              <p className="text-white/50 text-sm">{uni.programs}</p>
            </div>
            <span className="text-xs uppercase tracking-[0.3em] text-white/60">
              {uni.status}
            </span>
          </div>
          <Link to={`/universities/${uni.slug}`}>
            <NeonButton variant="secondary" className="w-full">
              View Details
            </NeonButton>
          </Link>
        </GlassCard>
      ))}
    </div>
  </section>
)

export default Universities

