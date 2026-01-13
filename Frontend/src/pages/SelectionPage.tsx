
import React from 'react';
import { BOTTLE_MODELS } from '../constants';
import type{ BottleModel } from '../types';

interface SelectionPageProps {
  onSelect: (model: BottleModel) => void;
}

const SelectionPage: React.FC<SelectionPageProps> = ({ onSelect }) => {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Select Your Base</h1>
            <p className="text-lg text-slate-500 font-light">Choose a model to start your creative journey.</p>
          </div>
          
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {BOTTLE_MODELS.map((model) => (
            <div 
              key={model.id}
              className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-50 flex flex-col"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img 
                  src={model.thumbnail} 
                  alt={model.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
              </div>
              <div className="p-8 space-y-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{model.name}</h3>
                    <p className="text-slate-400 text-sm font-medium">Starting from ${model.price}</p>
                  </div>
                </div>
                <p className="text-slate-500 text-sm font-light leading-relaxed">
                  Crafted with premium materials for ultimate durability and style.
                </p>
                <div className="pt-4 mt-auto">
                  <button 
                    onClick={() => onSelect(model)}
                    className="w-full py-4 bg-slate-50 group-hover:bg-blue-600 group-hover:text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    Customize
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectionPage;
