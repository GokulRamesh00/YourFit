import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingCart, Search, User, MessageCircle, Camera, Shirt, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/clerk-react";
import ChatAssistant from "@/components/ChatAssistant";
import VisualSearch from "@/components/VisualSearch";
import VirtualTryOn from "@/components/VirtualTryOn";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const [isVirtualTryOnOpen, setIsVirtualTryOnOpen] = useState(false);
  const { isSignedIn } = useAuth();

  const navLinks = [
    { name: "Men", href: "/men" },
    { name: "Women", href: "/women" },
    { name: "Kids", href: "/kids" },
    { name: "Size Guide", href: "/size-guide" },
    { name: "Size Finder", href: "/sizing-demo" },
    { name: "Products", href: "/products" },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-yourfit-primary">Your<span className="text-yourfit-secondary">Fit</span></span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-yourfit-primary border-b-2 border-transparent hover:border-yourfit-primary transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVisualSearchOpen(true)}
              className="text-gray-600 hover:text-yourfit-primary"
              title="Visual Product Search"
            >
              <Camera className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVirtualTryOnOpen(true)}
              className="text-gray-600 hover:text-yourfit-primary"
              title="Virtual Try-On"
            >
              <Shirt className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsChatOpen(true)}
              className="text-gray-600 hover:text-yourfit-primary"
              title="Chat Assistant"
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
            <Link to="/sizing-demo">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-600 hover:text-yourfit-primary"
                title="Size Finder"
              >
                <Ruler className="h-5 w-5" />
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-600 hover:text-yourfit-primary"
              title="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-600 hover:text-yourfit-primary"
              title="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <div className="flex space-x-2">
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button variant="default" size="sm">
                    Sign Up
                  </Button>
                </SignUpButton>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVisualSearchOpen(true)}
              className="text-gray-600 hover:text-yourfit-primary mr-2"
              title="Visual Product Search"
            >
              <Camera className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVirtualTryOnOpen(true)}
              className="text-gray-600 hover:text-yourfit-primary mr-2"
              title="Virtual Try-On"
            >
              <Shirt className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsChatOpen(true)}
              className="text-gray-600 hover:text-yourfit-primary mr-2"
              title="Chat Assistant"
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-yourfit-primary"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-yourfit-primary hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center justify-around">
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-yourfit-primary">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-yourfit-primary">
                <ShoppingCart className="h-5 w-5" />
              </Button>
              <Link to="/sizing-demo">
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-yourfit-primary">
                  <Ruler className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-yourfit-primary">
                <User className="h-5 w-5" />
              </Button>
              {isSignedIn ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
                <div className="flex space-x-2">
                  <SignInButton mode="modal">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button variant="default" size="sm">
                      Sign Up
                    </Button>
                  </SignUpButton>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Chat Assistant */}
      {isChatOpen && <ChatAssistant onClose={() => setIsChatOpen(false)} />}
      
      {/* Visual Search */}
      {isVisualSearchOpen && <VisualSearch isOpen={isVisualSearchOpen} onClose={() => setIsVisualSearchOpen(false)} />}
      
      {/* Virtual Try-On */}
      {isVirtualTryOnOpen && <VirtualTryOn isOpen={isVirtualTryOnOpen} onClose={() => setIsVirtualTryOnOpen(false)} />}
    </nav>
  );
};

export default Navbar;
