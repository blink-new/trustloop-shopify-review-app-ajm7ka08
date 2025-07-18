import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Mail, 
  Send, 
  Eye, 
  MousePointer, 
  Star,
  Calendar,
  Users,
  TrendingUp,
  Play,
  Pause,
  Settings,
  FileText
} from 'lucide-react'

export default function Campaigns() {
  const campaigns = [
    {
      id: 1,
      name: "Post-Purchase Review Request",
      type: "automated",
      status: "active",
      trigger: "3 days after delivery",
      sent: 1247,
      opens: 312,
      clicks: 89,
      reviews: 34,
      openRate: 25.0,
      clickRate: 7.1,
      reviewRate: 2.7,
      lastSent: "2 hours ago"
    },
    {
      id: 2,
      name: "Follow-up Reminder",
      type: "automated",
      status: "active",
      trigger: "7 days after first email",
      sent: 523,
      opens: 145,
      clicks: 34,
      reviews: 12,
      openRate: 27.7,
      clickRate: 6.5,
      reviewRate: 2.3,
      lastSent: "5 hours ago"
    },
    {
      id: 3,
      name: "VIP Customer Thank You",
      type: "manual",
      status: "draft",
      trigger: "Manual send",
      sent: 0,
      opens: 0,
      clicks: 0,
      reviews: 0,
      openRate: 0,
      clickRate: 0,
      reviewRate: 0,
      lastSent: "Never"
    },
    {
      id: 4,
      name: "Photo Upload Request",
      type: "automated",
      status: "paused",
      trigger: "After 4-5 star review",
      sent: 156,
      opens: 67,
      clicks: 23,
      reviews: 8,
      openRate: 42.9,
      clickRate: 14.7,
      reviewRate: 5.1,
      lastSent: "3 days ago"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return Play
      case 'paused': return Pause
      case 'draft': return Settings
      default: return Settings
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Campaigns</h1>
          <p className="text-gray-600">Automated email sequences to collect reviews</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          + Create Campaign
        </Button>
      </div>

      {/* Campaign Performance */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Send className="h-4 w-4 text-blue-600" />
              <div className="text-sm text-gray-600">Emails Sent</div>
            </div>
            <div className="text-2xl font-bold text-gray-900">2,456</div>
            <div className="text-xs text-green-600 mt-1">+12% this month</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-4 w-4 text-green-600" />
              <div className="text-sm text-gray-600">Open Rate</div>
            </div>
            <div className="text-2xl font-bold text-gray-900">24.5%</div>
            <div className="text-xs text-green-600 mt-1">+2.1% vs last month</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <MousePointer className="h-4 w-4 text-purple-600" />
              <div className="text-sm text-gray-600">Click Rate</div>
            </div>
            <div className="text-2xl font-bold text-gray-900">8.2%</div>
            <div className="text-xs text-red-600 mt-1">-0.5% vs last month</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-yellow-600" />
              <div className="text-sm text-gray-600">Review Rate</div>
            </div>
            <div className="text-2xl font-bold text-gray-900">3.1%</div>
            <div className="text-xs text-green-600 mt-1">+0.3% vs last month</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaigns List */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Active Campaigns</CardTitle>
              <CardDescription>Manage your automated email sequences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => {
                  const StatusIcon = getStatusIcon(campaign.status)
                  return (
                    <div key={campaign.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Mail className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                              <Badge className={`text-xs ${getStatusColor(campaign.status)}`}>
                                {campaign.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              Trigger: {campaign.trigger}
                            </p>
                            <p className="text-xs text-gray-500">
                              Last sent: {campaign.lastSent}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <StatusIcon className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-gray-900">{campaign.sent.toLocaleString()}</div>
                          <div className="text-xs text-gray-600">Sent</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-600">{campaign.openRate}%</div>
                          <div className="text-xs text-gray-600">Open Rate</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-purple-600">{campaign.clickRate}%</div>
                          <div className="text-xs text-gray-600">Click Rate</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-yellow-600">{campaign.reviewRate}%</div>
                          <div className="text-xs text-gray-600">Review Rate</div>
                        </div>
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Opens</span>
                          <span className="font-medium">{campaign.opens}/{campaign.sent}</span>
                        </div>
                        <Progress value={campaign.openRate} className="h-2" />
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Reviews</span>
                          <span className="font-medium">{campaign.reviews}/{campaign.sent}</span>
                        </div>
                        <Progress value={campaign.reviewRate} className="h-2" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Analytics */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Campaign Analytics</CardTitle>
              <CardDescription>Performance insights</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="trends">Trends</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-4">
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-900">Best Performing</span>
                      </div>
                      <div className="text-sm text-gray-700">Photo Upload Request</div>
                      <div className="text-xs text-gray-600">42.9% open rate</div>
                    </div>
                    
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-900">Most Active</span>
                      </div>
                      <div className="text-sm text-gray-700">Post-Purchase Request</div>
                      <div className="text-xs text-gray-600">1,247 emails sent</div>
                    </div>
                    
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium text-gray-900">Review Conversion</span>
                      </div>
                      <div className="text-sm text-gray-700">54 reviews this week</div>
                      <div className="text-xs text-gray-600">+23% from last week</div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="trends" className="mt-4">
                  <div className="space-y-4">
                    <div className="text-center p-8 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-sm">Trend analysis coming soon</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Template Library */}
          <Card className="border-0 shadow-sm mt-4">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Email Templates</CardTitle>
              <CardDescription>Pre-built templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Post-Purchase</div>
                    <div className="text-xs text-gray-600">Review request</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <Mail className="h-4 w-4 text-green-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Follow-up</div>
                    <div className="text-xs text-gray-600">Reminder email</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <Mail className="h-4 w-4 text-purple-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Thank You</div>
                    <div className="text-xs text-gray-600">VIP customers</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <Mail className="h-4 w-4 text-orange-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Photo Request</div>
                    <div className="text-xs text-gray-600">UGC collection</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}