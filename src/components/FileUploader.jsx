import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import NeonButton from './NeonButton.jsx'
import { useFileHash } from '../hooks/useFileHash.js'

const FileUploader = ({ onHashGenerated }) => {
  const inputRef = useRef(null)
  const { file, hash, isHashing, generateHash, error, clear } = useFileHash()

  useEffect(() => {
    if (hash && onHashGenerated) {
      onHashGenerated({ file, hash })
    }
  }, [file, hash, onHashGenerated])

  const handleFile = (selected) => {
    if (selected) {
      generateHash(selected)
    }
  }

  const handleChange = (event) => {
    const selected = event.target.files?.[0]
    handleFile(selected)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const selected = event.dataTransfer.files?.[0]
    handleFile(selected)
  }

  const handleDrag = (event) => {
    event.preventDefault()
  }

  return (
    <div className="space-y-6">
      <motion.div
        onDrop={handleDrop}
        onDragOver={handleDrag}
        className="glass-panel rounded-card border border-dashed border-white/15 p-8 text-center"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-neon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 5v14M5 12h14"
                stroke="#7af6ff"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <p className="text-lg font-semibold">Drop diploma files here</p>
            <p className="text-white/60 text-sm">
              Supported formats: PDF, PNG, JPG. Max 25MB.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 justify-center">
            <NeonButton onClick={() => inputRef.current?.click()}>Browse files</NeonButton>
            {file && (
              <button onClick={clear} className="text-sm text-white/60 underline">
                Reset
              </button>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleChange}
            hidden
          />
        </div>
      </motion.div>

      {file && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-card p-6 space-y-4"
        >
          <div className="flex justify-between text-sm">
            <span className="text-white/60">File</span>
            <span className="font-medium">{file.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Size</span>
            <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
          </div>
          <div>
            <p className="text-white/60 text-sm mb-2">SHA-256 Hash</p>
            <div className="font-mono text-xs sm:text-sm break-all text-neon-blue bg-white/5 rounded-xl p-4 border border-white/10">
              {isHashing ? 'Calculating...' : hash}
            </div>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </motion.div>
      )}
    </div>
  )
}

export default FileUploader

