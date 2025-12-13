import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'
import { motion } from 'framer-motion'

/**
 * QR Generator Component
 * Generates QR code from verified hash and allows download
 */
const QRGenerator = ({ hash, tokenId, metadataURI, className = '' }) => {
  const [isDownloading, setIsDownloading] = useState(false)

  // Format QR data: include hash, tokenId, and verification URL
  const qrData = JSON.stringify({
    hash,
    tokenId: tokenId?.toString(),
    metadataURI,
    verified: true,
    timestamp: new Date().toISOString(),
  })

  const handleDownload = async () => {
    try {
      setIsDownloading(true)

      // Get the SVG element
      const svgElement = document.getElementById('qr-code-svg')
      if (!svgElement) return

      // Convert SVG to blob
      const svgData = new XMLSerializer().serializeToString(svgElement)
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(svgBlob)

      // Create canvas to convert SVG to PNG
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = 512
        canvas.height = 512
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#030617'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, 512, 512)

        // Download as PNG
        canvas.toBlob((blob) => {
          const downloadUrl = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = downloadUrl
          link.download = `diploma-qr-${hash.slice(2, 10)}.png`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(downloadUrl)
          setIsDownloading(false)
        }, 'image/png')
      }
      img.src = url
    } catch (err) {
      console.error('Error downloading QR code:', err)
      setIsDownloading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`space-y-4 ${className}`}
    >
      <div className="bg-white/5 rounded-2xl border border-white/10 p-6 flex flex-col items-center space-y-4">
        <div className="bg-white rounded-2xl p-4">
          <QRCodeSVG
            id="qr-code-svg"
            value={qrData}
            size={256}
            level="H"
            includeMargin={true}
            fgColor="#030617"
            bgColor="#ffffff"
          />
        </div>

        <div className="text-center space-y-2">
          <p className="text-white/60 text-xs uppercase tracking-[0.3em]">
            Verified Diploma QR Code
          </p>
          <p className="text-white/40 text-xs font-mono break-all">
            {hash.slice(0, 10)}...{hash.slice(-8)}
          </p>
        </div>

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="px-6 py-3 rounded-2xl bg-neon-blue/20 border border-neon-blue/50 text-neon-blue font-medium hover:bg-neon-blue/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isDownloading ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Downloading...
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download QR Code
            </>
          )}
        </button>
      </div>

      <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
        <p className="text-white/60 text-xs mb-2">QR Code contains:</p>
        <ul className="text-white/40 text-xs space-y-1 list-disc list-inside">
          <li>SHA-256 Hash</li>
          <li>Token ID</li>
          <li>Metadata URI</li>
          <li>Verification timestamp</li>
        </ul>
      </div>
    </motion.div>
  )
}

export default QRGenerator

