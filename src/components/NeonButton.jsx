import { motion } from 'framer-motion'

const variants = {
  primary: 'bg-gradient-to-r from-neon-blue to-neon-purple text-night-900 shadow-neon-soft',
  secondary: 'border border-white/30 text-white bg-white/5 hover:bg-white/10',
}

const NeonButton = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => (
  <motion.button
    whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(122,246,255,0.45)' }}
    whileTap={{ scale: 0.98 }}
    className={`px-6 py-3 rounded-full font-medium tracking-wide transition duration-200 ${variants[variant]} ${className}`}
    {...props}
  >
    {children}
  </motion.button>
)

export default NeonButton

