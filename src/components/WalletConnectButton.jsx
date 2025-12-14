import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion } from 'framer-motion'

const WalletConnectButton = ({ className = '' }) => (
  <ConnectButton.Custom>
    {({
      account,
      chain,
      openAccountModal,
      openConnectModal,
      mounted,
    }) => {
      const connected = mounted && account && chain
      const wrongNetwork = connected && chain.unsupported

      const label = wrongNetwork
        ? 'Switch to Polygon Amoy'
        : connected
          ? `${account.displayName} · ${chain.name}`
          : 'Connect Wallet'

      const handleClick = () => {
        if (!connected) openConnectModal()
        else openAccountModal()
      }

      return (
        <motion.button
          layout
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleClick}
          className={`rounded-full px-5 py-2.5 text-sm font-medium border border-white/20 bg-white/5 shadow-neon ${className}`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex h-2.5 w-2.5 rounded-full ${
                connected ? 'bg-neon-blue shadow-neon' : 'bg-gray-400'
              }`}
            />
            <span className="text-white whitespace-nowrap">{label}</span>
          </div>
        </motion.button>
      )
    }}
  </ConnectButton.Custom>
)

export default WalletConnectButton

