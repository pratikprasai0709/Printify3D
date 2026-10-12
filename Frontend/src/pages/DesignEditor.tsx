import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ThreeScene from '../components/ThreeScene';
import { Icons, COLORS } from '../constants';
import type { CustomizationState, BottleModel } from '../types';

import CanvasEditor from "../components/CanvasEditor";

const DesignEditor: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedModel] = useState<BottleModel | null>(() => {
    if (location.state?.selectedModel) {
      sessionStorage.setItem('editor_model', JSON.stringify(location.state.selectedModel));
      return location.state.selectedModel;
    }
    const saved = sessionStorage.getItem('editor_model');
    return saved ? JSON.parse(saved) : null;
  });

  const [customization, setCustomization] = useState<CustomizationState>(() => {
    const saved = sessionStorage.getItem('editor_customization');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return {
      color: '#ffdab9',
      material: 'matte',
      imageScale: 1,
      imageRotation: 0,
      imageX: 0,
      imageY: 0,
      capColor: '#333333',
      text: '',
      font: "'Inter', sans-serif",
      textColor: '#000000',
      fontSize: 40,
      textScale: 1,
      textRotation: 0,
      textX: 0,
      textY: 0,
    };
  });

  useEffect(() => {
    sessionStorage.setItem('editor_customization', JSON.stringify(customization));
  }, [customization]);

  useEffect(() => {
    if (!selectedModel) {
      navigate('/selection');
    }
  }, [selectedModel, navigate]);

  if (!selectedModel) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomization(prev => ({ ...prev, labelUrl: event.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const resetDesign = () => {
    const defaultState: CustomizationState = {
      color: '#ffdab9',
      material: 'matte',
      imageScale: 1,
      imageRotation: 0,
      imageX: 0,
      imageY: 0,
      capColor: '#333333',
      text: '',
      font: "'Inter', sans-serif",
      textColor: '#000000',
      fontSize: 40,
      textScale: 1,
      textRotation: 0,
      textX: 0,
      textY: 0,
    };
    setCustomization(defaultState);
    sessionStorage.setItem('editor_customization', JSON.stringify(defaultState));
  };

  return (
    <div className="md:fixed md:inset-0 pt-8 md:pt-24 pb-8 px-4 md:px-6 flex flex-col md:flex-row gap-6 min-h-screen md:min-h-0 bg-brand-bg">

      {/* This canvas generates the texture used by Three.js */}
      <CanvasEditor
        imageUrl={customization.labelUrl}
        imageScale={customization.imageScale}
        imageRotation={customization.imageRotation}
        imageX={customization.imageX}
        imageY={customization.imageY}
        text={customization.text}
        font={customization.font}
        textColor={customization.textColor}
        fontSize={customization.fontSize}
        textScale={customization.textScale}
        textRotation={customization.textRotation}
        textX={customization.textX}
        textY={customization.textY}
        color={customization.color}
        onExport={(texture) =>
          setCustomization((prev) => ({
            ...prev,
            labelTexture: texture,
          }))
        }
      />

      {/* Left Sidebar - Tools */}
      <aside className="w-full md:w-20 lg:w-24 bg-brand-surface rounded-[2rem] shadow-sm border border-brand-border flex md:flex-col items-center justify-around md:justify-center gap-6 p-4 shrink-0">
        <label className="group flex flex-col items-center gap-2 cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-brand-bg flex items-center justify-center text-brand-secondary group-hover:bg-brand-accent group-hover:text-white transition-all">
            <Icons.Upload />
          </div>
          <span className="text-[10px] font-bold text-brand-secondary group-hover:text-brand-accent uppercase tracking-tighter">Upload</span>
          <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
        </label>


        <div className="w-8 h-[1px] bg-brand-border hidden md:block" />

        <button
          onClick={resetDesign}
          className="group flex flex-col items-center gap-2"
        >
          <div className="w-12 h-12 rounded-2xl bg-brand-bg flex items-center justify-center text-red-400 group-hover:bg-red-500 group-hover:text-white transition-all">
            <Icons.Reset />
          </div>
          <span className="text-[10px] font-bold text-brand-secondary group-hover:text-red-600 uppercase tracking-tighter">Reset</span>
        </button>
      </aside>

      {/* Center Viewport */}
      <main className="w-full min-w-0 h-[58vh] min-h-[420px] max-h-[650px] md:h-auto md:max-h-none flex-1 glass rounded-[3rem] relative flex items-center justify-center overflow-hidden shadow-inner bg-slate-50/50 md:min-h-0 shrink-0 md:shrink">
        <ThreeScene customization={customization} modelPath={selectedModel.modelPath} className="w-full h-full" enableEnvironment={false} />

        {/* Helper UI */}
        <div className="absolute top-8 left-8">
          <div className="bg-white/80 backdrop-blur px-4 py-2 rounded-2xl shadow-sm border border-white">
            <h2 className="text-sm font-bold text-slate-800">{selectedModel.name}</h2>
            {/* <p className="text-xs text-red-700">{selectedModel.type}</p> */}
          </div>
        </div>

        <div className="absolute bottom-8 flex gap-4">
          <button
            onClick={() => navigate('/selection')}
            className="px-6 py-3 bg-brand-surface text-brand-secondary rounded-2xl font-bold shadow-sm hover:shadow-md transition-all active:scale-95 text-sm border border-brand-border"
          >
            Back
          </button>
          <button
            onClick={() => navigate('/preview', { state: { model: selectedModel, customization } })}
            className="px-8 py-3 bg-brand-primary text-white rounded-2xl font-bold shadow-lg shadow-brand-primary/20 hover:bg-black transition-all active:scale-95 text-sm"
          >
            Preview Design
          </button>
        </div>
      </main>

      {/* Right Sidebar - Properties */}
      <aside className="w-full md:w-80 lg:w-96 bg-brand-surface rounded-[2rem] shadow-sm border border-brand-border p-6 md:p-8 flex flex-col gap-8 md:overflow-y-auto shrink-0 md:max-h-full">
        {/* Image Decoration */}
        {customization.labelUrl && (
          <div className="space-y-6 pt-4 border-t border-slate-100">
            <h4 className="text-sm font-bold text-slate-700 uppercase tracking-tighter">Image Decoration</h4>

            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-xs font-bold text-brand-secondary uppercase tracking-wider">Image Scale</label>
                <span className="text-[10px] font-bold text-brand-accent uppercase tracking-widest">{Math.round(customization.imageScale * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.01"
                value={customization.imageScale}
                onChange={(e) => setCustomization(p => ({ ...p, imageScale: parseFloat(e.target.value) }))}
                className="w-full h-1 bg-brand-bg rounded-lg appearance-none cursor-pointer accent-brand-accent"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Horizontal Position</label>
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{Math.round(customization.imageX * 100)}%</span>
              </div>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.01"
                value={customization.imageX}
                onChange={(e) => setCustomization(p => ({ ...p, imageX: parseFloat(e.target.value) }))}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vertical Position</label>
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{Math.round(customization.imageY * 100)}%</span>
              </div>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.01"
                value={customization.imageY}
                onChange={(e) => setCustomization(p => ({ ...p, imageY: parseFloat(e.target.value) }))}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Image Rotation</label>
              <div className="grid grid-cols-4 gap-2">
                {[0, 90, 180, 270].map(deg => (
                  <button
                    key={deg}
                    onClick={() => setCustomization(p => ({ ...p, imageRotation: (deg * Math.PI) / 180 }))}
                    className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${Math.round((customization.imageRotation * 180) / Math.PI) === deg
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-blue-500'
                      }`}
                  >
                    {deg}°
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Text Decoration */}
        <div className="space-y-6 pt-4 border-t border-slate-100">
          <h4 className="text-sm font-bold text-slate-700 uppercase tracking-tighter">Text Decoration</h4>
          <div className="space-y-4">
            <label className="text-xs font-bold text-brand-secondary uppercase tracking-wider">Message</label>
            <input
              type="text"
              value={customization.text || ''}
              onChange={(e) => setCustomization(p => ({ ...p, text: e.target.value }))}
              placeholder="Enter your text..."
              className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all"
            />
          </div>

          {customization.text && (
            <>
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Font Family</label>
                <select
                  value={customization.font}
                  onChange={(e) => setCustomization(p => ({ ...p, font: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
                >
                  <option value="'Inter', sans-serif">Inter (Modern)</option>
                  <option value="'Playfair Display', serif">Playfair (Elegant)</option>
                  <option value="'Pacifico', cursive">Pacifico (Script)</option>
                  <option value="'Oswald', sans-serif">Oswald (Bold)</option>
                  <option value="'Roboto Mono', monospace">Roboto Mono (Tech)</option>
                </select>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Font Size</label>
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{customization.fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="1"
                  value={customization.fontSize}
                  onChange={(e) => setCustomization(p => ({ ...p, fontSize: parseInt(e.target.value) }))}
                  className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Text Color</label>
                <div className="flex flex-wrap gap-2">
                  {['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'].map(c => (
                    <button
                      key={c}
                      onClick={() => setCustomization(prev => ({ ...prev, textColor: c }))}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${customization.textColor === c ? 'border-blue-500 scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Horizontal Position</label>
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{Math.round(customization.textX * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.01"
                  value={customization.textX}
                  onChange={(e) => setCustomization(p => ({ ...p, textX: parseFloat(e.target.value) }))}
                  className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vertical Position</label>
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{Math.round(customization.textY * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.01"
                  value={customization.textY}
                  onChange={(e) => setCustomization(p => ({ ...p, textY: parseFloat(e.target.value) }))}
                  className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Text Scale</label>
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{Math.round(customization.textScale * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.01"
                  value={customization.textScale}
                  onChange={(e) => setCustomization(p => ({ ...p, textScale: parseFloat(e.target.value) }))}
                  className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Text Rotation</label>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 90, 180, 270].map(deg => (
                    <button
                      key={deg}
                      onClick={() => setCustomization(p => ({ ...p, textRotation: (deg * Math.PI) / 180 }))}
                      className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${Math.round((customization.textRotation * 180) / Math.PI) === deg
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-blue-500'
                        }`}
                    >
                      {deg}°
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <h3 className="text-lg font-bold text-brand-primary flex items-center gap-2">
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
          <label className="text-xs font-bold text-brand-secondary uppercase tracking-wider">Finish</label>
          <div className="flex gap-2">
            {(['matte', 'glossy', 'metallic'] as const).map(m => (
              <button
                key={m}
                onClick={() => setCustomization(prev => ({ ...prev, material: m }))}
                className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all border ${customization.material === m ? 'bg-brand-primary text-white border-brand-primary' : 'bg-brand-bg text-brand-secondary border-brand-border hover:border-brand-accent'}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

      </aside>
    </div>
  );
};

export default DesignEditor;
