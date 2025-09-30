import React from 'react';
import { Heart, Shield } from 'lucide-react';
import { Link } from 'react-router';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-30" style={{ top: 0 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/superadmin" className="flex items-center space-x-3">
            <div className="bg-emerald-600 p-2 rounded-[0.3rem]">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">NPVRS</h1>
              <p className="text-xs text-gray-600">Super Admin Console</p>
            </div>
          </Link>

          <div className="hidden md:flex space-x-8">
            <Link to="/superadmin" className="text-gray-600 font-medium hover:text-emerald-600 transition-colors">Home</Link>
            <a href="#features" className="text-gray-600 font-medium hover:text-emerald-600 transition-colors">Features</a>
            <a href="#contact" className="text-gray-600 font-medium hover:text-emerald-600 transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/superadmin/signin" className="text-gray-600 font-medium hover:text-emerald-600 transition-colors">Sign in</Link>
            <Link to="/superadmin/signup" className="bg-emerald-600 text-white px-4 py-2 rounded-[0.3rem] font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2" >
              <Heart className="h-4 w-4 text-white" /> Get access
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
