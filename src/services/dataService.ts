import { blink } from '../blink/client'

export interface Review {
  id: string
  shopId: string
  customerName: string
  customerEmail: string
  productName: string
  productId?: string
  shopifyProductId?: string
  rating: number
  comment: string
  status: 'pending' | 'approved' | 'rejected' | 'flagged'
  verifiedPurchase: boolean
  hasPhoto: boolean
  hasVideo: boolean
  photoUrls?: string[]
  videoUrls?: string[]
  helpfulVotes: number
  replyText?: string
  replyDate?: string
  moderationScore?: number
  sentimentScore?: number
  language: string
  source: 'manual' | 'email' | 'widget' | 'import'
  createdAt: string
  updatedAt: string
}

export interface InstagramUGC {
  id: string
  shopId: string
  instagramId: string
  username: string
  caption?: string
  mediaUrl: string
  mediaType: 'image' | 'video'
  hashtags?: string[]
  status: 'pending' | 'approved' | 'rejected'
  assignedProductId?: string
  createdAt: string
  updatedAt: string
}

export interface EmailTemplate {
  id: string
  shopId: string
  name: string
  type: 'post_purchase' | 'reminder' | 'thank_you' | 'photo_request' | 'milestone'
  subject: string
  htmlContent: string
  textContent?: string
  variables: string[]
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface Campaign {
  id: string
  shopId: string
  name: string
  type: 'automated' | 'manual'
  status: 'draft' | 'active' | 'paused' | 'stopped'
  triggerType: string
  triggerValue?: string
  templateId?: string
  emailsSent: number
  emailsOpened: number
  emailsClicked: number
  reviewsGenerated: number
  createdAt: string
  updatedAt: string
}

export interface Widget {
  id: string
  shopId: string
  name: string
  type: 'carousel' | 'product' | 'collection' | 'floating' | 'thankyou' | 'popup'
  isActive: boolean
  configuration: Record<string, any>
  views: number
  clicks: number
  placement: string
  createdAt: string
  updatedAt: string
}

export interface AppSettings {
  id: string
  shopId: string
  category: string
  key: string
  value: string
  createdAt: string
  updatedAt: string
}

// Data service functions
export const dataService = {
  // Get current user and shop info
  async getCurrentUser() {
    try {
      return await blink.auth.me()
    } catch (error) {
      console.error('Failed to get current user:', error)
      return null
    }
  },

  async getCurrentShop() {
    try {
      const user = await this.getCurrentUser()
      if (!user) return null

      const shops = await blink.db.shops.list({
        where: { userId: user.id },
        limit: 1
      })

      return shops.length > 0 ? shops[0] : null
    } catch (error) {
      console.error('Error checking shop connection:', error)
      // If database doesn't exist, return null so user can complete onboarding
      return null
    }
  },

  // Reviews
  async getReviews(): Promise<Review[]> {
    try {
      const user = await this.getCurrentUser()
      if (!user) return []

      const reviews = await blink.db.reviews.list({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      })

      return reviews.map(review => ({
        ...review,
        verifiedPurchase: Number(review.verifiedPurchase) > 0,
        hasPhoto: Number(review.hasPhoto) > 0,
        hasVideo: Number(review.hasVideo) > 0,
        photoUrls: review.photoUrls ? JSON.parse(review.photoUrls) : [],
        videoUrls: review.videoUrls ? JSON.parse(review.videoUrls) : []
      }))
    } catch (error) {
      console.error('Failed to get reviews:', error)
      // Return empty array if database doesn't exist
      return []
    }
  },

  async getReviewById(id: string): Promise<Review | null> {
    try {
      const user = await this.getCurrentUser()
      if (!user) return null

      const reviews = await blink.db.reviews.list({
        where: { 
          AND: [
            { id },
            { userId: user.id }
          ]
        },
        limit: 1
      })

      if (reviews.length === 0) return null

      const review = reviews[0]
      return {
        ...review,
        verifiedPurchase: Number(review.verifiedPurchase) > 0,
        hasPhoto: Number(review.hasPhoto) > 0,
        hasVideo: Number(review.hasVideo) > 0,
        photoUrls: review.photoUrls ? JSON.parse(review.photoUrls) : [],
        videoUrls: review.videoUrls ? JSON.parse(review.videoUrls) : []
      }
    } catch (error) {
      console.error('Failed to get review by ID:', error)
      return null
    }
  },

  async createReview(review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<Review | null> {
    try {
      const user = await this.getCurrentUser()
      if (!user) return null

      const shop = await this.getCurrentShop()
      if (!shop) return null

      const now = new Date().toISOString()
      const newReview = await blink.db.reviews.create({
        id: `review_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        userId: user.id,
        shopId: shop.id,
        customerName: review.customerName,
        customerEmail: review.customerEmail,
        productName: review.productName,
        productId: review.productId || null,
        shopifyProductId: review.shopifyProductId || null,
        rating: review.rating,
        comment: review.comment,
        status: review.status,
        verifiedPurchase: review.verifiedPurchase ? 1 : 0,
        hasPhoto: review.hasPhoto ? 1 : 0,
        hasVideo: review.hasVideo ? 1 : 0,
        photoUrls: review.photoUrls ? JSON.stringify(review.photoUrls) : null,
        videoUrls: review.videoUrls ? JSON.stringify(review.videoUrls) : null,
        helpfulVotes: review.helpfulVotes,
        replyText: review.replyText || null,
        replyDate: review.replyDate || null,
        moderationScore: review.moderationScore || 0,
        sentimentScore: review.sentimentScore || 0,
        language: review.language,
        source: review.source,
        createdAt: now,
        updatedAt: now
      })

      return {
        ...newReview,
        verifiedPurchase: Number(newReview.verifiedPurchase) > 0,
        hasPhoto: Number(newReview.hasPhoto) > 0,
        hasVideo: Number(newReview.hasVideo) > 0,
        photoUrls: newReview.photoUrls ? JSON.parse(newReview.photoUrls) : [],
        videoUrls: newReview.videoUrls ? JSON.parse(newReview.videoUrls) : []
      }
    } catch (error) {
      console.error('Failed to create review:', error)
      return null
    }
  },

  async updateReviewStatus(id: string, status: Review['status']): Promise<boolean> {
    try {
      const user = await this.getCurrentUser()
      if (!user) return false

      await blink.db.reviews.update(id, {
        status,
        updatedAt: new Date().toISOString()
      })

      return true
    } catch (error) {
      console.error('Failed to update review status:', error)
      return false
    }
  },

  async replyToReview(id: string, replyText: string): Promise<boolean> {
    try {
      const user = await this.getCurrentUser()
      if (!user) return false

      await blink.db.reviews.update(id, {
        replyText,
        replyDate: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })

      return true
    } catch (error) {
      console.error('Failed to reply to review:', error)
      return false
    }
  },

  // Campaigns
  async getCampaigns(): Promise<Campaign[]> {
    try {
      const user = await this.getCurrentUser()
      if (!user) return []

      return await blink.db.campaigns.list({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      })
    } catch (error) {
      console.error('Failed to get campaigns:', error)
      return []
    }
  },

  async getCampaignById(id: string): Promise<Campaign | null> {
    try {
      const user = await this.getCurrentUser()
      if (!user) return null

      const campaigns = await blink.db.campaigns.list({
        where: { 
          AND: [
            { id },
            { userId: user.id }
          ]
        },
        limit: 1
      })

      return campaigns.length > 0 ? campaigns[0] : null
    } catch (error) {
      console.error('Failed to get campaign by ID:', error)
      return null
    }
  },

  async updateCampaignStatus(id: string, status: Campaign['status']): Promise<boolean> {
    try {
      const user = await this.getCurrentUser()
      if (!user) return false

      await blink.db.campaigns.update(id, {
        status,
        updatedAt: new Date().toISOString()
      })

      return true
    } catch (error) {
      console.error('Failed to update campaign status:', error)
      return false
    }
  },

  // Widgets
  async getWidgets(): Promise<Widget[]> {
    try {
      const user = await this.getCurrentUser()
      if (!user) return []

      const widgets = await blink.db.widgets.list({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      })

      return widgets.map(widget => ({
        ...widget,
        isActive: Number(widget.isActive) > 0,
        configuration: widget.configuration ? JSON.parse(widget.configuration) : {}
      }))
    } catch (error) {
      console.error('Failed to get widgets:', error)
      return []
    }
  },

  async getWidgetById(id: string): Promise<Widget | null> {
    try {
      const user = await this.getCurrentUser()
      if (!user) return null

      const widgets = await blink.db.widgets.list({
        where: { 
          AND: [
            { id },
            { userId: user.id }
          ]
        },
        limit: 1
      })

      if (widgets.length === 0) return null

      const widget = widgets[0]
      return {
        ...widget,
        isActive: Number(widget.isActive) > 0,
        configuration: widget.configuration ? JSON.parse(widget.configuration) : {}
      }
    } catch (error) {
      console.error('Failed to get widget by ID:', error)
      return null
    }
  },

  async updateWidgetStatus(id: string, isActive: boolean): Promise<boolean> {
    try {
      const user = await this.getCurrentUser()
      if (!user) return false

      await blink.db.widgets.update(id, {
        isActive: isActive ? 1 : 0,
        updatedAt: new Date().toISOString()
      })

      return true
    } catch (error) {
      console.error('Failed to update widget status:', error)
      return false
    }
  },

  async updateWidgetConfiguration(id: string, configuration: Record<string, any>): Promise<boolean> {
    try {
      const user = await this.getCurrentUser()
      if (!user) return false

      await blink.db.widgets.update(id, {
        configuration: JSON.stringify(configuration),
        updatedAt: new Date().toISOString()
      })

      return true
    } catch (error) {
      console.error('Failed to update widget configuration:', error)
      return false
    }
  },

  // Instagram UGC
  async getInstagramUGC(): Promise<InstagramUGC[]> {
    try {
      const user = await this.getCurrentUser()
      if (!user) return []

      const ugcPosts = await blink.db.instagramUgc.list({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      })

      return ugcPosts.map(post => ({
        ...post,
        hashtags: post.hashtags ? JSON.parse(post.hashtags) : []
      }))
    } catch (error) {
      console.error('Failed to get Instagram UGC:', error)
      return []
    }
  },

  async getInstagramUGCById(id: string): Promise<InstagramUGC | null> {
    try {
      const user = await this.getCurrentUser()
      if (!user) return null

      const ugcPosts = await blink.db.instagramUgc.list({
        where: { 
          AND: [
            { id },
            { userId: user.id }
          ]
        },
        limit: 1
      })

      if (ugcPosts.length === 0) return null

      const post = ugcPosts[0]
      return {
        ...post,
        hashtags: post.hashtags ? JSON.parse(post.hashtags) : []
      }
    } catch (error) {
      console.error('Failed to get Instagram UGC by ID:', error)
      return null
    }
  },

  async updateInstagramUGCStatus(id: string, status: InstagramUGC['status']): Promise<boolean> {
    try {
      const user = await this.getCurrentUser()
      if (!user) return false

      await blink.db.instagramUgc.update(id, {
        status,
        updatedAt: new Date().toISOString()
      })

      return true
    } catch (error) {
      console.error('Failed to update Instagram UGC status:', error)
      return false
    }
  },

  async assignInstagramUGCToProduct(id: string, productId: string): Promise<boolean> {
    try {
      const user = await this.getCurrentUser()
      if (!user) return false

      await blink.db.instagramUgc.update(id, {
        assignedProductId: productId,
        updatedAt: new Date().toISOString()
      })

      return true
    } catch (error) {
      console.error('Failed to assign Instagram UGC to product:', error)
      return false
    }
  },

  // Email Templates
  async getEmailTemplates(): Promise<EmailTemplate[]> {
    try {
      const user = await this.getCurrentUser()
      if (!user) return []

      const templates = await blink.db.emailTemplates.list({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      })

      return templates.map(template => ({
        ...template,
        isDefault: Number(template.isDefault) > 0,
        variables: template.variables ? JSON.parse(template.variables) : []
      }))
    } catch (error) {
      console.error('Failed to get email templates:', error)
      return []
    }
  },

  async getEmailTemplateById(id: string): Promise<EmailTemplate | null> {
    try {
      const user = await this.getCurrentUser()
      if (!user) return null

      const templates = await blink.db.emailTemplates.list({
        where: { 
          AND: [
            { id },
            { userId: user.id }
          ]
        },
        limit: 1
      })

      if (templates.length === 0) return null

      const template = templates[0]
      return {
        ...template,
        isDefault: Number(template.isDefault) > 0,
        variables: template.variables ? JSON.parse(template.variables) : []
      }
    } catch (error) {
      console.error('Failed to get email template by ID:', error)
      return null
    }
  },

  async createEmailTemplate(template: Omit<EmailTemplate, 'id' | 'shopId' | 'createdAt' | 'updatedAt'>): Promise<EmailTemplate | null> {
    try {
      const user = await this.getCurrentUser()
      if (!user) return null

      const shop = await this.getCurrentShop()
      if (!shop) return null

      const now = new Date().toISOString()
      const newTemplate = await blink.db.emailTemplates.create({
        id: `template_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        userId: user.id,
        shopId: shop.id,
        name: template.name,
        type: template.type,
        subject: template.subject,
        htmlContent: template.htmlContent,
        textContent: template.textContent || null,
        variables: JSON.stringify(template.variables),
        isDefault: template.isDefault ? 1 : 0,
        createdAt: now,
        updatedAt: now
      })

      return {
        ...newTemplate,
        isDefault: Number(newTemplate.isDefault) > 0,
        variables: newTemplate.variables ? JSON.parse(newTemplate.variables) : []
      }
    } catch (error) {
      console.error('Failed to create email template:', error)
      return null
    }
  },

  async updateEmailTemplate(id: string, updates: Partial<EmailTemplate>): Promise<boolean> {
    try {
      const user = await this.getCurrentUser()
      if (!user) return false

      const updateData: any = {
        updatedAt: new Date().toISOString()
      }

      if (updates.name) updateData.name = updates.name
      if (updates.subject) updateData.subject = updates.subject
      if (updates.htmlContent) updateData.htmlContent = updates.htmlContent
      if (updates.textContent) updateData.textContent = updates.textContent
      if (updates.variables) updateData.variables = JSON.stringify(updates.variables)
      if (updates.isDefault !== undefined) updateData.isDefault = updates.isDefault ? 1 : 0

      await blink.db.emailTemplates.update(id, updateData)
      return true
    } catch (error) {
      console.error('Failed to update email template:', error)
      return false
    }
  },

  // Analytics
  async getAnalytics() {
    try {
      const user = await this.getCurrentUser()
      if (!user) return null

      const reviews = await this.getReviews()
      const campaigns = await this.getCampaigns()
      const widgets = await this.getWidgets()
      const instagramUGC = await this.getInstagramUGC()
      
      const totalReviews = reviews.length
      const approvedReviews = reviews.filter(r => r.status === 'approved').length
      const pendingReviews = reviews.filter(r => r.status === 'pending').length
      const flaggedReviews = reviews.filter(r => r.status === 'flagged').length
      const verifiedReviews = reviews.filter(r => r.verifiedPurchase).length
      const photoReviews = reviews.filter(r => r.hasPhoto).length
      const videoReviews = reviews.filter(r => r.hasVideo).length
      
      return {
        totalReviews,
        approvedReviews,
        pendingReviews,
        flaggedReviews,
        rejectedReviews: reviews.filter(r => r.status === 'rejected').length,
        averageRating: reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0,
        verifiedPurchaseRate: totalReviews > 0 ? (verifiedReviews / totalReviews) * 100 : 0,
        photoReviewRate: totalReviews > 0 ? (photoReviews / totalReviews) * 100 : 0,
        videoReviewRate: totalReviews > 0 ? (videoReviews / totalReviews) * 100 : 0,
        averageModerationScore: reviews.length > 0 ? reviews.reduce((sum, r) => sum + (r.moderationScore || 0), 0) / reviews.length : 0,
        averageSentimentScore: reviews.length > 0 ? reviews.reduce((sum, r) => sum + (r.sentimentScore || 0), 0) / reviews.length : 0,
        totalCampaignsSent: campaigns.reduce((sum, c) => sum + c.emailsSent, 0),
        totalCampaignsOpened: campaigns.reduce((sum, c) => sum + c.emailsOpened, 0),
        totalCampaignsClicked: campaigns.reduce((sum, c) => sum + c.emailsClicked, 0),
        totalWidgetViews: widgets.reduce((sum, w) => sum + w.views, 0),
        totalWidgetClicks: widgets.reduce((sum, w) => sum + w.clicks, 0),
        totalInstagramUGC: instagramUGC.length,
        approvedInstagramUGC: instagramUGC.filter(u => u.status === 'approved').length,
        pendingInstagramUGC: instagramUGC.filter(u => u.status === 'pending').length,
        reviewsBySource: {
          manual: reviews.filter(r => r.source === 'manual').length,
          email: reviews.filter(r => r.source === 'email').length,
          widget: reviews.filter(r => r.source === 'widget').length,
          import: reviews.filter(r => r.source === 'import').length
        },
        reviewsByRating: {
          5: reviews.filter(r => r.rating === 5).length,
          4: reviews.filter(r => r.rating === 4).length,
          3: reviews.filter(r => r.rating === 3).length,
          2: reviews.filter(r => r.rating === 2).length,
          1: reviews.filter(r => r.rating === 1).length
        },
        campaignPerformance: campaigns.map(c => ({
          id: c.id,
          name: c.name,
          emailsSent: c.emailsSent,
          openRate: c.emailsSent > 0 ? (c.emailsOpened / c.emailsSent) * 100 : 0,
          clickRate: c.emailsSent > 0 ? (c.emailsClicked / c.emailsSent) * 100 : 0,
          reviewRate: c.emailsSent > 0 ? (c.reviewsGenerated / c.emailsSent) * 100 : 0
        })),
        widgetPerformance: widgets.map(w => ({
          id: w.id,
          name: w.name,
          views: w.views,
          clicks: w.clicks,
          ctr: w.views > 0 ? (w.clicks / w.views) * 100 : 0
        }))
      }
    } catch (error) {
      console.error('Failed to get analytics:', error)
      return null
    }
  }
}

export default dataService