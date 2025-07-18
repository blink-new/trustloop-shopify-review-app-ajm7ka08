import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import { dataService } from '@/services/dataService'
import { 
  Star, 
  Search, 
  Filter, 
  Check, 
  X, 
  Flag,
  Camera,
  MessageSquare,
  MoreHorizontal,
  Reply,
  ExternalLink,
  Zap,
  FileText,
  Eye,
  Mail
} from 'lucide-react'

export default function Reviews() {
  const [selectedTab, setSelectedTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProduct, setSelectedProduct] = useState("all")
  const [selectedRating, setSelectedRating] = useState("all")
  const [replyText, setReplyText] = useState("")
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    try {
      setLoading(true)
      const data = await dataService.getReviews()
      setReviews(data)
    } catch (error) {
      console.error('Error loading reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'flagged': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleApprove = async (reviewId: string) => {
    try {
      await dataService.updateReviewStatus(reviewId, 'approved')
      setReviews(prev => prev.map(r => 
        r.id === reviewId ? { ...r, status: 'approved' } : r
      ))
      toast({
        title: "Review Approved",
        description: "The review has been approved and is now live.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve review. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (reviewId: string) => {
    try {
      await dataService.updateReviewStatus(reviewId, 'rejected')
      setReviews(prev => prev.map(r => 
        r.id === reviewId ? { ...r, status: 'rejected' } : r
      ))
      toast({
        title: "Review Rejected",
        description: "The review has been rejected and hidden from customers.",
        variant: "destructive",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject review. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleFlag = async (reviewId: string) => {
    try {
      await dataService.updateReviewStatus(reviewId, 'flagged')
      setReviews(prev => prev.map(r => 
        r.id === reviewId ? { ...r, status: 'flagged' } : r
      ))
      toast({
        title: "Review Flagged",
        description: "The review has been flagged for manual review.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to flag review. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleReply = async (reviewId: string) => {
    if (replyText.trim()) {
      try {
        await dataService.replyToReview(reviewId, replyText)
        setReviews(prev => prev.map(r => 
          r.id === reviewId ? { ...r, replyText, replyDate: new Date().toISOString() } : r
        ))
        toast({
          title: "Reply Sent",
          description: "Your reply has been posted to the review.",
        })
        setReplyText("")
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to send reply. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const filteredReviews = selectedTab === "all" 
    ? reviews.filter(review => 
        (searchQuery === "" || review.comment.toLowerCase().includes(searchQuery.toLowerCase()) || 
         review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
         review.productName.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (selectedProduct === "all" || review.productName.toLowerCase().includes(selectedProduct.toLowerCase())) &&
        (selectedRating === "all" || review.rating.toString() === selectedRating)
      )
    : reviews.filter(review => 
        review.status === selectedTab &&
        (searchQuery === "" || review.comment.toLowerCase().includes(searchQuery.toLowerCase()) || 
         review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
         review.productName.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (selectedProduct === "all" || review.productName.toLowerCase().includes(selectedProduct.toLowerCase())) &&
        (selectedRating === "all" || review.rating.toString() === selectedRating)
      )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
          <p className="text-gray-600">Manage and moderate customer reviews</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Auto-Moderate
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Export Reviews
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">{reviews.length}</div>
            <div className="text-sm text-gray-600">Total Reviews</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {reviews.filter(r => r.status === 'approved').length}
            </div>
            <div className="text-sm text-gray-600">Approved</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {reviews.filter(r => r.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {reviews.filter(r => r.status === 'flagged').length}
            </div>
            <div className="text-sm text-gray-600">Flagged</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search reviews..." 
                  className="pl-10" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedRating} onValueChange={setSelectedRating}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Customer Reviews</CardTitle>
          <CardDescription>Manage and moderate customer feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Reviews</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="flagged">Flagged</TabsTrigger>
            </TabsList>
            
            <TabsContent value={selectedTab} className="mt-6">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredReviews.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Found</h3>
                  <p className="text-gray-500 mb-6">
                    {selectedTab === 'all' 
                      ? "Start collecting reviews by installing widgets or running email campaigns."
                      : `No ${selectedTab} reviews found. Try adjusting your filters or check a different tab.`
                    }
                  </p>
                  <div className="space-x-2">
                    <Button variant="outline">
                      Install Widgets
                    </Button>
                    <Button>
                      Create Campaign
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReviews.map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-blue-700">
                                {review.customerName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{review.customerName}</h4>
                              <p className="text-sm text-gray-600">{review.customerEmail}</p>
                            </div>
                            {review.verifiedPurchase && (
                              <Badge variant="secondary" className="text-xs bg-green-50 text-green-700">
                                Verified Purchase
                              </Badge>
                            )}
                            <Badge className={`text-xs ${getStatusColor(review.status)}`}>
                              {review.status}
                            </Badge>
                          </div>
                          
                          <div className="mb-3">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} 
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600">for {review.productName}</span>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                          
                          {review.replyText && (
                            <div className="mb-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                              <div className="flex items-center gap-2 mb-2">
                                <Reply className="h-3 w-3 text-blue-600" />
                                <span className="text-sm font-medium text-blue-900">Store Reply</span>
                              </div>
                              <p className="text-sm text-blue-800">{review.replyText}</p>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                            {review.hasPhoto && (
                              <div className="flex items-center gap-1">
                                <Camera className="h-3 w-3" />
                                <span>Has photo</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              <span>{review.helpfulVotes} helpful</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          {review.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-green-600 hover:text-green-700"
                                onClick={() => handleApprove(review.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleReject(review.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {review.status === 'approved' && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-orange-600 hover:text-orange-700"
                              onClick={() => handleFlag(review.id)}
                            >
                              <Flag className="h-4 w-4" />
                            </Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="outline">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem className="flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Email Customer
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2">
                                <ExternalLink className="h-4 w-4" />
                                View Product
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Export Review
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      
                      {/* Reply Section */}
                      {review.status === 'approved' && !review.replyText && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <Reply className="h-4 w-4" />
                                Reply to Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Reply to {review.customerName}</DialogTitle>
                                <DialogDescription>
                                  Your reply will be public and visible to all customers.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center gap-1 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                      <Star 
                                        key={i} 
                                        className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} 
                                      />
                                    ))}
                                  </div>
                                  <p className="text-sm text-gray-700">{review.comment}</p>
                                </div>
                                <Textarea
                                  placeholder="Write your reply..."
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  rows={4}
                                />
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" onClick={() => setReplyText("")}>
                                    Cancel
                                  </Button>
                                  <Button 
                                    onClick={() => handleReply(review.id)}
                                    disabled={!replyText.trim()}
                                  >
                                    Send Reply
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
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