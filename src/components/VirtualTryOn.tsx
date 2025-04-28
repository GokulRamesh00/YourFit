import { useState, useRef, useEffect } from "react";
import { X, Upload, Loader2, User, AlertTriangle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { products } from "@/lib/productData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateVirtualTryOn, generateAdvancedVirtualTryOn } from "@/lib/openai";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface VirtualTryOnProps {
  isOpen: boolean;
  onClose: () => void;
}

const VirtualTryOn = ({ isOpen, onClose }: VirtualTryOnProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [virtualResults, setVirtualResults] = useState<{ originalImage?: string, productImage?: string, virtualImage?: string, aiGeneratedImage?: string } | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("before-after");
  const [useAI, setUseAI] = useState(false);
  const [processingAI, setProcessingAI] = useState(false);
  const [simulatedTryOn, setSimulatedTryOn] = useState<string | null>(null);
  
  // A mapping of product names to their design-only transparent PNG images
  // In a real app, these would be separate assets in your product database
  const productDesigns: {[key: string]: string} = {
    "TrainTech Performance Tee": "/designs/traintech-design.png",
    // Add more designs for other products as needed
  };
  
  useEffect(() => {
    // Reset state when dialog is opened
    if (isOpen) {
      setSelectedImage(null);
      setVirtualResults(null);
      setSelectedProduct(null);
      setErrorMessage(null);
      setAddedToCart(false);
      setProcessingAI(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          const imageResult = e.target.result;
          setSelectedImage(imageResult);
          setVirtualResults(null);
          setErrorMessage(null);
          
          // Auto-select the first product if products exist
          if (products.length > 0 && !selectedProduct) {
            setSelectedProduct(products[0]);
          }
          
          setAddedToCart(false);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleProductSelect = (product: typeof products[0]) => {
    setSelectedProduct(product);
    setAddedToCart(false);
  };

  const handleVirtualTryOn = async () => {
    if (!selectedImage) {
      setErrorMessage("Please upload your photo first");
      return;
    }
    
    if (!selectedProduct) {
      setErrorMessage("Please select a product first");
      return;
    }
    
    console.log("Starting virtual try-on process", {
      product: selectedProduct.name,
      hasImage: !!selectedImage
    });
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      // Standard setup - create basic virtual results
      const basicResults = {
        virtualImage: selectedImage, // Use original photo as the base
        originalImage: selectedImage,
        productImage: selectedProduct.image
      };
      
      // Set initial results
      setVirtualResults(basicResults);
      
      // For the TrainTech Performance Tee and other products with transparent designs,
      // we don't need to do any advanced processing - we'll use CSS overlays
      // This approach is much more reliable than canvas manipulation
      setSimulatedTryOn(selectedImage);
      
      // Auto-switch to the try-on tab
      setActiveTab("try-on");
    } catch (error) {
      console.error("Virtual try-on error:", error);
      if (error instanceof Error) {
        setErrorMessage(error.message || "Failed to process virtual try-on. Please try again.");
      } else {
        setErrorMessage("Failed to process virtual try-on. Please try again.");
      }
    } finally {
      setIsLoading(false);
      setProcessingAI(false);
    }
  };

  // Helper function to get product design URL if it exists
  const getProductDesignUrl = (productName: string): string | null => {
    // Default designs for specific products
    if (productName.toLowerCase().includes('traintech')) {
      // Return a placeholder design path - replace with your actual design PNG
      return '/designs/traintech-workout-text.png';
    }
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Virtual Try-On Experience</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <p className="text-muted-foreground">
            Upload your photo and select a product to see how it looks on you!
          </p>
          
          <div className="flex items-center space-x-2 mb-4">
            <Switch 
              id="ai-mode" 
              checked={useAI}
              onCheckedChange={setUseAI}
            />
            <Label htmlFor="ai-mode" className="flex items-center">
              <Sparkles className="h-4 w-4 mr-1 text-amber-500" />
              Use experimental AI try-on (may create different person)
            </Label>
            <span className="text-xs text-muted-foreground ml-2">
              Local processing is faster and more accurate
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Card className="h-full">
                <CardContent className="p-4 flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <div 
                      className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {!selectedImage ? (
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <Upload className="h-8 w-8 text-muted-foreground" />
                          <p className="text-sm font-medium">Click to upload or drag and drop</p>
                          <p className="text-xs text-muted-foreground">JPG, PNG, WEBP up to 10MB</p>
                        </div>
                      ) : (
                        <div className="relative aspect-square w-full max-h-[300px] overflow-hidden rounded-md">
                          <img 
                            src={selectedImage} 
                            alt="Uploaded photo"
                            className="object-cover w-full h-full"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedImage(null);
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Select a product
                      </label>
                      <select 
                        className="w-full p-2 border rounded-md"
                        value={selectedProduct?.id.toString() || ""}
                        onChange={(e) => {
                          const product = products.find(p => p.id.toString() === e.target.value);
                          if (product) handleProductSelect(product);
                        }}
                      >
                        <option value="">Select a product</option>
                        {products.map(product => (
                          <option key={product.id} value={product.id.toString()}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {selectedProduct && (
                      <div className="border rounded-md p-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-16 w-16 rounded-md overflow-hidden">
                            <img 
                              src={selectedProduct.image} 
                              alt={selectedProduct.name}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{selectedProduct.name}</p>
                            <p className="text-sm text-muted-foreground">${selectedProduct.price}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {errorMessage && (
                      <div className="flex items-center p-3 rounded-md bg-destructive/10 text-destructive">
                        <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
                        <p className="text-sm">{errorMessage}</p>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    onClick={handleVirtualTryOn}
                    disabled={!selectedImage || !selectedProduct || isLoading}
                    className="w-full mt-4"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Try It On"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {virtualResults && (
              <div className="flex-1">
                <Card className="h-full">
                  <CardContent className="p-4">
                    <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="w-full">
                        <TabsTrigger value="before-after" className="flex-1">Before & After</TabsTrigger>
                        <TabsTrigger value="try-on" className="flex-1">Basic Try-On</TabsTrigger>
                        {useAI && (
                          <TabsTrigger value="ai-tryOn" className="flex-1 relative">
                            AI Try-On
                            {processingAI && (
                              <span className="absolute top-1 right-1">
                                <Loader2 className="h-3 w-3 animate-spin text-amber-500" />
                              </span>
                            )}
                          </TabsTrigger>
                        )}
                      </TabsList>
                      
                      <TabsContent value="before-after" className="mt-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Your Photo</p>
                            <div className="border rounded-md overflow-hidden">
                              <img 
                                src={virtualResults.originalImage} 
                                alt="Your photo" 
                                className="w-full object-contain max-h-[300px]"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Product</p>
                            <div className="border rounded-md overflow-hidden">
                              <img 
                                src={virtualResults.productImage} 
                                alt="Product" 
                                className="w-full object-contain max-h-[300px]"
                              />
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="try-on" className="mt-4">
                        <div className="relative max-w-md mx-auto">
                          <div className="border rounded-md overflow-hidden">
                            <div className="relative aspect-auto max-h-[400px]">
                              {/* Base image - always show the user's photo */}
                              <img 
                                src={virtualResults.originalImage} 
                                alt="Base" 
                                className="w-full"
                              />
                              
                              {/* Overlay for TrainTech Performance Tee */}
                              {selectedProduct && selectedProduct.name.includes('TrainTech') && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  {/* Black t-shirt overlay - semi-transparent black rectangle */}
                                  <div 
                                    className="absolute" 
                                    style={{
                                      top: '20%',
                                      left: '25%',
                                      width: '50%',
                                      height: '35%',
                                      backgroundColor: 'black',
                                      opacity: 0.85,
                                      borderRadius: '5px'
                                    }}
                                  ></div>
                                  
                                  {/* Text overlay - this would ideally be a transparent PNG */}
                                  <div 
                                    className="absolute text-center text-white font-bold" 
                                    style={{
                                      top: '25%',
                                      left: '30%',
                                      width: '40%'
                                    }}
                                  >
                                    <div style={{ fontSize: 'min(3vw, 16px)' }}>YOUR WORKOUT</div>
                                    <div style={{ fontSize: 'min(3.5vw, 18px)', margin: '4px 0' }}>IS MY</div>
                                    <div style={{ fontSize: 'min(3vw, 16px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                      <span className="inline-block h-3 w-3 mr-1">
                                        <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14 4.14 5.57 2 7.71 3.43 9.14 2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22 14.86 20.57"/>
                                        </svg>
                                      </span>
                                      WARM UP
                                      <span className="inline-block h-3 w-3 ml-1">
                                        <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14 4.14 5.57 2 7.71 3.43 9.14 2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22 14.86 20.57"/>
                                        </svg>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {/* For other products */}
                              {selectedProduct && !selectedProduct.name.includes('TrainTech') && (
                                <div 
                                  className="absolute"
                                  style={{
                                    top: '15%',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '50%',
                                    height: '40%',
                                    zIndex: 15
                                  }}
                                >
                                  <div className="relative w-full h-full overflow-hidden">
                                    <img 
                                      src={virtualResults.productImage}
                                      alt={selectedProduct.name} 
                                      className="w-full h-full object-contain"
                                      style={{
                                        mixBlendMode: 'multiply',
                                        opacity: 0.9,
                                        filter: 'contrast(1.2)'
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                              
                              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs p-1 rounded">
                                <p className="font-medium">Basic Try-On Preview</p>
                                <p className="text-[10px]">Design overlay simulation</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      {useAI && (
                        <TabsContent value="ai-tryOn" className="mt-4">
                          <div className="relative max-w-md mx-auto">
                            <div className="border rounded-md overflow-hidden">
                              {processingAI ? (
                                <div className="flex flex-col items-center justify-center p-12 space-y-4 bg-muted/20">
                                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                                  <div className="text-center">
                                    <p className="font-medium">Generating AI try-on image...</p>
                                    <p className="text-sm text-muted-foreground mt-1">This may take up to 30 seconds</p>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  {virtualResults?.aiGeneratedImage ? (
                                    <div className="relative">
                                      <img 
                                        src={virtualResults.aiGeneratedImage} 
                                        alt="AI-generated try-on" 
                                        className="w-full"
                                      />
                                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs p-1 rounded flex items-center">
                                        <Sparkles className="h-3 w-3 text-amber-400 mr-1" />
                                        <p className="font-medium">
                                          {useAI ? "AI-Generated Try-On" : "Enhanced Try-On"}
                                        </p>
                                      </div>
                                    </div>
                                  ) : errorMessage ? (
                                    <div className="flex flex-col items-center justify-center p-12 space-y-4 bg-muted/20">
                                      <AlertTriangle className="h-12 w-12 text-amber-500" />
                                      <div className="text-center">
                                        <p className="font-medium">AI Generation Error</p>
                                        <p className="text-sm text-destructive mt-1">{errorMessage}</p>
                                        <p className="text-xs text-muted-foreground mt-3">Viewing Basic Try-On instead</p>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col items-center justify-center p-12 space-y-4 bg-muted/20">
                                      <AlertTriangle className="h-12 w-12 text-amber-500" />
                                      <div className="text-center">
                                        <p className="font-medium">AI generation failed</p>
                                        <p className="text-sm text-muted-foreground mt-1">Please try again or use the basic try-on</p>
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </TabsContent>
                      )}
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VirtualTryOn; 