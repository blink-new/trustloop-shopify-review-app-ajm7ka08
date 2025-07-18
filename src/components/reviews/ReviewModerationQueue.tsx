import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { dataService, Review } from '@/services/dataService'
import { 
  Check, 
  X, 
  Flag, 
  Star, 
  Camera, 
  Video,
  Shield,
  MessageSquare,
  Clock,
  User,
  Reply,
  Bot
} from 'lucide-react'

interface ReviewModerationQueueProps {
  onStatusChange?: (reviewId: string, status: Review['status']) => void
  onReplyAdded?: (reviewId: string, reply: string) => void
}

export default function ReviewModerationQueue({ 
  onStatusChange, 
  onReplyAdded 
}: ReviewModerationQueueProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [replyText, setReplyText] = useState('')
  const [moderationScores, setModerationScores] = useState<Record<string, number>>({})
  const { toast } = useToast()

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    try {
      setLoading(true)
      const data = await dataService.getReviews()
      setReviews(data)
      
      // Simulate AI moderation scores
      const scores: Record<string, number> = {}
      data.forEach(review => {
        scores[review.id] = Math.random() * 100
      })
      setModerationScores(scores)
    } catch (error) {
      console.error('Error loading reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (reviewId: string, status: Review['status']) => {
    try {
      await dataService.updateReviewStatus(reviewId, status)
      setReviews(prev => prev.map(r => 
        r.id === reviewId ? { ...r, status } : r
      ))
      
      onStatusChange?.(reviewId, status)
      
      toast({
        title: `Review ${status}`,
        description: `The review has been ${status} successfully.`,
        variant: status === 'rejected' ? 'destructive' : 'default'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update review status.',
        variant: 'destructive'
      })
    }
  }

  const handleReply = async (reviewId: string) => {
    if (!replyText.trim()) return
    
    try {
      await dataService.replyToReview(reviewId, replyText)
      setReviews(prev => prev.map(r => 
        r.id === reviewId ? { 
          ...r, 
          replyText, 
          replyDate: new Date().toISOString() 
        } : r
      ))
      
      onReplyAdded?.(reviewId, replyText)
      setReplyText('')
      setSelectedReview(null)
      
      toast({
        title: 'Reply Added',
        description: 'Your reply has been posted successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add reply.',
        variant: 'destructive'
      })
    }
  }

  const getModerationSuggestion = (score: number) => {
    if (score >= 80) return { text: 'Auto-Approve', color: 'bg-green-100 text-green-800' }
    if (score >= 60) return { text: 'Review', color: 'bg-yellow-100 text-yellow-800' }
    return { text: 'Flag', color: 'bg-red-100 text-red-800' }
  }

  const getStatusColor = (status: Review['status']) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'flagged': return 'bg-red-100 text-red-800'
      case 'rejected': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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
            <CardTitle className="text-lg font-semibold text-gray-900">Review Moderation Queue</CardTitle>
            <CardDescription>AI-powered review moderation and management</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
              {reviews.filter(r => r.status === 'pending').length} Pending
            </Badge>
            <Button variant="outline" size="sm" onClick={loadReviews}>
              <Clock className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-600 mb-4">
              Reviews will appear here once customers start submitting them.
            </p>
            <Button variant="outline" onClick={() => window.location.href = '/widgets'}>
              Set up review widgets
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => {
              const moderationScore = moderationScores[review.id] || 0
              const suggestion = getModerationSuggestion(moderationScore)
              
              return (
                <div key={review.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{review.customerName}</h4>
                          <Badge className={getStatusColor(review.status)}>
                            {review.status}
                          </Badge>
                          {review.verifiedPurchase && (
                            <Badge variant="secondary" className="bg-green-50 text-green-700">
                              <Shield className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{review.customerEmail}</p>
                        
                        <div className="flex items-center gap-2 mb-2">
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
                        
                        <p className="text-gray-700 mb-3">{review.comment}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                          {review.hasPhoto && (
                            <div className="flex items-center gap-1">
                              <Camera className="h-3 w-3" />
                              <span>Photo</span>
                            </div>
                          )}
                          {review.hasVideo && (
                            <div className="flex items-center gap-1">
                              <Video className="h-3 w-3" />
                              <span>Video</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            <span>{review.helpfulVotes} helpful</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <Badge className={suggestion.color} variant="secondary">
                          <Bot className="h-3 w-3 mr-1" />
                          {suggestion.text}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {Math.round(moderationScore)}% confidence
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {review.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => handleStatusChange(review.id, 'approved')}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleStatusChange(review.id, 'rejected')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-orange-600 hover:text-orange-700"
                              onClick={() => handleStatusChange(review.id, 'flagged')}
                            >
                              <Flag className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        
                        {review.status === 'approved' && !review.replyText && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedReview(review)}
                              >
                                <Reply className="h-4 w-4 mr-2" />
                                Reply
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
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
                                  <Button 
                                    variant="outline" 
                                    onClick={() => {
                                      setReplyText('')
                                      setSelectedReview(null)
                                    }}
                                  >
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
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {review.replyText && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <div className="flex items-center gap-2 mb-2">
                        <Reply className="h-3 w-3 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Store Reply</span>
                        <span className="text-xs text-blue-700">
                          {review.replyDate ? new Date(review.replyDate).toLocaleDateString() : 'Just now'}
                        </span>
                      </div>
                      <p className="text-sm text-blue-800">{review.replyText}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}