import React, { useState } from 'react';
import { Send, Globe, Smile } from 'lucide-react';

interface UrlInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  isFunny?: boolean;
  onFunnyToggle?: (funny: boolean) => void;
}

const UrlInput: React.FC<UrlInputProps> = ({ 
  value, 
  onChange, 
  onSubmit, 
  disabled = false,
  isFunny = false,
  onFunnyToggle 
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

  const handleFunnyToggle = () => {
    if (onFunnyToggle) {
      onFunnyToggle(!isFunny);
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className={`
        relative flex items-center
        bg-white/5 backdrop-blur-xl
        border-2 rounded-2xl
        transition-all duration-300
        ${isFocused 
          ? 'border-white/40 shadow-lg shadow-white/10' 
          : 'border-white/20'
        }
        ${disabled ? 'opacity-50' : ''}
      `}>
        {/* Globe Icon */}
        <div className="absolute left-4 text-white/60">
          <Globe size={20} />
        </div>
        
        {/* Funny Mode Toggle Button */}
        <button
          onClick={handleFunnyToggle}
          disabled={disabled}
          title={isFunny ? "Funny mode ON - Click for serious mode" : "Click for funny mode!"}
          className={`
            absolute left-14 p-1.5 rounded-lg
            transition-all duration-300 transform hover:scale-110
            focus:outline-none disabled:cursor-not-allowed
            ${isFunny 
              ? 'bg-yellow-500/20 text-yellow-300 shadow-lg shadow-yellow-500/20' 
              : 'text-white/40 hover:text-white/70 hover:bg-white/10'
            }
          `}
        >
          {isFunny ? '😂' : '😐'}
        </button>
        
        {/* Input Field */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isFunny 
            ? "Enter a URL for a roast session... 🔥" 
            : "Enter any website URL to get an AI summary..."
          }
          disabled={disabled}
          className="
            w-full px-20 py-4 text-lg 
            bg-transparent text-white placeholder-white/60
            focus:outline-none
            pr-16
          "
        />
        
        {/* Submit Button */}
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className={`
            absolute right-2 p-2.5 rounded-xl
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
      
      {/* Status indicators */}
      <div className="mt-2 flex items-center justify-between">
        {/* URL validation message */}
        {value.length > 0 && !isValidUrl(value) && !disabled && (
          <div className="text-sm text-red-300/80 ml-4">
            Please enter a valid HTTPS URL
          </div>
        )}
        
        {/* Funny mode indicator */}
        {isFunny && (
          <div className="text-sm text-yellow-300/80 ml-auto mr-4 flex items-center space-x-1">
            <span>🔥</span>
            <span>Roast mode active</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlInput; 