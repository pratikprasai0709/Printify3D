import React from 'react';

const Preloader: React.FC = () => (
  <div
    className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center bg-slate-50/95 px-6 backdrop-blur-sm"
    role="status"
    aria-label="Loading Printify3D"
  >
    <div className="flex flex-col items-center text-center">
      <div className="preloader-orbit relative mb-7 h-16 w-16" aria-hidden="true">
        <span className="absolute inset-0 rounded-full border-2 border-blue-100" />
        <span className="absolute inset-1 rounded-full border-2 border-transparent border-t-blue-600 border-r-sky-400" />
        <span className="preloader-core absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600" />
      </div>
      <p className="text-2xl font-extrabold tracking-tight text-slate-900">
        Printify<span className="text-blue-600">3D</span>
      </p>
      <p className="mt-2 text-sm font-medium text-slate-500">Preparing your experience</p>
    </div>
  </div>
);

export default Preloader;
