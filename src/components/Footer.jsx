const footerLinks = ['About', 'Terms', 'Contact']

const Footer = () => (
  <footer className="py-12 relative">
    <div className="glass-panel px-8 py-6 rounded-card flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        <p className="text-white/70 text-sm">© {new Date().getFullYear()} Project Vault</p>
        <p className="text-white font-semibold text-lg">NFT Diploma</p>
      </div>
      <div className="flex items-center gap-6 text-sm text-white/60">
        {footerLinks.map((link) => (
          <button key={link} className="hover:text-white transition">{link}</button>
        ))}
      </div>
    </div>
  </footer>
)

export default Footer

