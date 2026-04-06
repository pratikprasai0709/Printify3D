import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Page } from '../types';

interface NavbarProps {
  currentPage?: Page;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage }) => {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('currentUser');
  const user = userStr ? JSON.parse(userStr) : null;
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass rounded-2xl px-4 md:px-8 py-3 shadow-sm">
        <div
          className="text-xl md:text-2xl font-bold tracking-tight cursor-pointer text-slate-800 shrink-0"
          onClick={() => navigate('/')}
        >
          Printify<span className="text-blue-500">3D</span>
        </div>

        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
          {(user?.role === 'user' || !isLoggedIn) && (
            <button
              onClick={() => navigate('/selection')}
              className={`hover:text-blue-500 transition-colors ${currentPage === 'selection' ? 'text-blue-600' : ''}`}
            >
              Explore
            </button>
          )}

          {user?.role === 'admin' && (
            <button
               onClick={() => navigate('/admin')}
               className={`hover:text-blue-500 transition-colors ${currentPage === 'admin' ? 'text-blue-600' : ''}`}
            >
              Dashboard
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2 md:space-x-4 shrink-0">
           {isLoggedIn ? (
             <>
               <span className="hidden sm:inline text-xs md:text-sm font-bold text-slate-500 mr-2">
                 Hi, {user.username} 
                 <span className="ml-1 px-1.5 py-0.5 bg-slate-100 rounded text-[9px] uppercase">{user.role}</span>
               </span>
               <button
                 onClick={handleLogout}
                 className="px-3 md:px-5 py-2 text-xs md:text-sm font-semibold text-rose-500 hover:text-rose-600 transition-colors"
               >
                 Logout
               </button>
             </>
           ) : (
             <>
               <button
                 onClick={() => navigate('/login')}
                 className="px-3 md:px-5 py-2 text-xs md:text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
               >
                 Login
               </button>
               <button
                 onClick={() => navigate('/selection')}
                 className="px-4 md:px-6 py-2 bg-blue-600 text-white rounded-full text-xs md:text-sm font-semibold hover:bg-blue-700 transition-all shadow-md active:scale-95"
               >
                 Design<span className="hidden sm:inline"> Now</span>
               </button>
             </>
           )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
