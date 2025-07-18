import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { Database, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { blink } from '@/blink/client'
import { useAuth } from '@/contexts/AuthContext'

export default function DatabaseInitializer() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [initResult, setInitResult] = useState<{ success: boolean; message: string } | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()

  const createDatabaseTables = async () => {
    // Note: Database tables will be created automatically when first accessed
    // For now, we'll just proceed with sample data creation
    console.log('Database tables will be created automatically')
  }

  const createSampleShop = async (userId: string) => {
    const now = new Date().toISOString()
    const shop = {
      id: `shop_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      userId,
      shopDomain: 'demo-store.myshopify.com',
      shopName: 'Demo Store',
      accessToken: 'sample_token_' + Math.random().toString(36).substring(2, 15),
      connectionType: 'oauth',
      isActive: 1,
      planName: 'Basic',
      shopEmail: 'demo@example.com',
      shopOwner: 'Demo Owner',
      timezone: 'UTC',
      currency: 'USD',
      createdAt: now,
      updatedAt: now
    }

    await blink.db.shops.create(shop)
    return shop
  }

  const createSampleReviews = async (userId: string, shopId: string) => {
    const now = new Date().toISOString()
    const sampleReviews = [
      {
        id: `review_${Date.now()}_1`,
        userId,
        shopId,
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah@example.com',
        productName: 'Wireless Earbuds Pro',
        productId: 'prod_123',
        shopifyProductId: 'gid://shopify/Product/123',
        rating: 5,
        comment: 'Amazing sound quality and battery life! Highly recommend these earbuds.',
        status: 'approved',
        verifiedPurchase: 1,
        hasPhoto: 1,
        hasVideo: 0,
        photoUrls: JSON.stringify(['https://example.com/photo1.jpg']),
        videoUrls: null,
        helpfulVotes: 12,
        replyText: null,
        replyDate: null,
        moderationScore: 0.95,
        sentimentScore: 0.8,
        language: 'en',
        source: 'email',
        createdAt: now,
        updatedAt: now
      },
      {
        id: `review_${Date.now()}_2`,
        userId,
        shopId,
        customerName: 'Mike Chen',
        customerEmail: 'mike@example.com',
        productName: 'Fitness Tracker',
        productId: 'prod_456',
        shopifyProductId: 'gid://shopify/Product/456',
        rating: 4,
        comment: 'Great features and comfortable to wear. Battery could be better.',
        status: 'approved',
        verifiedPurchase: 1,
        hasPhoto: 0,
        hasVideo: 0,
        photoUrls: null,
        videoUrls: null,
        helpfulVotes: 8,
        replyText: 'Thanks for the feedback! We\'re working on improving battery life.',
        replyDate: now,
        moderationScore: 0.88,
        sentimentScore: 0.6,
        language: 'en',
        source: 'widget',
        createdAt: now,
        updatedAt: now
      },
      {
        id: `review_${Date.now()}_3`,
        userId,
        shopId,
        customerName: 'Emma Wilson',
        customerEmail: 'emma@example.com',
        productName: 'Coffee Maker Deluxe',
        productId: 'prod_789',
        shopifyProductId: 'gid://shopify/Product/789',
        rating: 5,
        comment: 'Perfect morning brew every time! Love the programmable features.',
        status: 'pending',
        verifiedPurchase: 1,
        hasPhoto: 1,
        hasVideo: 1,
        photoUrls: JSON.stringify(['https://example.com/photo2.jpg']),
        videoUrls: JSON.stringify(['https://example.com/video1.mp4']),
        helpfulVotes: 0,
        replyText: null,
        replyDate: null,
        moderationScore: 0.92,
        sentimentScore: 0.9,
        language: 'en',
        source: 'email',
        createdAt: now,
        updatedAt: now
      }
    ]

    for (const review of sampleReviews) {
      await blink.db.reviews.create(review)
    }
  }

  const createSampleWidgets = async (userId: string, shopId: string) => {
    const now = new Date().toISOString()
    const sampleWidgets = [
      {
        id: `widget_${Date.now()}_1`,
        userId,
        shopId,
        name: 'Homepage Review Carousel',
        type: 'carousel',
        isActive: 1,
        configuration: JSON.stringify({
          theme: 'light',
          showRating: true,
          showPhotos: true,
          autoPlay: true,
          displayCount: 5
        }),
        views: 1245,
        clicks: 89,
        placement: 'homepage',
        createdAt: now,
        updatedAt: now
      },
      {
        id: `widget_${Date.now()}_2`,
        userId,
        shopId,
        name: 'Product Page Reviews',
        type: 'product',
        isActive: 1,
        configuration: JSON.stringify({
          theme: 'light',
          showRating: true,
          showPhotos: true,
          allowFiltering: true,
          showReplyButton: true
        }),
        views: 2156,
        clicks: 234,
        placement: 'product',
        createdAt: now,
        updatedAt: now
      }
    ]

    for (const widget of sampleWidgets) {
      await blink.db.widgets.create(widget)
    }
  }

  const createSampleCampaigns = async (userId: string, shopId: string) => {
    const now = new Date().toISOString()
    const sampleCampaigns = [
      {
        id: `campaign_${Date.now()}_1`,
        userId,
        shopId,
        name: 'Post-Purchase Review Request',
        type: 'automated',
        status: 'active',
        triggerType: 'post_purchase',
        triggerValue: '7',
        templateId: 'template_001',
        emailsSent: 156,
        emailsOpened: 38,
        emailsClicked: 12,
        reviewsGenerated: 8,
        createdAt: now,
        updatedAt: now
      },
      {
        id: `campaign_${Date.now()}_2`,
        userId,
        shopId,
        name: 'Review Reminder Follow-up',
        type: 'automated',
        status: 'active',
        triggerType: 'reminder',
        triggerValue: '14',
        templateId: 'template_002',
        emailsSent: 89,
        emailsOpened: 22,
        emailsClicked: 7,
        reviewsGenerated: 4,
        createdAt: now,
        updatedAt: now
      }
    ]

    for (const campaign of sampleCampaigns) {
      await blink.db.campaigns.create(campaign)
    }
  }

  const handleInitializeDatabase = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Please log in first',
        variant: 'destructive'
      })
      return
    }

    setIsInitializing(true)
    setInitResult(null)

    try {
      // Create database tables
      await createDatabaseTables()
      
      // Create a sample shop
      const shop = await createSampleShop(user.id)
      
      // Create sample data
      await createSampleReviews(user.id, shop.id)
      await createSampleWidgets(user.id, shop.id)
      await createSampleCampaigns(user.id, shop.id)
      
      setInitResult({
        success: true,
        message: 'Database initialized successfully with sample data!'
      })
      
      toast({
        title: 'Success!',
        description: 'Database initialized with sample data. Please refresh the page.',
      })
      
      // Reload the page after a delay
      setTimeout(() => {
        window.location.reload()
      }, 2000)
      
    } catch (error) {
      console.error('Failed to initialize database:', error)
      setInitResult({
        success: false,
        message: 'Failed to initialize database. Please try again.'
      })
      
      toast({
        title: 'Error',
        description: 'Failed to initialize database. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsInitializing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Database className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-xl font-semibold">Database Setup Required</CardTitle>
          <CardDescription>
            Initialize your database with sample data to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your database needs to be set up with the required tables and sample data.
              This is a one-time process.
            </AlertDescription>
          </Alert>
          
          {initResult && (
            <Alert variant={initResult.success ? 'default' : 'destructive'}>
              {initResult.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>{initResult.message}</AlertDescription>
            </Alert>
          )}
          
          <Button
            onClick={handleInitializeDatabase}
            disabled={isInitializing}
            className="w-full"
          >
            {isInitializing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Initializing...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Initialize Database
              </>
            )}
          </Button>
          
          <div className="text-center text-sm text-gray-500">
            This will create sample shops, reviews, widgets, and campaigns for demonstration.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}