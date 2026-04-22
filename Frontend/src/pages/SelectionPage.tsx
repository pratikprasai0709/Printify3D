import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBottlesApi } from '../shared/config/api';
import type { BottleModel } from '../types';

const SelectionPage: React.FC = () => {
  const [models, setModels] = useState<BottleModel[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const res = await getBottlesApi();
      setModels(res.data);
    } catch (e) {
      console.error("Failed to fetch models:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 px-6 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Select Your Base</h1>
            <p className="text-lg text-slate-500 font-light">Choose a model to start your creative journey.</p>
          </div>
        </div>

        {models.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
            <p className="text-slate-400 text-lg">No models available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {models.map((model) => {
              const thumbUrl = model.thumbnail.startsWith('http')
                ? model.thumbnail
                : `http://localhost:5000${model.thumbnail}`;

              return (
                <div
                  key={model._id || model.id}
                  className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-50 flex flex-col"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={thumbUrl}
                      alt={model.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6 space-y-3 flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">{model.name}</h3>
                        <p className="text-slate-400 text-xs font-medium">Starting from Rs. {model.price}</p>
                      </div>
                    </div>
                    <p className="text-slate-500 text-xs font-light leading-relaxed">
                      Crafted with premium materials for ultimate durability and style.
                    </p>
                    <div className="pt-3 mt-auto">
                      <button
                        onClick={() => navigate('/editor', { state: { selectedModel: model } })}
                        className="w-full py-3 bg-slate-50 group-hover:bg-blue-600 group-hover:text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm"
                      >
                        Customize
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectionPage;
