import { motion } from 'framer-motion'

const GlassCard = ({
  children,
  className = '',
  delay = 0,
  reveal = 'scroll', // 'scroll' | 'instant'
}) => {
  const motionProps =
    reveal === 'instant'
      ? {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
        }
      : {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.2 },
        }

  return (
    <motion.div
      {...motionProps}
      transition={{ duration: 0.6, delay }}
      className={`glass-panel relative overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-30 pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

export default GlassCard

