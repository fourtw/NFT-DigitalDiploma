import { useState, useCallback } from 'react'
import { hashFile } from '../utils/hashFile.js'

export const useFileHash = () => {
  const [file, setFile] = useState(null)
  const [hash, setHash] = useState('')
  const [isHashing, setIsHashing] = useState(false)
  const [error, setError] = useState(null)

  const generateHash = useCallback(
    async (selectedFile) => {
      if (!selectedFile) return
      try {
        setFile(selectedFile)
        setIsHashing(true)
        setError(null)
        const digest = await hashFile(selectedFile)
        setHash(digest)
      } catch (err) {
        console.error(err)
        setError('Unable to hash file')
      } finally {
        setIsHashing(false)
      }
    },
    [],
  )

  const clear = useCallback(() => {
    setFile(null)
    setHash('')
    setError(null)
  }, [])

  return {
    file,
    hash,
    error,
    isHashing,
    generateHash,
    clear,
  }
}

