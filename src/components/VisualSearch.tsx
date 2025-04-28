import { useState, useRef } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { products } from "@/lib/productData";
import { analyzeProductImage } from "@/lib/openai";

interface VisualSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const VisualSearch = ({ isOpen, onClose }: VisualSearchProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<typeof products | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          setSelectedImage(e.target.result);
          setResults(null);
          setErrorMessage(null);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          setSelectedImage(e.target.result);
          setResults(null);
          setErrorMessage(null);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleSearch = async () => {
    if (!selectedImage) return;
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const matchedProducts = await analyzeProductImage(selectedImage, products);
      
      if (matchedProducts.length > 0) {
        setResults(matchedProducts);
      } else {
        setErrorMessage("Sorry, we don't have similar products in our catalog right now.");
      }
    } catch (error) {
      console.error("Visual search error:", error);
      setErrorMessage("An error occurred during visual search. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setResults(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Visual Product Search</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!selectedImage ? (
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange}
                ref={fileInputRef}
              />
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Drag and drop an image here, or click to select</p>
              <p className="text-gray-400 text-sm">Upload a photo of fitness apparel to find similar products</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img 
                  src={selectedImage} 
                  alt="Selected product" 
                  className="w-full h-64 object-contain rounded-lg" 
                />
                <button
                  onClick={clearImage}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70 transition-opacity"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {!results && !errorMessage && (
                <Button 
                  onClick={handleSearch} 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing image...
                    </>
                  ) : "Find similar products"}
                </Button>
              )}
              
              {errorMessage && (
                <div className="text-red-500 p-4 bg-red-50 rounded-lg text-center">
                  {errorMessage}
                </div>
              )}
              
              {results && results.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Similar products we found:</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {results.map((product) => (
                      <Card key={product.id} className="overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-40 object-cover"
                        />
                        <CardContent className="p-3">
                          <h4 className="font-medium line-clamp-1">{product.name}</h4>
                          <p className="text-sm text-gray-500">{product.category}</p>
                          <p className="font-bold mt-1">
                            {product.sale ? (
                              <>
                                <span className="text-gray-400 line-through text-xs mr-1">${product.price}</span>
                                <span className="text-yourfit-primary">${product.salePrice}</span>
                              </>
                            ) : (
                              <span>${product.price}</span>
                            )}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <Button 
                    onClick={clearImage} 
                    variant="outline" 
                    className="w-full"
                  >
                    Try another image
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VisualSearch; 