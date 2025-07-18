import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { dataService, Widget } from '@/services/dataService'
import { 
  Eye, 
  MousePointer, 
  TrendingUp, 
  TrendingDown,
  Star,
  Code,
  MessageSquare,
  Image,
  Zap,
  Settings,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react'

interface WidgetPerformanceMonitorProps {
  onWidgetUpdate?: (widgetId: string, data: Partial<Widget>) => void
}

export default function WidgetPerformanceMonitor({ onWidgetUpdate }: WidgetPerformanceMonitorProps) {
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [loading, setLoading] = useState(true)
  const [realTimeData, setRealTimeData] = useState<Record<string, any>>({})

  const loadWidgets = async () => {
    try {
      setLoading(true)
      const data = await dataService.getWidgets()
      setWidgets(data)
    } catch (error) {
      console.error('Error loading widgets:', error)
    } finally {
      setLoading(false)
    }
  }

  const simulateRealTimeUpdates = () => {
    setRealTimeData(prev => {
      const newData = { ...prev }
      widgets.forEach(widget => {
        const currentData = newData[widget.id] || { views: 0, clicks: 0, ctr: 0 }
        newData[widget.id] = {
          views: currentData.views + Math.floor(Math.random() * 10),
          clicks: currentData.clicks + Math.floor(Math.random() * 3),
          ctr: (currentData.clicks + Math.floor(Math.random() * 3)) / (currentData.views + Math.floor(Math.random() * 10)) * 100
        }
      })
      return newData
    })
  }

  useEffect(() => {
    loadWidgets()
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setRealTimeData(prev => {
        const newData = { ...prev }
        // Add some random increments to simulate real-time data
        Object.keys(newData).forEach(id => {
          newData[id] = {
            views: (newData[id]?.views || 0) + Math.floor(Math.random() * 5),
            clicks: (newData[id]?.clicks || 0) + Math.floor(Math.random() * 2),
            ctr: 0 // Will be calculated in render
          }
        })
        return newData
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getWidgetIcon = (type: Widget['type']) => {
    switch (type) {
      case 'carousel': return <Star className="h-4 w-4" />
      case 'product': return <MessageSquare className="h-4 w-4" />
      case 'collection': return <Star className="h-4 w-4" />
      case 'floating': return <Eye className="h-4 w-4" />
      case 'thankyou': return <MessageSquare className="h-4 w-4" />
      case 'popup': return <Image className="h-4 w-4" />
      default: return <Code className="h-4 w-4" />
    }
  }

  const getDeviceBreakdown = (widgetId: string) => {
    // Simulate device breakdown
    return {
      desktop: Math.floor(Math.random() * 60) + 20,
      mobile: Math.floor(Math.random() * 40) + 30,
      tablet: Math.floor(Math.random() * 20) + 10
    }
  }

  const getPerformanceScore = (ctr: number) => {
    if (ctr >= 10) return { score: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-50' }
    if (ctr >= 5) return { score: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-50' }
    if (ctr >= 2) return { score: 'Average', color: 'text-yellow-600', bgColor: 'bg-yellow-50' }
    return { score: 'Poor', color: 'text-red-600', bgColor: 'bg-red-50' }
  }

  if (loading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">Widget Performance Monitor</CardTitle>
            <CardDescription>Real-time widget analytics and performance tracking</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-50 text-green-700">
              Live
            </Badge>
            <Button variant="outline" size="sm" onClick={loadWidgets}>
              <Zap className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {widgets.map((widget) => {
            const realTime = realTimeData[widget.id] || { views: 0, clicks: 0, ctr: 0 }
            const totalViews = widget.views + realTime.views
            const totalClicks = widget.clicks + realTime.clicks
            const ctr = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0
            const deviceBreakdown = getDeviceBreakdown(widget.id)
            const performance = getPerformanceScore(ctr)
            
            return (
              <div key={widget.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <div className="text-blue-600">
                        {getWidgetIcon(widget.type)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{widget.name}</h4>
                        <Badge variant={widget.isActive ? "default" : "secondary"}>
                          {widget.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge className={`${performance.bgColor} ${performance.color}`}>
                          {performance.score}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {widget.placement} • {widget.type.charAt(0).toUpperCase() + widget.type.slice(1)} Widget
                      </p>
                      
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">{totalViews.toLocaleString()}</div>
                          <div className="text-xs text-gray-600">Views</div>
                          {realTime.views > 0 && (
                            <div className="text-xs text-green-600 flex items-center justify-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              +{realTime.views}
                            </div>
                          )}
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">{totalClicks}</div>
                          <div className="text-xs text-gray-600">Clicks</div>
                          {realTime.clicks > 0 && (
                            <div className="text-xs text-green-600 flex items-center justify-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              +{realTime.clicks}
                            </div>
                          )}
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">{ctr.toFixed(1)}%</div>
                          <div className="text-xs text-gray-600">CTR</div>
                          <div className="text-xs text-blue-600">
                            {ctr > 5 ? 'High' : ctr > 2 ? 'Average' : 'Low'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Device Breakdown */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Device Breakdown</span>
                    <span className="text-xs text-gray-500">Last 24 hours</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-gray-700">Desktop</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20">
                          <Progress value={deviceBreakdown.desktop} className="h-2" />
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-8">{deviceBreakdown.desktop}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-gray-700">Mobile</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20">
                          <Progress value={deviceBreakdown.mobile} className="h-2" />
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-8">{deviceBreakdown.mobile}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tablet className="h-4 w-4 text-purple-600" />
                        <span className="text-sm text-gray-700">Tablet</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20">
                          <Progress value={deviceBreakdown.tablet} className="h-2" />
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-8">{deviceBreakdown.tablet}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Performance Insights */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-gray-900">Performance Insights</span>
                  </div>
                  <div className="space-y-1">
                    {ctr > 10 && (
                      <p className="text-xs text-green-700">
                        ✓ Excellent conversion rate! This widget is performing very well.
                      </p>
                    )}
                    {ctr < 2 && (
                      <p className="text-xs text-red-700">
                        ⚠ Low conversion rate. Consider optimizing the widget placement or design.
                      </p>
                    )}
                    {totalViews > 1000 && (
                      <p className="text-xs text-blue-700">
                        📈 High visibility widget with strong engagement.
                      </p>
                    )}
                    {deviceBreakdown.mobile > 60 && (
                      <p className="text-xs text-purple-700">
                        📱 Mobile-dominant traffic. Ensure mobile optimization.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}