import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@clerk/clerk-react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

interface WishlistButtonProps {
  productId: number;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
}

const WishlistButton = ({ 
  productId, 
  variant = 'outline', 
  size = 'icon',
  showLabel = false
}: WishlistButtonProps) => {
  const [isInWishlist, setIsInWishlist] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { userId, isSignedIn } = useAuth();
  const { toast } = useToast();

  // Check if product is in wishlist on load
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!isSignedIn || !userId) {
        setIsInWishlist(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('wishlists')
          .select('id')
          .eq('user_id', userId)
          .eq('product_id', productId)
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found" error
          console.error('Error checking wishlist status:', error);
        }
        
        setIsInWishlist(!!data);
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    };

    checkWishlistStatus();
  }, [productId, userId, isSignedIn]);

  const toggleWishlist = async () => {
    if (!isSignedIn) {
      // Prompt user to sign in
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your wishlist",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isInWishlist) {
        // Remove from wishlist
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', userId)
          .eq('product_id', productId);

        if (error) throw error;

        setIsInWishlist(false);
        toast({
          title: "Removed from wishlist",
          description: "The item has been removed from your wishlist",
        });
      } else {
        // Add to wishlist
        const { error } = await supabase
          .from('wishlists')
          .insert([
            {
              user_id: userId,
              product_id: productId,
              added_at: new Date().toISOString()
            }
          ]);

        if (error) throw error;

        setIsInWishlist(true);
        toast({
          title: "Added to wishlist",
          description: "The item has been added to your wishlist",
        });
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to update your wishlist. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      disabled={isLoading}
      onClick={toggleWishlist}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      className={`group ${isInWishlist ? 'text-red-500 hover:text-red-600' : 'text-gray-600 hover:text-red-500'}`}
    >
      <Heart 
        className={`h-5 w-5 ${isInWishlist ? 'fill-current' : 'fill-none group-hover:fill-red-500'}`} 
      />
      {showLabel && (
        <span className="ml-2">
          {isInWishlist ? 'Saved' : 'Save'}
        </span>
      )}
    </Button>
  );
};

export default WishlistButton; 