import { blink } from '../blink/client'

export const initializeDatabase = async () => {
  try {
    console.log('Initializing database tables...')
    
    // Note: We'll use the existing dataService methods to create sample data
    // once the user completes the onboarding flow
    
    return { success: true, message: 'Database initialized successfully' }
  } catch (error) {
    console.error('Failed to initialize database:', error)
    return { success: false, error: error.message }
  }
}

export const createSampleShop = async (userId: string, shopDomain: string) => {
  try {
    const now = new Date().toISOString()
    const shop = {
      id: `shop_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      userId,
      shopDomain,
      shopName: shopDomain.replace('.myshopify.com', '').replace(/[-_]/g, ' '),
      accessToken: 'sample_token_' + Math.random().toString(36).substring(2, 15),
      connectionType: 'oauth',
      isActive: 1,
      planName: 'Basic',
      email: 'demo@example.com',
      timezone: 'UTC',
      currency: 'USD',
      createdAt: now,
      updatedAt: now
    }

    await blink.db.shops.create(shop)
    return shop
  } catch (error) {
    console.error('Failed to create sample shop:', error)
    throw error
  }
}

export const createSampleReviews = async (userId: string, shopId: string) => {
  try {
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

    return sampleReviews
  } catch (error) {
    console.error('Failed to create sample reviews:', error)
    throw error
  }
}

export const createSampleWidgets = async (userId: string, shopId: string) => {
  try {
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

    return sampleWidgets
  } catch (error) {
    console.error('Failed to create sample widgets:', error)
    throw error
  }
}

export const createSampleCampaigns = async (userId: string, shopId: string) => {
  try {
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

    return sampleCampaigns
  } catch (error) {
    console.error('Failed to create sample campaigns:', error)
    throw error
  }
}