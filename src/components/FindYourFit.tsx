import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ruler, Shirt, Umbrella, Footprints } from 'lucide-react';
import { Link } from 'react-router-dom';
import SizeRecommendationQuiz, { SizeRecommendationResult } from '@/components/SizeRecommendationQuiz';

interface FindYourFitProps {
  productType: 'tops' | 'bottoms' | 'footwear';
  onSizeSelect?: (size: string) => void;
}

const FindYourFit = ({ productType, onSizeSelect }: FindYourFitProps) => {
  const [activeTab, setActiveTab] = useState<string>('finder');
  const [quizResults, setQuizResults] = useState<SizeRecommendationResult | null>(null);
  
  const handleQuizComplete = (results: SizeRecommendationResult) => {
    setQuizResults(results);
    
    // Select the appropriate size based on product type
    if (onSizeSelect) {
      if (productType === 'tops') {
        onSizeSelect(results.topSize);
      } else if (productType === 'bottoms') {
        onSizeSelect(results.bottomSize);
      } else if (productType === 'footwear') {
        onSizeSelect(results.footwearSize);
      }
    }
  };

  const renderChartPreview = () => {
    switch (productType) {
      case 'tops':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-3 border-b text-left text-xs font-semibold">Size</th>
                  <th className="py-2 px-3 border-b text-center text-xs font-semibold">Chest (cm)</th>
                  <th className="py-2 px-3 border-b text-center text-xs font-semibold">Chest (in)</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr>
                  <td className="py-2 px-3 border-b font-medium">XS</td>
                  <td className="py-2 px-3 border-b text-center">82-87</td>
                  <td className="py-2 px-3 border-b text-center">32-34</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border-b font-medium">S</td>
                  <td className="py-2 px-3 border-b text-center">88-93</td>
                  <td className="py-2 px-3 border-b text-center">35-37</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border-b font-medium">M</td>
                  <td className="py-2 px-3 border-b text-center">94-99</td>
                  <td className="py-2 px-3 border-b text-center">38-39</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border-b font-medium">L</td>
                  <td className="py-2 px-3 border-b text-center">100-105</td>
                  <td className="py-2 px-3 border-b text-center">40-41</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      case 'bottoms':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-3 border-b text-left text-xs font-semibold">Size</th>
                  <th className="py-2 px-3 border-b text-center text-xs font-semibold">Waist (cm)</th>
                  <th className="py-2 px-3 border-b text-center text-xs font-semibold">Hip (cm)</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr>
                  <td className="py-2 px-3 border-b font-medium">XS</td>
                  <td className="py-2 px-3 border-b text-center">65-70</td>
                  <td className="py-2 px-3 border-b text-center">85-90</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border-b font-medium">S</td>
                  <td className="py-2 px-3 border-b text-center">71-76</td>
                  <td className="py-2 px-3 border-b text-center">91-96</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border-b font-medium">M</td>
                  <td className="py-2 px-3 border-b text-center">77-82</td>
                  <td className="py-2 px-3 border-b text-center">97-102</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border-b font-medium">L</td>
                  <td className="py-2 px-3 border-b text-center">83-88</td>
                  <td className="py-2 px-3 border-b text-center">103-108</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      case 'footwear':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-3 border-b text-left text-xs font-semibold">Foot Length (cm)</th>
                  <th className="py-2 px-3 border-b text-center text-xs font-semibold">US Men</th>
                  <th className="py-2 px-3 border-b text-center text-xs font-semibold">US Women</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr>
                  <td className="py-2 px-3 border-b">24.0</td>
                  <td className="py-2 px-3 border-b text-center">6</td>
                  <td className="py-2 px-3 border-b text-center">7.5</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border-b">25.0</td>
                  <td className="py-2 px-3 border-b text-center">7</td>
                  <td className="py-2 px-3 border-b text-center">8.5</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border-b">26.0</td>
                  <td className="py-2 px-3 border-b text-center">8</td>
                  <td className="py-2 px-3 border-b text-center">9.5</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border-b">27.0</td>
                  <td className="py-2 px-3 border-b text-center">9</td>
                  <td className="py-2 px-3 border-b text-center">10.5</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Ruler className="h-4 w-4" />
          Find Your Size
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="py-4">
          <h2 className="text-xl font-bold mb-2">Find Your Perfect Size</h2>
          <p className="text-sm text-gray-600 mb-4">
            Use our size finder tool or check our size charts to find your perfect fit.
          </p>
          
          <Tabs defaultValue="finder" value={activeTab} onValueChange={setActiveTab} className="mb-4">
            <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-4">
              <TabsTrigger value="finder" className="flex items-center justify-center gap-2">
                <Ruler className="h-4 w-4" />
                <span>Size Finder</span>
              </TabsTrigger>
              <TabsTrigger value="charts" className="flex items-center justify-center gap-2">
                {productType === 'tops' && <Shirt className="h-4 w-4" />}
                {productType === 'bottoms' && <Umbrella className="h-4 w-4" />}
                {productType === 'footwear' && <Footprints className="h-4 w-4" />}
                <span>Size Chart</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="finder">
              {quizResults ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-semibold mb-2">Your Recommended Size</h3>
                    <div className="text-3xl font-bold mb-2">
                      {productType === 'tops' && quizResults.topSize}
                      {productType === 'bottoms' && quizResults.bottomSize}
                      {productType === 'footwear' && quizResults.footwearSize}
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      Based on your measurements and preferences
                    </p>
                    <Button 
                      variant="default" 
                      onClick={() => {
                        if (onSizeSelect) {
                          if (productType === 'tops') {
                            onSizeSelect(quizResults.topSize);
                          } else if (productType === 'bottoms') {
                            onSizeSelect(quizResults.bottomSize);
                          } else if (productType === 'footwear') {
                            onSizeSelect(quizResults.footwearSize);
                          }
                        }
                      }}
                    >
                      Select This Size
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <SizeRecommendationQuiz 
                  onComplete={handleQuizComplete} 
                  productCategory={productType} 
                />
              )}
            </TabsContent>
            
            <TabsContent value="charts">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">
                      {productType === 'tops' && 'Tops Size Chart'}
                      {productType === 'bottoms' && 'Bottoms Size Chart'}
                      {productType === 'footwear' && 'Footwear Size Chart'}
                    </h3>
                    {renderChartPreview()}
                  </div>
                  
                  <div className="text-center">
                    <Link to="/size-guide">
                      <Button variant="outline">View Complete Size Guide</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FindYourFit; 