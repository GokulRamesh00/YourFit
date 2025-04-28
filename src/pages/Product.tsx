import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product as ProductType, products } from '@/lib/productData';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Star, ShoppingCart, Heart, MessageCircle, Share2 } from 'lucide-react';
import ProductSizeRecommender from '@/components/ProductSizeRecommender';
import ProductReviews from '@/components/ProductReviews';
import WishlistButton from '@/components/WishlistButton';
import ProductSizeSelector from '@/components/ProductSizeSelector';

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>('description');

  useEffect(() => {
    if (id) {
      const foundProduct = products.find(p => p.id.toString() === id);
      if (foundProduct) {
        setProduct(foundProduct);
      }
    }
  }, [id]);

  if (!product) {
    return <div className="container mx-auto px-4 py-12">Product not found</div>;
  }

  // Determine product type for the size selector
  const getProductType = () => {
    const category = product.category.toLowerCase();
    if (category.includes('footwear') || category.includes('shoe')) {
      return 'footwear';
    } else if (
      category.includes('pants') || 
      category.includes('shorts') || 
      category.includes('leggings') || 
      category.includes('bottom')
    ) {
      return 'bottoms';
    } else {
      return 'tops'; // Default to tops for shirts, t-shirts, etc.
    }
  };

  // Extract the available sizes for this product (example)
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL'];

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    // Add to cart logic would go here
    alert(`Added ${product.name} (${selectedSize}) to cart`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Product Images */}
        <div className="md:w-1/2">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-auto rounded-lg object-cover"
          />
          <div className="grid grid-cols-4 gap-2 mt-4">
            <img 
              src={product.image} 
              alt={product.name} 
              className="rounded cursor-pointer border-2 border-yourfit-primary"
            />
            {/* Additional product images would go here */}
            <div className="rounded bg-gray-100 h-24"></div>
            <div className="rounded bg-gray-100 h-24"></div>
            <div className="rounded bg-gray-100 h-24"></div>
          </div>
        </div>

        {/* Product Details */}
        <div className="md:w-1/2">
          <div className="mb-4">
            <span className="text-gray-500">{product.category}</span>
            <h1 className="text-3xl font-bold mt-1">{product.name}</h1>
            
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`h-5 w-5 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="ml-2 text-gray-600">4.0 (24 reviews)</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            {product.sale ? (
              <div className="flex items-center">
                <span className="text-3xl font-bold text-yourfit-primary">${product.salePrice}</span>
                <span className="ml-3 text-lg text-gray-400 line-through">${product.price}</span>
                <span className="ml-3 bg-red-100 text-red-800 px-2 py-1 rounded-md text-sm font-medium">
                  SALE
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold">${product.price}</span>
            )}
          </div>

          {/* Size Selector Component */}
          <div className="mb-6">
            <ProductSizeSelector
              productType={getProductType()}
              availableSizes={availableSizes}
              onSizeChange={setSelectedSize}
              defaultSize={selectedSize}
            />
          </div>

          {/* Quantity Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Quantity</h3>
            <div className="flex items-center border rounded-md w-32">
              <button
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                className="px-3 py-2 text-gray-600 hover:text-black"
              >
                -
              </button>
              <span className="flex-1 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-gray-600 hover:text-black"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            <Button 
              onClick={handleAddToCart}
              className="flex-1 bg-black hover:bg-yourfit-dark text-white"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            
            <WishlistButton 
              productId={product.id} 
              variant="outline" 
              size="default"
              showLabel={true}
            />
          </div>

          {/* Product Info Tabs */}
          <Tabs defaultValue="description" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="text-gray-700">
              <p>{product.description || 'No description available.'}</p>
            </TabsContent>
            
            <TabsContent value="details" className="text-gray-700">
              <ul className="list-disc pl-5 space-y-2">
                <li>Material: Premium performance fabric</li>
                <li>Care: Machine wash cold, tumble dry low</li>
                <li>Features: Moisture-wicking, breathable</li>
                <li>Fit: Regular fit</li>
                <li>Origin: Imported</li>
              </ul>
            </TabsContent>
            
            <TabsContent value="shipping" className="text-gray-700">
              <p className="mb-3">Free standard shipping on all orders over $75.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Standard: 3-5 business days</li>
                <li>Express: 2-3 business days</li>
                <li>Overnight: Next business day</li>
              </ul>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Product Reviews Section */}
      <div className="mt-16">
        <ProductReviews productId={product.id} />
      </div>
    </div>
  );
};

export default Product; 