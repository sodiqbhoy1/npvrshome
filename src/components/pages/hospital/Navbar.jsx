import React from 'react'
import { Heart } from 'lucide-react';
import { Link } from 'react-router';



const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg border-b border-blue-100 fixed w-full z-30" style={{ top: 0 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">NPVRS</h1>
              <p className="text-xs text-gray-600">National Patient Vital Record System</p>
            </div>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#home" className="text-blue-700 font-medium hover:text-green-600 transition-colors">Home</a>
            <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">About</a>
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
            <a href="#impact" className="text-gray-700 hover:text-blue-600 transition-colors">Impact</a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
          </div>
          <Link to="/signup" className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5" > Get started </Link>
         
        </div>
      </div>
    </nav>
  )
}

export default Navbar
