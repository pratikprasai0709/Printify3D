
import React from 'react';
import ThreeScene from '../components/ThreeScene';
import type{ CustomizationState, BottleModel, Page } from '../types';
import { Icons } from '../constants';

interface PreviewPageProps {
  model: BottleModel;
  customization: CustomizationState;
  onBack: () => void;
  onConfirm: () => void;
}

const PreviewPage: React.FC<PreviewPageProps> = ({ model, customization, onBack, onConfirm }) => {
  return (
    <div className="pt-24 min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 flex flex-col lg:flex-row gap-12">
        {/* Left: Interactive 3D */}
        <div className="flex-1 glass rounded-[3rem] shadow-xl overflow-hidden min-h-[500px]">
           <ThreeScene customization={customization} className="w-full h-full" />
        </div>

        {/* Right: Summary & Checkout */}
        <div className="w-full lg:w-96 flex flex-col gap-8">
           <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 space-y-6">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900">{model.name}</h1>
                <p className="text-slate-500 font-medium">Custom Configuration</p>
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between items-center py-3 border-b border-slate-50">
                    <span className="text-sm text-slate-500">Base Model</span>
                    <span className="text-sm font-bold text-slate-800">${model.price.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-center py-3 border-b border-slate-50">
                    <span className="text-sm text-slate-500">Finish ({customization.material})</span>
                    <span className="text-sm font-bold text-slate-800">$5.00</span>
                 </div>
                 <div className="flex justify-between items-center py-3 border-b border-slate-50">
                    <span className="text-sm text-slate-500">Custom Artwork</span>
                    <span className="text-sm font-bold text-slate-800">$10.00</span>
                 </div>
                 <div className="flex justify-between items-center pt-6">
                    <span className="text-lg font-bold text-slate-900">Total</span>
                    <span className="text-2xl font-black text-blue-600">${(model.price + 15).toFixed(2)}</span>
                 </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                 <button 
                   onClick={onConfirm}
                   className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                 >
                    <Icons.Confirm />
                    Checkout Now
                 </button>
                 <button 
                   onClick={onBack}
                   className="w-full py-4 bg-slate-50 text-slate-700 rounded-2xl font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                 >
                    <Icons.Edit />
                    Back to Editor
                 </button>
              </div>
           </div>

           <div className="bg-blue-600 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-100 flex items-center justify-between">
              <div className="space-y-1">
                 <h4 className="font-bold">Share Your Design</h4>
                 <p className="text-xs text-blue-100">Get a preview image for social media.</p>
              </div>
              <button className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all">
                 <Icons.Download />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;
