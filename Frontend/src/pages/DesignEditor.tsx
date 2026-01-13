
import React, { useState } from 'react';
import ThreeScene from '../components/ThreeScene';
import { Icons, COLORS } from '../constants';
import type { CustomizationState, BottleModel, Page } from '../types';

import CanvasEditor from "../components/CanvasEditor";


interface DesignEditorProps {
  selectedModel: BottleModel;
  onPreview: (state: CustomizationState) => void;
  onNavigate: (page: Page) => void;
}

const DesignEditor: React.FC<DesignEditorProps> = ({ selectedModel, onPreview, onNavigate }) => {
  const [customization, setCustomization] = useState<CustomizationState>({
    color: '#ffdab9',
    material: 'matte',
    labelScale: 1,
    labelRotation: 0,
    labelY: 0,
    capColor: '#333333',
  });




  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomization(prev => ({ ...prev, labelUrl: url }));
    }
  };

  const resetDesign = () => {
    setCustomization({
      color: '#ffdab9',
      material: 'matte',
      labelScale: 1,
      labelRotation: 0,
      labelY: 0,
      capColor: '#333333',
    });
  };

  return (
    <div className="fixed inset-0 pt-24 pb-8 px-6 flex flex-col md:flex-row gap-6">

      {/* This canvas generates the texture used by Three.js */}
      <CanvasEditor
        imageUrl={customization.labelUrl}
        scale={customization.labelScale}
        rotation={customization.labelRotation}
        onExport={(texture) =>
          setCustomization((prev) => ({
            ...prev,
            labelTexture: texture,
          }))
        }
      />

      {/* Left Sidebar - Tools */}
      <aside className="w-full md:w-20 lg:w-24 bg-white rounded-[2rem] shadow-sm border border-slate-100 flex md:flex-col items-center justify-around md:justify-center gap-6 p-4">
        <label className="group flex flex-col items-center gap-2 cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
            <Icons.Upload />
          </div>
          <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 uppercase tracking-tighter">Upload</span>
          <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
        </label>

        <button
          onClick={() => setCustomization(p => ({ ...p, labelScale: Math.min(2, p.labelScale + 0.1) }))}
          className="group flex flex-col items-center gap-2"
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
            <Icons.Resize />
          </div>
          <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 uppercase tracking-tighter">Scale</span>
        </button>

        <button
          onClick={() => setCustomization(p => ({ ...p, labelRotation: p.labelRotation + 0.2 }))}
          className="group flex flex-col items-center gap-2"
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
            <Icons.Rotate />
          </div>
          <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 uppercase tracking-tighter">Rotate</span>
        </button>

        <button
          onClick={() => setCustomization(p => ({ ...p, labelY: Math.max(-1, Math.min(1, p.labelY + 0.1)) }))}
          className="group flex flex-col items-center gap-2"
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
            <Icons.Move />
          </div>
          <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 uppercase tracking-tighter">Position</span>
        </button>

        <div className="w-8 h-[1px] bg-slate-100 hidden md:block" />

        <button
          onClick={resetDesign}
          className="group flex flex-col items-center gap-2"
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-red-400 group-hover:bg-red-50 group-hover:text-red-600 transition-all">
            <Icons.Reset />
          </div>
          <span className="text-[10px] font-bold text-slate-400 group-hover:text-red-600 uppercase tracking-tighter">Reset</span>
        </button>
      </aside>

      {/* Center Viewport */}
      <main className="flex-1 glass rounded-[3rem] relative flex items-center justify-center overflow-hidden shadow-inner bg-slate-50/50">
        <ThreeScene customization={customization} className="w-full h-full" />

        {/* Helper UI */}
        <div className="absolute top-8 left-8">
          <div className="bg-white/80 backdrop-blur px-4 py-2 rounded-2xl shadow-sm border border-white">
            <h2 className="text-sm font-bold text-slate-800">{selectedModel.name}</h2>
            {/* <p className="text-xs text-red-700">{selectedModel.type}</p> */}
          </div>
        </div>

        <div className="absolute bottom-8 flex gap-4">
          <button
            onClick={() => onNavigate('selection')}
            className="px-6 py-3 bg-white text-slate-700 rounded-2xl font-bold shadow-sm hover:shadow-md transition-all active:scale-95 text-sm"
          >
            Back
          </button>
          <button
            onClick={() => onPreview(customization)}
            className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 text-sm"
          >
            Preview Design
          </button>
        </div>
      </main>

      {/* Right Sidebar - Properties */}
      <aside className="w-full md:w-80 lg:w-96 bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 flex flex-col gap-8">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Icons.Settings />
          Customizer
        </h3>

        {/* Color Selection */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bottle Color</label>
          <div className="grid grid-cols-4 gap-3">
            {COLORS.map(c => (
              <button
                key={c.hex}
                onClick={() => setCustomization(prev => ({ ...prev, color: c.hex }))}
                className={`aspect-square rounded-xl transition-all p-1 ${customization.color === c.hex ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
              >
                <div className="w-full h-full rounded-lg shadow-inner" style={{ backgroundColor: c.hex }} />
              </button>
            ))}
          </div>
        </div>

        {/* Material Selection */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Finish</label>
          <div className="flex gap-2">
            {(['matte', 'glossy', 'metallic'] as const).map(m => (
              <button
                key={m}
                onClick={() => setCustomization(prev => ({ ...prev, material: m }))}
                className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all border ${customization.material === m ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-100 hover:border-slate-300'}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Label Position Slider (Precision Control) */}
        {customization.labelUrl && (
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vertical Position</label>
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{Math.round(customization.labelY * 100)}%</span>
            </div>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              value={customization.labelY}
              onChange={(e) => setCustomization(p => ({ ...p, labelY: parseFloat(e.target.value) }))}
              className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        )}




      </aside>
    </div>
  );
};

export default DesignEditor;
