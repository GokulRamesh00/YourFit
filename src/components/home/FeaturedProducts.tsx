import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgePercent, ShoppingCart } from "lucide-react";
import { products } from "@/lib/productData";

const FeaturedProducts = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Best Sellers</h2>
          <p className="mt-4 text-xl text-gray-600">
            Our most popular products, trusted by athletes worldwide
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden card-hover border border-gray-200">
              <div className="relative">
                {product.sale && (
                  <div className="absolute top-2 left-2 bg-yourfit-primary text-white px-2 py-1 rounded-md text-xs font-bold flex items-center">
                    <BadgePercent className="h-3 w-3 mr-1" />
                    SALE
                  </div>
                )}
                <Link to={`/product/${product.id}`}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-64 object-cover"
                  />
                </Link>
              </div>
              
              <CardContent className="p-4">
                <div className="text-sm text-gray-500 mb-1">{product.category}</div>
                <Link to={`/product/${product.id}`} className="hover:text-yourfit-primary">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.name}</h3>
                </Link>
                <div className="flex items-center">
                  {product.sale ? (
                    <>
                      <span className="text-gray-400 line-through mr-2">${product.price}</span>
                      <span className="font-bold text-yourfit-primary">${product.salePrice}</span>
                    </>
                  ) : (
                    <span className="font-bold">${product.price}</span>
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
        
        <div className="text-center mt-10">
          <Link to="/shop">
            <Button className="btn-primary">View All Products</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
