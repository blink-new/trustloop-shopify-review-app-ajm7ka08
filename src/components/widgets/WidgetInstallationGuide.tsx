import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { 
  Code, 
  Copy, 
  ExternalLink, 
  Check, 
  AlertTriangle,
  FileText,
  Zap,
  Settings,
  Globe,
  Smartphone,
  Monitor
} from 'lucide-react'

interface Widget {
  id: string
  name: string
  type: string
  isActive: boolean
  installCode: string
  placement: string
}

interface WidgetInstallationGuideProps {
  widgets: Widget[]
}

export default function WidgetInstallationGuide({ widgets }: WidgetInstallationGuideProps) {
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(widgets[0] || null)
  const [copiedCode, setCopiedCode] = useState('')
  const { toast } = useToast()

  const handleCopyCode = (code: string, type: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast({
      title: 'Code Copied',
      description: `${type} code has been copied to clipboard.`,
    })
    
    // Reset copied state after 2 seconds
    setTimeout(() => setCopiedCode(''), 2000)
  }

  const installationSteps = [
    {
      step: 1,
      title: 'Copy the Installation Code',
      description: 'Copy the widget installation code from the code block below.',
      icon: <Copy className="h-5 w-5" />
    },
    {
      step: 2,
      title: 'Access Your Shopify Admin',
      description: 'Log in to your Shopify admin panel and navigate to Online Store → Themes.',
      icon: <Globe className="h-5 w-5" />
    },
    {
      step: 3,
      title: 'Edit Your Theme',
      description: 'Click "Actions" → "Edit code" on your active theme.',
      icon: <Code className="h-5 w-5" />
    },
    {
      step: 4,
      title: 'Paste the Code',
      description: 'Paste the installation code in the appropriate template file based on widget type.',
      icon: <FileText className="h-5 w-5" />
    },
    {
      step: 5,
      title: 'Save and Test',
      description: 'Save your changes and test the widget on your store.',
      icon: <Check className="h-5 w-5" />
    }
  ]

  const getPlacementInstructions = (type: string) => {
    switch (type) {
      case 'carousel':
        return {
          file: 'sections/index.liquid or templates/index.liquid',
          location: 'After the hero section or before the footer',
          code: `<!-- TrustLoop Homepage Carousel -->
<div id="trustloop-carousel"></div>
${selectedWidget?.installCode || ''}
<!-- End TrustLoop Carousel -->`
        }
      case 'product':
        return {
          file: 'sections/product-form.liquid or templates/product.liquid',
          location: 'After the product description or in the product tabs',
          code: `<!-- TrustLoop Product Reviews -->
<div id="trustloop-product-reviews"></div>
${selectedWidget?.installCode || ''}
<!-- End TrustLoop Product Reviews -->`
        }
      case 'collection':
        return {
          file: 'sections/collection-template.liquid or templates/collection.liquid',
          location: 'In the product grid loop or after product cards',
          code: `<!-- TrustLoop Collection Ratings -->
<div id="trustloop-collection-ratings"></div>
${selectedWidget?.installCode || ''}
<!-- End TrustLoop Collection Ratings -->`
        }
      case 'floating':
        return {
          file: 'layout/theme.liquid',
          location: 'Before the closing </body> tag',
          code: `<!-- TrustLoop Floating Widget -->
${selectedWidget?.installCode || ''}
<!-- End TrustLoop Floating Widget -->`
        }
      case 'popup':
        return {
          file: 'layout/theme.liquid',
          location: 'Before the closing </body> tag',
          code: `<!-- TrustLoop Popup Widget -->
${selectedWidget?.installCode || ''}
<!-- End TrustLoop Popup Widget -->`
        }
      case 'thankyou':
        return {
          file: 'templates/orders/order.liquid',
          location: 'After the order details',
          code: `<!-- TrustLoop Thank You Widget -->
<div id="trustloop-thankyou"></div>
${selectedWidget?.installCode || ''}
<!-- End TrustLoop Thank You Widget -->`
        }
      default:
        return {
          file: 'layout/theme.liquid',
          location: 'Before the closing </body> tag',
          code: selectedWidget?.installCode || ''
        }
    }
  }

  const placementInfo = selectedWidget ? getPlacementInstructions(selectedWidget.type) : null

  return (
    <div className="space-y-6">
      {/* Widget Selection */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Select Widget to Install</CardTitle>
          <CardDescription>Choose which widget you want to install on your store</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {widgets.map((widget) => (
              <div
                key={widget.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedWidget?.id === widget.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedWidget(widget)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{widget.name}</h3>
                  <Badge variant={widget.isActive ? 'default' : 'secondary'}>
                    {widget.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{widget.placement}</p>
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-500 font-mono">{widget.type}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedWidget && (
        <>
          {/* Installation Instructions */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Installation Instructions</CardTitle>
              <CardDescription>Follow these steps to install your {selectedWidget.name} widget</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {installationSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">{step.step}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{step.title}</h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                    <div className="text-gray-400">
                      {step.icon}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Code Installation */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Installation Code</CardTitle>
              <CardDescription>Copy and paste this code into your theme</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="liquid" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="liquid">Liquid Template</TabsTrigger>
                  <TabsTrigger value="html">HTML/JavaScript</TabsTrigger>
                  <TabsTrigger value="instructions">File Instructions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="liquid" className="space-y-4">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>File:</strong> {placementInfo?.file}<br />
                      <strong>Location:</strong> {placementInfo?.location}
                    </AlertDescription>
                  </Alert>
                  
                  <div className="relative">
                    <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                      <code>{placementInfo?.code}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2"
                      onClick={() => handleCopyCode(placementInfo?.code || '', 'Liquid template')}
                    >
                      {copiedCode === placementInfo?.code ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="html" className="space-y-4">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      This is the basic JavaScript code. For Shopify, use the Liquid template version instead.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="relative">
                    <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                      <code>{selectedWidget.installCode}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2"
                      onClick={() => handleCopyCode(selectedWidget.installCode, 'JavaScript')}
                    >
                      {copiedCode === selectedWidget.installCode ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="instructions" className="space-y-4">
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Detailed Installation Steps</h4>
                      <div className="space-y-3 text-sm text-blue-800">
                        <div>
                          <strong>1. Access Theme Editor:</strong>
                          <p>In your Shopify admin, go to Online Store → Themes → Actions → Edit code</p>
                        </div>
                        <div>
                          <strong>2. Locate Template File:</strong>
                          <p>Find and open: <code className="bg-blue-100 px-1 rounded">{placementInfo?.file}</code></p>
                        </div>
                        <div>
                          <strong>3. Insert Code:</strong>
                          <p>Paste the installation code at: {placementInfo?.location}</p>
                        </div>
                        <div>
                          <strong>4. Save Changes:</strong>
                          <p>Click "Save" and preview your store to see the widget</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-medium text-yellow-900 mb-2">Important Notes</h4>
                      <ul className="space-y-1 text-sm text-yellow-800">
                        <li>• Always backup your theme before making changes</li>
                        <li>• Test the widget on a development theme first</li>
                        <li>• The widget will only show when it's activated in the dashboard</li>
                        <li>• Widget styling will inherit from your theme's CSS</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Testing Guide */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Testing Your Widget</CardTitle>
              <CardDescription>Verify that your widget is working correctly</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Desktop Testing</h4>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Monitor className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium">Preview on Desktop</p>
                      <p className="text-xs text-gray-600">Check widget responsiveness and layout</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p>• Widget appears in correct location</p>
                    <p>• Reviews are displaying properly</p>
                    <p>• Click interactions work</p>
                    <p>• Colors match your theme</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Mobile Testing</h4>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Smartphone className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium">Preview on Mobile</p>
                      <p className="text-xs text-gray-600">Ensure mobile responsiveness</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p>• Widget is mobile-friendly</p>
                    <p>• Text is readable on small screens</p>
                    <p>• Touch interactions work</p>
                    <p>• Loading performance is good</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <h4 className="font-medium text-green-900">Widget Successfully Installed!</h4>
                </div>
                <p className="text-sm text-green-800">
                  Your {selectedWidget.name} widget is now active. Monitor its performance in the dashboard and adjust settings as needed.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Troubleshooting */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Troubleshooting</CardTitle>
              <CardDescription>Common issues and solutions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Widget Not Showing</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Check if the widget is activated in the dashboard</li>
                    <li>• Verify the installation code is in the correct template file</li>
                    <li>• Clear your browser cache and reload the page</li>
                    <li>• Check browser console for JavaScript errors</li>
                  </ul>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Styling Issues</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Customize colors in the widget configuration</li>
                    <li>• Add custom CSS in the widget settings</li>
                    <li>• Check for CSS conflicts with your theme</li>
                    <li>• Test on different devices and browsers</li>
                  </ul>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Performance Issues</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Reduce the number of reviews displayed</li>
                    <li>• Disable auto-rotation if not needed</li>
                    <li>• Optimize images in review content</li>
                    <li>• Consider lazy loading for large widgets</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}