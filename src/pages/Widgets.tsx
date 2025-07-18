import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'

import { useToast } from '@/hooks/use-toast'
import WidgetInstallationGuide from '@/components/widgets/WidgetInstallationGuide'
import WidgetPerformanceMonitor from '@/components/widgets/WidgetPerformanceMonitor'
import { dataService } from '@/services/dataService'
import { 
  Code, 
  Eye, 
  Settings, 
  Palette, 
  Star, 
  MousePointer, 
  Copy,
  Plus,
  Smartphone,
  Monitor,
  Play,
  Pause,
  BarChart,
  Download,
  ExternalLink,
  Zap,
  Image,
  MessageSquare,
  Globe,
  Layout,
  Sparkles
} from 'lucide-react'

interface WidgetConfiguration {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  borderRadius: number
  showPhotos: boolean
  showDates: boolean
  showRatings: boolean
  showCustomerNames: boolean
  layout: 'grid' | 'list' | 'carousel'
  animationSpeed: number
  maxReviews: number
  autoRotate: boolean
  showPagination: boolean
  customCSS: string
}

interface Widget {
  id: string
  name: string
  type: 'carousel' | 'product' | 'collection' | 'floating' | 'thankyou' | 'popup'
  isActive: boolean
  configuration: WidgetConfiguration
  views: number
  clicks: number
  placement: string
  performance: {
    impressions: number
    clickThrough: number
    conversions: number
  }
  previewUrl: string
  installCode: string
}

const widgetTypes = [
  {
    id: 'carousel',
    name: 'Homepage Carousel',
    description: 'Showcase top reviews in a beautiful carousel format',
    icon: <Layout className="h-5 w-5" />,
    placement: 'Homepage',
    features: ['Auto-rotating', 'Photo support', 'Mobile responsive']
  },
  {
    id: 'product',
    name: 'Product Page Reviews',
    description: 'Display reviews directly on product pages',
    icon: <Star className="h-5 w-5" />,
    placement: 'Product Pages',
    features: ['Filtered by product', 'Pagination', 'Sort options']
  },
  {
    id: 'collection',
    name: 'Collection Rating Snippets',
    description: 'Show star ratings in collection/category pages',
    icon: <Globe className="h-5 w-5" />,
    placement: 'Collection Pages',
    features: ['Compact design', 'Quick loading', 'SEO friendly']
  },
  {
    id: 'floating',
    name: 'Floating Review Widget',
    description: 'Sticky widget that follows user scroll',
    icon: <MousePointer className="h-5 w-5" />,
    placement: 'All Pages',
    features: ['Always visible', 'Customizable position', 'Expandable']
  },
  {
    id: 'popup',
    name: 'Social Proof Popup',
    description: 'Show recent reviews in popup notifications',
    icon: <MessageSquare className="h-5 w-5" />,
    placement: 'Site-wide',
    features: ['Real-time updates', 'Exit intent', 'Timed display']
  },
  {
    id: 'thankyou',
    name: 'Thank You Page Widget',
    description: 'Encourage reviews on post-purchase pages',
    icon: <Sparkles className="h-5 w-5" />,
    placement: 'Thank You Page',
    features: ['Review request', 'Incentive offers', 'Social sharing']
  }
]

