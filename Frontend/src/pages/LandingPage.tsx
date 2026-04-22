import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
        {/* Left Content */}
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="inline-block px-4 py-1.5 bg-brand-bg text-brand-accent rounded-full text-xs font-bold tracking-widest uppercase">
            Design Reimagined
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-brand-primary leading-tight tracking-tight">
            Design Your Bottle <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">
              In Stunning 3D
            </span>
          </h1>
          <p className="text-lg text-brand-secondary max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
            Create unique hydration experiences with our intuitive 3D editor. Choose your model, apply your art, and see it come to life instantly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <button 
              onClick={() => navigate('/selection')}
              className="px-8 py-4 bg-brand-primary text-white rounded-2xl text-lg font-bold hover:bg-black transition-all shadow-xl hover:-translate-y-1 active:scale-95 w-full sm:w-auto"
            >
              Start Designing
            </button>
            <button 
              onClick={() => navigate('/selection')}
              className="px-8 py-4 bg-white text-brand-secondary border-2 border-brand-border rounded-2xl text-lg font-bold hover:border-brand-primary hover:text-brand-primary transition-all w-full sm:w-auto"
            >
              View Bottles
            </button>
          </div>
        </div>

        <div className="flex-1 relative w-full aspect-square max-w-2xl">
          <div className="absolute inset-0 bg-brand-accent rounded-full blur-[100px] opacity-10"></div>
          <div className="relative glass w-full h-full rounded-[4rem] flex items-center justify-center shadow-2xl animate-float border border-white/50">
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
          <div key={i} className="p-8 bg-brand-surface rounded-3xl shadow-sm border border-brand-border hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-brand-bg rounded-2xl flex items-center justify-center text-brand-accent mb-6 font-bold">
              0{i+1}
            </div>
            <h3 className="text-xl font-bold mb-3 text-brand-primary">{f.title}</h3>
            <p className="text-brand-secondary leading-relaxed font-light">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
