
import React from 'react';
import type{ Page } from '../types';

interface LandingPageProps {
  onStart: (page: Page) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
        {/* Left Content */}
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold tracking-wide">
            DESIGN REIMAGINED
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight">
            Design Your Bottle <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
              In Stunning 3D
            </span>
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto lg:mx-0 font-light">
            Create unique hydration experiences with our intuitive 3D editor. Choose your model, apply your art, and see it come to life instantly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <button 
              onClick={() => onStart('selection')}
              className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-lg font-bold hover:bg-slate-800 transition-all shadow-xl hover:-translate-y-1 active:scale-95 w-full sm:w-auto"
            >
              Start Designing
            </button>
            <button 
              onClick={() => onStart('selection')}
              className="px-8 py-4 bg-white text-slate-700 border-2 border-slate-100 rounded-2xl text-lg font-bold hover:border-slate-300 transition-all w-full sm:w-auto"
            >
              View Bottles
            </button>
          </div>
        </div>

        {/* Right Content - Abstract 3D Preview */}
        <div className="flex-1 relative w-full aspect-square max-w-2xl">
          <div className="absolute inset-0 bg-blue-200 rounded-full blur-[100px] opacity-20"></div>
          <div className="relative glass w-full h-full rounded-[4rem] flex items-center justify-center shadow-2xl animate-float">
            <img 
              src="homepageimage.jpg" 
              alt="3D Bottle Preview" 
              className="w-3/4 h-3/4 object-cover rounded-3xl shadow-2xl"
            />
            {/* Design Tags Decoration */}
            
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Real-time 3D", desc: "Interact with your design from every angle with professional rendering." },
          { title: "Eco Friendly", desc: "All our materials are sustainable and built for a lifetime of use." },
          { title: "Premium Quality", desc: "Double-walled insulation keeps your drinks perfect for up to 24 hours." }
        ].map((f, i) => (
          <div key={i} className="p-8 bg-white rounded-3xl shadow-sm border border-slate-50 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 font-bold">
              0{i+1}
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-800">{f.title}</h3>
            <p className="text-slate-500 leading-relaxed font-light">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
