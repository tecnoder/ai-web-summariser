import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FileText, Copy, CheckCircle } from 'lucide-react';

interface SummaryDisplayProps {
  summary: string;
  websiteTitle?: string;
  isFunny?: boolean; // Keep for backward compatibility but don't use
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ 
  summary, 
  websiteTitle 
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 animate-fade-in">
      {/* Card Container */}
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <FileText size={20} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              AI Summary
            </h2>
          </div>
          
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className={`
              flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-300
              ${copied 
                ? 'bg-green-500/20 text-green-300 border border-green-400/30' 
                : 'bg-white/10 text-white/80 border border-white/20 hover:bg-white/20 hover:text-white hover:scale-105'
              }
            `}
          >
            {copied ? (
              <>
                <CheckCircle size={16} />
                <span className="text-sm font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span className="text-sm font-medium">Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Website Title */}
        {websiteTitle && (
          <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-sm text-white/50 mb-1 uppercase tracking-wide font-medium">Source Website</p>
            <h3 className="text-lg font-semibold text-white">{websiteTitle}</h3>
          </div>
        )}

        {/* Summary Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          <ReactMarkdown
            className="text-white/90 leading-relaxed"
            components={{
              // Custom styling for markdown elements
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-semibold text-white mb-4 mt-8">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-white/90 mb-4 leading-relaxed">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside text-white/90 mb-6 space-y-2 ml-4">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside text-white/90 mb-6 space-y-2 ml-4">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-white/90 leading-relaxed">{children}</li>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-white">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="italic text-blue-300">{children}</em>
              ),
              code: ({ children }) => (
                <code className="bg-white/10 text-blue-300 px-2 py-1 rounded-lg text-sm font-mono">
                  {children}
                </code>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-blue-400/50 pl-6 italic text-white/80 my-6 bg-white/5 py-4 rounded-r-xl">
                  {children}
                </blockquote>
              ),
            }}
          >
            {summary}
          </ReactMarkdown>
        </div>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between text-sm text-white/50">
            <span>Summary generated by AI</span>
            <span>{new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryDisplay; 