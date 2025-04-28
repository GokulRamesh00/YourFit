
import { ArrowRight, Truck, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PromoSection = () => {
  const benefits = [
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Free Shipping",
      description: "On all orders over $75",
    },
    {
      icon: <RefreshCw className="h-6 w-6" />,
      title: "Easy Returns",
      description: "30-day hassle-free returns",
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Lifetime Warranty",
      description: "On select premium products",
    },
  ];

  return (
    <section className="relative py-16 overflow-hidden">
      <div className="absolute inset-0 bg-yourfit-secondary/10 z-0"></div>
      
      {/* Benefits Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center card-hover"
            >
              <div className="bg-yourfit-secondary/10 p-3 rounded-full mb-4 text-yourfit-secondary">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Promo Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-yourfit-primary rounded-xl overflow-hidden shadow-xl">
          <div className="md:flex">
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Join the YourFit Community
              </h2>
              <p className="text-white/90 mb-6">
                Sign up today and get 15% off your first order, plus exclusive access to new releases, 
                workout tips, and members-only promotions.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <Button className="bg-white text-yourfit-primary hover:bg-gray-100 flex items-center">
                  <span>Sign Up Now</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Link to="/about">
                  <Button variant="outline" className="border-white text-white hover:bg-white/10">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                alt="Athletes training" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
