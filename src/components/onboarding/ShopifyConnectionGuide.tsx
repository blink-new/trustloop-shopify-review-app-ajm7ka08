import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import {
  Store,
  Globe,
  Key,
  Shield,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Info,
  Copy,
  Download,
  ArrowRight,
  Users,
  Settings,
  Code,
  Zap
} from 'lucide-react'

export default function ShopifyConnectionGuide() {
  const [activeTab, setActiveTab] = useState('oauth')
  const { toast } = useToast()

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Code Copied!",
      description: "Code has been copied to your clipboard.",
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
            <Store className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Shopify Connection Guide</h1>
        </div>
        <p className="text-lg text-gray-600">
          Connect your Shopify store to TrustLoop using OAuth or Private App
        </p>
      </div>

      {/* Connection Methods */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="oauth" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            OAuth (Recommended)
          </TabsTrigger>
          <TabsTrigger value="private" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Private App
          </TabsTrigger>
        </TabsList>

        {/* OAuth Method */}
        <TabsContent value="oauth" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                OAuth Connection (Recommended)
              </CardTitle>
              <CardDescription>
                The easiest and most secure way to connect your Shopify store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Recommended:</strong> OAuth provides the best security and user experience. 
                  No manual token management required.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <h4 className="font-semibold">How OAuth Works:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <h5 className="font-medium">Authorization</h5>
                    <p className="text-sm text-gray-600">You're redirected to Shopify to approve permissions</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <h5 className="font-medium">Token Exchange</h5>
                    <p className="text-sm text-gray-600">Shopify securely provides access tokens</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <h5 className="font-medium">Connected</h5>
                    <p className="text-sm text-gray-600">Your store is connected and ready to use</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold">Required Permissions:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Read Products</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Read Orders</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Read Customers</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Read Store Information</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Write Script Tags</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Read Inventory</span>
                    </div>
                  </div>
                </div>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Security:</strong> OAuth tokens are encrypted and stored securely. 
                  TrustLoop never stores your admin credentials.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Private App Method */}
        <TabsContent value="private" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-orange-600" />
                Private App Connection
              </CardTitle>
              <CardDescription>
                For advanced users who need more control over permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Advanced:</strong> Private apps require manual setup and token management. 
                  Only use if you have specific requirements.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <h4 className="font-semibold">Step-by-Step Setup:</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                    <div>
                      <h5 className="font-medium">Access Shopify Admin</h5>
                      <p className="text-sm text-gray-600">Log in to your Shopify admin panel</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                    <div>
                      <h5 className="font-medium">Navigate to Apps</h5>
                      <p className="text-sm text-gray-600">Go to Settings → Apps and sales channels</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                    <div>
                      <h5 className="font-medium">Create Private App</h5>
                      <p className="text-sm text-gray-600">Click "Develop apps" → "Create an app"</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">4</div>
                    <div>
                      <h5 className="font-medium">Configure Permissions</h5>
                      <p className="text-sm text-gray-600">Set up required Admin API access scopes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">5</div>
                    <div>
                      <h5 className="font-medium">Generate Token</h5>
                      <p className="text-sm text-gray-600">Install the app and copy the access token</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold">Required Admin API Scopes:</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Code className="h-3 w-3" />
                      <span>read_products</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Code className="h-3 w-3" />
                      <span>read_orders</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Code className="h-3 w-3" />
                      <span>read_customers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Code className="h-3 w-3" />
                      <span>read_inventory</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Code className="h-3 w-3" />
                      <span>write_script_tags</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Code className="h-3 w-3" />
                      <span>read_content</span>
                    </div>
                  </div>
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Token Format:</strong> Your private app access token will start with "shpat_" 
                  followed by a long string of characters.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Common Setup Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            After Connection
          </CardTitle>
          <CardDescription>
            What happens after your store is connected
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-green-700">✓ Automatic Setup:</h4>
              <ul className="text-sm space-y-1">
                <li>• Product sync begins immediately</li>
                <li>• Order webhooks are configured</li>
                <li>• Customer data is imported</li>
                <li>• Email templates are created</li>
                <li>• Widget tracking is enabled</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-700">⚡ Next Steps:</h4>
              <ul className="text-sm space-y-1">
                <li>• Configure email campaigns</li>
                <li>• Customize review widgets</li>
                <li>• Set up moderation rules</li>
                <li>• Install widget code</li>
                <li>• Test the integration</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security & Compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Compliance
          </CardTitle>
          <CardDescription>
            How TrustLoop protects your data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h5 className="font-medium">Encrypted Storage</h5>
              <p className="text-sm text-gray-600">All tokens encrypted at rest</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Globe className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h5 className="font-medium">HTTPS Only</h5>
              <p className="text-sm text-gray-600">Secure transmission protocols</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h5 className="font-medium">GDPR Compliant</h5>
              <p className="text-sm text-gray-600">Data protection standards</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle>Common Issues & Solutions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 bg-red-50 rounded-lg">
              <h5 className="font-medium text-red-800">Connection Failed</h5>
              <p className="text-sm text-red-700">Check your store domain format and try again</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <h5 className="font-medium text-yellow-800">Invalid Token</h5>
              <p className="text-sm text-yellow-700">Ensure your private app has all required permissions</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <h5 className="font-medium text-blue-800">Permission Denied</h5>
              <p className="text-sm text-blue-700">Contact your store owner to install the app</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4">
        <Button variant="outline" asChild>
          <a href="https://docs.trustloop.com/shopify" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Full Documentation
          </a>
        </Button>
        <Button>
          <ArrowRight className="h-4 w-4 mr-2" />
          Start Connection
        </Button>
      </div>
    </div>
  )
}