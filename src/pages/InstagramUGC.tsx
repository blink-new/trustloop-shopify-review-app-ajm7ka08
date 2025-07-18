import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { dataService, InstagramUGC } from '@/services/dataService'
import { 
  Instagram, 
  Check, 
  X, 
  Eye, 
  Heart,
  MessageCircle,
  Share,
  Tag,
  Image,
  Video,
  Link,
  Download,
  RefreshCw,
  Filter,
  Search,
  Grid,
  List,
  Zap,
  Calendar,
  User,
  HashIcon
} from 'lucide-react'

export default function InstagramUGC() {
  const [ugcPosts, setUGCPosts] = useState<InstagramUGC[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState<InstagramUGC | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedTab, setSelectedTab] = useState('all')
  const { toast } = useToast()

  useEffect(() => {
    loadUGCPosts()
  }, [])

  const loadUGCPosts = async () => {
    try {
      setLoading(true)
      const data = await dataService.getInstagramUGC()
      setUGCPosts(data)
    } catch (error) {
      console.error('Error loading Instagram UGC:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (postId: string, status: InstagramUGC['status']) => {
    try {
      await dataService.updateInstagramUGCStatus(postId, status)
      setUGCPosts(prev => prev.map(post => 
        post.id === postId ? { ...post, status } : post
      ))
      
      toast({
        title: `Post ${status}`,
        description: `The Instagram post has been ${status} successfully.`,
        variant: status === 'rejected' ? 'destructive' : 'default'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update post status.',
        variant: 'destructive'
      })
    }
  }

  const handleAssignToProduct = async (postId: string, productId: string) => {
    try {
      await dataService.assignInstagramUGCToProduct(postId, productId)
      setUGCPosts(prev => prev.map(post => 
        post.id === postId ? { ...post, assignedProductId: productId } : post
      ))
      
      toast({
        title: 'Product Assigned',
        description: 'The Instagram post has been assigned to the product successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to assign post to product.',
        variant: 'destructive'
      })
    }
  }

  const getStatusColor = (status: InstagramUGC['status']) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredPosts = ugcPosts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.hashtags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter
    const matchesTab = selectedTab === 'all' || post.status === selectedTab
    
    return matchesSearch && matchesStatus && matchesTab
  })

  const getProductName = (productId: string) => {
    const products = {
      'prod_1': 'Wireless Earbuds Pro',
      'prod_2': 'Fitness Tracker',
      'prod_3': 'Coffee Maker Deluxe',
      'prod_4': 'Smart Watch Series 3'
    }
    return products[productId as keyof typeof products] || 'Unknown Product'
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
          <h1 className="text-2xl font-bold text-gray-900">Instagram UGC</h1>
          <p className="text-gray-600">Manage user-generated content from Instagram</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Instagram className="h-4 w-4" />
            Connect Instagram
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Sync Posts
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Zap className="h-4 w-4 mr-2" />
            Auto-Approve
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Instagram className="h-4 w-4 text-purple-600" />
              <div className="text-sm text-gray-600">Total Posts</div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{ugcPosts.length}</div>
            <div className="text-xs text-green-600 mt-1">+5 this week</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Check className="h-4 w-4 text-green-600" />
              <div className="text-sm text-gray-600">Approved</div>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {ugcPosts.filter(post => post.status === 'approved').length}
            </div>
            <div className="text-xs text-green-600 mt-1">Ready to use</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-4 w-4 text-yellow-600" />
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-2xl font-bold text-yellow-600">
              {ugcPosts.filter(post => post.status === 'pending').length}
            </div>
            <div className="text-xs text-yellow-600 mt-1">Needs review</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="h-4 w-4 text-blue-600" />
              <div className="text-sm text-gray-600">Assigned</div>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {ugcPosts.filter(post => post.assignedProductId).length}
            </div>
            <div className="text-xs text-blue-600 mt-1">Linked to products</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search posts by username, caption, or hashtag..." 
                  className="pl-10" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Instagram Posts</CardTitle>
          <CardDescription>Manage user-generated content from Instagram</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Posts</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            
            <TabsContent value={selectedTab} className="mt-6">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPosts.map((post) => (
                    <div key={post.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                      <div className="relative">
                        <img 
                          src={post.mediaUrl} 
                          alt={`Post by ${post.username}`}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className={`${getStatusColor(post.status)} text-xs`}>
                            {post.status}
                          </Badge>
                        </div>
                        <div className="absolute top-2 left-2">
                          {post.mediaType === 'video' ? (
                            <Video className="h-4 w-4 text-white" />
                          ) : (
                            <Image className="h-4 w-4 text-white" />
                          )}
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">{post.username}</span>
                        </div>
                        
                        {post.caption && (
                          <p className="text-sm text-gray-700 mb-2 line-clamp-2">{post.caption}</p>
                        )}
                        
                        {post.hashtags && post.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {post.hashtags.slice(0, 3).map((tag, index) => (
                              <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                            {post.hashtags.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{post.hashtags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                        
                        {post.assignedProductId && (
                          <div className="flex items-center gap-2 mb-3">
                            <Tag className="h-3 w-3 text-blue-600" />
                            <span className="text-xs text-blue-600">
                              {getProductName(post.assignedProductId)}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {post.status === 'pending' && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-green-600 hover:text-green-700"
                                  onClick={() => handleStatusChange(post.id, 'approved')}
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => handleStatusChange(post.id, 'rejected')}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => setSelectedPost(post)}
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                  <DialogTitle>Instagram Post Details</DialogTitle>
                                  <DialogDescription>
                                    Review and manage this Instagram post
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedPost && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <img 
                                          src={selectedPost.mediaUrl} 
                                          alt={`Post by ${selectedPost.username}`}
                                          className="w-full h-48 object-cover rounded-lg"
                                        />
                                      </div>
                                      <div className="space-y-3">
                                        <div>
                                          <Label className="text-sm font-medium">Username</Label>
                                          <p className="text-sm text-gray-700">{selectedPost.username}</p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium">Status</Label>
                                          <Badge className={`${getStatusColor(selectedPost.status)} text-xs ml-2`}>
                                            {selectedPost.status}
                                          </Badge>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium">Media Type</Label>
                                          <p className="text-sm text-gray-700 capitalize">{selectedPost.mediaType}</p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium">Date</Label>
                                          <p className="text-sm text-gray-700">
                                            {new Date(selectedPost.createdAt).toLocaleDateString()}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {selectedPost.caption && (
                                      <div>
                                        <Label className="text-sm font-medium">Caption</Label>
                                        <p className="text-sm text-gray-700 mt-1">{selectedPost.caption}</p>
                                      </div>
                                    )}
                                    
                                    {selectedPost.hashtags && selectedPost.hashtags.length > 0 && (
                                      <div>
                                        <Label className="text-sm font-medium">Hashtags</Label>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {selectedPost.hashtags.map((tag, index) => (
                                            <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                              {tag}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    
                                    <div>
                                      <Label className="text-sm font-medium">Assign to Product</Label>
                                      <Select 
                                        value={selectedPost.assignedProductId || ''} 
                                        onValueChange={(value) => handleAssignToProduct(selectedPost.id, value)}
                                      >
                                        <SelectTrigger className="mt-1">
                                          <SelectValue placeholder="Select a product" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="prod_1">Wireless Earbuds Pro</SelectItem>
                                          <SelectItem value="prod_2">Fitness Tracker</SelectItem>
                                          <SelectItem value="prod_3">Coffee Maker Deluxe</SelectItem>
                                          <SelectItem value="prod_4">Smart Watch Series 3</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    
                                    <div className="flex justify-end gap-2">
                                      {selectedPost.status === 'pending' && (
                                        <>
                                          <Button 
                                            variant="outline"
                                            className="text-green-600 hover:text-green-700"
                                            onClick={() => handleStatusChange(selectedPost.id, 'approved')}
                                          >
                                            <Check className="h-4 w-4 mr-2" />
                                            Approve
                                          </Button>
                                          <Button 
                                            variant="outline"
                                            className="text-red-600 hover:text-red-700"
                                            onClick={() => handleStatusChange(selectedPost.id, 'rejected')}
                                          >
                                            <X className="h-4 w-4 mr-2" />
                                            Reject
                                          </Button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <div key={post.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <img 
                            src={post.mediaUrl} 
                            alt={`Post by ${post.username}`}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-gray-900">{post.username}</span>
                            <Badge className={`${getStatusColor(post.status)} text-xs`}>
                              {post.status}
                            </Badge>
                            {post.mediaType === 'video' && (
                              <Video className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                          
                          {post.caption && (
                            <p className="text-sm text-gray-700 mb-2">{post.caption}</p>
                          )}
                          
                          {post.hashtags && post.hashtags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {post.hashtags.slice(0, 5).map((tag, index) => (
                                <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                  {tag}
                                </span>
                              ))}
                              {post.hashtags.length > 5 && (
                                <span className="text-xs text-gray-500">
                                  +{post.hashtags.length - 5} more
                                </span>
                              )}
                            </div>
                          )}
                          
                          {post.assignedProductId && (
                            <div className="flex items-center gap-2 mb-2">
                              <Tag className="h-3 w-3 text-blue-600" />
                              <span className="text-xs text-blue-600">
                                Assigned to: {getProductName(post.assignedProductId)}
                              </span>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {post.status === 'pending' && (
                                <>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="text-green-600 hover:text-green-700"
                                    onClick={() => handleStatusChange(post.id, 'approved')}
                                  >
                                    <Check className="h-3 w-3 mr-1" />
                                    Approve
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() => handleStatusChange(post.id, 'rejected')}
                                  >
                                    <X className="h-3 w-3 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              )}
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setSelectedPost(post)}
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    View Details
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[600px]">
                                  <DialogHeader>
                                    <DialogTitle>Instagram Post Details</DialogTitle>
                                    <DialogDescription>
                                      Review and manage this Instagram post
                                    </DialogDescription>
                                  </DialogHeader>
                                  {selectedPost && (
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <img 
                                            src={selectedPost.mediaUrl} 
                                            alt={`Post by ${selectedPost.username}`}
                                            className="w-full h-48 object-cover rounded-lg"
                                          />
                                        </div>
                                        <div className="space-y-3">
                                          <div>
                                            <Label className="text-sm font-medium">Username</Label>
                                            <p className="text-sm text-gray-700">{selectedPost.username}</p>
                                          </div>
                                          <div>
                                            <Label className="text-sm font-medium">Status</Label>
                                            <Badge className={`${getStatusColor(selectedPost.status)} text-xs ml-2`}>
                                              {selectedPost.status}
                                            </Badge>
                                          </div>
                                          <div>
                                            <Label className="text-sm font-medium">Media Type</Label>
                                            <p className="text-sm text-gray-700 capitalize">{selectedPost.mediaType}</p>
                                          </div>
                                          <div>
                                            <Label className="text-sm font-medium">Date</Label>
                                            <p className="text-sm text-gray-700">
                                              {new Date(selectedPost.createdAt).toLocaleDateString()}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {selectedPost.caption && (
                                        <div>
                                          <Label className="text-sm font-medium">Caption</Label>
                                          <p className="text-sm text-gray-700 mt-1">{selectedPost.caption}</p>
                                        </div>
                                      )}
                                      
                                      {selectedPost.hashtags && selectedPost.hashtags.length > 0 && (
                                        <div>
                                          <Label className="text-sm font-medium">Hashtags</Label>
                                          <div className="flex flex-wrap gap-1 mt-1">
                                            {selectedPost.hashtags.map((tag, index) => (
                                              <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                                {tag}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                      
                                      <div>
                                        <Label className="text-sm font-medium">Assign to Product</Label>
                                        <Select 
                                          value={selectedPost.assignedProductId || ''} 
                                          onValueChange={(value) => handleAssignToProduct(selectedPost.id, value)}
                                        >
                                          <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Select a product" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="prod_1">Wireless Earbuds Pro</SelectItem>
                                            <SelectItem value="prod_2">Fitness Tracker</SelectItem>
                                            <SelectItem value="prod_3">Coffee Maker Deluxe</SelectItem>
                                            <SelectItem value="prod_4">Smart Watch Series 3</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      
                                      <div className="flex justify-end gap-2">
                                        {selectedPost.status === 'pending' && (
                                          <>
                                            <Button 
                                              variant="outline"
                                              className="text-green-600 hover:text-green-700"
                                              onClick={() => handleStatusChange(selectedPost.id, 'approved')}
                                            >
                                              <Check className="h-4 w-4 mr-2" />
                                              Approve
                                            </Button>
                                            <Button 
                                              variant="outline"
                                              className="text-red-600 hover:text-red-700"
                                              onClick={() => handleStatusChange(selectedPost.id, 'rejected')}
                                            >
                                              <X className="h-4 w-4 mr-2" />
                                              Reject
                                            </Button>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                            </div>
                            
                            <div className="text-xs text-gray-500">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}