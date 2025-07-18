import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { dataService, EmailTemplate } from '@/services/dataService'
import { 
  Mail, 
  Edit, 
  Copy, 
  Trash2, 
  Eye,
  Send,
  Settings,
  Plus,
  Code,
  Type,
  Palette,
  Play,
  Clock,
  Target,
  Zap,
  BarChart3,
  FileText,
  Image,
  Link,
  Star,
  User,
  ShoppingCart,
  Gift,
  CheckCircle
} from 'lucide-react'

export default function EmailTemplates() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'post_purchase' as EmailTemplate['type'],
    subject: '',
    htmlContent: '',
    textContent: '',
    variables: [] as string[]
  })
  const { toast } = useToast()

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      setLoading(true)
      const data = await dataService.getEmailTemplates()
      setTemplates(data)
    } catch (error) {
      console.error('Error loading templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTemplate = async () => {
    try {
      const newTemplate = await dataService.createEmailTemplate({
        ...formData,
        isDefault: false
      })
      setTemplates(prev => [...prev, newTemplate])
      setIsCreating(false)
      resetForm()
      toast({
        title: 'Template Created',
        description: 'Your email template has been created successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create template.',
        variant: 'destructive'
      })
    }
  }

  const handleUpdateTemplate = async (templateId: string) => {
    try {
      await dataService.updateEmailTemplate(templateId, formData)
      setTemplates(prev => prev.map(t => 
        t.id === templateId ? { ...t, ...formData } : t
      ))
      setIsEditing(false)
      setSelectedTemplate(null)
      resetForm()
      toast({
        title: 'Template Updated',
        description: 'Your email template has been updated successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update template.',
        variant: 'destructive'
      })
    }
  }

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      // In a real app, this would call the delete API
      setTemplates(prev => prev.filter(t => t.id !== templateId))
      toast({
        title: 'Template Deleted',
        description: 'The email template has been deleted.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete template.',
        variant: 'destructive'
      })
    }
  }

  const handleDuplicateTemplate = async (template: EmailTemplate) => {
    try {
      const newTemplate = await dataService.createEmailTemplate({
        name: `${template.name} (Copy)`,
        type: template.type,
        subject: template.subject,
        htmlContent: template.htmlContent,
        textContent: template.textContent,
        variables: template.variables,
        isDefault: false
      })
      setTemplates(prev => [...prev, newTemplate])
      toast({
        title: 'Template Duplicated',
        description: 'A copy of the template has been created.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to duplicate template.',
        variant: 'destructive'
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'post_purchase',
      subject: '',
      htmlContent: '',
      textContent: '',
      variables: []
    })
  }

  const getTemplateTypeIcon = (type: EmailTemplate['type']) => {
    switch (type) {
      case 'post_purchase': return <ShoppingCart className="h-4 w-4" />
      case 'reminder': return <Clock className="h-4 w-4" />
      case 'thank_you': return <Gift className="h-4 w-4" />
      case 'photo_request': return <Image className="h-4 w-4" />
      case 'milestone': return <Star className="h-4 w-4" />
      default: return <Mail className="h-4 w-4" />
    }
  }

  const getTemplateTypeColor = (type: EmailTemplate['type']) => {
    switch (type) {
      case 'post_purchase': return 'bg-blue-100 text-blue-800'
      case 'reminder': return 'bg-orange-100 text-orange-800'
      case 'thank_you': return 'bg-green-100 text-green-800'
      case 'photo_request': return 'bg-purple-100 text-purple-800'
      case 'milestone': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const availableVariables = [
    { name: 'customer_name', description: 'Customer\'s name' },
    { name: 'customer_email', description: 'Customer\'s email address' },
    { name: 'product_name', description: 'Product name' },
    { name: 'product_title', description: 'Product title' },
    { name: 'order_number', description: 'Order number' },
    { name: 'shop_name', description: 'Store name' },
    { name: 'shop_url', description: 'Store URL' },
    { name: 'review_url', description: 'Review submission URL' },
    { name: 'photo_upload_url', description: 'Photo upload URL' },
    { name: 'star_rating', description: 'Star rating' },
    { name: 'coupon_code', description: 'Discount coupon code' },
    { name: 'unsubscribe_url', description: 'Unsubscribe URL' }
  ]

  const sampleContent = {
    post_purchase: {
      subject: 'How was your {{product_name}}?',
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Hi {{customer_name}}!</h1>
        <p>We hope you're loving your {{product_name}}! Your feedback helps other customers make informed decisions.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{{review_url}}" style="background: #007cba; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Leave a Review</a>
        </div>
        <p>Thank you for choosing {{shop_name}}!</p>
      </div>`,
      variables: ['customer_name', 'product_name', 'review_url', 'shop_name']
    },
    reminder: {
      subject: 'Don\'t forget to review your {{product_name}}',
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Hi {{customer_name}}!</h1>
        <p>We noticed you haven't reviewed your {{product_name}} yet. Your feedback is valuable to us and helps other customers!</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{{review_url}}" style="background: #007cba; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Leave a Review Now</a>
        </div>
        <p>Thanks for being a valued customer!</p>
      </div>`,
      variables: ['customer_name', 'product_name', 'review_url']
    },
    thank_you: {
      subject: 'Thank you for your {{star_rating}} star review!',
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Thank you {{customer_name}}!</h1>
        <p>We're thrilled that you gave {{product_name}} a {{star_rating}} star review! Your feedback means the world to us.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{{photo_upload_url}}" style="background: #007cba; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Share a Photo</a>
        </div>
        <p>Keep an eye out for exclusive offers coming your way!</p>
      </div>`,
      variables: ['customer_name', 'product_name', 'star_rating', 'photo_upload_url']
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
          <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
          <p className="text-gray-600">Create and manage email templates for your review campaigns</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setIsCreating(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="h-4 w-4 text-blue-600" />
              <div className="text-sm text-gray-600">Total Templates</div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{templates.length}</div>
            <div className="text-xs text-green-600 mt-1">+2 this month</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {templates.filter(t => !t.isDefault).length}
            </div>
            <div className="text-xs text-green-600 mt-1">Ready to use</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-purple-600" />
              <div className="text-sm text-gray-600">Avg. Open Rate</div>
            </div>
            <div className="text-2xl font-bold text-purple-600">24.5%</div>
            <div className="text-xs text-green-600 mt-1">+2.1% this month</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-orange-600" />
              <div className="text-sm text-gray-600">Conversion Rate</div>
            </div>
            <div className="text-2xl font-bold text-orange-600">3.2%</div>
            <div className="text-xs text-green-600 mt-1">+0.5% this month</div>
          </CardContent>
        </Card>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    {getTemplateTypeIcon(template.type)}
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {template.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      {template.subject}
                    </CardDescription>
                  </div>
                </div>
                <Badge className={`${getTemplateTypeColor(template.type)} text-xs`}>
                  {template.type.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">Preview</div>
                  <div 
                    className="text-sm text-gray-700 line-clamp-3"
                    dangerouslySetInnerHTML={{ 
                      __html: template.htmlContent.replace(/{{([^}]+)}}/g, '<span class="text-blue-600">[$1]</span>') 
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Variables: {template.variables.length}</span>
                  <span>{template.isDefault ? 'Default' : 'Custom'}</span>
                </div>
                
                <div className="flex items-center gap-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setSelectedTemplate(template)
                      setFormData({
                        name: template.name,
                        type: template.type,
                        subject: template.subject,
                        htmlContent: template.htmlContent,
                        textContent: template.textContent || '',
                        variables: template.variables
                      })
                      setIsEditing(true)
                    }}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDuplicateTemplate(template)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setSelectedTemplate(template)
                    }}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  {!template.isDefault && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteTemplate(template.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Template Dialog */}
      <Dialog open={isCreating || isEditing} onOpenChange={(open) => {
        if (!open) {
          setIsCreating(false)
          setIsEditing(false)
          setSelectedTemplate(null)
          resetForm()
        }
      }}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isCreating ? 'Create Email Template' : 'Edit Email Template'}
            </DialogTitle>
            <DialogDescription>
              Design your email template with dynamic variables and HTML content.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="variables">Variables</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter template name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-type">Template Type</Label>
                  <Select value={formData.type} onValueChange={(value: EmailTemplate['type']) => {
                    setFormData(prev => ({ ...prev, type: value }))
                    // Auto-populate with sample content
                    if (sampleContent[value]) {
                      setFormData(prev => ({
                        ...prev,
                        subject: sampleContent[value].subject,
                        htmlContent: sampleContent[value].html,
                        variables: sampleContent[value].variables
                      }))
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="post_purchase">Post-Purchase</SelectItem>
                      <SelectItem value="reminder">Reminder</SelectItem>
                      <SelectItem value="thank_you">Thank You</SelectItem>
                      <SelectItem value="photo_request">Photo Request</SelectItem>
                      <SelectItem value="milestone">Milestone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template-subject">Subject Line</Label>
                <Input
                  id="template-subject"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter email subject"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template-html">HTML Content</Label>
                <Textarea
                  id="template-html"
                  value={formData.htmlContent}
                  onChange={(e) => setFormData(prev => ({ ...prev, htmlContent: e.target.value }))}
                  placeholder="Enter HTML content with variables like {{customer_name}}"
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template-text">Plain Text Content (Optional)</Label>
                <Textarea
                  id="template-text"
                  value={formData.textContent}
                  onChange={(e) => setFormData(prev => ({ ...prev, textContent: e.target.value }))}
                  placeholder="Enter plain text version"
                  rows={6}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="variables" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Available Variables</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {availableVariables.map((variable) => (
                      <div key={variable.name} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div>
                          <code className="text-sm font-mono bg-gray-200 px-2 py-1 rounded">
                            {`{{${variable.name}}}`}
                          </code>
                          <p className="text-xs text-gray-600 mt-1">{variable.description}</p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            const textarea = document.getElementById('template-html') as HTMLTextAreaElement
                            if (textarea) {
                              const start = textarea.selectionStart
                              const end = textarea.selectionEnd
                              const text = textarea.value
                              const before = text.substring(0, start)
                              const after = text.substring(end)
                              const newText = before + `{{${variable.name}}}` + after
                              setFormData(prev => ({ ...prev, htmlContent: newText }))
                            }
                          }}
                        >
                          Insert
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="space-y-4">
              <div className="border rounded-lg p-4 bg-white">
                <div className="border-b pb-2 mb-4">
                  <h3 className="font-medium text-gray-900">Subject: {formData.subject}</h3>
                </div>
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: formData.htmlContent.replace(/{{([^}]+)}}/g, '<span class="bg-blue-100 text-blue-800 px-1 rounded">[$1]</span>') 
                  }}
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => {
              setIsCreating(false)
              setIsEditing(false)
              setSelectedTemplate(null)
              resetForm()
            }}>
              Cancel
            </Button>
            <Button onClick={isCreating ? handleCreateTemplate : () => selectedTemplate && handleUpdateTemplate(selectedTemplate.id)}>
              {isCreating ? 'Create Template' : 'Update Template'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!selectedTemplate && !isEditing} onOpenChange={(open) => {
        if (!open) setSelectedTemplate(null)
      }}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              Template preview with sample variables
            </DialogDescription>
          </DialogHeader>
          
          {selectedTemplate && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Subject Line</h4>
                <p className="text-gray-700">{selectedTemplate.subject}</p>
              </div>
              
              <div className="border rounded-lg p-4 bg-white">
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: selectedTemplate.htmlContent
                      .replace(/{{customer_name}}/g, 'John Doe')
                      .replace(/{{product_name}}/g, 'Wireless Earbuds Pro')
                      .replace(/{{shop_name}}/g, 'My Awesome Store')
                      .replace(/{{star_rating}}/g, '5')
                      .replace(/{{([^}]+)}}/g, '<span class="bg-blue-100 text-blue-800 px-1 rounded">[$1]</span>')
                  }}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}