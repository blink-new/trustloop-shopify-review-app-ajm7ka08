import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { SidebarProvider } from '@/components/ui/sidebar'
import AuthProvider, { useAuth } from '@/contexts/AuthContext'
import AppLayout from '@/components/layout/AppLayout'
import LoginPage from '@/components/auth/LoginPage'
import ShopifyOnboarding from '@/components/onboarding/ShopifyOnboarding'
import DatabaseInitializer from '@/components/admin/DatabaseInitializer'
import Dashboard from '@/pages/Dashboard'
import Reviews from '@/pages/Reviews'
import Widgets from '@/pages/Widgets'
import Campaigns from '@/pages/Campaigns'
import InstagramUGC from '@/pages/InstagramUGC'
import EmailTemplates from '@/pages/EmailTemplates'
import Settings from '@/pages/Settings'
import ShopifyGuide from '@/pages/ShopifyGuide'
import './App.css'

function AppContent() {
  const { isAuthenticated, isLoading, shop } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading TrustLoop...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return <LoginPage />
  }

  // If authenticated but no shop connected, show database initializer first
  if (!shop) {
    return <DatabaseInitializer />
  }

  // Main app with shop connected
  return (
    <Router>
      <SidebarProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/instagram-ugc" element={<InstagramUGC />} />
            <Route path="/widgets" element={<Widgets />} />
            <Route path="/email-templates" element={<EmailTemplates />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/shopify-guide" element={<ShopifyGuide />} />
          </Routes>
        </AppLayout>
        <Toaster />
      </SidebarProvider>
    </Router>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App