import React from 'react';
import { Brain, Zap, Sparkles } from 'lucide-react';

interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ 
  message = "Analyzing website content..." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-16">
      {/* Main loading animation */}
      <div className="relative">
        {/* Backdrop blur circle */}
        <div className="absolute inset-0 w-32 h-32 bg-gradient-to-r from-emerald-500/20 to-teal-600/20 rounded-full blur-xl animate-pulse"></div>
        
        {/* Outer ring */}
        <div className="relative w-24 h-24 border-2 border-white/10 rounded-full"></div>
        
        {/* Spinning gradient ring */}
        <div className="absolute inset-0 w-24 h-24 rounded-full animate-spin" style={{ animationDuration: '2s' }}>
          <div className="w-full h-full rounded-full border-2 border-transparent border-t-emerald-400 border-r-teal-500"></div>
        </div>
        
        {/* Inner ring */}
        <div className="absolute inset-2 w-20 h-20 rounded-full animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }}>
          <div className="w-full h-full rounded-full border-2 border-transparent border-b-cyan-400 border-l-teal-400"></div>
        </div>
        
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center animate-pulse">
            <Brain size={20} className="text-white" />
          </div>
        </div>
      </div>
      
      {/* Floating particles */}
      <div className="relative w-full max-w-md h-12">
        <div className="absolute left-8 top-0">
          <div className="w-3 h-3 bg-emerald-400/60 rounded-full animate-float"></div>
        </div>
        <div className="absolute right-12 top-2">
          <Zap size={16} className="text-teal-400/80 animate-float" style={{ animationDelay: '0.5s' }} />
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2 top-1">
          <Sparkles size={14} className="text-cyan-400/70 animate-float" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute right-4 top-3">
          <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
        </div>
      </div>
      
      {/* Loading message */}
      <div className="text-center space-y-4">
        <p className="text-xl font-medium text-white/90">
          {message}
        </p>
        
        {/* Animated dots */}
        <div className="flex space-x-2 justify-center">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
        </div>
      </div>
      
      {/* Progress indication */}
      <div className="w-full max-w-sm">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full animate-pulse origin-left transform scale-x-75"></div>
        </div>
        <div className="mt-2 text-center">
          <span className="text-sm text-white/60 font-medium">Processing with AI</span>
        </div>
      </div>
    </div>
  );
};

export default Loader; 