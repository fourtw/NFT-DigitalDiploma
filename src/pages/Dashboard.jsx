import GlassCard from '../components/GlassCard.jsx'
import NFTCard from '../components/NFTCard.jsx'

const stats = [
  { label: 'Total issued', value: 42 },
  { label: 'Pending', value: 7 },
  { label: 'Rejected', value: 0 },
  { label: 'Smart Contract', value: '0xCONTRACT...ABCD' },
]

const recent = [
  { tokenId: '0x3D79...2AFB', name: 'Jane Doe', program: 'Computer Science', year: '2023', status: 'verified' },
  { tokenId: '0x9F2E...B31C', name: 'John Smith', program: 'Decentralized Engineering', year: '2024', status: 'pending' },
  { tokenId: '0x31CA...5D4A', name: 'Alice Johnson', program: 'Institute of Crypto Studies', year: '2023', status: 'verified' },
  { tokenId: '0x7C5B...4E9F', name: 'Bob Brown', program: 'Blockchain Academy', year: '2022', status: 'verified' },
]

const Dashboard = () => (
  <section className="space-y-10">
    <div>
      <p className="text-white/60 uppercase text-xs tracking-[0.5em]">University Portal</p>
      <h1 className="text-4xl font-semibold mt-4">Live issuance telemetry</h1>
      <p className="text-white/60 mt-2">
        Monitor issuance velocity, pending requests, and contract health on Polygon Amoy.
      </p>
    </div>

    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <GlassCard key={stat.label} className="p-6" delay={idx * 0.05}>
          <p className="text-sm text-white/50 uppercase tracking-[0.3em]">{stat.label}</p>
          <p className="text-3xl font-semibold mt-4">{stat.value}</p>
        </GlassCard>
      ))}
    </div>

    <div className="grid lg:grid-cols-2 gap-6">
      {recent.map((diploma, idx) => (
        <NFTCard key={diploma.tokenId} diploma={diploma} index={idx} />
      ))}
    </div>
  </section>
)

export default Dashboard

