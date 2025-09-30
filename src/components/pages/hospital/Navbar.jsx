import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Heart, Menu, X, ArrowRight } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle smooth scrolling for hash links on the homepage
  const handleScroll = (e, hash) => {
    if (location.pathname !== '/') {
      // If not on homepage, let the link navigate normally
      return;
    }
    e.preventDefault();
    setIsOpen(false);
    const element = document.getElementById(hash);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Change navbar style on scroll
  useEffect(() => {
    const changeBackground = () => {
      if (window.scrollY >= 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', changeBackground);
    return () => window.removeEventListener('scroll', changeBackground);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/', hash: 'home' },
    { label: 'Features', href: '/#features', hash: 'features' },
    { label: 'About', href: '/#about', hash: 'about' },
    { label: 'Contact', href: '/#contact', hash: 'contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-900/95 backdrop-blur-lg border-b border-gray-700' : 'bg-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-[0.3rem] flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">NPVRS</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <a 
                key={link.label}
                href={link.href} 
                onClick={(e) => handleScroll(e, link.hash)}
                className="font-medium text-gray-300 hover:text-emerald-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/signin" className="font-medium text-gray-300 hover:text-emerald-400 transition-colors">
              Sign In
            </Link>
            <Link to="/signup" className="bg-emerald-600 text-white px-4 py-2 rounded-[0.3rem] font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2">
              Register <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none text-gray-300 hover:text-white">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map(link => (
              <a 
                key={link.label}
                href={link.href} 
                onClick={(e) => handleScroll(e, link.hash)}
                className="block px-3 py-2 rounded-[0.3rem] text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
              >
                {link.label}
              </a>
            ))}
            <div className="border-t border-gray-700 my-2"></div>
            <Link to="/signin" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-[0.3rem] text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800">
              Sign In
            </Link>
            <Link to="/signup" onClick={() => setIsOpen(false)} className="block w-full text-left px-3 py-2 rounded-[0.3rem] text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700">
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
