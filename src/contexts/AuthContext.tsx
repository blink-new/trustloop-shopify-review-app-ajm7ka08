import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { blink } from '../blink/client'
import { shopifyService, ShopifyStore } from '../services/shopifyService'

interface AuthContextType {
  user: any | null
  shop: ShopifyStore | null
  isLoading: boolean
  isAuthenticated: boolean
  login: () => void
  logout: () => void
  connectShop: (shopDomain: string) => Promise<void>
  disconnectShop: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null)
  const [shop, setShop] = useState<ShopifyStore | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const initializeAuth = useCallback(async () => {
    try {
      setIsLoading(true)
      
      // Check if user is authenticated with Blink
      const unsubscribe = blink.auth.onAuthStateChanged(async (state) => {
        setUser(state.user)
        setIsAuthenticated(state.isAuthenticated)
        
        if (state.user) {
          // Check if user has connected a Shopify shop
          await checkShopConnection(state.user.id)
        } else {
          setShop(null)
        }
        
        setIsLoading(state.isLoading)
      })

      return unsubscribe
    } catch (error) {
      console.error('Auth initialization error:', error)
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  const checkShopConnection = async (userId: string) => {
    try {
      // Check if user has connected a Shopify shop
      const shops = await blink.db.shops.list({
        where: { userId },
        limit: 1
      })
      
      if (shops.length > 0) {
        setShop(shops[0])
      } else {
        setShop(null)
      }
    } catch (error) {
      console.warn('Database not available, showing initialization screen:', error)
      // If database doesn't exist, that's fine - user just needs to complete onboarding
      setShop(null)
    }
  }

  const login = () => {
    // Blink handles authentication automatically
    blink.auth.login()
  }

  const logout = () => {
    blink.auth.logout()
    setShop(null)
  }

  const connectShop = async (shopDomain: string) => {
    try {
      setIsLoading(true)
      
      // For development, we'll simulate the connection
      // In a real app, this would initiate the OAuth flow
      const mockCode = 'mock_oauth_code'
      const accessToken = await shopifyService.authenticateShop(shopDomain, mockCode)
      
      // Refresh shop connection
      if (user) {
        await checkShopConnection(user.id)
      }
      
      console.log('Shop connected successfully with token:', accessToken)
    } catch (error) {
      console.error('Error connecting shop:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectShop = async () => {
    try {
      if (shop && user) {
        await blink.db.shops.delete(shop.id)
        setShop(null)
      }
    } catch (error) {
      console.error('Error disconnecting shop:', error)
    }
  }

  const value: AuthContextType = {
    user,
    shop,
    isLoading,
    isAuthenticated,
    login,
    logout,
    connectShop,
    disconnectShop
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider