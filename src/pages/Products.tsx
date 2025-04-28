import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { products } from '@/lib/productData';
import { Button } from '@/components/ui/button';

const Products = () => {
  const [filter, setFilter] = useState('all');
  
  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(product => product.category.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>
      
      <div className="flex flex-wrap gap-3 mb-8">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button 
          variant={filter === 'men' ? 'default' : 'outline'}
          onClick={() => setFilter('men')}
        >
          Men's
        </Button>
        <Button 
          variant={filter === 'women' ? 'default' : 'outline'}
          onClick={() => setFilter('women')}
        >
          Women's
        </Button>
        <Button 
          variant={filter === 'footwear' ? 'default' : 'outline'}
          onClick={() => setFilter('footwear')}
        >
          Footwear
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <Link to={`/product/${product.id}`}>
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-60 object-cover hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">
                    <Link to={`/product/${product.id}`} className="hover:text-yourfit-primary">
                      {product.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-500">{product.category}</p>
                </div>
                {product.sale ? (
                  <div>
                    <span className="text-sm line-through text-gray-400">${product.price}</span>
                    <span className="block font-bold text-yourfit-primary">${product.salePrice}</span>
                  </div>
                ) : (
                  <span className="font-bold">${product.price}</span>
                )}
              </div>
              <Link to={`/product/${product.id}`}>
                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">No products found matching your filter.</p>
          <Button className="mt-4" onClick={() => setFilter('all')}>
            View All Products
          </Button>
        </div>
      )}
    </div>
  );
};

export default Products; 