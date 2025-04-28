
import { Link } from "react-router-dom";

const categories = [
  {
    id: 1,
    name: "Men's Training",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    href: "/men",
  },
  {
    id: 2,
    name: "Women's Training",
    image: "https://images.unsplash.com/photo-1518310383802-640c2de311b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    href: "/women",
  },
  {
    id: 3,
    name: "Running",
    image: "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    href: "/running",
  },
  {
    id: 4,
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    href: "/accessories",
  },
];

const FeaturedCategories = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
          <p className="mt-4 text-xl text-gray-600">Find the perfect gear for your workout</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.id} to={category.href} className="group">
              <div className="relative rounded-lg overflow-hidden card-hover">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white">{category.name}</h3>
                  <p className="text-white/80 group-hover:text-white transition-colors mt-1">
                    Shop Collection
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
