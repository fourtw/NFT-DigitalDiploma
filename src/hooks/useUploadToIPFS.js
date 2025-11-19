import { useState, useCallback } from 'react'
import { uploadJSONToIPFS } from '../utils/ipfs.js'

export const useUploadToIPFS = () => {
  const [cid, setCid] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)

  const uploadMetadata = useCallback(async (payload) => {
    try {
      setIsUploading(true)
      setError(null)
      const response = await uploadJSONToIPFS(payload)
      setCid(response.cid)
      return response
    } catch (err) {
      console.error(err)
      setError('Unable to upload to IPFS right now.')
      return null
    } finally {
      setIsUploading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setCid('')
    setError(null)
    setIsUploading(false)
  }, [])

  return {
    cid,
    isUploading,
    error,
    uploadMetadata,
    reset,
  }
}

