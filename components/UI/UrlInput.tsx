import React, { useState } from 'react';
import { Send, Globe, Smile, Zap, Flame } from 'lucide-react';

interface UrlInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onStreamSubmit: () => void;
  disabled?: boolean;
  mode: 'normal' | 'roast' | 'angry';
  onModeChange: (mode: 'normal' | 'roast' | 'angry') => void;
}

const UrlInput: React.FC<UrlInputProps> = ({ 
  value, 
  onChange, 
  onSubmit, 
  onStreamSubmit,
  disabled = false,
  mode = 'normal',
  onModeChange
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !disabled && isValidUrl(value)) {
      onSubmit();
    }
  };

  const isValidUrl = (url: string) => {
    return url.startsWith('https://') && url.length > 8;
  };

  const canSubmit = isValidUrl(value) && !disabled;

  const handleModeChange = (newMode: 'normal' | 'roast' | 'angry') => {
    onModeChange(newMode);
  };

  const getModeConfig = (currentMode: 'normal' | 'roast' | 'angry') => {
    switch (currentMode) {
      case 'roast':
        return {
          icon: <Flame size={16} />,
          label: '🔥 Roast',
          bgColor: 'bg-orange-500/20',
          textColor: 'text-orange-300',
          borderColor: 'border-orange-400/30',
          shadowColor: 'shadow-orange-500/20'
        };
      case 'angry':
        return {
          icon: <Zap size={16} />,
          label: '⚡ Angry',
          bgColor: 'bg-red-500/20',
          textColor: 'text-red-300',
          borderColor: 'border-red-400/30',
          shadowColor: 'shadow-red-500/20'
        };
      default:
        return {
          icon: <Smile size={16} />,
          label: '😐 Normal',
          bgColor: 'bg-emerald-500/20',
          textColor: 'text-emerald-300',
          borderColor: 'border-emerald-400/30',
          shadowColor: 'shadow-emerald-500/20'
        };
    }
  };

  const currentModeConfig = getModeConfig(mode);

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Chatbot-like bordered section */}
      <div className={`
        relative 
        bg-white/5 backdrop-blur-xl
        border-2 rounded-2xl p-4
        transition-all duration-300
        ${isFocused 
          ? 'border-white/40 shadow-lg shadow-white/10' 
          : 'border-white/20'
        }
        ${disabled ? 'opacity-50' : ''}
      `}>
        {/* Textfield without border */}
        <div className="relative mb-4">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
            <Globe size={18} />
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={
              mode === 'roast' ? "Enter a URL for a roast session... 🔥" :
              mode === 'angry' ? "Enter a URL for an angry critique... ⚡" :
              "Enter any website URL to get an AI summary..."
            }
            disabled={disabled}
            className="
              w-full pl-10 pr-4 py-3 text-lg 
              bg-transparent text-white placeholder-white/60
              focus:outline-none
              resize-none
            "
          />
        </div>
        
        {/* Bottom section with buttons */}
        <div className="flex items-center justify-between">
          {/* Mode toggle buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => handleModeChange('normal')}
              disabled={disabled}
              className={`
                px-3 py-2 rounded-xl text-sm font-medium
                transition-all duration-300 transform
                focus:outline-none disabled:cursor-not-allowed
                ${mode === 'normal' 
                  ? 'bg-emerald-500/20 text-emerald-300 shadow-lg shadow-emerald-500/20 scale-105 border border-emerald-400/30' 
                  : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white/80 border border-transparent'
                }
              `}
            >
              <Smile size={14} className="inline mr-1" />
              Normal
            </button>
            
            <button
              onClick={() => handleModeChange('roast')}
              disabled={disabled}
              className={`
                px-3 py-2 rounded-xl text-sm font-medium
                transition-all duration-300 transform
                focus:outline-none disabled:cursor-not-allowed
                ${mode === 'roast' 
                  ? 'bg-orange-500/20 text-orange-300 shadow-lg shadow-orange-500/20 scale-105 border border-orange-400/30' 
                  : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white/80 border border-transparent'
                }
              `}
            >
              <Flame size={14} className="inline mr-1" />
              Roast
            </button>
            
            <button
              onClick={() => handleModeChange('angry')}
              disabled={disabled}
              className={`
                px-3 py-2 rounded-xl text-sm font-medium
                transition-all duration-300 transform
                focus:outline-none disabled:cursor-not-allowed
                ${mode === 'angry' 
                  ? 'bg-red-500/20 text-red-300 shadow-lg shadow-red-500/20 scale-105 border border-red-400/30' 
                  : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white/80 border border-transparent'
                }
              `}
            >
              <Zap size={14} className="inline mr-1" />
              Angry
            </button>
          </div>
          
          {/* Action buttons */}
          <div className="flex space-x-2">
            {/* Stream button */}
            <button
              onClick={onStreamSubmit}
              disabled={!canSubmit}
              className={`
                px-3 py-2 rounded-xl text-sm font-medium
                transition-all duration-300 transform
                focus:outline-none disabled:cursor-not-allowed
                ${canSubmit
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 active:scale-95'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
                }
              `}
            >
              <Zap size={14} className="inline mr-1" />
              Stream
            </button>
            
            {/* Generate button */}
            <button
              onClick={onSubmit}
              disabled={!canSubmit}
              className={`
                p-3 rounded-xl
                transition-all duration-300 transform
                ${canSubmit
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
                }
              `}
            >
              <Send size={18} className={canSubmit ? '' : 'opacity-50'} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Status indicators */}
      <div className="mt-2 flex items-center justify-between">
        {/* URL validation message */}
        {value.length > 0 && !isValidUrl(value) && !disabled && (
          <div className="text-sm text-red-300/80 ml-4">
            Please enter a valid HTTPS URL
          </div>
        )}
        
        {/* Mode indicator */}
        {mode !== 'normal' && (
          <div className={`text-sm ${currentModeConfig.textColor}/80 ml-auto mr-4 flex items-center space-x-1`}>
            {currentModeConfig.icon}
            <span>{mode === 'roast' ? 'Roast mode active' : 'Angry mode active'}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlInput; 