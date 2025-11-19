import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import LandingPage from './pages/LandingPage.jsx'
import UploadPage from './pages/UploadPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import VerifyPage from './pages/VerifyPage.jsx'
import Explorer from './pages/Explorer.jsx'
import Universities from './pages/Universities.jsx'
import UniversityDetail from './pages/UniversityDetail.jsx'
import { useWallet } from './hooks/useWallet.js'

const AppShell = ({ children }) => (
  <div className="min-h-screen bg-transparent text-white relative overflow-hidden">
    <div className="pointer-events-none absolute inset-0 opacity-40">
      <div className="absolute inset-0 grid-glow" />
      <div className="absolute -top-32 -right-32 w-[480px] h-[480px] bg-neon-purple/20 blur-[120px]" />
      <div className="absolute -bottom-32 -left-32 w-[520px] h-[520px] bg-neon-blue/20 blur-[130px]" />
    </div>
    <div className="relative z-10 flex flex-col min-h-screen px-4 sm:px-8">
      <Navbar />
      <main className="flex-1 w-full max-w-6xl mx-auto py-12 pt-24 space-y-16">
        {children}
      </main>
      <Footer />
    </div>
  </div>
)

const ProtectedRoute = ({ children }) => {
  const { isConnected, ensurePolygon } = useWallet()

  useEffect(() => {
    if (isConnected) {
      ensurePolygon()
    }
  }, [isConnected, ensurePolygon])

  if (!isConnected) {
    return <Navigate to="/" replace />
  }

  return children
}

const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  return null
}

const App = () => {
  return (
    <AppShell>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/explorer" element={<Explorer />} />
        <Route path="/universities" element={<Universities />} />
        <Route path="/universities/:slug" element={<UniversityDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}

export default App

