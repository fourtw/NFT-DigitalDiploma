import { motion } from 'framer-motion'
import NeonButton from '../components/NeonButton.jsx'
import GlassCard from '../components/GlassCard.jsx'
import { Link } from 'react-router-dom'

const stats = [
  { label: 'Diplomas Issued', value: '42', sub: 'On-chain records' },
  { label: 'Universities', value: '128', sub: 'Verified partners' },
  { label: 'Verifications', value: '8.2K', sub: 'Monthly checks' },
]

const pillars = [
  {
    title: 'Issuance',
    copy: 'Mint tamper-proof diplomas tied to the university wallet.',
  },
  {
    title: 'Ownership',
    copy: 'Graduates hold their credentials as transferable NFTs.',
  },
  {
    title: 'Verification',
    copy: 'Employers verify instantly through blockchain proofs.',
  },
]

const LandingPage = () => (
  <section className="space-y-16">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm uppercase tracking-[0.5em] text-white/55 mb-4">
            NFT Diploma
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight">
            Reinventing Academic Credentials with Blockchain
          </h1>
        </motion.div>
        <p className="text-lg text-white/70 max-w-xl">
          A futuristic issuance and verification portal built for Polygon Amoy. Project
          Vault transforms every diploma into a verifiable asset secured by wagmi +
          RainbowKit.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link to="/verify">
            <NeonButton>Verify Diploma</NeonButton>
          </Link>
          <Link to="/explorer">
            <NeonButton variant="secondary">Explore Blockchain</NeonButton>
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, idx) => (
            <GlassCard key={stat.label} delay={idx * 0.05} className="p-4">
              <p className="text-3xl font-semibold text-gradient">{stat.value}</p>
              <p className="text-sm uppercase tracking-wide text-white/60">{stat.label}</p>
              <p className="text-xs text-white/40">{stat.sub}</p>
            </GlassCard>
          ))}
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        <div className="glass-panel rounded-[32px] p-10 space-y-8 neon-ring">
          <div className="h-40 bg-gradient-to-br from-neon-blue/40 to-neon-purple/40 rounded-3xl flex items-center justify-center border border-white/10">
            <div className="flex flex-col items-center">
              <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
                <circle cx="34" cy="34" r="30" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                <path d="M20 36L34 18L48 36" stroke="#7af6ff" strokeWidth="3" strokeLinecap="round" />
                <path d="M34 18V50" stroke="#a07bff" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <p className="mt-4 text-sm text-white/60 uppercase tracking-[0.5em]">
                On-chain
              </p>
            </div>
          </div>
          <div className="space-y-3 text-sm text-white/70">
            <p>
              Metadata is pinned to IPFS + Arweave while minting through the university
              issuer wallet secured by RainbowKit connectors.
            </p>
            <p>ID collisions prevented with live SHA-256 hashing and proof-of-mint logs.</p>
          </div>
        </div>
      </motion.div>
    </div>

    <div id="about" className="space-y-6 scroll-mt-32">
      <GlassCard className="p-10 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <p className="text-white/60 uppercase text-xs tracking-[0.5em]">What is NFT Diploma?</p>
            <h2 className="text-3xl font-semibold mt-2">Project Vault explained</h2>
            <p className="text-white/60 mt-4 max-w-2xl">
              A fully responsive, glassy dashboard that mirrors your original Project Vault
              UI. Every card, spacing, and neon glow is recreated with Tailwind + Framer
              Motion.
            </p>
          </div>
          <NeonButton variant="secondary" className="w-full sm:w-auto">
            Learn More
          </NeonButton>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="bg-white/5 rounded-3xl p-6 border border-white/5">
              <p className="text-white font-semibold text-lg mb-2">{pillar.title}</p>
              <p className="text-white/70 text-sm">{pillar.copy}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  </section>
)

export default LandingPage

