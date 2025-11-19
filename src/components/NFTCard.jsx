import { motion } from 'framer-motion'
import GlassCard from './GlassCard.jsx'

const statusStyles = {
  verified: 'text-emerald-300',
  pending: 'text-yellow-300',
  revoked: 'text-red-300',
}

const NFTCard = ({ diploma, index }) => (
  <GlassCard className="p-4 sm:p-6" delay={index * 0.08}>
    <motion.div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/60">Token ID</p>
          <p className="font-mono text-sm">{diploma.tokenId}</p>
        </div>
        <span className={`text-xs uppercase tracking-[0.3em] ${statusStyles[diploma.status]}`}>
          {diploma.status}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-white/50">Name</p>
          <p className="font-semibold">{diploma.name}</p>
        </div>
        <div>
          <p className="text-white/50">Program</p>
          <p>{diploma.program}</p>
        </div>
        <div>
          <p className="text-white/50">Year</p>
          <p>{diploma.year}</p>
        </div>
        <div>
          <p className="text-white/50">Status</p>
          <p className="capitalize">{diploma.status}</p>
        </div>
      </div>
    </motion.div>
  </GlassCard>
)

export default NFTCard

