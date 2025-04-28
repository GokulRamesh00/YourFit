import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { CheckCircle, ChevronLeft, ChevronRight, Ruler } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SizeRecommendationQuizProps {
  onComplete?: (results: SizeRecommendationResult) => void;
  productCategory?: 'tops' | 'bottoms' | 'footwear' | string;
}

export interface SizeRecommendationResult {
  topSize: string;
  bottomSize: string;
  footwearSize: string;
  fitPreference: string;
  measurements: {
    height: number;
    weight: number;
    chest?: number;
    waist?: number;
    hips?: number;
    footLength?: number;
  };
}

interface QuizQuestion {
  id: string;
  question: string;
  type: 'radio' | 'slider' | 'number';
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  required?: boolean;
  category?: 'tops' | 'bottoms' | 'footwear' | 'general';
}

const SizeRecommendationQuiz = ({ 
  onComplete, 
  productCategory 
}: SizeRecommendationQuizProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({
    gender: '',
    fitPreference: 'regular',
    height: 170,
    weight: 70,
    chest: 95,
    waist: 80,
    hips: 95,
    footLength: 26,
    athleticBuild: '',
    shoulderWidth: 'medium',
    legLength: 'medium',
    footWidth: 'medium'
  });
  const [quizComplete, setQuizComplete] = useState(false);
  const [results, setResults] = useState<SizeRecommendationResult | null>(null);
  
  const { toast } = useToast();

  // Define questions based on the product category (or show all if not specified)
  const allQuestions: QuizQuestion[] = [
    {
      id: 'gender',
      question: 'What is your gender?',
      type: 'radio',
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Prefer not to say' }
      ],
      required: true,
      category: 'general'
    },
    {
      id: 'fitPreference',
      question: 'What fit do you generally prefer?',
      type: 'radio',
      options: [
        { value: 'tight', label: 'Tight / Compression' },
        { value: 'regular', label: 'Regular Fit' },
        { value: 'loose', label: 'Loose / Relaxed' }
      ],
      category: 'general'
    },
    {
      id: 'height',
      question: 'What is your height?',
      type: 'slider',
      min: 140,
      max: 220,
      step: 1,
      unit: 'cm',
      category: 'general'
    },
    {
      id: 'weight',
      question: 'What is your weight?',
      type: 'slider',
      min: 40,
      max: 160,
      step: 1,
      unit: 'kg',
      category: 'general'
    },
    {
      id: 'athleticBuild',
      question: 'How would you describe your athletic build?',
      type: 'radio',
      options: [
        { value: 'slim', label: 'Slim / Lean' },
        { value: 'average', label: 'Average / Moderate' },
        { value: 'athletic', label: 'Athletic / Muscular' },
        { value: 'full', label: 'Full-figured' }
      ],
      category: 'general'
    },
    {
      id: 'chest',
      question: 'What is your chest circumference?',
      type: 'slider',
      min: 70,
      max: 140,
      step: 1,
      unit: 'cm',
      category: 'tops'
    },
    {
      id: 'shoulderWidth',
      question: 'How would you describe your shoulder width?',
      type: 'radio',
      options: [
        { value: 'narrow', label: 'Narrow' },
        { value: 'medium', label: 'Average' },
        { value: 'wide', label: 'Wide' }
      ],
      category: 'tops'
    },
    {
      id: 'waist',
      question: 'What is your waist circumference?',
      type: 'slider',
      min: 60,
      max: 130,
      step: 1,
      unit: 'cm',
      category: 'bottoms'
    },
    {
      id: 'hips',
      question: 'What is your hip circumference?',
      type: 'slider',
      min: 70,
      max: 150,
      step: 1,
      unit: 'cm',
      category: 'bottoms'
    },
    {
      id: 'legLength',
      question: 'How would you describe your leg length relative to your height?',
      type: 'radio',
      options: [
        { value: 'short', label: 'Shorter than average' },
        { value: 'medium', label: 'Average' },
        { value: 'long', label: 'Longer than average' }
      ],
      category: 'bottoms'
    },
    {
      id: 'footLength',
      question: 'What is your foot length?',
      type: 'slider',
      min: 20,
      max: 35,
      step: 0.5,
      unit: 'cm',
      category: 'footwear'
    },
    {
      id: 'footWidth',
      question: 'How would you describe your foot width?',
      type: 'radio',
      options: [
        { value: 'narrow', label: 'Narrow' },
        { value: 'medium', label: 'Standard width' },
        { value: 'wide', label: 'Wide' }
      ],
      category: 'footwear'
    }
  ];

  // Filter questions based on product category if specified
  const questions = productCategory 
    ? [
        ...allQuestions.filter(q => q.category === 'general'),
        ...allQuestions.filter(q => {
          if (productCategory === 'footwear') {
            return q.category === 'footwear';
          } else if (productCategory === 'bottoms') {
            return q.category === 'bottoms';
          } else if (productCategory === 'tops') {
            return q.category === 'tops';
          } else if (productCategory.toLowerCase().includes('shoe') || productCategory.toLowerCase().includes('footwear')) {
            return q.category === 'footwear';
          } else if (productCategory.toLowerCase().includes('pant') || 
                    productCategory.toLowerCase().includes('short') || 
                    productCategory.toLowerCase().includes('legging') || 
                    productCategory.toLowerCase().includes('bottom')) {
            return q.category === 'bottoms';
          } else if (productCategory.toLowerCase().includes('shirt') || 
                    productCategory.toLowerCase().includes('tee') || 
                    productCategory.toLowerCase().includes('top') ||
                    productCategory.toLowerCase().includes('bra')) {
            return q.category === 'tops';
          }
          return false;
        })
      ]
    : allQuestions;

  const handleNext = () => {
    const currentQuestion = questions[currentStep];
    
    // Validate required fields
    if (currentQuestion.required && !answers[currentQuestion.id]) {
      toast({
        title: "Required Field",
        description: "Please answer this question before proceeding.",
        variant: "destructive"
      });
      return;
    }
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete the quiz and calculate size recommendations
      calculateSizeRecommendation();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };

  const calculateSizeRecommendation = () => {
    // Placeholder for complex size calculation algorithm
    // Below is a simplified version based on common sizing standards
    
    let topSize = 'M';
    let bottomSize = 'M';
    let footwearSize = '9';
    
    const { gender, height, weight, chest, waist, hips, footLength, athleticBuild, fitPreference } = answers;
    
    // BMI for general body type assessment
    const bmiValue = weight / ((height / 100) * (height / 100));
    
    // TOP SIZE CALCULATION
    if (gender === 'male') {
      if (chest < 85) topSize = 'XS';
      else if (chest < 95) topSize = 'S';
      else if (chest < 105) topSize = 'M';
      else if (chest < 115) topSize = 'L';
      else if (chest < 125) topSize = 'XL';
      else topSize = 'XXL';
    } else {
      // Female or other sizing
      if (chest < 80) topSize = 'XS';
      else if (chest < 90) topSize = 'S';
      else if (chest < 100) topSize = 'M';
      else if (chest < 110) topSize = 'L';
      else if (chest < 120) topSize = 'XL';
      else topSize = 'XXL';
    }
    
    // Adjust for athletic build
    if (athleticBuild === 'athletic' || athleticBuild === 'full') {
      topSize = getAdjustedSize(topSize, 1); // Size up
    } else if (athleticBuild === 'slim' && topSize !== 'XS') {
      topSize = getAdjustedSize(topSize, -1); // Size down
    }
    
    // BOTTOM SIZE CALCULATION
    if (gender === 'male') {
      if (waist < 70) bottomSize = 'XS';
      else if (waist < 80) bottomSize = 'S';
      else if (waist < 90) bottomSize = 'M';
      else if (waist < 100) bottomSize = 'L';
      else if (waist < 110) bottomSize = 'XL';
      else bottomSize = 'XXL';
    } else {
      // Female or other sizing (typically uses hip measurement more)
      if (hips < 85) bottomSize = 'XS';
      else if (hips < 95) bottomSize = 'S';
      else if (hips < 105) bottomSize = 'M';
      else if (hips < 115) bottomSize = 'L';
      else if (hips < 125) bottomSize = 'XL';
      else bottomSize = 'XXL';
    }
    
    // FOOTWEAR SIZE CALCULATION
    if (gender === 'male') {
      // Male US shoe sizing approximation
      if (footLength < 24) footwearSize = '6';
      else if (footLength < 25) footwearSize = '7';
      else if (footLength < 26) footwearSize = '8';
      else if (footLength < 27) footwearSize = '9';
      else if (footLength < 28) footwearSize = '10';
      else if (footLength < 29) footwearSize = '11';
      else if (footLength < 30) footwearSize = '12';
      else footwearSize = '13';
      
      // Width adjustment
      if (answers.footWidth === 'wide') {
        footwearSize += ' (Wide)';
      }
    } else {
      // Female US shoe sizing approximation
      if (footLength < 22) footwearSize = '5';
      else if (footLength < 23) footwearSize = '6';
      else if (footLength < 24) footwearSize = '7';
      else if (footLength < 25) footwearSize = '8';
      else if (footLength < 26) footwearSize = '9';
      else if (footLength < 27) footwearSize = '10';
      else footwearSize = '11';
      
      // Width adjustment
      if (answers.footWidth === 'wide') {
        footwearSize += ' (Wide)';
      }
    }
    
    // Fit preference adjustment for clothes (not shoes)
    if (fitPreference === 'tight' && topSize !== 'XS') {
      topSize = getAdjustedSize(topSize, -1);
      bottomSize = getAdjustedSize(bottomSize, -1);
    } else if (fitPreference === 'loose') {
      topSize = getAdjustedSize(topSize, 1);
      bottomSize = getAdjustedSize(bottomSize, 1);
    }
    
    const result: SizeRecommendationResult = {
      topSize,
      bottomSize,
      footwearSize,
      fitPreference,
      measurements: {
        height,
        weight,
        chest,
        waist,
        hips,
        footLength
      }
    };
    
    setResults(result);
    setQuizComplete(true);
    
    // Call onComplete callback if provided
    if (onComplete) {
      onComplete(result);
    }
  };
  
  // Helper function to adjust sizes up or down
  const getAdjustedSize = (currentSize: string, adjustment: number): string => {
    const sizesOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const currentIndex = sizesOrder.indexOf(currentSize);
    
    if (currentIndex !== -1) {
      const newIndex = Math.min(Math.max(0, currentIndex + adjustment), sizesOrder.length - 1);
      return sizesOrder[newIndex];
    }
    
    return currentSize; // Return unchanged if not found
  };

  const renderQuestion = (question: QuizQuestion) => {
    switch (question.type) {
      case 'radio':
        return (
          <RadioGroup
            value={answers[question.id] || ''}
            onValueChange={(value) => handleAnswerChange(question.id, value)}
            className="space-y-3"
          >
            {question.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                <Label htmlFor={`${question.id}-${option.value}`} className="cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
        
      case 'slider':
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>{question.min}</span>
              <span>Current: {answers[question.id] || question.min} {question.unit}</span>
              <span>{question.max}</span>
            </div>
            <Slider
              value={[answers[question.id] || question.min || 0]}
              min={question.min}
              max={question.max}
              step={question.step}
              onValueChange={(value) => handleAnswerChange(question.id, value[0])}
              className="w-full"
            />
          </div>
        );
        
      default:
        return null;
    }
  };

  const renderResults = () => {
    if (!results) return null;
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold">Your Size Recommendations</h3>
          <p className="text-gray-500">Based on your body measurements and preferences</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="overflow-hidden">
            <CardContent className="p-6 text-center">
              <h4 className="text-lg font-medium mb-2">Tops</h4>
              <div className="text-4xl font-bold mb-2">{results.topSize}</div>
              <p className="text-sm text-gray-500">Based on chest measurement of {results.measurements.chest}cm</p>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden">
            <CardContent className="p-6 text-center">
              <h4 className="text-lg font-medium mb-2">Bottoms</h4>
              <div className="text-4xl font-bold mb-2">{results.bottomSize}</div>
              <p className="text-sm text-gray-500">Based on waist measurement of {results.measurements.waist}cm</p>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden">
            <CardContent className="p-6 text-center">
              <h4 className="text-lg font-medium mb-2">Footwear</h4>
              <div className="text-4xl font-bold mb-2">{results.footwearSize}</div>
              <p className="text-sm text-gray-500">Based on foot length of {results.measurements.footLength}cm</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-600">
            <strong>Fit preference:</strong> {results.fitPreference === 'tight' ? 'Tight/Compression' : results.fitPreference === 'loose' ? 'Loose/Relaxed' : 'Regular Fit'}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            These are estimated sizes based on your measurements. For the most accurate fit, we recommend trying on items or checking specific product size charts.
          </p>
        </div>
        
        <div className="flex justify-center">
          <Button
            onClick={() => {
              setQuizComplete(false);
              setCurrentStep(0);
            }}
            variant="outline"
          >
            Retake Quiz
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Size Finder</h2>
        <p className="text-gray-600">
          Answer a few questions to get personalized size recommendations for our fitness apparel.
        </p>
      </div>
      
      {!quizComplete ? (
        <div className="space-y-6">
          <div className="mb-4">
            <Progress value={((currentStep + 1) / questions.length) * 100} className="h-2" />
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>Question {currentStep + 1}</span>
              <span>of {questions.length}</span>
            </div>
          </div>
          
          {renderQuestion(questions[currentStep])}
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleNext} className="flex items-center">
              {currentStep < questions.length - 1 ? (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Complete
                  <CheckCircle className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        renderResults()
      )}
    </div>
  );
};

export default SizeRecommendationQuiz; 