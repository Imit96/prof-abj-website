import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-primary">
            Prof. Abolaji
          </Link>
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-primary">
              Home
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-primary">
              About
            </Link>
            <Link to="/portfolio" className="text-gray-600 hover:text-primary">
              Portfolio
            </Link>
            <Link to="/cooperation" className="text-gray-600 hover:text-primary">
              Cooperation
            </Link>
            <Link to="/foundation" className="text-gray-600 hover:text-primary">
              Foundation
            </Link>
            <Link to="/gallery" className="text-gray-600 hover:text-primary">
              Gallery
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-primary">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}; 