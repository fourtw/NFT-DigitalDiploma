const delay = (ms = 1500) => new Promise((resolve) => setTimeout(resolve, ms))

export const persistToArweave = async (payload) => {
  await delay()
  return {
    tx: `0x${crypto.randomUUID().replace(/-/g, '').slice(0, 64)}`,
    payload,
    network: 'arweave-testnet',
  }
}

