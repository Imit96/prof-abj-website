import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p>Email: contact@profabolaji.com</p>
            <p>Phone: +234 123 456 7890</p>
            <p>Address: University of Ibadan, Nigeria</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-primary">
                  About
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-primary">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="/cooperation" className="hover:text-primary">
                  Cooperation
                </Link>
              </li>
              <li>
                <Link to="/foundation" className="hover:text-primary">
                  Foundation
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-primary">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary">
                Twitter
              </a>
              <a href="#" className="hover:text-primary">
                LinkedIn
              </a>
              <a href="#" className="hover:text-primary">
                ResearchGate
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p>&copy; {new Date().getFullYear()} Prof. Abolaji. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}; 