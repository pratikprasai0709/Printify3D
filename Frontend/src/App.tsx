
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import SelectionPage from './pages/SelectionPage';
import DesignEditor from './pages/DesignEditor';
import PreviewPage from './pages/PreviewPage';
import AdminDashboard from './pages/AdminDashboard';
import type { Page, BottleModel, CustomizationState } from './types';


const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [selectedModel, setSelectedModel] = useState<BottleModel | null>(null);
  const [customizationState, setCustomizationState] = useState<CustomizationState | null>(null);

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectModel = (model: BottleModel) => {
    setSelectedModel(model);
    navigateTo('editor');
  };

  const handlePreview = (state: CustomizationState) => {
    setCustomizationState(state);
    navigateTo('preview');
  };

  const handleConfirmOrder = () => {
    alert('Thank you! Your custom order has been received.');
    navigateTo('landing');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onStart={navigateTo} />;
      case 'selection':
        return <SelectionPage onSelect={handleSelectModel} />;
      case 'editor':
        return selectedModel ? (
          <DesignEditor 
            selectedModel={selectedModel} 
            onPreview={handlePreview} 
            onNavigate={navigateTo}
          />
        ) : <SelectionPage onSelect={handleSelectModel} />;
      case 'preview':
        return selectedModel && customizationState ? (
          <PreviewPage 
            model={selectedModel} 
            customization={customizationState} 
            onBack={() => navigateTo('editor')}
            onConfirm={handleConfirmOrder}
          />
        ) : <SelectionPage onSelect={handleSelectModel} />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <LandingPage onStart={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-blue-100">
      <Navbar currentPage={currentPage} onNavigate={navigateTo} />
      {renderPage()}
      
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
