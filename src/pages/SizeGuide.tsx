import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ruler, Shirt, Umbrella, Footprints } from 'lucide-react';
import SizeRecommendationQuiz, { SizeRecommendationResult } from '@/components/SizeRecommendationQuiz';

const SizeGuide = () => {
  const [activeTab, setActiveTab] = useState<string>('finder');
  const [productTypeFilter, setProductTypeFilter] = useState<string | null>(null);
  const [quizResults, setQuizResults] = useState<SizeRecommendationResult | null>(null);
  
  const handleQuizComplete = (results: SizeRecommendationResult) => {
    setQuizResults(results);
  };
  
  // Helper function to handle product type selection for quiz
  const handleProductTypeSelect = (type: string) => {
    setProductTypeFilter(type);
    setActiveTab('finder');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Size Guide</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Find your perfect fit with our interactive size finder or browse our detailed size charts for each product category.
        </p>
      </div>
      
      <Tabs defaultValue="finder" value={activeTab} onValueChange={setActiveTab} className="mb-10">
        <div className="flex justify-center mb-8">
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="finder" className="flex items-center justify-center gap-2">
              <Ruler className="h-4 w-4" />
              <span>Size Finder</span>
            </TabsTrigger>
            <TabsTrigger value="charts" className="flex items-center justify-center gap-2">
              <Shirt className="h-4 w-4" />
              <span>Size Charts</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="finder" className="pt-4">
          <SizeRecommendationQuiz 
            onComplete={handleQuizComplete} 
            productCategory={productTypeFilter} 
          />
        </TabsContent>
        
        <TabsContent value="charts" className="pt-4">
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card
                className={`cursor-pointer hover:shadow-md transition ${
                  productTypeFilter === 'tops' ? 'border-yourfit-primary' : ''
                }`}
                onClick={() => handleProductTypeSelect('tops')}
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Shirt className="h-12 w-12 mb-4 text-yourfit-primary" />
                  <h3 className="text-xl font-semibold mb-2">Tops & T-Shirts</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Performance tees, training tops and sports bras
                  </p>
                  <Button variant="outline" size="sm">View Guide</Button>
                </CardContent>
              </Card>
              
              <Card
                className={`cursor-pointer hover:shadow-md transition ${
                  productTypeFilter === 'bottoms' ? 'border-yourfit-primary' : ''
                }`}
                onClick={() => handleProductTypeSelect('bottoms')}
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Umbrella className="h-12 w-12 mb-4 text-yourfit-primary" />
                  <h3 className="text-xl font-semibold mb-2">Bottoms & Shorts</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Training shorts, leggings and joggers
                  </p>
                  <Button variant="outline" size="sm">View Guide</Button>
                </CardContent>
              </Card>
              
              <Card
                className={`cursor-pointer hover:shadow-md transition ${
                  productTypeFilter === 'footwear' ? 'border-yourfit-primary' : ''
                }`}
                onClick={() => handleProductTypeSelect('footwear')}
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Footprints className="h-12 w-12 mb-4 text-yourfit-primary" />
                  <h3 className="text-xl font-semibold mb-2">Footwear</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Running shoes, training shoes and casual sneakers
                  </p>
                  <Button variant="outline" size="sm">View Guide</Button>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="space-y-12">
            {/* Tops Size Chart */}
            <section id="tops-chart">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Shirt className="h-6 w-6 mr-2 text-yourfit-primary" />
                Tops Size Chart
              </h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 border-b text-left font-semibold">Size</th>
                      <th className="py-3 px-4 border-b text-center font-semibold">Chest (cm)</th>
                      <th className="py-3 px-4 border-b text-center font-semibold">Chest (inches)</th>
                      <th className="py-3 px-4 border-b text-center font-semibold">Neck (cm)</th>
                      <th className="py-3 px-4 border-b text-center font-semibold">Sleeve (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-3 px-4 border-b font-medium">XS</td>
                      <td className="py-3 px-4 border-b text-center">82-87</td>
                      <td className="py-3 px-4 border-b text-center">32-34</td>
                      <td className="py-3 px-4 border-b text-center">35-36</td>
                      <td className="py-3 px-4 border-b text-center">81-82</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 border-b font-medium">S</td>
                      <td className="py-3 px-4 border-b text-center">88-93</td>
                      <td className="py-3 px-4 border-b text-center">35-37</td>
                      <td className="py-3 px-4 border-b text-center">37-38</td>
                      <td className="py-3 px-4 border-b text-center">83-84</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 border-b font-medium">M</td>
                      <td className="py-3 px-4 border-b text-center">94-99</td>
                      <td className="py-3 px-4 border-b text-center">38-39</td>
                      <td className="py-3 px-4 border-b text-center">39-40</td>
                      <td className="py-3 px-4 border-b text-center">85-86</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 border-b font-medium">L</td>
                      <td className="py-3 px-4 border-b text-center">100-105</td>
                      <td className="py-3 px-4 border-b text-center">40-41</td>
                      <td className="py-3 px-4 border-b text-center">41-42</td>
                      <td className="py-3 px-4 border-b text-center">87-88</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 border-b font-medium">XL</td>
                      <td className="py-3 px-4 border-b text-center">106-111</td>
                      <td className="py-3 px-4 border-b text-center">42-44</td>
                      <td className="py-3 px-4 border-b text-center">43-44</td>
                      <td className="py-3 px-4 border-b text-center">89-90</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 border-b font-medium">XXL</td>
                      <td className="py-3 px-4 border-b text-center">112-118</td>
                      <td className="py-3 px-4 border-b text-center">45-46</td>
                      <td className="py-3 px-4 border-b text-center">45-46</td>
                      <td className="py-3 px-4 border-b text-center">91-92</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">How to Measure</h3>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  <li><strong>Chest:</strong> Measure around the fullest part of your chest, keeping the tape measure level.</li>
                  <li><strong>Neck:</strong> Measure around the base of your neck, where a collar would sit.</li>
                  <li><strong>Sleeve:</strong> Measure from the center back of your neck, across your shoulder and down to your wrist.</li>
                </ul>
              </div>
            </section>
            
            {/* Bottoms Size Chart */}
            <section id="bottoms-chart">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Umbrella className="h-6 w-6 mr-2 text-yourfit-primary" />
                Bottoms Size Chart
              </h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 border-b text-left font-semibold">Size</th>
                      <th className="py-3 px-4 border-b text-center font-semibold">Waist (cm)</th>
                      <th className="py-3 px-4 border-b text-center font-semibold">Waist (inches)</th>
                      <th className="py-3 px-4 border-b text-center font-semibold">Hip (cm)</th>
                      <th className="py-3 px-4 border-b text-center font-semibold">Inseam (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-3 px-4 border-b font-medium">XS</td>
                      <td className="py-3 px-4 border-b text-center">65-70</td>
                      <td className="py-3 px-4 border-b text-center">26-28</td>
                      <td className="py-3 px-4 border-b text-center">85-90</td>
                      <td className="py-3 px-4 border-b text-center">75-76</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 border-b font-medium">S</td>
                      <td className="py-3 px-4 border-b text-center">71-76</td>
                      <td className="py-3 px-4 border-b text-center">29-30</td>
                      <td className="py-3 px-4 border-b text-center">91-96</td>
                      <td className="py-3 px-4 border-b text-center">77-78</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 border-b font-medium">M</td>
                      <td className="py-3 px-4 border-b text-center">77-82</td>
                      <td className="py-3 px-4 border-b text-center">31-32</td>
                      <td className="py-3 px-4 border-b text-center">97-102</td>
                      <td className="py-3 px-4 border-b text-center">79-80</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 border-b font-medium">L</td>
                      <td className="py-3 px-4 border-b text-center">83-88</td>
                      <td className="py-3 px-4 border-b text-center">33-35</td>
                      <td className="py-3 px-4 border-b text-center">103-108</td>
                      <td className="py-3 px-4 border-b text-center">81-82</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 border-b font-medium">XL</td>
                      <td className="py-3 px-4 border-b text-center">89-94</td>
                      <td className="py-3 px-4 border-b text-center">36-37</td>
                      <td className="py-3 px-4 border-b text-center">109-114</td>
                      <td className="py-3 px-4 border-b text-center">83-84</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 border-b font-medium">XXL</td>
                      <td className="py-3 px-4 border-b text-center">95-100</td>
                      <td className="py-3 px-4 border-b text-center">38-40</td>
                      <td className="py-3 px-4 border-b text-center">115-120</td>
                      <td className="py-3 px-4 border-b text-center">85-86</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">How to Measure</h3>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  <li><strong>Waist:</strong> Measure around your natural waistline, keeping the tape measure comfortably loose.</li>
                  <li><strong>Hip:</strong> Measure around the fullest part of your hips, keeping the tape measure level.</li>
                  <li><strong>Inseam:</strong> Measure from the crotch to the bottom of the leg.</li>
                </ul>
              </div>
            </section>
            
            {/* Footwear Size Chart */}
            <section id="footwear-chart">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Footprints className="h-6 w-6 mr-2 text-yourfit-primary" />
                Footwear Size Chart
              </h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 border-b text-left font-semibold">Foot Length (cm)</th>
                      <th className="py-3 px-4 border-b text-center font-semibold">US Men</th>
                      <th className="py-3 px-4 border-b text-center font-semibold">US Women</th>
                      <th className="py-3 px-4 border-b text-center font-semibold">EU</th>
                      <th className="py-3 px-4 border-b text-center font-semibold">UK</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-3 px-4 border-b">22.0</td>
                      <td className="py-3 px-4 border-b text-center">4</td>
                      <td className="py-3 px-4 border-b text-center">5.5</td>
                      <td className="py-3 px-4 border-b text-center">36</td>
                      <td className="py-3 px-4 border-b text-center">3.5</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 border-b">23.0</td>
                      <td className="py-3 px-4 border-b text-center">5</td>
                      <td className="py-3 px-4 border-b text-center">6.5</td>
                      <td className="py-3 px-4 border-b text-center">37-38</td>
                      <td className="py-3 px-4 border-b text-center">4.5</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 border-b">24.0</td>
                      <td className="py-3 px-4 border-b text-center">6</td>
                      <td className="py-3 px-4 border-b text-center">7.5</td>
                      <td className="py-3 px-4 border-b text-center">39</td>
                      <td className="py-3 px-4 border-b text-center">5.5</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 border-b">25.0</td>
                      <td className="py-3 px-4 border-b text-center">7</td>
                      <td className="py-3 px-4 border-b text-center">8.5</td>
                      <td className="py-3 px-4 border-b text-center">40</td>
                      <td className="py-3 px-4 border-b text-center">6.5</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 border-b">26.0</td>
                      <td className="py-3 px-4 border-b text-center">8</td>
                      <td className="py-3 px-4 border-b text-center">9.5</td>
                      <td className="py-3 px-4 border-b text-center">41-42</td>
                      <td className="py-3 px-4 border-b text-center">7.5</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 border-b">27.0</td>
                      <td className="py-3 px-4 border-b text-center">9</td>
                      <td className="py-3 px-4 border-b text-center">10.5</td>
                      <td className="py-3 px-4 border-b text-center">43</td>
                      <td className="py-3 px-4 border-b text-center">8.5</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 border-b">28.0</td>
                      <td className="py-3 px-4 border-b text-center">10</td>
                      <td className="py-3 px-4 border-b text-center">11.5</td>
                      <td className="py-3 px-4 border-b text-center">44-45</td>
                      <td className="py-3 px-4 border-b text-center">9.5</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 border-b">29.0</td>
                      <td className="py-3 px-4 border-b text-center">11</td>
                      <td className="py-3 px-4 border-b text-center">12.5</td>
                      <td className="py-3 px-4 border-b text-center">45-46</td>
                      <td className="py-3 px-4 border-b text-center">10.5</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 border-b">30.0</td>
                      <td className="py-3 px-4 border-b text-center">12</td>
                      <td className="py-3 px-4 border-b text-center">-</td>
                      <td className="py-3 px-4 border-b text-center">47</td>
                      <td className="py-3 px-4 border-b text-center">11.5</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">How to Measure</h3>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  <li><strong>Foot Length:</strong> Stand on a piece of paper and trace around your foot. Measure from the back of your heel to the tip of your longest toe.</li>
                  <li><strong>Width:</strong> Measure the widest part of your foot.</li>
                  <li>For the most accurate sizing, measure your feet in the evening when they are at their largest.</li>
                </ul>
              </div>
            </section>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-16 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Size Guide FAQ</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">How should fitness apparel fit?</h3>
            <p className="text-gray-600">
              Fitness apparel should allow for a full range of motion without being restrictive. Performance wear is often designed to be more form-fitting to help with moisture management and reduce chafing, while training gear may be more relaxed for comfort during various movements.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">What if I'm between sizes?</h3>
            <p className="text-gray-600">
              If you're between sizes, consider your preferred fit. Size up for a more relaxed fit or if you plan to layer underneath. Size down if you prefer a more compressive or snug fit. Our interactive size finder can help you determine which size might work better based on your body measurements and preferences.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Do your products shrink after washing?</h3>
            <p className="text-gray-600">
              Our performance fabrics are pre-shrunk and designed to maintain their shape and size. To best preserve your apparel, we recommend following the care instructions on the garment label. Generally, washing in cold water and air drying will help prevent any potential shrinkage.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">How accurate is the Size Finder tool?</h3>
            <p className="text-gray-600">
              While our Size Finder provides personalized recommendations based on your measurements and preferences, individual comfort and fit preferences can vary. The tool provides a strong starting point, but we always recommend checking the specific product size chart for the most accurate sizing information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeGuide; 