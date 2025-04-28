
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Marathon Runner",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    stars: 5,
    text: "The breathability and comfort of YourFit's running gear is unmatched. I've completed three marathons wearing their shorts and tees, and I wouldn't trust any other brand.",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "CrossFit Athlete",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    stars: 5,
    text: "These are the only shorts that can keep up with my CrossFit workouts. The durability is incredible - after a year of intense training, they still look brand new.",
  },
  {
    id: 3,
    name: "Tara Williams",
    role: "Yoga Instructor",
    image: "https://randomuser.me/api/portraits/women/36.jpg",
    stars: 4,
    text: "The flexibility in YourFit's training pants allows for full range of motion in all my yoga poses. Plus, the fabric wicks moisture perfectly during hot yoga sessions.",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">What Athletes Say</h2>
          <p className="mt-4 text-xl text-gray-600">
            Trusted by professionals and fitness enthusiasts worldwide
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="overflow-hidden card-hover border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${
                        i < testimonial.stars 
                          ? "text-yellow-400 fill-yellow-400" 
                          : "text-gray-300"
                      }`} 
                    />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
