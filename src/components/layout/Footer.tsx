
import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: "Products",
      links: [
        { name: "Men", href: "/men" },
        { name: "Women", href: "/women" },
        { name: "Kids", href: "/kids" },
        { name: "Accessories", href: "/accessories" },
        { name: "New Arrivals", href: "/new" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Contact Us", href: "/contact" },
        { name: "FAQs", href: "/faqs" },
        { name: "Size Guide", href: "/size-guide" },
        { name: "Shipping", href: "/shipping" },
        { name: "Returns", href: "/returns" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Sustainability", href: "/sustainability" },
        { name: "Press", href: "/press" },
        { name: "Partners", href: "/partners" },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="col-span-1 lg:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-bold text-white">Your<span className="text-yourfit-secondary">Fit</span></span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              Performance apparel designed for athletes and fitness enthusiasts. 
              Push your limits with gear that moves with you.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href} 
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-gray-400 text-sm text-center">
            &copy; {currentYear} YourFit. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
