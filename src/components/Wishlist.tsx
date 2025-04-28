import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { supabase } from '@/lib/supabaseClient';
import { Product, products } from '@/lib/productData';
import { WishlistItem } from '@/lib/supabaseClient';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<(WishlistItem & { product: Product })[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { userId, isSignedIn } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isSignedIn || !userId) {
        setWishlistItems([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('wishlists')
          .select('*')
          .eq('user_id', userId)
          .order('added_at', { ascending: false });
        
        if (error) throw error;
        
        // Join with product data
        const itemsWithProducts = data.map(item => {
          const product = products.find(p => p.id === item.product_id);
          return { ...item, product: product! };
        }).filter(item => item.product); // Filter out any items where product wasn't found
        
        setWishlistItems(itemsWithProducts);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        toast({
          title: "Error",
          description: "Failed to load your wishlist. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, [userId, isSignedIn, toast]);

  const removeFromWishlist = async (itemId: string, productName: string) => {
    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('id', itemId);
      
      if (error) throw error;
      
      // Update state
      setWishlistItems(current => current.filter(item => item.id !== itemId));
      
      toast({
        title: "Removed from wishlist",
        description: `${productName} has been removed from your wishlist`,
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from your wishlist. Please try again.",
        variant: "destructive"
      });
    }
  };

  const EmptyWishlist = () => (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Heart className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
      <p className="text-gray-500 mb-6">
        Items you save to your wishlist will appear here.
      </p>
      <Link to="/products">
        <Button>Browse Products</Button>
      </Link>
    </div>
  );

  if (!isSignedIn) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Please sign in to view your wishlist</h3>
          <p className="text-gray-500 mb-6">
            Sign in to save and view your favorite products.
          </p>
          <Button>Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : wishlistItems.length === 0 ? (
        <EmptyWishlist />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map(item => (
            <Card key={item.id} className="overflow-hidden border border-gray-200 group">
              <div className="relative">
                <Link to={`/product/${item.product.id}`}>
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    className="w-full h-64 object-cover group-hover:opacity-90 transition-opacity"
                  />
                </Link>
                <button 
                  onClick={() => removeFromWishlist(item.id!, item.product.name)}
                  className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-red-50 transition-colors"
                  aria-label={`Remove ${item.product.name} from wishlist`}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>
              
              <CardContent className="p-4">
                <div className="text-sm text-gray-500 mb-1">{item.product.category}</div>
                <Link to={`/product/${item.product.id}`} className="hover:text-yourfit-primary">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">{item.product.name}</h3>
                </Link>
                <div className="flex items-center">
                  {item.product.sale ? (
                    <>
                      <span className="text-gray-400 line-through mr-2">${item.product.price}</span>
                      <span className="font-bold text-yourfit-primary">${item.product.salePrice}</span>
                    </>
                  ) : (
                    <span className="font-bold">${item.product.price}</span>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="p-4 pt-0">
                <Button className="w-full bg-yourfit-dark hover:bg-black flex items-center justify-center">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;

// Import the Heart icon for EmptyWishlist
import { Heart } from 'lucide-react'; 