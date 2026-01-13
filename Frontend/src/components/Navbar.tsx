
import React from 'react';
import type{ Page } from '../types';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass rounded-2xl px-8 py-3 shadow-sm">
        <div 
          className="text-2xl font-bold tracking-tight cursor-pointer text-slate-800"
          onClick={() => onNavigate('landing')}
        >
          Printify<span className="text-blue-500">3D</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
          <button 
            onClick={() => onNavigate('selection')}
            className={`hover:text-blue-500 transition-colors ${currentPage === 'selection' ? 'text-blue-600' : ''}`}
          >
            Explore
          </button>
          
          {currentPage !== 'admin' && (
             <button 
                onClick={() => onNavigate('admin')}
                className="hover:text-blue-500 transition-colors"
             >
                Dashboard
             </button>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <button className="px-5 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors">
            Login
          </button>
          <button 
            onClick={() => onNavigate('selection')}
            className="px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-all shadow-md active:scale-95"
          >
            Design Now
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
