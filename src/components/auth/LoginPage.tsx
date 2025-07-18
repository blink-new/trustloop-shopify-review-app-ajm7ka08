import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import {
  Store,
  Shield,
  Zap,
  Mail,
  Instagram,
  BarChart3,
  Star,
  Users,
  Globe,
  CheckCircle,
  ArrowRight,
  ExternalLink
} from 'lucide-react'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const { toast } = useToast()

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      // Blink SDK handles Google OAuth automatically
      await login()
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: "Login Failed",
        description: "There was an error signing in. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

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
    },
    {
      icon: <Star className="h-5 w-5 text-purple-600" />,
      title: 'Customizable Widgets',
      description: 'Beautiful review widgets for your store'
    },
    {
      icon: <Shield className="h-5 w-5 text-red-600" />,
      title: 'Secure & Compliant',
      description: 'GDPR compliant with enterprise security'
    }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Store Owner",
      company: "Eco Beauty Co.",
      quote: "TrustLoop increased our review collection by 300% and improved our conversion rate significantly.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b632?w=150"
    },
    {
      name: "Michael Chen",
      role: "Marketing Director",
      company: "Tech Gadgets Plus",
      quote: "The AI moderation and automation features save us hours every week. Highly recommend!",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
    },
    {
      name: "Emma Rodriguez",
      role: "E-commerce Manager",
      company: "Fashion Forward",
      quote: "The Instagram UGC integration has been a game-changer for our social proof strategy.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Column - Login Form */}
          <div className="space-y-6">
            {/* Logo and Title */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                  <Store className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">TrustLoop</h1>
                  <p className="text-sm text-gray-600">Shopify Review & UGC Management</p>
                </div>
              </div>
              <p className="text-lg text-gray-600 max-w-md mx-auto lg:mx-0">
                Transform your Shopify store with powerful review collection, AI moderation, and social proof widgets.
              </p>
            </div>

            {/* Login Card */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 text-center">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-center">
                  Sign in to your TrustLoop account to manage your reviews and UGC
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Google Login Button */}
                <Button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Sign in with Google
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    By signing in, you agree to our{' '}
                    <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>{' '}
                    and{' '}
                    <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-lg">
                <div className="text-2xl font-bold text-blue-600">10K+</div>
                <div className="text-sm text-gray-600">Active Stores</div>
              </div>
              <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-lg">
                <div className="text-2xl font-bold text-green-600">50M+</div>
                <div className="text-sm text-gray-600">Reviews Managed</div>
              </div>
              <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-lg">
                <div className="text-2xl font-bold text-purple-600">98%</div>
                <div className="text-sm text-gray-600">Satisfaction Rate</div>
              </div>
            </div>
          </div>

          {/* Right Column - Features and Testimonials */}
          <div className="space-y-8">
            {/* Features Grid */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center lg:text-left">
                Everything you need for review management
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center lg:text-left">
                Trusted by successful stores
              </h2>
              <div className="space-y-4">
                {testimonials.slice(0, 2).map((testimonial, index) => (
                  <div key={index} className="p-4 bg-white/80 backdrop-blur-sm rounded-lg">
                    <div className="flex items-start gap-3">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 mb-2">"{testimonial.quote}"</p>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{testimonial.name}</span>
                          <span className="text-gray-500">•</span>
                          <span className="text-sm text-gray-600">{testimonial.role}</span>
                          <span className="text-gray-500">•</span>
                          <span className="text-sm text-gray-600">{testimonial.company}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center lg:text-left">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Free 14-day trial</span>
                <span className="text-gray-400">•</span>
                <span>No credit card required</span>
                <span className="text-gray-400">•</span>
                <span>Setup in minutes</span>
              </div>
              <Button variant="outline" asChild>
                <a href="https://docs.trustloop.com" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Learn More
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}