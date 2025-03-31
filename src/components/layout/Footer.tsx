import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#4B6BFB] text-white">
      <div className="container mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Column 1 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-wide uppercase">
              News and Events
            </h3>
            <div className="flex flex-col space-y-3">
              <Link 
                to="/news" 
                className="text-gray-200 hover:text-white transition-colors duration-200 text-sm"
              >
                News and Events
              </Link>
              <Link 
                to="/useful-link" 
                className="text-gray-200 hover:text-white transition-colors duration-200 text-sm"
              >
                Useful Link
              </Link>
              <Link 
                to="/papers" 
                className="text-gray-200 hover:text-white transition-colors duration-200 text-sm"
              >
                Papers and Articles
              </Link>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-wide uppercase">
              Academic
            </h3>
            <div className="flex flex-col space-y-3">
              <Link 
                to="/curriculum-vitae" 
                className="text-gray-200 hover:text-white transition-colors duration-200 text-sm"
              >
                Curriculum Vitae
              </Link>
              <Link 
                to="/foundation" 
                className="text-gray-200 hover:text-white transition-colors duration-200 text-sm"
              >
                Foundation
              </Link>
              <Link 
                to="/gallery" 
                className="text-gray-200 hover:text-white transition-colors duration-200 text-sm"
              >
                Gallery
              </Link>
            </div>
          </div>

          {/* Column 3 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-wide uppercase">
              Connect
            </h3>
            <div className="flex flex-col space-y-3">
              <Link 
                to="/cooperation" 
                className="text-gray-200 hover:text-white transition-colors duration-200 text-sm"
              >
                Cooperation
              </Link>
              <Link 
                to="/about" 
                className="text-gray-200 hover:text-white transition-colors duration-200 text-sm"
              >
                About me
              </Link>
            </div>
          </div>

          {/* Column 4 - Copyright info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-wide uppercase">
              Legal
            </h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-200">
                Copyright © {new Date().getFullYear()}
                <br />All rights reserved
              </p>
              <p className="text-sm text-gray-200 font-medium">
                Prof. Amos Olalekan Abolaji
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-400/30"></div>

        {/* Designer credit */}
        <div className="pt-8 text-center">
          <p className="text-sm text-gray-200">
            Designed with ♥ by{' '}
            <span className="font-medium hover:text-white transition-colors duration-200">
              imit-celsius
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}; 