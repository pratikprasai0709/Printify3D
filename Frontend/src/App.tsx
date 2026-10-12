import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Preloader from './components/Preloader';

import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const SelectionPage = lazy(() => import('./pages/SelectionPage'));
const DesignEditor = lazy(() => import('./pages/DesignEditor'));
const PreviewPage = lazy(() => import('./pages/PreviewPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const LoginPage = lazy(() => import('./features/login/login'));
const Register = lazy(() => import('./features/register/register'));

const App: React.FC = () => {
  const location = useLocation();

  let currentPageContext = 'landing';
  if (location.pathname.includes('/selection')) currentPageContext = 'selection';
  else if (location.pathname.includes('/editor')) currentPageContext = 'editor';
  else if (location.pathname.includes('/preview')) currentPageContext = 'preview';
  else if (location.pathname.includes('/admin')) currentPageContext = 'admin';
  else if (location.pathname.includes('/login')) currentPageContext = 'login';
  else if (location.pathname.includes('/register')) currentPageContext = 'register';

  return (
    <div className="min-h-screen bg-brand-bg text-brand-primary selection:bg-blue-100 font-sans">
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar currentPage={currentPageContext as any} />
      
      <Suspense fallback={<Preloader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          {/* User Routes */}
          <Route path="/selection" element={<SelectionPage />} />
          <Route path="/editor" element={
            <ProtectedRoute allowedRoles={['user']}>
              <DesignEditor />
            </ProtectedRoute>
          } />
          <Route path="/preview" element={
            <ProtectedRoute allowedRoles={['user']}>
              <PreviewPage />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Suspense>

      {/* Dynamic Background Elements */}
      <div className="fixed -z-10 top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-100 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[30vw] h-[30vw] bg-teal-50 rounded-full blur-[100px]" />
      </div>

      {currentPageContext !== 'editor' && (
        <footer className="mt-20 py-12 px-6 border-t border-brand-border bg-white">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-evenly items-center gap-8">
            <p className="text-sm text-brand-secondary font-light">
              © 2025 Printify3D Systems. All rights reserved.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
