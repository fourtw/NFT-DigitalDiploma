import GlassCard from '../components/GlassCard.jsx'
import NeonButton from '../components/NeonButton.jsx'

const explorerRows = [
  { id: '0x3D79...2AFB', name: 'Jane Doe', institution: 'University of Blockchain', status: 'Verified' },
  { id: '0x9F2E...B31C', name: 'John Smith', institution: 'Decentralized University', status: 'Verified' },
  { id: '0x31CA...5D4A', name: 'Alice Johnson', institution: 'Institute of Crypto Studies', status: 'Verified' },
  { id: '0x7C5B...4E9F', name: 'Bob Brown', institution: 'Blockchain Academy', status: 'Verified' },
]

const Explorer = () => (
  <section className="space-y-10">
    <div>
      <p className="text-white/60 uppercase text-xs tracking-[0.5em]">NFT Diploma</p>
      <h1 className="text-4xl font-semibold mt-4">Blockchain Explorer</h1>
      <p className="text-white/60 mt-2">
        Browse and verify digital diplomas issued as NFTs.
      </p>
    </div>

    <GlassCard className="p-6 space-y-6" reveal="instant">
      <div className="flex flex-col md:flex-row gap-4">
        <input
          placeholder="Search by Diploma ID"
          className="flex-1 rounded-2xl bg-white/5 border border-white/10 px-4 py-3 focus:outline-none focus:border-neon-blue"
        />
        <NeonButton className="w-full md:w-auto">Search</NeonButton>
      </div>
      <div className="overflow-x-auto rounded-3xl border border-white/5">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-white/50 uppercase text-xs tracking-[0.3em]">
              <th className="px-6 py-3">Diploma ID</th>
              <th className="px-6 py-3">Student Name</th>
              <th className="px-6 py-3">Institution</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {explorerRows.map((row) => (
              <tr key={row.id} className="border-t border-white/5 text-white/80">
                <td className="px-6 py-4 font-mono text-xs">{row.id}</td>
                <td className="px-6 py-4">{row.name}</td>
                <td className="px-6 py-4">{row.institution}</td>
                <td className="px-6 py-4 text-emerald-300 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-300" />
                  {row.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  </section>
)

export default Explorer

