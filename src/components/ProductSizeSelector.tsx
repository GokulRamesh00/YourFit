import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import FindYourFit from '@/components/FindYourFit'; 
import { cn } from '@/lib/utils';

interface ProductSizeSelectorProps {
  productType: 'tops' | 'bottoms' | 'footwear';
  availableSizes: string[];
  onSizeChange: (size: string) => void;
  defaultSize?: string;
  className?: string;
}

const ProductSizeSelector = ({
  productType,
  availableSizes,
  onSizeChange,
  defaultSize,
  className
}: ProductSizeSelectorProps) => {
  const [selectedSize, setSelectedSize] = useState<string>(defaultSize || '');
  
  useEffect(() => {
    if (defaultSize) {
      setSelectedSize(defaultSize);
    }
  }, [defaultSize]);

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    onSizeChange(size);
  };

  const handleSizeSelect = (size: string) => {
    // Check if the size is available for this product
    if (availableSizes.includes(size)) {
      handleSizeChange(size);
    } else {
      // If recommended size is not available, we could show a message or alert
      console.log('Recommended size not available for this product');
      // For now, we'll just not update the selection
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor="size-select" className="font-medium">
          Size
        </Label>
        <FindYourFit 
          productType={productType} 
          onSizeSelect={handleSizeSelect} 
        />
      </div>
      
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {availableSizes.map((size) => (
          <Button
            key={size}
            type="button"
            variant={selectedSize === size ? "default" : "outline"}
            className={cn(
              "h-10 text-center",
              selectedSize === size ? "ring-2 ring-primary" : ""
            )}
            onClick={() => handleSizeChange(size)}
          >
            {size}
          </Button>
        ))}
      </div>
      
      {availableSizes.length === 0 && (
        <p className="text-sm text-muted-foreground">No sizes available</p>
      )}
    </div>
  );
};

export default ProductSizeSelector; 