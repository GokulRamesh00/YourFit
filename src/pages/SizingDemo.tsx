import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Shirt, Umbrella, Footprints } from 'lucide-react';
import ProductSizeSelector from '@/components/ProductSizeSelector';
import FindYourFit from '@/components/FindYourFit';

const SizingDemo = () => {
  const [selectedTopSize, setSelectedTopSize] = useState<string>('');
  const [selectedBottomSize, setSelectedBottomSize] = useState<string>('');
  const [selectedFootwearSize, setSelectedFootwearSize] = useState<string>('');
  
  const topsSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const bottomsSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const footwearSizes = ['6', '7', '8', '9', '10', '11', '12'];
  
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-2">Sizing Features Demo</h1>
      <p className="text-gray-600 mb-8">Explore our enhanced sizing tools to help customers find their perfect fit</p>
      
      <Tabs defaultValue="selector" className="mb-10">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="selector">Size Selector</TabsTrigger>
          <TabsTrigger value="finder">Size Finder Dialog</TabsTrigger>
        </TabsList>
        
        <TabsContent value="selector">
          <Card>
            <CardHeader>
              <CardTitle>Product Size Selector</CardTitle>
              <CardDescription>
                This component combines size buttons with a size finder popup, allowing users to select their size directly or get recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-10">
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Shirt className="h-5 w-5" />
                  <h3 className="text-lg font-medium">Tops Sizing</h3>
                </div>
                <ProductSizeSelector
                  productType="tops"
                  availableSizes={topsSizes}
                  onSizeChange={setSelectedTopSize}
                  defaultSize={selectedTopSize}
                />
                {selectedTopSize && (
                  <div className="text-sm font-medium text-green-600">
                    Selected size: {selectedTopSize}
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Umbrella className="h-5 w-5" />
                  <h3 className="text-lg font-medium">Bottoms Sizing</h3>
                </div>
                <ProductSizeSelector
                  productType="bottoms"
                  availableSizes={bottomsSizes}
                  onSizeChange={setSelectedBottomSize}
                  defaultSize={selectedBottomSize}
                />
                {selectedBottomSize && (
                  <div className="text-sm font-medium text-green-600">
                    Selected size: {selectedBottomSize}
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Footprints className="h-5 w-5" />
                  <h3 className="text-lg font-medium">Footwear Sizing</h3>
                </div>
                <ProductSizeSelector
                  productType="footwear"
                  availableSizes={footwearSizes}
                  onSizeChange={setSelectedFootwearSize}
                  defaultSize={selectedFootwearSize}
                />
                {selectedFootwearSize && (
                  <div className="text-sm font-medium text-green-600">
                    Selected size: {selectedFootwearSize}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="finder">
          <Card>
            <CardHeader>
              <CardTitle>Find Your Fit Component</CardTitle>
              <CardDescription>
                This standalone component can be used anywhere in the UI to help users determine their size.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center gap-3 p-4 border rounded-md">
                  <Shirt className="h-8 w-8" />
                  <h3 className="font-medium">Tops</h3>
                  <FindYourFit 
                    productType="tops" 
                    onSizeSelect={(size) => {
                      setSelectedTopSize(size);
                      alert(`Tops size selected: ${size}`);
                    }} 
                  />
                </div>
                
                <div className="flex flex-col items-center gap-3 p-4 border rounded-md">
                  <Umbrella className="h-8 w-8" />
                  <h3 className="font-medium">Bottoms</h3>
                  <FindYourFit 
                    productType="bottoms" 
                    onSizeSelect={(size) => {
                      setSelectedBottomSize(size);
                      alert(`Bottoms size selected: ${size}`);
                    }} 
                  />
                </div>
                
                <div className="flex flex-col items-center gap-3 p-4 border rounded-md">
                  <Footprints className="h-8 w-8" />
                  <h3 className="font-medium">Footwear</h3>
                  <FindYourFit 
                    productType="footwear" 
                    onSizeSelect={(size) => {
                      setSelectedFootwearSize(size);
                      alert(`Footwear size selected: ${size}`);
                    }} 
                  />
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2">Selected Sizes:</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Tops:</span>
                    <span className="ml-2 font-medium">{selectedTopSize || 'None'}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Bottoms:</span>
                    <span className="ml-2 font-medium">{selectedBottomSize || 'None'}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Footwear:</span>
                    <span className="ml-2 font-medium">{selectedFootwearSize || 'None'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Implementation Guide</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">Product Page Integration</h3>
            <p className="text-sm text-gray-600">
              Add the ProductSizeSelector component to your product pages for an enhanced size selection experience:
            </p>
            <pre className="bg-gray-900 text-gray-100 p-3 rounded-md mt-2 text-xs overflow-x-auto">
{`<ProductSizeSelector
  productType={getProductType(product.category)}
  availableSizes={availableSizes}
  onSizeChange={setSelectedSize}
  defaultSize={selectedSize}
/>`}
            </pre>
          </div>
          
          <div>
            <h3 className="font-medium mb-1">Standalone Size Finder</h3>
            <p className="text-sm text-gray-600">
              Use the FindYourFit component anywhere you need to help users determine their size:
            </p>
            <pre className="bg-gray-900 text-gray-100 p-3 rounded-md mt-2 text-xs overflow-x-auto">
{`<FindYourFit 
  productType="tops" 
  onSizeSelect={(size) => {
    // Handle selected size
    console.log(\`Size selected: \${size}\`);
  }} 
/>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizingDemo; 