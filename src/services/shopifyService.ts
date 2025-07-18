import { blink } from '../blink/client'

export interface ShopifyStore {
  id: string
  shopDomain: string
  accessToken: string
  shopName: string
  shopEmail: string
  shopOwner: string
  currency: string
  timezone: string
  createdAt: string
  updatedAt: string
  connectionType?: 'oauth' | 'private' | 'demo';
}

export interface ShopifyProduct {
  id: string
  title: string
  handle: string
  vendor: string
  productType: string
  createdAt: string
  updatedAt: string
  images: ShopifyImage[]
  variants: ShopifyVariant[]
}

export interface ShopifyImage {
  id: string
  productId: string
  src: string
  alt: string
  width: number
  height: number
}

export interface ShopifyVariant {
  id: string
  productId: string
  title: string
  price: string
  sku: string
  inventoryQuantity: number
}

export interface ShopifyOrder {
  id: string
  orderNumber: string
  customer: {
    id: string
    email: string
    firstName: string
    lastName: string
  }
  lineItems: Array<{
    id: string
    productId: string
    variantId: string
    title: string
    quantity: number
    price: string
  }>
  createdAt: string
  fulfillmentStatus: string
}

class ShopifyService {
  private baseUrl = 'https://admin.shopify.com/admin/api/2024-04'
  
  async authenticateShop(shop: string, code: string): Promise<string> {
    try {
      // In a real app, this would exchange the code for an access token
      // For now, we'll simulate this with a mock token
      const accessToken = `shpat_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
      
      // Verify the shop exists and get basic info
      const shopInfo = await this.getShopInfo(shop, accessToken)
      
      // Store the shop in our database
      await this.storeShopInfo(shop, accessToken, shopInfo)
      
      return accessToken
    } catch (error) {
      console.error('Failed to authenticate with Shopify:', error)
      throw new Error('Failed to authenticate with Shopify')
    }
  }

  async getShopInfo(shop: string, accessToken: string): Promise<any> {
    // In a real app, this would make an API call to Shopify
    // For now, we'll return mock data
    return {
      id: `shop_${Date.now()}`,
      name: shop.split('.')[0].replace(/-/g, ' '),
      email: `owner@${shop}`,
      domain: shop,
      owner: 'Shop Owner',
      currency: 'USD',
      timezone: 'America/New_York'
    }
  }

  async storeShopInfo(shop: string, accessToken: string, shopInfo: any): Promise<void> {
    try {
      const user = await blink.auth.me()
      if (!user) throw new Error('User not authenticated')

      // Check if shop already exists
      const existingShops = await blink.db.shops.list({
        where: { 
          AND: [
            { shopDomain: shop },
            { userId: user.id }
          ]
        }
      })

      const now = new Date().toISOString()

      if (existingShops.length > 0) {
        // Update existing shop
        await blink.db.shops.update(existingShops[0].id, {
          accessToken,
          shopName: shopInfo.name,
          shopEmail: shopInfo.email,
          shopOwner: shopInfo.owner,
          currency: shopInfo.currency,
          timezone: shopInfo.timezone,
          updatedAt: now
        })
      } else {
        // Create new shop
        await blink.db.shops.create({
          id: shopInfo.id,
          userId: user.id,
          shopDomain: shop,
          accessToken,
          shopName: shopInfo.name,
          shopEmail: shopInfo.email,
          shopOwner: shopInfo.owner,
          currency: shopInfo.currency,
          timezone: shopInfo.timezone,
          createdAt: now,
          updatedAt: now
        })
      }
    } catch (error) {
      console.error('Failed to store shop info:', error)
      throw error
    }
  }

  async getShopByDomain(domain: string): Promise<ShopifyStore | null> {
    try {
      const user = await blink.auth.me()
      if (!user) return null

      const shops = await blink.db.shops.list({
        where: { 
          AND: [
            { shopDomain: domain },
            { userId: user.id }
          ]
        }
      })
      
      return shops.length > 0 ? shops[0] : null
    } catch (error) {
      console.error('Failed to get shop by domain:', error)
      return null
    }
  }

  async getProducts(shop: string, accessToken: string): Promise<ShopifyProduct[]> {
    try {
      // In a real app, this would make an API call to Shopify
      // For now, we'll return empty array since we don't have real products
      return []
    } catch (error) {
      console.error('Failed to get products:', error)
      return []
    }
  }

  async getOrders(shop: string, accessToken: string): Promise<ShopifyOrder[]> {
    try {
      // In a real app, this would make an API call to Shopify
      // For now, we'll return empty array since we don't have real orders
      return []
    } catch (error) {
      console.error('Failed to get orders:', error)
      return []
    }
  }

  async installApp(shop: string): Promise<string> {
    // Generate OAuth URL for Shopify app installation
    const clientId = process.env.SHOPIFY_CLIENT_ID || 'your-shopify-app-client-id'
    const redirectUri = `${window.location.origin}/auth/callback`
    const scopes = 'read_products,read_orders,read_customers,write_script_tags'
    const state = btoa(Math.random().toString(36).substring(2, 15))
    
    const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}&state=${state}`
    
    return authUrl
  }

  async verifyWebhook(data: any, signature: string): Promise<boolean> {
    // In a real app, this would verify the webhook signature
    // For now, we'll just return true for development
    return true
  }

  async handleWebhook(topic: string, data: any): Promise<void> {
    switch (topic) {
      case 'app/uninstalled':
        await this.handleAppUninstalled(data)
        break
      case 'orders/create':
        await this.handleOrderCreated(data)
        break
      case 'orders/fulfilled':
        await this.handleOrderFulfilled(data)
        break
      default:
        console.log(`Unhandled webhook topic: ${topic}`)
    }
  }

  private async handleAppUninstalled(data: any): Promise<void> {
    // Remove shop from database when app is uninstalled
    try {
      const user = await blink.auth.me()
      if (!user) return

      const shops = await blink.db.shops.list({
        where: { 
          AND: [
            { shopDomain: data.domain },
            { userId: user.id }
          ]
        }
      })
      
      if (shops.length > 0) {
        await blink.db.shops.delete(shops[0].id)
      }
    } catch (error) {
      console.error('Failed to handle app uninstalled:', error)
    }
  }

  private async handleOrderCreated(data: any): Promise<void> {
    // Handle new order creation
    console.log('Order created:', data.id)
    // TODO: This would trigger review request campaigns in a real app
  }

  private async handleOrderFulfilled(data: any): Promise<void> {
    // Handle order fulfillment - trigger review request campaign
    console.log('Order fulfilled:', data.id)
    // TODO: This would trigger review request email campaigns in a real app
  }
}

export const shopifyService = new ShopifyService()
export default shopifyService