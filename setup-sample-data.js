// This script will create sample data for testing the TrustLoop app
// Run this after the database is set up

const sampleData = {
  // Sample shop data
  shop: {
    id: 'shop_demo_001',
    userId: '12fYt58Yi7hA9w2OjZxlVyKQkYz1',
    shopDomain: 'demo-store.myshopify.com',
    accessToken: 'shpat_demo_token_123',
    shopName: 'Demo Store',
    shopEmail: 'owner@demo-store.com',
    shopOwner: 'Demo Owner',
    currency: 'USD',
    timezone: 'America/New_York',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Sample reviews
  reviews: [
    {
      id: 'review_001',
      userId: '12fYt58Yi7hA9w2OjZxlVyKQkYz1',
      shopId: 'shop_demo_001',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah@example.com',
      productName: 'Wireless Bluetooth Headphones',
      productId: 'prod_001',
      shopifyProductId: 'gid://shopify/Product/123456',
      rating: 5,
      comment: 'Amazing sound quality and battery life! Perfect for my daily commute.',
      status: 'approved',
      verifiedPurchase: 1,
      hasPhoto: 1,
      hasVideo: 0,
      photoUrls: JSON.stringify(['https://example.com/review-photo1.jpg']),
      videoUrls: null,
      helpfulVotes: 12,
      replyText: null,
      replyDate: null,
      moderationScore: 95.5,
      sentimentScore: 0.9,
      language: 'en',
      source: 'email',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'review_002',
      userId: '12fYt58Yi7hA9w2OjZxlVyKQkYz1',
      shopId: 'shop_demo_001',
      customerName: 'Mike Rodriguez',
      customerEmail: 'mike@example.com',
      productName: 'Smart Fitness Tracker',
      productId: 'prod_002',
      shopifyProductId: 'gid://shopify/Product/789012',
      rating: 4,
      comment: 'Great features and comfortable to wear all day. Battery could be better.',
      status: 'pending',
      verifiedPurchase: 1,
      hasPhoto: 0,
      hasVideo: 0,
      photoUrls: null,
      videoUrls: null,
      helpfulVotes: 3,
      replyText: null,
      replyDate: null,
      moderationScore: 82.3,
      sentimentScore: 0.7,
      language: 'en',
      source: 'widget',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'review_003',
      userId: '12fYt58Yi7hA9w2OjZxlVyKQkYz1',
      shopId: 'shop_demo_001',
      customerName: 'Emma Thompson',
      customerEmail: 'emma@example.com',
      productName: 'Coffee Maker Deluxe',
      productId: 'prod_003',
      shopifyProductId: 'gid://shopify/Product/345678',
      rating: 3,
      comment: 'It works but the instructions were unclear. Would be better with more detailed setup guide.',
      status: 'flagged',
      verifiedPurchase: 0,
      hasPhoto: 0,
      hasVideo: 0,
      photoUrls: null,
      videoUrls: null,
      helpfulVotes: 1,
      replyText: null,
      replyDate: null,
      moderationScore: 45.2,
      sentimentScore: 0.3,
      language: 'en',
      source: 'manual',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],

  // Sample campaigns
  campaigns: [
    {
      id: 'campaign_001',
      userId: '12fYt58Yi7hA9w2OjZxlVyKQkYz1',
      shopId: 'shop_demo_001',
      name: 'Post-Purchase Review Request',
      type: 'automated',
      status: 'active',
      triggerType: 'order_fulfilled',
      triggerValue: '3',
      templateId: 'template_001',
      emailsSent: 150,
      emailsOpened: 45,
      emailsClicked: 12,
      reviewsGenerated: 8,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],

  // Sample widgets
  widgets: [
    {
      id: 'widget_001',
      userId: '12fYt58Yi7hA9w2OjZxlVyKQkYz1',
      shopId: 'shop_demo_001',
      name: 'Homepage Reviews Carousel',
      type: 'carousel',
      isActive: 1,
      configuration: JSON.stringify({
        theme: 'modern',
        autoplay: true,
        showRating: true,
        showPhotos: true,
        maxReviews: 10
      }),
      views: 2456,
      clicks: 89,
      placement: 'homepage',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]
}

console.log('Sample data structure:')
console.log(JSON.stringify(sampleData, null, 2))