import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/AuthContext'
import { blink } from '@/blink/client'
import { 
  Settings as SettingsIcon, 
  Store, 
  Mail, 
  Shield, 
  Palette, 
  Database,
  Key,
  Bell,
  Globe,
  Download,
  Upload,
  Trash2,
  Save,
  RefreshCw,
  Check,
  X,
  AlertTriangle,
  Instagram,
  ExternalLink,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Minus,
  Activity,
  Zap,
  Clock,
  Calendar,
  Users,
  Star,
  BarChart3,
  FileText,
  Link2,
  Search,
  Filter,
  Sliders,
  Smartphone,
  Monitor,
  Tablet,
  Chrome,
  Firefox,
  Safari
} from 'lucide-react'

interface Settings {
  general: {
    shopName: string
    shopUrl: string
    timezone: string
    currency: string
    language: string
    dateFormat: string
    primaryColor: string
    accentColor: string
    logoUrl: string
    darkMode: boolean
    customCSS: string
  }
  email: {
    senderName: string
    senderEmail: string
    replyToEmail: string
    emailNotifications: boolean
    dailyDigest: boolean
    weeklyReport: boolean
    defaultDelay: number
    sendTime: string
    weekendSending: boolean
    timezone: string
    emailFooter: string
    unsubscribeText: string
  }
  moderation: {
    autoApprove: boolean
    confidenceThreshold: number
    sentimentFilter: boolean
    spamDetection: boolean
    profanityFilter: boolean
    bannedKeywords: string[]
    caseSensitive: boolean
    moderationNotifications: boolean
    requireVerification: boolean
    minimumRating: number
    languageDetection: boolean
    allowedLanguages: string[]
  }
  widgets: {
    homepageCarousel: boolean
    productReviews: boolean
    collectionRatings: boolean
    floatingWidget: boolean
    popupWidget: boolean
    thankYouWidget: boolean
    mobileWidgets: boolean
    desktopWidgets: boolean
    tabletWidgets: boolean
    loadingAnimation: boolean
    lazyLoading: boolean
    cacheEnabled: boolean
    performanceMode: boolean
  }
  integrations: {
    shopifyConnected: boolean
    klaviyoApiKey: string
    instagramToken: string
    googleMerchantCenter: boolean
    zapierWebhook: string
    mailchimpApiKey: string
    facebookPixel: string
    googleAnalytics: string
    webhookUrl: string
    apiRateLimit: number
  }
  data: {
    dataRetention: number
    autoBackup: boolean
    backupFrequency: string
    exportFormat: string
    anonymizeData: boolean
    gdprCompliance: boolean
    cookieConsent: boolean
    privacyPolicy: string
    termsOfService: string
  }
}

