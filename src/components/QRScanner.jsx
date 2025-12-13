import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { motion } from 'framer-motion'

/**
 * QR Scanner Component
 * Scans QR code from camera and returns the decoded text
 */
const QRScanner = ({ onScanSuccess, onError, className = '' }) => {
  const scannerRef = useRef(null)
  const html5QrCodeRef = useRef(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState(null)
  const [hasPermission, setHasPermission] = useState(null)

  const startScanning = async () => {
    try {
      setError(null)
      
      // Check if camera permission is available
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach(track => track.stop()) // Stop immediately, just checking permission
      setHasPermission(true)

      if (!scannerRef.current) return

      const html5QrCode = new Html5Qrcode(scannerRef.current.id)
      html5QrCodeRef.current = html5QrCode

      await html5QrCode.start(
        { facingMode: 'environment' }, // Use back camera on mobile
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          // Success callback
          if (onScanSuccess) {
            onScanSuccess(decodedText)
          }
        },
        (errorMessage) => {
          // Error callback (ignore, it's just scanning)
        }
      )

      setIsScanning(true)
    } catch (err) {
      console.error('Error starting scanner:', err)
      setError(err.message || 'Failed to start camera')
      setHasPermission(false)
      if (onError) {
        onError(err)
      }
    }
  }

  const stopScanning = async () => {
    try {
      if (html5QrCodeRef.current && isScanning) {
        await html5QrCodeRef.current.stop()
        html5QrCodeRef.current.clear()
        html5QrCodeRef.current = null
        setIsScanning(false)
      }
    } catch (err) {
      console.error('Error stopping scanner:', err)
    }
  }

  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [])

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        id="qr-scanner"
        ref={scannerRef}
        className="relative w-full max-w-md mx-auto rounded-2xl overflow-hidden bg-black/20 border border-white/10"
        style={{ aspectRatio: '1', minHeight: '300px' }}
      >
        {!isScanning && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4 p-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-white/10 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-neon-blue"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                  />
                </svg>
              </div>
              <p className="text-white/60 text-sm">Camera ready</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/20 border border-red-500/50 rounded-2xl p-4 text-red-300 text-sm text-center"
        >
          {error === 'Permission denied' || error.includes('permission')
            ? '⚠️ Camera permission denied. Please allow camera access to scan QR codes.'
            : `Error: ${error}`}
        </motion.div>
      )}

      {hasPermission === false && (
        <div className="text-center space-y-2">
          <p className="text-white/60 text-sm">
            Camera access is required to scan QR codes.
          </p>
          <p className="text-white/40 text-xs">
            Please enable camera permissions in your browser settings.
          </p>
        </div>
      )}

      <div className="flex gap-3 justify-center">
        {!isScanning ? (
          <button
            onClick={startScanning}
            className="px-6 py-3 rounded-2xl bg-neon-blue/20 border border-neon-blue/50 text-neon-blue font-medium hover:bg-neon-blue/30 transition-colors"
          >
            Start Scanning
          </button>
        ) : (
          <button
            onClick={stopScanning}
            className="px-6 py-3 rounded-2xl bg-red-500/20 border border-red-500/50 text-red-300 font-medium hover:bg-red-500/30 transition-colors"
          >
            Stop Scanning
          </button>
        )}
      </div>

      {isScanning && (
        <p className="text-center text-white/60 text-xs">
          Point your camera at the QR code
        </p>
      )}
    </div>
  )
}

export default QRScanner

