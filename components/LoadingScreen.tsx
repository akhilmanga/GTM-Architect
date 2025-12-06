import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full border-4 border-slate-800" />
        <div className="absolute top-0 left-0 w-24 h-24 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-slate-100 mb-2 animate-pulse-slow">
        Building your GTM strategy...
      </h2>
      <p className="text-slate-400 max-w-md mx-auto">
        Analyzing market fit, identifying key personas, and structuring your quarterly roadmap.
      </p>
    </div>
  );
};

export default LoadingScreen;