export default function Settings() {
  const [settings, setSettings] = useState<Settings>({
    general: {
      shopName: 'Demo Store',
      shopUrl: 'demo-store.myshopify.com',
      timezone: 'America/New_York',
      currency: 'USD',
      language: 'en',
      dateFormat: 'MM/DD/YYYY',
      primaryColor: '#005BD3',
      accentColor: '#008060',
      logoUrl: '',
      darkMode: false,
      customCSS: ''
    },
    email: {
      senderName: 'Demo Store',
      senderEmail: 'noreply@demo-store.com',
      replyToEmail: 'support@demo-store.com',
      emailNotifications: true,
      dailyDigest: true,
      weeklyReport: true,
      defaultDelay: 3,
      sendTime: '10:00',
      weekendSending: false,
      timezone: 'America/New_York',
      emailFooter: 'Thank you for choosing Demo Store!',
      unsubscribeText: 'Unsubscribe from future emails'
    },
    moderation: {
      autoApprove: true,
      confidenceThreshold: 75,
      sentimentFilter: true,
      spamDetection: true,
      profanityFilter: true,
      bannedKeywords: ['spam', 'fake', 'scam', 'terrible'],
      caseSensitive: false,
      moderationNotifications: true,
      requireVerification: false,
      minimumRating: 1,
      languageDetection: true,
      allowedLanguages: ['en', 'es', 'fr', 'de']
    },
    widgets: {
      homepageCarousel: true,
      productReviews: true,
      collectionRatings: true,
      floatingWidget: true,
      popupWidget: false,
      thankYouWidget: true,
      mobileWidgets: true,
      desktopWidgets: true,
      tabletWidgets: true,
      loadingAnimation: true,
      lazyLoading: true,
      cacheEnabled: true,
      performanceMode: false
    },
    integrations: {
      shopifyConnected: true,
      klaviyoApiKey: '',
      instagramToken: '',
      googleMerchantCenter: false,
      zapierWebhook: '',
      mailchimpApiKey: '',
      facebookPixel: '',
      googleAnalytics: '',
      webhookUrl: '',
      apiRateLimit: 1000
    },
    data: {
      dataRetention: 36,
      autoBackup: true,
      backupFrequency: 'daily',
      exportFormat: 'CSV',
      anonymizeData: false,
      gdprCompliance: true,
      cookieConsent: true,
      privacyPolicy: '',
      termsOfService: ''
    }
  })

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showSecrets, setShowSecrets] = useState<{[key: string]: boolean}>({})
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [testEmailSent, setTestEmailSent] = useState(false)
  const [connectionTests, setConnectionTests] = useState<{[key: string]: 'idle' | 'testing' | 'success' | 'error'}>({})
  const [selectedTab, setSelectedTab] = useState('general')
  const [newKeyword, setNewKeyword] = useState('')
  const [colorPreview, setColorPreview] = useState(false)
  
  const { toast } = useToast()
  const { shop, user } = useAuth()

  useEffect(() => {
    if (shop) {
      setSettings(prev => ({
        ...prev,
        general: {
          ...prev.general,
          shopName: shop.shopName || 'Demo Store',
          shopUrl: shop.shopDomain || 'demo-store.myshopify.com'
        }
      }))
    }
  }, [shop])

  const handleSaveSettings = async (category?: keyof Settings) => {
    setSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real app, this would save to the database
      // await blink.db.settings.upsert({
      //   userId: user?.id,
      //   category: category || 'all',
      //   settings: category ? settings[category] : settings
      // })
      
      toast({
        title: 'Settings Saved',
        description: category 
          ? `${category.charAt(0).toUpperCase() + category.slice(1)} settings have been saved successfully.`
          : 'All settings have been saved successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleTestConnection = async (service: string) => {
    setConnectionTests(prev => ({ ...prev, [service]: 'testing' }))
    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000))
      const success = Math.random() > 0.3 // 70% success rate for demo
      
      setConnectionTests(prev => ({ 
        ...prev, 
        [service]: success ? 'success' : 'error' 
      }))
      
      toast({
        title: success ? 'Connection Successful' : 'Connection Failed',
        description: success 
          ? `Successfully connected to ${service}`
          : `Failed to connect to ${service}. Please check your credentials.`,
        variant: success ? 'default' : 'destructive'
      })
    } catch (error) {
      setConnectionTests(prev => ({ ...prev, [service]: 'error' }))
    }
  }

  const handleSendTestEmail = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setTestEmailSent(true)
      toast({
        title: 'Test Email Sent',
        description: 'A test email has been sent to your configured email address.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send test email.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExportData = async (type: string) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create mock CSV data
      const csvData = `Date,Type,Count\n${new Date().toISOString().split('T')[0]},${type},${Math.floor(Math.random() * 1000)}`
      const blob = new Blob([csvData], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${type}-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      toast({
        title: 'Export Complete',
        description: `${type} data has been exported successfully.`,
      })
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export data. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAllData = async () => {
    if (deleteConfirmation !== 'DELETE ALL DATA') {
      toast({
        title: 'Confirmation Required',
        description: 'Please type "DELETE ALL DATA" to confirm.',
        variant: 'destructive'
      })
      return
    }
    
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      toast({
        title: 'Data Deleted',
        description: 'All data has been permanently deleted.',
        variant: 'destructive'
      })
      
      setShowDeleteDialog(false)
      setDeleteConfirmation('')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete data. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const addKeyword = () => {
    if (newKeyword.trim() && !settings.moderation.bannedKeywords.includes(newKeyword.trim())) {
      setSettings(prev => ({
        ...prev,
        moderation: {
          ...prev.moderation,
          bannedKeywords: [...prev.moderation.bannedKeywords, newKeyword.trim()]
        }
      }))
      setNewKeyword('')
    }
  }

  const removeKeyword = (keyword: string) => {
    setSettings(prev => ({
      ...prev,
      moderation: {
        ...prev.moderation,
        bannedKeywords: prev.moderation.bannedKeywords.filter(k => k !== keyword)
      }
    }))
  }

  const toggleSecretVisibility = (key: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Configure your TrustLoop app preferences and integrations</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleSaveSettings()}
            disabled={saving}
          >
            {saving ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saving ? 'Saving...' : 'Save All Changes'}
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => handleSaveSettings(selectedTab as keyof Settings)}
            disabled={saving}
          >
            <Save className="h-4 w-4 mr-2" />
            Save {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="moderation">Moderation</TabsTrigger>
          <TabsTrigger value="widgets">Widgets</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Store Information
                </CardTitle>
                <CardDescription>Basic store settings and regional preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="store-name">Store Name</Label>
                    <Input 
                      id="store-name" 
                      value={settings.general.shopName}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, shopName: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-url">Store URL</Label>
                    <Input 
                      id="store-url" 
                      value={settings.general.shopUrl}
                      disabled 
                      className="bg-gray-50"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select 
                      value={settings.general.timezone}
                      onValueChange={(value) => setSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, timezone: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                        <SelectItem value="Europe/Paris">Central European Time (CET)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Japan Standard Time (JST)</SelectItem>
                        <SelectItem value="Australia/Sydney">Australian Eastern Time (AET)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select 
                      value={settings.general.currency}
                      onValueChange={(value) => setSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, currency: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="CAD">CAD (C$)</SelectItem>
                        <SelectItem value="AUD">AUD (A$)</SelectItem>
                        <SelectItem value="JPY">JPY (¥)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select 
                      value={settings.general.language}
                      onValueChange={(value) => setSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, language: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="it">Italian</SelectItem>
                        <SelectItem value="pt">Portuguese</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                        <SelectItem value="ko">Korean</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-format">Date Format</Label>
                    <Select 
                      value={settings.general.dateFormat}
                      onValueChange={(value) => setSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, dateFormat: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        <SelectItem value="MMM DD, YYYY">MMM DD, YYYY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Branding & Appearance
                </CardTitle>
                <CardDescription>Customize the look and feel of your widgets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Brand Color</Label>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded-md border cursor-pointer"
                      style={{ backgroundColor: settings.general.primaryColor }}
                      onClick={() => setColorPreview(!colorPreview)}
                    />
                    <Input 
                      id="primary-color" 
                      value={settings.general.primaryColor}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, primaryColor: e.target.value }
                      }))}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accent-color">Accent Color</Label>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded-md border cursor-pointer"
                      style={{ backgroundColor: settings.general.accentColor }}
                    />
                    <Input 
                      id="accent-color" 
                      value={settings.general.accentColor}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, accentColor: e.target.value }
                      }))}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="logo-url">Logo URL</Label>
                  <Input 
                    id="logo-url" 
                    value={settings.general.logoUrl}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, logoUrl: e.target.value }
                    }))}
                    placeholder="https://example.com/logo.png" 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-gray-600">Enable dark theme for widgets</p>
                  </div>
                  <Switch 
                    id="dark-mode" 
                    checked={settings.general.darkMode}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, darkMode: checked }
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="custom-css">Custom CSS</Label>
                  <Textarea 
                    id="custom-css" 
                    value={settings.general.customCSS}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, customCSS: e.target.value }
                    }))}
                    placeholder="/* Add your custom CSS here */"
                    rows={6}
                    className="font-mono text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Configuration
                </CardTitle>
                <CardDescription>Configure your email sending settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sender-name">Sender Name</Label>
                  <Input 
                    id="sender-name" 
                    value={settings.email.senderName}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      email: { ...prev.email, senderName: e.target.value }
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sender-email">Sender Email</Label>
                  <Input 
                    id="sender-email" 
                    value={settings.email.senderEmail}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      email: { ...prev.email, senderEmail: e.target.value }
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reply-to">Reply-To Email</Label>
                  <Input 
                    id="reply-to" 
                    value={settings.email.replyToEmail}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      email: { ...prev.email, replyToEmail: e.target.value }
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email-footer">Email Footer</Label>
                  <Textarea 
                    id="email-footer" 
                    value={settings.email.emailFooter}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      email: { ...prev.email, emailFooter: e.target.value }
                    }))}
                    rows={3}
                    placeholder="Thank you for choosing our store!"
                  />
                </div>
                
                <Button 
                  onClick={handleSendTestEmail}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : testEmailSent ? (
                    <Check className="h-4 w-4 mr-2" />
                  ) : (
                    <Mail className="h-4 w-4 mr-2" />
                  )}
                  {loading ? 'Sending...' : testEmailSent ? 'Test Email Sent' : 'Send Test Email'}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications & Campaigns
                </CardTitle>
                <CardDescription>Email notification and campaign settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-gray-600">Receive alerts for new reviews</p>
                  </div>
                  <Switch 
                    id="email-notifications" 
                    checked={settings.email.emailNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      email: { ...prev.email, emailNotifications: checked }
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="daily-digest">Daily Digest</Label>
                    <p className="text-sm text-gray-600">Daily summary of activities</p>
                  </div>
                  <Switch 
                    id="daily-digest" 
                    checked={settings.email.dailyDigest}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      email: { ...prev.email, dailyDigest: checked }
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="weekly-report">Weekly Report</Label>
                    <p className="text-sm text-gray-600">Weekly performance report</p>
                  </div>
                  <Switch 
                    id="weekly-report" 
                    checked={settings.email.weeklyReport}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      email: { ...prev.email, weeklyReport: checked }
                    }))}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="default-delay">Default Delay (days)</Label>
                    <Select 
                      value={settings.email.defaultDelay.toString()}
                      onValueChange={(value) => setSettings(prev => ({
                        ...prev,
                        email: { ...prev.email, defaultDelay: parseInt(value) }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 day</SelectItem>
                        <SelectItem value="2">2 days</SelectItem>
                        <SelectItem value="3">3 days</SelectItem>
                        <SelectItem value="5">5 days</SelectItem>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="send-time">Send Time</Label>
                    <Select 
                      value={settings.email.sendTime}
                      onValueChange={(value) => setSettings(prev => ({
                        ...prev,
                        email: { ...prev.email, sendTime: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                        <SelectItem value="11:00">11:00 AM</SelectItem>
                        <SelectItem value="12:00">12:00 PM</SelectItem>
                        <SelectItem value="13:00">1:00 PM</SelectItem>
                        <SelectItem value="14:00">2:00 PM</SelectItem>
                        <SelectItem value="15:00">3:00 PM</SelectItem>
                        <SelectItem value="16:00">4:00 PM</SelectItem>
                        <SelectItem value="17:00">5:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="weekend-sending">Weekend Sending</Label>
                    <p className="text-sm text-gray-600">Send emails on weekends</p>
                  </div>
                  <Switch 
                    id="weekend-sending" 
                    checked={settings.email.weekendSending}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      email: { ...prev.email, weekendSending: checked }
                    }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Moderation Settings */}
        <TabsContent value="moderation" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Auto-Moderation
                </CardTitle>
                <CardDescription>AI-powered automatic review moderation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="auto-approve">Auto-Approve Reviews</Label>
                    <p className="text-sm text-gray-600">Automatically approve high-confidence reviews</p>
                  </div>
                  <Switch 
                    id="auto-approve" 
                    checked={settings.moderation.autoApprove}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      moderation: { ...prev.moderation, autoApprove: checked }
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confidence-threshold">
                    Confidence Threshold: {settings.moderation.confidenceThreshold}%
                  </Label>
                  <input
                    type="range"
                    id="confidence-threshold"
                    min="0"
                    max="100"
                    value={settings.moderation.confidenceThreshold}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      moderation: { ...prev.moderation, confidenceThreshold: parseInt(e.target.value) }
                    }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Permissive</span>
                    <span>Balanced</span>
                    <span>Strict</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="sentiment-filter">Sentiment Filter</Label>
                    <p className="text-sm text-gray-600">Filter negative sentiment reviews</p>
                  </div>
                  <Switch 
                    id="sentiment-filter" 
                    checked={settings.moderation.sentimentFilter}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      moderation: { ...prev.moderation, sentimentFilter: checked }
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="spam-detection">Spam Detection</Label>
                    <p className="text-sm text-gray-600">Automatically detect and flag spam</p>
                  </div>
                  <Switch 
                    id="spam-detection" 
                    checked={settings.moderation.spamDetection}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      moderation: { ...prev.moderation, spamDetection: checked }
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="profanity-filter">Profanity Filter</Label>
                    <p className="text-sm text-gray-600">Filter inappropriate language</p>
                  </div>
                  <Switch 
                    id="profanity-filter" 
                    checked={settings.moderation.profanityFilter}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      moderation: { ...prev.moderation, profanityFilter: checked }
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="minimum-rating">
                    Minimum Rating: {settings.moderation.minimumRating} star{settings.moderation.minimumRating !== 1 ? 's' : ''}
                  </Label>
                  <input
                    type="range"
                    id="minimum-rating"
                    min="1"
                    max="5"
                    value={settings.moderation.minimumRating}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      moderation: { ...prev.moderation, minimumRating: parseInt(e.target.value) }
                    }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1 star</span>
                    <span>3 stars</span>
                    <span>5 stars</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Banned Keywords</CardTitle>
                <CardDescription>Keywords that will automatically flag reviews</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="add-keyword">Add Keyword</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="add-keyword" 
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      placeholder="Enter keyword"
                      onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                    />
                    <Button 
                      onClick={addKeyword}
                      disabled={!newKeyword.trim()}
                      size="sm"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Current Keywords</Label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {settings.moderation.bannedKeywords.map((keyword, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="flex items-center gap-1"
                      >
                        {keyword}
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-red-600"
                          onClick={() => removeKeyword(keyword)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="case-sensitive">Case Sensitive</Label>
                    <p className="text-sm text-gray-600">Match exact case for keywords</p>
                  </div>
                  <Switch 
                    id="case-sensitive" 
                    checked={settings.moderation.caseSensitive}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      moderation: { ...prev.moderation, caseSensitive: checked }
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="language-detection">Language Detection</Label>
                    <p className="text-sm text-gray-600">Detect review language automatically</p>
                  </div>
                  <Switch 
                    id="language-detection" 
                    checked={settings.moderation.languageDetection}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      moderation: { ...prev.moderation, languageDetection: checked }
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="require-verification">Require Verification</Label>
                    <p className="text-sm text-gray-600">Only allow verified purchases</p>
                  </div>
                  <Switch 
                    id="require-verification" 
                    checked={settings.moderation.requireVerification}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      moderation: { ...prev.moderation, requireVerification: checked }
                    }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Widget Settings */}
        <TabsContent value="widgets" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Widget Display</CardTitle>
                <CardDescription>Control which widgets are enabled and where they appear</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="homepage-carousel">Homepage Carousel</Label>
                    <p className="text-sm text-gray-600">Show review carousel on homepage</p>
                  </div>
                  <Switch 
                    id="homepage-carousel" 
                    checked={settings.widgets.homepageCarousel}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      widgets: { ...prev.widgets, homepageCarousel: checked }
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="product-reviews">Product Page Reviews</Label>
                    <p className="text-sm text-gray-600">Embed reviews on product pages</p>
                  </div>
                  <Switch 
                    id="product-reviews" 
                    checked={settings.widgets.productReviews}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      widgets: { ...prev.widgets, productReviews: checked }
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="collection-ratings">Collection Ratings</Label>
                    <p className="text-sm text-gray-600">Show ratings in collection grids</p>
                  </div>
                  <Switch 
                    id="collection-ratings" 
                    checked={settings.widgets.collectionRatings}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      widgets: { ...prev.widgets, collectionRatings: checked }
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="floating-widget">Floating Widget</Label>
                    <p className="text-sm text-gray-600">Fixed position review widget</p>
                  </div>
                  <Switch 
                    id="floating-widget" 
                    checked={settings.widgets.floatingWidget}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      widgets: { ...prev.widgets, floatingWidget: checked }
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="popup-widget">Popup Widget</Label>
                    <p className="text-sm text-gray-600">Show social proof popup</p>
                  </div>
                  <Switch 
                    id="popup-widget" 
                    checked={settings.widgets.popupWidget}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      widgets: { ...prev.widgets, popupWidget: checked }
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="thankyou-widget">Thank You Widget</Label>
                    <p className="text-sm text-gray-600">Review request on thank you page</p>
                  </div>
                  <Switch 
                    id="thankyou-widget" 
                    checked={settings.widgets.thankYouWidget}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      widgets: { ...prev.widgets, thankYouWidget: checked }
                    }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Device & Performance</CardTitle>
                <CardDescription>Control widget visibility and performance settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Device Visibility</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="text-sm font-medium">Desktop</div>
                          <div className="text-xs text-gray-600">Show on desktop devices</div>
                        </div>
                      </div>
                      <Switch 
                        checked={settings.widgets.desktopWidgets}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          widgets: { ...prev.widgets, desktopWidgets: checked }
                        }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tablet className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="text-sm font-medium">Tablet</div>
                          <div className="text-xs text-gray-600">Show on tablet devices</div>
                        </div>
                      </div>
                      <Switch 
                        checked={settings.widgets.tabletWidgets}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          widgets: { ...prev.widgets, tabletWidgets: checked }
                        }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="text-sm font-medium">Mobile</div>
                          <div className="text-xs text-gray-600">Show on mobile devices</div>
                        </div>
                      </div>
                      <Switch 
                        checked={settings.widgets.mobileWidgets}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          widgets: { ...prev.widgets, mobileWidgets: checked }
                        }))}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Performance Settings</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="loading-animation">Loading Animation</Label>
                        <p className="text-sm text-gray-600">Show loading animations</p>
                      </div>
                      <Switch 
                        id="loading-animation" 
                        checked={settings.widgets.loadingAnimation}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          widgets: { ...prev.widgets, loadingAnimation: checked }
                        }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="lazy-loading">Lazy Loading</Label>
                        <p className="text-sm text-gray-600">Load widgets when visible</p>
                      </div>
                      <Switch 
                        id="lazy-loading" 
                        checked={settings.widgets.lazyLoading}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          widgets: { ...prev.widgets, lazyLoading: checked }
                        }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="cache-enabled">Cache Enabled</Label>
                        <p className="text-sm text-gray-600">Cache widget data locally</p>
                      </div>
                      <Switch 
                        id="cache-enabled" 
                        checked={settings.widgets.cacheEnabled}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          widgets: { ...prev.widgets, cacheEnabled: checked }
                        }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="performance-mode">Performance Mode</Label>
                        <p className="text-sm text-gray-600">Optimize for speed over features</p>
                      </div>
                      <Switch 
                        id="performance-mode" 
                        checked={settings.widgets.performanceMode}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          widgets: { ...prev.widgets, performanceMode: checked }
                        }))}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Keys & Tokens
                </CardTitle>
                <CardDescription>Manage your API integrations and authentication</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shopify-token">Shopify Access Token</Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <Input 
                        id="shopify-token" 
                        type={showSecrets.shopify ? "text" : "password"}
                        value="shpat_xxxxxxxxxxxxxxxxx"
                        disabled
                        className="pr-10"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-6 w-6 p-0"
                        onClick={() => toggleSecretVisibility('shopify')}
                      >
                        {showSecrets.shopify ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Check className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="klaviyo-key">Klaviyo API Key</Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <Input 
                        id="klaviyo-key" 
                        type={showSecrets.klaviyo ? "text" : "password"}
                        value={settings.integrations.klaviyoApiKey}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          integrations: { ...prev.integrations, klaviyoApiKey: e.target.value }
                        }))}
                        placeholder="Enter Klaviyo API key"
                        className="pr-10"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-6 w-6 p-0"
                        onClick={() => toggleSecretVisibility('klaviyo')}
                      >
                        {showSecrets.klaviyo ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestConnection('Klaviyo')}
                      disabled={connectionTests.Klaviyo === 'testing'}
                    >
                      {connectionTests.Klaviyo === 'testing' ? (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      ) : connectionTests.Klaviyo === 'success' ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : connectionTests.Klaviyo === 'error' ? (
                        <X className="h-3 w-3 text-red-600" />
                      ) : (
                        'Test'
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instagram-token">Instagram Access Token</Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <Input 
                        id="instagram-token" 
                        type={showSecrets.instagram ? "text" : "password"}
                        value={settings.integrations.instagramToken}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          integrations: { ...prev.integrations, instagramToken: e.target.value }
                        }))}
                        placeholder="Enter Instagram token"
                        className="pr-10"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-6 w-6 p-0"
                        onClick={() => toggleSecretVisibility('instagram')}
                      >
                        {showSecrets.instagram ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestConnection('Instagram')}
                      disabled={connectionTests.Instagram === 'testing'}
                    >
                      {connectionTests.Instagram === 'testing' ? (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      ) : connectionTests.Instagram === 'success' ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : connectionTests.Instagram === 'error' ? (
                        <X className="h-3 w-3 text-red-600" />
                      ) : (
                        'Test'
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="webhook-url" 
                      value={settings.integrations.webhookUrl}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        integrations: { ...prev.integrations, webhookUrl: e.target.value }
                      }))}
                      placeholder="https://your-app.com/webhook"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(settings.integrations.webhookUrl)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  External Services
                </CardTitle>
                <CardDescription>Connect with third-party services and platforms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <Search className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <div className="font-medium">Google Merchant Center</div>
                      <div className="text-sm text-gray-600">Export reviews to Google</div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleTestConnection('Google Merchant Center')}
                  >
                    {settings.integrations.googleMerchantCenter ? 'Connected' : 'Connect'}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <Zap className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-medium">Zapier</div>
                      <div className="text-sm text-gray-600">Automate with 3000+ apps</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Connect
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Mail className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <div className="font-medium">Mailchimp</div>
                      <div className="text-sm text-gray-600">Sync customer data</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <BarChart3 className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">Google Analytics</div>
                      <div className="text-sm text-gray-600">Track widget performance</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="api-rate-limit">API Rate Limit (requests/hour)</Label>
                  <Input 
                    id="api-rate-limit" 
                    type="number"
                    value={settings.integrations.apiRateLimit}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      integrations: { ...prev.integrations, apiRateLimit: parseInt(e.target.value) || 1000 }
                    }))}
                    min="100"
                    max="10000"
                    step="100"
                  />
                  <p className="text-xs text-gray-500">
                    Current usage: {Math.floor(settings.integrations.apiRateLimit * 0.3)} / {settings.integrations.apiRateLimit}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Data Management */}
        <TabsContent value="data" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Export & Backup
                </CardTitle>
                <CardDescription>Export your review data and manage backups</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">All Reviews</div>
                    <div className="text-sm text-gray-600">Export all reviews as CSV/JSON</div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2"
                    onClick={() => handleExportData('reviews')}
                    disabled={loading}
                  >
                    {loading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    Export
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Customer Data</div>
                    <div className="text-sm text-gray-600">Export customer information</div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2"
                    onClick={() => handleExportData('customers')}
                    disabled={loading}
                  >
                    {loading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    Export
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Analytics Data</div>
                    <div className="text-sm text-gray-600">Export performance metrics</div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2"
                    onClick={() => handleExportData('analytics')}
                    disabled={loading}
                  >
                    {loading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    Export
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="export-format">Export Format</Label>
                  <Select 
                    value={settings.data.exportFormat}
                    onValueChange={(value) => setSettings(prev => ({
                      ...prev,
                      data: { ...prev.data, exportFormat: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CSV">CSV</SelectItem>
                      <SelectItem value="JSON">JSON</SelectItem>
                      <SelectItem value="Excel">Excel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="auto-backup">Auto Backup</Label>
                    <p className="text-sm text-gray-600">Automatically backup data</p>
                  </div>
                  <Switch 
                    id="auto-backup" 
                    checked={settings.data.autoBackup}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      data: { ...prev.data, autoBackup: checked }
                    }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy & Compliance
                </CardTitle>
                <CardDescription>Data privacy and compliance settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="data-retention">Data Retention (months)</Label>
                  <Select 
                    value={settings.data.dataRetention.toString()}
                    onValueChange={(value) => setSettings(prev => ({
                      ...prev,
                      data: { ...prev.data, dataRetention: parseInt(value) }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12 months</SelectItem>
                      <SelectItem value="24">24 months</SelectItem>
                      <SelectItem value="36">36 months</SelectItem>
                      <SelectItem value="60">60 months</SelectItem>
                      <SelectItem value="0">Never delete</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="gdpr-compliance">GDPR Compliance</Label>
                    <p className="text-sm text-gray-600">Enable GDPR compliance features</p>
                  </div>
                  <Switch 
                    id="gdpr-compliance" 
                    checked={settings.data.gdprCompliance}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      data: { ...prev.data, gdprCompliance: checked }
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="cookie-consent">Cookie Consent</Label>
                    <p className="text-sm text-gray-600">Show cookie consent banner</p>
                  </div>
                  <Switch 
                    id="cookie-consent" 
                    checked={settings.data.cookieConsent}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      data: { ...prev.data, cookieConsent: checked }
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="anonymize-data">Anonymize Data</Label>
                    <p className="text-sm text-gray-600">Anonymize personal information</p>
                  </div>
                  <Switch 
                    id="anonymize-data" 
                    checked={settings.data.anonymizeData}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      data: { ...prev.data, anonymizeData: checked }
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="privacy-policy">Privacy Policy URL</Label>
                  <Input 
                    id="privacy-policy" 
                    value={settings.data.privacyPolicy}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      data: { ...prev.data, privacyPolicy: e.target.value }
                    }))}
                    placeholder="https://yourstore.com/privacy"
                  />
                </div>
                
                <div className="p-3 border-2 border-dashed border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700 mb-2">
                    <AlertTriangle className="h-4 w-4" />
                    <div className="font-medium">Danger Zone</div>
                  </div>
                  <p className="text-sm text-red-600 mb-3">
                    This will permanently delete all your data. This action cannot be undone.
                  </p>
                  
                  <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete All Data
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently delete all your reviews, 
                          customer data, analytics, and configurations.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="delete-confirmation">
                            Type "DELETE ALL DATA" to confirm
                          </Label>
                          <Input
                            id="delete-confirmation"
                            value={deleteConfirmation}
                            onChange={(e) => setDeleteConfirmation(e.target.value)}
                            placeholder="DELETE ALL DATA"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Cancel
                          </Button>
                          <Button 
                            variant="destructive" 
                            onClick={handleDeleteAllData}
                            disabled={deleteConfirmation !== 'DELETE ALL DATA' || loading}
                          >
                            {loading ? (
                              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <Trash2 className="h-4 w-4 mr-2" />
                            )}
                            {loading ? 'Deleting...' : 'Delete All Data'}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}