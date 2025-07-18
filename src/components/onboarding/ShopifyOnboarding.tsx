import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { createSampleShop, createSampleReviews, createSampleWidgets, createSampleCampaigns } from '@/utils/initializeDatabase'
import {
  Store,
  CheckCircle,
  ArrowRight,
  Loader2,
  ExternalLink,
  Shield,
  Zap,
  Mail,
  Instagram,
  BarChart3,
  Code,
  Key,
  Globe,
  Users,
  Smartphone,
  Monitor
} from 'lucide-react'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  completed: boolean
}

export default function ShopifyOnboarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const [shopDomain, setShopDomain] = useState('')
  const [connectionType, setConnectionType] = useState<'oauth' | 'private'>('oauth')
  const [privateToken, setPrivateToken] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState('')
  const { connectShop, user } = useAuth()
  const { toast } = useToast()

  const steps: OnboardingStep[] = [
    {
      id: 'connect',
      title: 'Connect Your Shopify Store',
      description: 'Link your Shopify store to start managing reviews and UGC',
      icon: <Store className="h-5 w-5" />,
      completed: false
    },
    {
      id: 'setup',
      title: 'Configure Settings',
      description: 'Set up your review preferences and email templates',
      icon: <Shield className="h-5 w-5" />,
      completed: false
    },
    {
      id: 'widgets',
      title: 'Install Widgets',
      description: 'Add review widgets to your store pages',
      icon: <Zap className="h-5 w-5" />,
      completed: false
    },
    {
      id: 'complete',
      title: 'All Set!',
      description: 'Your store is ready to collect and display reviews',
      icon: <CheckCircle className="h-5 w-5" />,
      completed: false
    }
  ]

  const features = [
    {
      icon: <Mail className="h-5 w-5 text-blue-600" />,
      title: 'Automated Email Campaigns',
      description: 'Send review requests and follow-ups automatically'
    },
    {
      icon: <Instagram className="h-5 w-5 text-pink-600" />,
      title: 'Instagram UGC Integration',
      description: 'Collect and showcase user-generated content'
    },
    {
      icon: <BarChart3 className="h-5 w-5 text-green-600" />,
      title: 'Advanced Analytics',
      description: 'Track review performance and customer sentiment'
    },
    {
      icon: <Zap className="h-5 w-5 text-yellow-600" />,
      title: 'AI-Powered Moderation',
      description: 'Automatically moderate reviews with AI'
    }
  ]

  const handleConnectShop = async () => {
    if (!shopDomain.trim()) {
      setError('Please enter your shop domain')
      return
    }

    // Validate shop domain format
    if (!shopDomain.includes('.myshopify.com')) {
      setError('Please enter a valid Shopify domain (e.g., your-store.myshopify.com)')
      return
    }

    // If using private app, validate token
    if (connectionType === 'private') {
      if (!privateToken.trim()) {
        setError('Please enter your private app access token')
        return
      }
      if (!privateToken.startsWith('shpat_')) {
        setError('Private app access token should start with "shpat_"')
        return
      }
    }

    setIsConnecting(true)
    setError('')

    try {
      if (connectionType === 'oauth') {
        // OAuth flow - redirect to Shopify
        const authUrl = `https://${shopDomain}/admin/oauth/authorize?client_id=your-client-id&scope=read_products,read_orders,read_customers&redirect_uri=${window.location.origin}/auth/callback&state=${btoa(Math.random().toString())}`
        window.location.href = authUrl
      } else {
        // Private app flow - validate token and connect
        if (!user) {
          setError('User not authenticated')
          return
        }

        // Create shop record in database
        try {
          const shop = await createSampleShop(user.id, shopDomain)
          
          // Create sample data for demo
          await createSampleReviews(user.id, shop.id)
          await createSampleWidgets(user.id, shop.id)
          await createSampleCampaigns(user.id, shop.id)
          
          toast({
            title: 'Shop Connected!',
            description: `Successfully connected to ${shopDomain} with sample data`,
          })
          
          // Move to next step
          setCurrentStep(1)
        } catch (err) {
          console.error('Failed to create shop:', err)
          setError('Failed to create shop record. Please try again.')
        }
      }
    } catch (err) {
      setError('Failed to connect to your Shopify store. Please try again.')
      console.error('Connection error:', err)
    } finally {
      if (connectionType === 'private') {
        setIsConnecting(false)
      }
    }
  }

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleSkipOnboarding = () => {
    toast({
      title: 'Onboarding Skipped',
      description: 'You can access these features from the dashboard anytime.',
    })
    // In a real app, this would redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
              <Store className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">TrustLoop</h1>
          </div>
          <p className="text-lg text-gray-600">
            The complete review and UGC management solution for Shopify stores
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  index === currentStep
                    ? 'bg-blue-600 text-white'
                    : index < currentStep
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    index < currentStep ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {steps[currentStep].title}
            </CardTitle>
            <CardDescription className="text-lg">
              {steps[currentStep].description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 0: Connect Shop */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <Tabs value={connectionType} onValueChange={(value) => setConnectionType(value as 'oauth' | 'private')}>
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
                  
                  <TabsContent value="oauth" className="space-y-4">
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">OAuth Connection (Recommended)</h4>
                        <p className="text-sm text-blue-800">
                          Connect your Shopify store securely using OAuth. This is the recommended method for most users.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="shop-domain" className="text-sm font-medium">
                          Shopify Store Domain
                        </Label>
                        <Input
                          id="shop-domain"
                          type="text"
                          placeholder="your-store.myshopify.com"
                          value={shopDomain}
                          onChange={(e) => setShopDomain(e.target.value)}
                          className="h-12"
                        />
                        <p className="text-xs text-gray-500">
                          Enter your Shopify store domain (e.g., my-store.myshopify.com)
                        </p>
                      </div>
                      
                      {error && (
                        <Alert variant="destructive">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="flex justify-center">
                      <Button
                        onClick={handleConnectShop}
                        disabled={isConnecting}
                        className="bg-blue-600 hover:bg-blue-700 h-12 px-8"
                      >
                        {isConnecting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <Store className="mr-2 h-4 w-4" />
                            Connect with OAuth
                          </>
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="private" className="space-y-4">
                    <div className="space-y-4">
                      <div className="p-4 bg-orange-50 rounded-lg">
                        <h4 className="font-medium text-orange-900 mb-2">Private App Connection</h4>
                        <p className="text-sm text-orange-800">
                          Use a private app token if you have one. This requires manual setup in your Shopify admin.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="shop-domain-private" className="text-sm font-medium">
                          Shopify Store Domain
                        </Label>
                        <Input
                          id="shop-domain-private"
                          type="text"
                          placeholder="your-store.myshopify.com"
                          value={shopDomain}
                          onChange={(e) => setShopDomain(e.target.value)}
                          className="h-12"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="private-token" className="text-sm font-medium">
                          Private App Access Token
                        </Label>
                        <Input
                          id="private-token"
                          type="password"
                          placeholder="shpat_xxxxxxxxxxxxx"
                          value={privateToken}
                          onChange={(e) => setPrivateToken(e.target.value)}
                          className="h-12"
                        />
                        <p className="text-xs text-gray-500">
                          Your private app access token (starts with shpat_)
                        </p>
                      </div>
                      
                      {error && (
                        <Alert variant="destructive">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="flex justify-center">
                      <Button
                        onClick={handleConnectShop}
                        disabled={isConnecting}
                        className="bg-orange-600 hover:bg-orange-700 h-12 px-8"
                      >
                        {isConnecting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <Key className="mr-2 h-4 w-4" />
                            Connect with Private App
                          </>
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    Don't have a Shopify store yet?
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://shopify.com" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Start Free Trial
                    </a>
                  </Button>
                </div>
              </div>
            )}

            {/* Step 1: Setup */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Store Connected Successfully!
                  </h3>
                  <p className="text-gray-600">
                    Your Shopify store is now connected. Let's set up your preferences.
                  </p>
                </div>

                <div className="grid gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Email Templates</h4>
                    <p className="text-sm text-blue-800">
                      We've created default email templates for review requests and follow-ups.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">AI Moderation</h4>
                    <p className="text-sm text-green-800">
                      AI-powered moderation is enabled to automatically filter reviews.
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">Review Widgets</h4>
                    <p className="text-sm text-purple-800">
                      Review widgets are ready to be installed on your store pages.
                    </p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button onClick={handleNextStep} className="h-12 px-8">
                    Continue Setup
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Widgets */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Install Review Widgets
                  </h3>
                  <p className="text-gray-600">
                    Add review widgets to your store to start collecting and displaying reviews.
                  </p>
                </div>

                <div className="grid gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Product Page Reviews</h4>
                        <p className="text-sm text-gray-600">Display reviews on product pages</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Install Widget
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Homepage Carousel</h4>
                        <p className="text-sm text-gray-600">Show featured reviews on homepage</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Install Widget
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Floating Review Widget</h4>
                        <p className="text-sm text-gray-600">Floating review display</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Install Widget
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button onClick={handleNextStep} className="h-12 px-8">
                    Finish Setup
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Complete */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    You're All Set!
                  </h3>
                  <p className="text-gray-600">
                    Your TrustLoop setup is complete. Start collecting reviews and managing UGC.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{feature.title}</h4>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-green-600 hover:bg-green-700 h-12 px-8"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={handleSkipOnboarding}
            className="text-gray-600 hover:text-gray-900"
          >
            Skip onboarding for now
          </Button>
        </div>
      </div>
    </div>
  )
}