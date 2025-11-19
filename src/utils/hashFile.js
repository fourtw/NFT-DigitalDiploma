const toHex = (buffer) =>
  [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

export const hashFile = async (file) => {
  if (!file) return ''
  const arrayBuffer = await file.arrayBuffer()
  const digest = await crypto.subtle.digest('SHA-256', arrayBuffer)
  return toHex(digest)
}

