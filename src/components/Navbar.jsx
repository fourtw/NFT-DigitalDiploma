import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import WalletConnectButton from './WalletConnectButton.jsx'

const navItems = [
  { label: 'About Us', path: '/', hash: 'about' },
  { label: 'Blockchain Explorer', path: '/explorer' },
  { label: 'Verification', path: '/verify' },
  { label: 'University', path: '/universities' },
  { label: 'Upload', path: '/upload' },
]

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleNavigate = (item) => {
    setOpen(false)
    if (item.hash) {
      navigate(item.path)
      setTimeout(() => {
        document.getElementById(item.hash)?.scrollIntoView({ behavior: 'smooth' })
      }, 200)
    } else {
      navigate(item.path)
    }
  }

  return (
    <header className="py-6 sticky top-4 z-50">
      <div className="glass-panel flex items-center justify-between px-4 sm:px-8 py-4 rounded-card relative overflow-hidden">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-neon-blue/70 to-neon-purple/70 flex items-center justify-center shadow-neon ring-1 ring-white/30">
            <span className="text-xl font-semibold text-night-900">N</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">
              NFT Diploma
            </p>
            <p className="text-lg font-semibold text-white">Project Vault</p>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-white/70">
          {navItems.map((item) =>
            item.hash ? (
              <button
                key={item.label}
                onClick={() => handleNavigate(item)}
                className="hover:text-neon-blue transition tracking-wide"
              >
                {item.label}
              </button>
            ) : (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `hover:text-neon-blue transition tracking-wide ${
                    isActive ? 'text-white' : ''
                  }`
                }
              >
                {item.label}
              </NavLink>
            ),
          )}
        </nav>
        <div className="hidden md:block">
          <WalletConnectButton />
        </div>
        <button
          className="md:hidden border border-white/20 rounded-full p-2 text-white/70"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="sr-only">Toggle Menu</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 6H20M4 12H20M4 18H20"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden mt-3 glass-panel p-4 flex flex-col gap-4 rounded-3xl"
          >
            {navItems.map((item) =>
              item.hash ? (
                <button
                  key={item.label}
                  onClick={() => handleNavigate(item)}
                  className="text-left text-sm text-white/80 hover:text-white"
                >
                  {item.label}
                </button>
              ) : (
                <NavLink
                  key={item.label}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className="text-sm text-white/80 hover:text-white"
                >
                  {item.label}
                </NavLink>
              ),
            )}
            <WalletConnectButton />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar

