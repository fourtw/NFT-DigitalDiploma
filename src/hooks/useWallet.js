import { useCallback } from 'react'
import {
  useAccount,
  useConnect,
  useDisconnect,
  useChainId,
  useSwitchChain,
} from 'wagmi'
import { polygonAmoy, localhost } from 'wagmi/chains'

const isLocalhost = import.meta.env.VITE_USE_LOCALHOST === 'true'
const targetChain = isLocalhost ? localhost : polygonAmoy

export const useWallet = () => {
  const { address, status, isConnected } = useAccount()
  const chainId = useChainId()
  const { connectors, connect, connectAsync, error, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain, switchChainAsync, isPending: isSwitching } = useSwitchChain()

  const requestConnect = useCallback(async () => {
    if (isConnected || connectors.length === 0) return
    const fn = connectAsync ?? connect
    if (fn) {
      await fn({ connector: connectors[0] })
    }
  }, [connect, connectAsync, connectors, isConnected])

  const ensurePolygon = useCallback(async () => {
    // Skip switch jika sudah di chain yang benar atau di localhost (auto connect)
    if (!isConnected || chainId === targetChain.id) return
    
    // Localhost tidak perlu switch (wallet auto connect)
    if (isLocalhost) return
    
    try {
      const fn = switchChainAsync ?? switchChain
      if (fn) {
        await fn({ chainId: targetChain.id })
      }
    } catch (switchError) {
      console.warn('Failed to switch network', switchError)
    }
  }, [chainId, isConnected, switchChainAsync, switchChain])

  return {
    address,
    status,
    error,
    chainId,
    isConnected,
    isBusy: isPending || isSwitching,
    requestConnect,
    disconnect,
    ensurePolygon,
  }
}

