import { useState, useEffect } from 'react';
import { StarIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { useAuth } from '@clerk/clerk-react';
import { supabase } from '@/lib/supabaseClient';

interface Review {
  id: string;
  user_name: string;
  product_id: number;
  rating: number;
  review_text: string;
  created_at: string;
}

interface ProductReviewsProps {
  productId: number;
}

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userRating, setUserRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [averageRating, setAverageRating] = useState<number>(0);
  const { userId, isSignedIn, user } = useAuth();

  // Fetch reviews for the product
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('product_reviews')
          .select('*')
          .eq('product_id', productId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) {
          setReviews(data as Review[]);
          
          // Calculate average rating
          if (data.length > 0) {
            const total = data.reduce((sum, review) => sum + review.rating, 0);
            setAverageRating(total / data.length);
          }
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [productId, success]);

  const handleRatingClick = (rating: number) => {
    setUserRating(rating);
  };

  const handleSubmitReview = async () => {
    // Validation
    if (!isSignedIn) {
      setError('You must be signed in to submit a review');
      return;
    }
    
    if (userRating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (reviewText.trim().length < 10) {
      setError('Review must be at least 10 characters long');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const newReview = {
        product_id: productId,
        user_id: userId,
        user_name: user?.fullName || 'Anonymous User',
        rating: userRating,
        review_text: reviewText,
      };
      
      const { error } = await supabase
        .from('product_reviews')
        .insert([newReview]);
      
      if (error) throw error;
      
      // Reset form
      setUserRating(0);
      setReviewText('');
      setSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      
      {/* Average Rating Display */}
      <div className="flex items-center mb-6">
        <div className="mr-4">
          <span className="text-3xl font-bold">{averageRating.toFixed(1)}</span>
          <span className="text-gray-500">/5</span>
        </div>
        <div>
          <StarRating rating={Math.round(averageRating)} />
          <p className="text-sm text-gray-500">{reviews.length} reviews</p>
        </div>
      </div>
      
      {/* Write a Review Section */}
      <div className="mb-8 p-4 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-3">Write a Review</h3>
        
        {!isSignedIn && (
          <p className="text-sm text-gray-500 mb-4">
            Please sign in to leave a review.
          </p>
        )}
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Your Rating</label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingClick(star)}
                disabled={!isSignedIn}
                className={`p-1 ${!isSignedIn ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <StarIcon
                  className={`h-6 w-6 ${
                    star <= userRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Your Review</label>
          <Textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            disabled={!isSignedIn}
            placeholder={isSignedIn ? "Tell us your experience with this product..." : "Sign in to write a review"}
            className={`h-24 ${!isSignedIn ? 'cursor-not-allowed opacity-50' : ''}`}
          />
        </div>
        
        {error && (
          <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-2 text-sm text-green-600 bg-green-50 rounded">
            Thank you for your review!
          </div>
        )}
        
        <Button 
          onClick={handleSubmitReview} 
          disabled={!isSignedIn || isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </div>
      
      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{review.user_name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                <p className="mt-3">{review.review_text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No reviews yet. Be the first to review this product!
        </div>
      )}
    </div>
  );
};

export default ProductReviews; 