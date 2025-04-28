import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Ruler, ChevronRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { SizeRecommendationResult } from './SizeRecommendationQuiz';

interface ProductSizeRecommenderProps {
  productId: number;
  productName: string;
  productCategory: string;
  availableSizes: string[];
}

const ProductSizeRecommender = ({
  productId,
  productName,
  productCategory,
  availableSizes
}: ProductSizeRecommenderProps) => {
  const [quickQuizOpen, setQuickQuizOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [recommendedSize, setRecommendedSize] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { isSignedIn } = useAuth();
  
  // Simple state to store quick quiz answers
  const [height, setHeight] = useState<number>(170);
  const [weight, setWeight] = useState<number>(70);
  const [gender, setGender] = useState<string>('');
  const [build, setBuild] = useState<string>('');
  const [fitPreference, setFitPreference] = useState<string>('regular');
  
  // Get the appropriate question set based on product category
  const getQuickQuizQuestions = () => {
    if (productCategory.toLowerCase().includes('shoe') || productCategory.toLowerCase().includes('footwear')) {
      return [
        {
          title: 'What is your gender?',
          type: 'radio',
          options: [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' }
          ],
          setter: setGender
        },
        {
          title: 'How would you describe your foot width?',
          type: 'radio',
          options: [
            { value: 'narrow', label: 'Narrow' },
            { value: 'medium', label: 'Regular' },
            { value: 'wide', label: 'Wide' }
          ],
          setter: setBuild
        },
        {
          title: 'What is your foot length (cm)?',
          type: 'slider',
          min: 22,
          max: 32,
          step: 0.5,
          unit: 'cm',
          setter: setHeight
        }
      ];
    } else if (productCategory.toLowerCase().includes('pant') || 
               productCategory.toLowerCase().includes('short') || 
               productCategory.toLowerCase().includes('legging') || 
               productCategory.toLowerCase().includes('bottom')) {
      return [
        {
          title: 'What is your gender?',
          type: 'radio',
          options: [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' }
          ],
          setter: setGender
        },
        {
          title: 'What is your height?',
          type: 'slider',
          min: 150,
          max: 200,
          step: 1,
          unit: 'cm',
          setter: setHeight
        },
        {
          title: 'What is your weight?',
          type: 'slider',
          min: 40,
          max: 120,
          step: 1,
          unit: 'kg',
          setter: setWeight
        },
        {
          title: 'What fit do you prefer?',
          type: 'radio',
          options: [
            { value: 'tight', label: 'Tight/Compression' },
            { value: 'regular', label: 'Regular Fit' },
            { value: 'loose', label: 'Loose/Relaxed' }
          ],
          setter: setFitPreference
        }
      ];
    } else {
      // Default for tops
      return [
        {
          title: 'What is your gender?',
          type: 'radio',
          options: [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' }
          ],
          setter: setGender
        },
        {
          title: 'What is your height?',
          type: 'slider',
          min: 150,
          max: 200,
          step: 1,
          unit: 'cm',
          setter: setHeight
        },
        {
          title: 'How would you describe your build?',
          type: 'radio',
          options: [
            { value: 'slim', label: 'Slim' },
            { value: 'average', label: 'Average' },
            { value: 'athletic', label: 'Athletic' },
            { value: 'full', label: 'Full-figured' }
          ],
          setter: setBuild
        },
        {
          title: 'What fit do you prefer?',
          type: 'radio',
          options: [
            { value: 'tight', label: 'Tight/Compression' },
            { value: 'regular', label: 'Regular Fit' },
            { value: 'loose', label: 'Loose/Relaxed' }
          ],
          setter: setFitPreference
        }
      ];
    }
  };
  
  const questions = getQuickQuizQuestions();
  
  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateRecommendedSize();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const calculateRecommendedSize = () => {
    setIsCalculating(true);
    
    // Simulating calculation delay
    setTimeout(() => {
      let size = '';
      
      // Simple size calculation algorithm based on product category
      if (productCategory.toLowerCase().includes('shoe') || productCategory.toLowerCase().includes('footwear')) {
        // For footwear, we use foot length directly
        const footLength = height; // In this case, height state variable stores foot length
        
        if (gender === 'male') {
          if (footLength < 24.5) size = '7';
          else if (footLength < 25.5) size = '8';
          else if (footLength < 26.5) size = '9';
          else if (footLength < 27.5) size = '10';
          else if (footLength < 28.5) size = '11';
          else size = '12';
          
          // Adjust for width if needed
          if (build === 'wide') size += ' Wide';
        } else {
          if (footLength < 22.5) size = '5';
          else if (footLength < 23.5) size = '6';
          else if (footLength < 24.5) size = '7';
          else if (footLength < 25.5) size = '8';
          else if (footLength < 26.5) size = '9';
          else size = '10';
          
          if (build === 'wide') size += ' Wide';
        }
      } else {
        // For clothing, use BMI as a rough indicator along with build and fit preference
        const bmi = weight / ((height / 100) * (height / 100));
        
        // Base size based on BMI range
        let baseSize = '';
        if (bmi < 18.5) baseSize = 'XS';
        else if (bmi < 22) baseSize = 'S';
        else if (bmi < 25) baseSize = 'M';
        else if (bmi < 30) baseSize = 'L';
        else baseSize = 'XL';
        
        // Adjust for build
        if (build === 'athletic' || build === 'full') {
          baseSize = getSizeUp(baseSize);
        } else if (build === 'slim' && baseSize !== 'XS') {
          baseSize = getSizeDown(baseSize);
        }
        
        // Adjust for fit preference
        if (fitPreference === 'tight' && baseSize !== 'XS') {
          baseSize = getSizeDown(baseSize);
        } else if (fitPreference === 'loose') {
          baseSize = getSizeUp(baseSize);
        }
        
        size = baseSize;
      }
      
      // Ensure the recommended size is available, otherwise suggest closest available
      if (!availableSizes.includes(size)) {
        // Find closest available size
        size = findClosestSize(size, availableSizes);
      }
      
      setRecommendedSize(size);
      setIsCalculating(false);
    }, 1500);
  };
  
  // Helper function to get one size larger
  const getSizeUp = (size: string): string => {
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const currentIndex = sizes.indexOf(size);
    if (currentIndex < sizes.length - 1) {
      return sizes[currentIndex + 1];
    }
    return size;
  };
  
  // Helper function to get one size smaller
  const getSizeDown = (size: string): string => {
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const currentIndex = sizes.indexOf(size);
    if (currentIndex > 0) {
      return sizes[currentIndex - 1];
    }
    return size;
  };
  
  // Find closest available size
  const findClosestSize = (preferredSize: string, availableSizes: string[]): string => {
    // For numeric sizes (like footwear)
    if (!isNaN(Number(preferredSize.split(' ')[0]))) {
      const preferredNumber = Number(preferredSize.split(' ')[0]);
      const availableNumbers = availableSizes.map(s => Number(s.split(' ')[0])).filter(n => !isNaN(n));
      
      if (availableNumbers.length === 0) return availableSizes[0];
      
      // Find closest available size
      let closest = availableNumbers[0];
      let closestDiff = Math.abs(preferredNumber - closest);
      
      for (let i = 1; i < availableNumbers.length; i++) {
        const diff = Math.abs(preferredNumber - availableNumbers[i]);
        if (diff < closestDiff) {
          closestDiff = diff;
          closest = availableNumbers[i];
        }
      }
      
      // Return the full size string if it includes width
      return preferredSize.includes('Wide') ? 
        availableSizes.find(s => s.startsWith(closest.toString()) && s.includes('Wide')) || 
        closest.toString() : 
        closest.toString();
    }
    
    // For letter sizes (like clothing)
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const preferredIndex = sizes.indexOf(preferredSize);
    
    if (preferredIndex === -1) return availableSizes[0];
    
    // Find available sizes that are in our standard size list
    const validSizes = availableSizes.filter(s => sizes.includes(s));
    if (validSizes.length === 0) return availableSizes[0];
    
    // Find the closest available size by index difference
    const availableIndices = validSizes.map(s => sizes.indexOf(s));
    let closestIndex = availableIndices[0];
    let closestDiff = Math.abs(preferredIndex - closestIndex);
    
    for (let i = 1; i < availableIndices.length; i++) {
      const diff = Math.abs(preferredIndex - availableIndices[i]);
      if (diff < closestDiff) {
        closestDiff = diff;
        closestIndex = availableIndices[i];
      }
    }
    
    return sizes[closestIndex];
  };
  
  const renderQuestion = (question: any, index: number) => {
    if (index !== currentStep) return null;
    
    return (
      <div className="my-6">
        <h3 className="text-lg font-medium mb-4">{question.title}</h3>
        
        {question.type === 'radio' && (
          <RadioGroup
            value={
              question.title.includes('gender') ? gender :
              question.title.includes('build') || question.title.includes('width') ? build :
              fitPreference
            }
            onValueChange={question.setter}
            className="space-y-3"
          >
            {question.options.map((option: any) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${index}-${option.value}`} />
                <Label htmlFor={`${index}-${option.value}`} className="cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
        
        {question.type === 'slider' && (
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <span>{question.min}</span>
              <span className="font-medium">{
                question.title.includes('height') ? height :
                question.title.includes('weight') ? weight :
                height // Default to height (which may store foot length for shoes)
              } {question.unit}</span>
              <span>{question.max}</span>
            </div>
            <Slider
              value={[
                question.title.includes('height') ? height :
                question.title.includes('weight') ? weight :
                height // Default to height (which may store foot length for shoes)
              ]}
              min={question.min}
              max={question.max}
              step={question.step}
              onValueChange={(value) => question.setter(value[0])}
            />
          </div>
        )}
      </div>
    );
  };
  
  const renderResult = () => {
    if (isCalculating) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-yourfit-primary rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Calculating your perfect size...</p>
        </div>
      );
    }
    
    if (!recommendedSize) return null;
    
    return (
      <div className="text-center py-6">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
        <h3 className="text-xl font-bold mb-2">Your Recommended Size</h3>
        <div className="text-5xl font-bold mb-4 text-yourfit-primary">{recommendedSize}</div>
        <p className="text-gray-600 mb-6">
          Based on your measurements and preferences, we recommend size {recommendedSize} for {productName}.
        </p>
        <div className="flex flex-col space-y-3">
          <Button 
            onClick={() => setQuickQuizOpen(false)}
            className="w-full"
          >
            Got it!
          </Button>
          <Link to="/size-guide" className="text-sm text-gray-500 hover:text-yourfit-primary">
            View detailed size guide
          </Link>
        </div>
      </div>
    );
  };
  
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-2 sm:mb-0">
          <h3 className="text-lg font-medium">Not sure about your size?</h3>
          <p className="text-sm text-gray-500">Get a personalized recommendation</p>
        </div>
        
        <Sheet open={quickQuizOpen} onOpenChange={setQuickQuizOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              <span>Find My Size</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="sm:max-w-md w-full">
            <SheetHeader>
              <SheetTitle>Size Recommender</SheetTitle>
              <SheetDescription>
                Answer a few quick questions to find your perfect fit for {productName}
              </SheetDescription>
            </SheetHeader>
            
            {recommendedSize ? (
              renderResult()
            ) : (
              <div className="mt-6">
                <div className="mb-4">
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div
                      className="bg-yourfit-primary h-2 rounded-full transition-all"
                      style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>Step {currentStep + 1}</span>
                    <span>of {questions.length}</span>
                  </div>
                </div>
                
                {questions.map(renderQuestion)}
                
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                  >
                    Back
                  </Button>
                  
                  <Button onClick={handleNext}>
                    {currentStep < questions.length - 1 ? (
                      <>
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </>
                    ) : (
                      'Get My Size'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
      
      <div className="text-sm mt-3">
        <Link to="/size-guide" className="text-yourfit-primary hover:underline flex items-center">
          <span>View Size Chart</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default ProductSizeRecommender; 