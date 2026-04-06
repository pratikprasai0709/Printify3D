import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import SelectionPage from './pages/SelectionPage';
import DesignEditor from './pages/DesignEditor';
import PreviewPage from './pages/PreviewPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './features/login/login';
import Register from './features/register/register';

import ProtectedRoute from './components/ProtectedRoute';

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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-blue-100">
      <Navbar currentPage={currentPageContext as any} />
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* User Routes */}
        <Route path="/selection" element={
          <ProtectedRoute allowedRoles={['user']}>
            <SelectionPage />
          </ProtectedRoute>
        } />
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

      {/* Dynamic Background Elements */}
      <div className="fixed -z-10 top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-100 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[30vw] h-[30vw] bg-teal-50 rounded-full blur-[100px]" />
      </div>

      <footer className="mt-20 py-12 px-6 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-evenly items-center gap-8">
          <p className="text-sm text-slate-400 font-light">
            © 2025 Printify3D Systems. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
