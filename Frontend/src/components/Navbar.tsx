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
    <nav className="sticky top-0 z-50 w-full px-2 py-2 sm:px-4 sm:py-3 md:px-6" aria-label="Main navigation">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 glass rounded-2xl px-3 py-2 shadow-sm sm:px-4 sm:py-3 md:px-8">
        <div
          className="shrink-0 cursor-pointer text-lg font-bold tracking-tight text-brand-primary transition-opacity hover:opacity-80 sm:text-xl md:text-2xl"
          onClick={() => navigate('/')}
        >
          Printify<span className="text-brand-accent">3D</span>
        </div>

        <div className="hidden flex-1 items-center justify-center space-x-8 text-sm font-bold text-brand-secondary md:flex">
          {(user?.role === 'user' || !isLoggedIn) && (
            <button
              onClick={() => navigate('/selection')}
              className={`hover:text-brand-accent transition-colors uppercase tracking-widest text-[11px] ${currentPage === 'selection' ? 'text-brand-accent' : ''}`}
            >
              Explore
            </button>
          )}

          {user?.role === 'admin' && (
            <button
               onClick={() => navigate('/admin')}
               className={`hover:text-brand-accent transition-colors uppercase tracking-widest text-[11px] ${currentPage === 'admin' ? 'text-brand-accent' : ''}`}
            >
              Dashboard
            </button>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2 md:gap-4">
            {isLoggedIn ? (
              <>
                <span className="mr-1 hidden max-w-[180px] min-w-0 items-center whitespace-nowrap text-xs font-bold text-brand-secondary sm:flex md:mr-2 md:text-sm">
                  <span className="truncate">Hi, {user?.username}</span>
                  <span className="ml-1 shrink-0 rounded border border-brand-border bg-brand-bg px-1.5 py-0.5 text-[9px] uppercase text-brand-accent">{user?.role}</span>
                </span>
               <button
                 onClick={handleLogout}
                 className="whitespace-nowrap px-2 py-2 text-[11px] font-semibold text-rose-500 transition-colors hover:text-rose-600 sm:px-3 sm:text-xs md:px-5 md:text-sm"
               >
                 Logout
               </button>
             </>
           ) : (
             <>
                <button
                  onClick={() => navigate('/login')}
                  className="whitespace-nowrap px-2 py-2 text-[11px] font-bold text-brand-primary transition-colors hover:text-brand-accent sm:px-3 sm:text-xs md:px-5 md:text-sm"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/selection')}
                  className="whitespace-nowrap rounded-full bg-brand-primary px-3 py-2 text-[11px] font-bold text-white shadow-md transition-all hover:bg-black active:scale-95 sm:px-4 sm:text-xs md:px-6 md:text-sm"
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
