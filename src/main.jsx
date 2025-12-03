import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import {
  RainbowKitProvider,
  getDefaultConfig,
  midnightTheme,
} from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { polygonMumbai, localhost } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.jsx'
import './styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'

const queryClient = new QueryClient()

// Support localhost untuk development
const isLocalhost = import.meta.env.VITE_USE_LOCALHOST === 'true'
const chains = isLocalhost ? [localhost] : [polygonMumbai]

const walletConnectId =
  import.meta.env.VITE_WALLETCONNECT_ID && import.meta.env.VITE_WALLETCONNECT_ID.trim().length > 0
    ? import.meta.env.VITE_WALLETCONNECT_ID.trim()
    : 'demo'

const wagmiConfig = getDefaultConfig({
  appName: 'Project Vault',
  projectId: walletConnectId,
  chains,
  ssr: false,
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={midnightTheme({
            accentColor: '#7af6ff',
            accentColorForeground: '#030617',
            borderRadius: 'large',
          })}
        >
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)

