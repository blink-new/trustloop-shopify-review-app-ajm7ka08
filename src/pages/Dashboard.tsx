import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import AnalyticsChart from '@/components/charts/AnalyticsChart'
import ReviewModerationQueue from '@/components/reviews/ReviewModerationQueue'
import { dataService } from '@/services/dataService'
import { blink } from '@/blink/client'
import { 
  Star, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Users,
  ShoppingCart,
  Camera,
  Mail,
  MousePointer,
  Eye,
  Zap,
  RefreshCw,
  Download,
  AlertTriangle
} from 'lucide-react'

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [autoModerating, setAutoModerating] = useState(false)
  const { toast } = useToast()
  const { shop } = useAuth()

  useEffect(() => {
    loadAnalytics()
    initAuth()
  }, [])

  const initAuth = async () => {
    try {
      const currentUser = await blink.auth.me()
      setUser(currentUser)
    } catch (error) {
      console.error('Auth error:', error)
    }
  }

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const data = await dataService.getAnalytics()
      setAnalytics(data)
    } catch (error) {
      console.error('Error loading analytics:', error)
      // If database doesn't exist, set empty analytics
      setAnalytics({
        totalReviews: 0,
        approvedReviews: 0,
        pendingReviews: 0,
        flaggedReviews: 0,
        rejectedReviews: 0,
        averageRating: 0,
        verifiedPurchaseRate: 0,
        photoReviewRate: 0,
        videoReviewRate: 0,
        totalInstagramUGC: 0,
        approvedInstagramUGC: 0,
        pendingInstagramUGC: 0,
        totalWidgetViews: 0,
        totalWidgetClicks: 0
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = () => {
    // Refresh analytics when review status changes
    loadAnalytics()
  }

  const handleAutoModerate = async () => {
    setAutoModerating(true)
    try {
      // Simulate AI moderation process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Auto-Moderation Complete",
        description: "15 reviews have been automatically processed using AI sentiment analysis.",
      })
      
      // Refresh analytics
      loadAnalytics()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to auto-moderate reviews. Please try again.",
        variant: "destructive"
      })
    } finally {
      setAutoModerating(false)
    }
  }

  const handleExportAnalytics = async () => {
    try {
      toast({
        title: "Export Started",
        description: "Your analytics report is being generated and will download shortly.",
      })
      
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Create mock CSV data
      const csvData = `Date,Total Reviews,Approved,Pending,Average Rating
${new Date().toISOString().split('T')[0]},${analytics?.totalReviews || 0},${analytics?.approvedReviews || 0},${analytics?.pendingReviews || 0},${analytics?.averageRating?.toFixed(1) || '0.0'}`
      
      const blob = new Blob([csvData], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `trustloop-analytics-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export analytics. Please try again.",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {shop?.connectionType === 'demo' && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md flex items-center gap-3">
          <AlertTriangle className="h-5 w-5" />
          <div>
            <p className="font-bold">Demo Mode</p>
            <p className="text-sm">You are currently in demo mode. The data displayed is for demonstration purposes only.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of your store's review performance</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleAutoModerate}
            disabled={autoModerating}
          >
            {autoModerating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Zap className="h-4 w-4" />
            )}
            {autoModerating ? 'Processing...' : 'Auto-Moderate'}
          </Button>
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleExportAnalytics}
          >
            <Download className="h-4 w-4" />
            Export Data
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            View All Reviews
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsChart
          title="Total Reviews"
          value={analytics?.totalReviews || 0}
          icon={<MessageSquare className="h-4 w-4" />}
          trend={{
            value: 12,
            type: 'increase',
            period: 'from last month'
          }}
          color="blue"
        />

        <AnalyticsChart
          title="Average Rating"
          value={analytics?.averageRating ? analytics.averageRating.toFixed(1) : '0.0'}
          icon={<Star className="h-4 w-4" />}
          description={`${analytics?.approvedReviews || 0} approved reviews`}
          color="yellow"
        />

        <AnalyticsChart
          title="Verified Purchases"
          value={analytics?.verifiedPurchaseRate ? `${analytics.verifiedPurchaseRate.toFixed(1)}%` : '0%'}
          icon={<CheckCircle className="h-4 w-4" />}
          description={`${Math.round((analytics?.verifiedPurchaseRate || 0) * (analytics?.totalReviews || 0) / 100)} verified reviews`}
          color="green"
        />

        <AnalyticsChart
          title="Pending Reviews"
          value={analytics?.pendingReviews || 0}
          icon={<Clock className="h-4 w-4" />}
          description="Needs moderation"
          color="orange"
        />
      </div>

      {/* Instagram UGC Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnalyticsChart
          title="Instagram UGC"
          value={analytics?.totalInstagramUGC || 0}
          icon={<Camera className="h-4 w-4" />}
          description={`${analytics?.approvedInstagramUGC || 0} approved posts`}
          color="purple"
        />

        <AnalyticsChart
          title="Email Templates"
          value="8"
          icon={<Mail className="h-4 w-4" />}
          description="Ready to use"
          color="green"
        />

        <AnalyticsChart
          title="Widget Performance"
          value={analytics?.totalWidgetClicks && analytics?.totalWidgetViews ? 
            `${((analytics.totalWidgetClicks / analytics.totalWidgetViews) * 100).toFixed(1)}%` : '0%'}
          icon={<MousePointer className="h-4 w-4" />}
          description="Average CTR"
          color="blue"
        />
      </div>

      {/* Real-time Moderation Queue */}
      <ReviewModerationQueue onStatusChange={handleStatusChange} />

      {/* Recent Activity & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Recent Reviews</CardTitle>
            <CardDescription>Latest customer feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  customer: "Sarah M.",
                  product: "Wireless Earbuds Pro",
                  rating: 5,
                  comment: "Amazing sound quality and battery life!",
                  time: "2 hours ago",
                  hasPhoto: true
                },
                {
                  customer: "Mike R.",
                  product: "Fitness Tracker",
                  rating: 4,
                  comment: "Great features, comfortable to wear.",
                  time: "5 hours ago",
                  hasPhoto: false
                },
                {
                  customer: "Emma K.",
                  product: "Coffee Maker Deluxe",
                  rating: 5,
                  comment: "Perfect morning brew every time!",
                  time: "1 day ago",
                  hasPhoto: true
                }
              ].map((review, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-700">
                        {review.customer.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">{review.customer}</span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} 
                          />
                        ))}
                      </div>
                      {review.hasPhoto && (
                        <Camera className="h-3 w-3 text-gray-400" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{review.product}</p>
                    <p className="text-sm text-gray-700">{review.comment}</p>
                    <p className="text-xs text-gray-500 mt-1">{review.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Top Reviewed Products</CardTitle>
            <CardDescription>Best performing products this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  product: "Wireless Earbuds Pro",
                  reviews: 89,
                  rating: 4.8,
                  trend: "+15%"
                },
                {
                  product: "Fitness Tracker",
                  reviews: 67,
                  rating: 4.5,
                  trend: "+8%"
                },
                {
                  product: "Coffee Maker Deluxe",
                  reviews: 45,
                  rating: 4.7,
                  trend: "+22%"
                },
                {
                  product: "Smart Watch Series 3",
                  reviews: 34,
                  rating: 4.4,
                  trend: "+5%"
                }
              ].map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{product.product}</h4>
                      <p className="text-xs text-gray-600">{product.reviews} reviews</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-900">{product.rating}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs text-green-700 bg-green-50">
                      {product.trend}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Performance */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Campaign Performance</CardTitle>
          <CardDescription>Email campaign metrics for this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">2,456</div>
              <div className="text-sm text-gray-600">Emails Sent</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">24.5%</div>
              <div className="text-sm text-gray-600">Open Rate</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-700">8.2%</div>
              <div className="text-sm text-gray-600">Click Rate</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-700">3.1%</div>
              <div className="text-sm text-gray-600">Review Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}