export default function Widgets() {
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null)
  const [selectedTab, setSelectedTab] = useState('overview')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newWidgetType, setNewWidgetType] = useState('')
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop')
  const { toast } = useToast()

  useEffect(() => {
    loadWidgets()
  }, [])

  const loadWidgets = async () => {
    try {
      setLoading(true)
      // Mock widgets data
      const mockWidgets: Widget[] = [
        {
          id: 'widget_1',
          name: 'Homepage Carousel',
          type: 'carousel',
          isActive: true,
          configuration: {
            primaryColor: '#005BD3',
            secondaryColor: '#E6F3FF',
            backgroundColor: '#FFFFFF',
            textColor: '#1F2937',
            borderRadius: 8,
            showPhotos: true,
            showDates: true,
            showRatings: true,
            showCustomerNames: true,
            layout: 'carousel',
            animationSpeed: 3000,
            maxReviews: 10,
            autoRotate: true,
            showPagination: true,
            customCSS: ''
          },
          views: 15420,
          clicks: 890,
          placement: 'Homepage',
          performance: {
            impressions: 15420,
            clickThrough: 5.77,
            conversions: 34
          },
          previewUrl: 'https://example.com/preview/carousel',
          installCode: '<script src="https://cdn.trustloop.com/widget.js" data-widget-id="widget_1"></script>'
        },
        {
          id: 'widget_2',
          name: 'Product Page Reviews',
          type: 'product',
          isActive: true,
          configuration: {
            primaryColor: '#005BD3',
            secondaryColor: '#E6F3FF',
            backgroundColor: '#FFFFFF',
            textColor: '#1F2937',
            borderRadius: 8,
            showPhotos: true,
            showDates: true,
            showRatings: true,
            showCustomerNames: true,
            layout: 'list',
            animationSpeed: 0,
            maxReviews: 20,
            autoRotate: false,
            showPagination: true,
            customCSS: ''
          },
          views: 28450,
          clicks: 1240,
          placement: 'Product Pages',
          performance: {
            impressions: 28450,
            clickThrough: 4.36,
            conversions: 67
          },
          previewUrl: 'https://example.com/preview/product',
          installCode: '<script src="https://cdn.trustloop.com/widget.js" data-widget-id="widget_2"></script>'
        },
        {
          id: 'widget_3',
          name: 'Floating Social Proof',
          type: 'floating',
          isActive: false,
          configuration: {
            primaryColor: '#005BD3',
            secondaryColor: '#E6F3FF',
            backgroundColor: '#FFFFFF',
            textColor: '#1F2937',
            borderRadius: 12,
            showPhotos: false,
            showDates: false,
            showRatings: true,
            showCustomerNames: true,
            layout: 'list',
            animationSpeed: 0,
            maxReviews: 5,
            autoRotate: false,
            showPagination: false,
            customCSS: ''
          },
          views: 0,
          clicks: 0,
          placement: 'All Pages',
          performance: {
            impressions: 0,
            clickThrough: 0,
            conversions: 0
          },
          previewUrl: 'https://example.com/preview/floating',
          installCode: '<script src="https://cdn.trustloop.com/widget.js" data-widget-id="widget_3"></script>'
        }
      ]
      setWidgets(mockWidgets)
    } catch (error) {
      console.error('Error loading widgets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleWidget = async (widgetId: string, isActive: boolean) => {
    try {
      await dataService.updateWidgetStatus(widgetId, isActive)
      setWidgets(prev => prev.map(w => 
        w.id === widgetId ? { ...w, isActive } : w
      ))
      
      toast({
        title: isActive ? 'Widget Activated' : 'Widget Deactivated',
        description: `The widget has been ${isActive ? 'activated' : 'deactivated'} successfully.`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update widget status.',
        variant: 'destructive'
      })
    }
  }

  const handleCreateWidget = async () => {
    if (!newWidgetType) return
    
    const widgetType = widgetTypes.find(t => t.id === newWidgetType)
    if (!widgetType) return
    
    try {
      const newWidget: Widget = {
        id: `widget_${Date.now()}`,
        name: `${widgetType.name} ${widgets.length + 1}`,
        type: newWidgetType as Widget['type'],
        isActive: false,
        configuration: {
          primaryColor: '#005BD3',
          secondaryColor: '#E6F3FF',
          backgroundColor: '#FFFFFF',
          textColor: '#1F2937',
          borderRadius: 8,
          showPhotos: true,
          showDates: true,
          showRatings: true,
          showCustomerNames: true,
          layout: 'carousel',
          animationSpeed: 3000,
          maxReviews: 10,
          autoRotate: true,
          showPagination: true,
          customCSS: ''
        },
        views: 0,
        clicks: 0,
        placement: widgetType.placement,
        performance: {
          impressions: 0,
          clickThrough: 0,
          conversions: 0
        },
        previewUrl: `https://example.com/preview/${newWidgetType}`,
        installCode: `<script src="https://cdn.trustloop.com/widget.js" data-widget-id="${Date.now()}"></script>`
      }
      
      setWidgets(prev => [...prev, newWidget])
      setShowCreateDialog(false)
      setNewWidgetType('')
      
      toast({
        title: 'Widget Created',
        description: `${widgetType.name} has been created successfully.`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create widget.',
        variant: 'destructive'
      })
    }
  }

  const handleCopyInstallCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: 'Code Copied',
      description: 'Installation code has been copied to clipboard.',
    })
  }

  const handleUpdateConfiguration = async (widgetId: string, config: Partial<WidgetConfiguration>) => {
    try {
      await dataService.updateWidgetConfiguration(widgetId, config)
      setWidgets(prev => prev.map(w => 
        w.id === widgetId ? { ...w, configuration: { ...w.configuration, ...config } } : w
      ))
      
      toast({
        title: 'Configuration Updated',
        description: 'Widget configuration has been saved.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update widget configuration.',
        variant: 'destructive'
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Widgets</h1>
          <p className="text-gray-600">Customize and manage your review widgets</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Analytics
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Widget
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Widget</DialogTitle>
                <DialogDescription>
                  Choose a widget type to add to your store
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {widgetTypes.map((type) => (
                  <div
                    key={type.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      newWidgetType === type.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setNewWidgetType(type.id)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-blue-600">{type.icon}</div>
                      <div>
                        <h3 className="font-medium text-gray-900">{type.name}</h3>
                        <p className="text-sm text-gray-600">{type.placement}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {type.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateWidget}
                  disabled={!newWidgetType}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Create Widget
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Widget Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Total Views</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {widgets.reduce((sum, w) => sum + w.views, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <MousePointer className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Total Clicks</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {widgets.reduce((sum, w) => sum + w.clicks, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Active Widgets</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {widgets.filter(w => w.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-gray-600">Avg. CTR</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {widgets.length > 0 
                ? (widgets.reduce((sum, w) => sum + (w.views > 0 ? (w.clicks / w.views) * 100 : 0), 0) / widgets.length).toFixed(1)
                : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Widget Management */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="customization">Customization</TabsTrigger>
          <TabsTrigger value="installation">Installation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {widgets.map((widget) => (
              <Card key={widget.id} className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="text-blue-600">
                        {widgetTypes.find(t => t.id === widget.type)?.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{widget.name}</CardTitle>
                        <CardDescription>{widget.placement}</CardDescription>
                      </div>
                    </div>
                    <Switch 
                      checked={widget.isActive}
                      onCheckedChange={(checked) => handleToggleWidget(widget.id, checked)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Views</div>
                        <div className="text-lg font-semibold">{widget.views.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Clicks</div>
                        <div className="text-lg font-semibold">{widget.clicks.toLocaleString()}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">CTR</div>
                        <div className="text-lg font-semibold">
                          {widget.views > 0 ? ((widget.clicks / widget.views) * 100).toFixed(1) : 0}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Conversions</div>
                        <div className="text-lg font-semibold">{widget.performance.conversions}</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setSelectedWidget(widget)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(widget.previewUrl, '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCopyInstallCode(widget.installCode)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="customization" className="space-y-4">
          {selectedWidget ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Widget Configuration</CardTitle>
                  <CardDescription>Customize the appearance and behavior of your widget</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="widget-name">Widget Name</Label>
                      <Input 
                        id="widget-name"
                        value={selectedWidget.name}
                        onChange={(e) => setSelectedWidget({...selectedWidget, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="primary-color">Primary Color</Label>
                        <div className="flex gap-2">
                          <Input 
                            id="primary-color"
                            value={selectedWidget.configuration.primaryColor}
                            onChange={(e) => handleUpdateConfiguration(selectedWidget.id, {primaryColor: e.target.value})}
                          />
                          <div 
                            className="w-10 h-10 rounded border"
                            style={{ backgroundColor: selectedWidget.configuration.primaryColor }}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="text-color">Text Color</Label>
                        <div className="flex gap-2">
                          <Input 
                            id="text-color"
                            value={selectedWidget.configuration.textColor}
                            onChange={(e) => handleUpdateConfiguration(selectedWidget.id, {textColor: e.target.value})}
                          />
                          <div 
                            className="w-10 h-10 rounded border"
                            style={{ backgroundColor: selectedWidget.configuration.textColor }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="border-radius">Border Radius: {selectedWidget.configuration.borderRadius}px</Label>
                      <Slider
                        id="border-radius"
                        value={[selectedWidget.configuration.borderRadius]}
                        onValueChange={(value) => handleUpdateConfiguration(selectedWidget.id, {borderRadius: value[0]})}
                        max={20}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="max-reviews">Max Reviews: {selectedWidget.configuration.maxReviews}</Label>
                      <Slider
                        id="max-reviews"
                        value={[selectedWidget.configuration.maxReviews]}
                        onValueChange={(value) => handleUpdateConfiguration(selectedWidget.id, {maxReviews: value[0]})}
                        min={1}
                        max={50}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-photos">Show Photos</Label>
                        <Switch 
                          id="show-photos"
                          checked={selectedWidget.configuration.showPhotos}
                          onCheckedChange={(checked) => handleUpdateConfiguration(selectedWidget.id, {showPhotos: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-dates">Show Dates</Label>
                        <Switch 
                          id="show-dates"
                          checked={selectedWidget.configuration.showDates}
                          onCheckedChange={(checked) => handleUpdateConfiguration(selectedWidget.id, {showDates: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-ratings">Show Ratings</Label>
                        <Switch 
                          id="show-ratings"
                          checked={selectedWidget.configuration.showRatings}
                          onCheckedChange={(checked) => handleUpdateConfiguration(selectedWidget.id, {showRatings: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="auto-rotate">Auto Rotate</Label>
                        <Switch 
                          id="auto-rotate"
                          checked={selectedWidget.configuration.autoRotate}
                          onCheckedChange={(checked) => handleUpdateConfiguration(selectedWidget.id, {autoRotate: checked})}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="custom-css">Custom CSS</Label>
                      <Textarea 
                        id="custom-css"
                        placeholder="/* Add your custom CSS here */"
                        value={selectedWidget.configuration.customCSS}
                        onChange={(e) => handleUpdateConfiguration(selectedWidget.id, {customCSS: e.target.value})}
                        rows={6}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Widget Preview</CardTitle>
                      <CardDescription>See how your widget will look on your store</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={previewDevice === 'desktop' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPreviewDevice('desktop')}
                      >
                        <Monitor className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={previewDevice === 'mobile' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPreviewDevice('mobile')}
                      >
                        <Smartphone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`border rounded-lg p-4 ${previewDevice === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600 mb-2">Widget Preview</div>
                      <div 
                        className="p-4 rounded-lg border"
                        style={{ 
                          backgroundColor: selectedWidget.configuration.backgroundColor,
                          borderRadius: `${selectedWidget.configuration.borderRadius}px`,
                          borderColor: selectedWidget.configuration.primaryColor
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">4.8</span>
                        </div>
                        <p 
                          className="text-sm mb-2"
                          style={{ color: selectedWidget.configuration.textColor }}
                        >
                          Amazing product! Great quality and fast shipping.
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>Sarah M.</span>
                          {selectedWidget.configuration.showDates && <span>• 2 days ago</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-12 text-center">
                <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Widget to Customize</h3>
                <p className="text-gray-600">Choose a widget from the overview tab to start customizing its appearance and behavior.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="installation" className="space-y-4">
          <WidgetInstallationGuide widgets={widgets} />
        </TabsContent>
      </Tabs>
    </div>
  )
}