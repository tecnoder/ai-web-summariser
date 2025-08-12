import React, { useState } from 'react';
import Head from 'next/head';
import axios from 'axios';

// Import UI components
import UrlInput from '../components/UI/UrlInput';
import Loader from '../components/UI/Loader';
import SummaryDisplay from '../components/SummaryDisplay';

interface SummaryState {
  summary: string;
  websiteTitle: string;
}

const Home: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [summaryData, setSummaryData] = useState<SummaryState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'normal' | 'roast' | 'angry'>('normal');
  const [isGeneratingBrochure, setIsGeneratingBrochure] = useState(false);

  const isValidUrl = (url: string) => {
    return url.startsWith('https://') && url.length > 8;
  };

  const handleSubmit = async () => {
    if (!isValidUrl(url)) {
      setError('Please enter a valid HTTPS URL');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSummaryData(null);

    try {
      const response = await axios.post('/api/summarize', {
        url: url.trim(),
        mode: mode
      });

      if (response.data.success) {
        setSummaryData({
          summary: response.data.summary,
          websiteTitle: response.data.websiteTitle
        });
      } else {
        setError(response.data.error || 'Failed to generate summary');
      }
    } catch (err: any) {
      console.error('Error calling summarize API:', err);
      
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.code === 'NETWORK_ERROR') {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStreamSubmit = async () => {
    if (!isValidUrl(url)) {
      setError('Please enter a valid HTTPS URL');
      return;
    }

    setIsStreaming(true);
    setError(null);
    setSummaryData(null);

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url.trim(),
          mode: mode,
          stream: true
        }),
      });

      if (!response.ok) {
        throw new Error('Stream request failed');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      let streamedContent = '';
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        streamedContent += chunk;

        // Update the summary data as we receive content
        setSummaryData({
          summary: streamedContent,
          websiteTitle: 'Streaming...'
        });
      }

      // Final update with complete content
      setSummaryData({
        summary: streamedContent,
        websiteTitle: 'Streamed Content'
      });

    } catch (err: any) {
      console.error('Error in streaming:', err);
      setError('Failed to stream content. Please try again.');
    } finally {
      setIsStreaming(false);
    }
  };

  const handleGenerateBrochure = async () => {
    if (!summaryData?.summary) {
      setError('No content available for brochure generation');
      return;
    }

    setIsGeneratingBrochure(true);
    setError(null);

    try {
      const response = await axios.post('/api/summarize', {
        brochure: true,
        existingContent: summaryData.summary
      });

      if (response.data.success) {
        setSummaryData({
          summary: response.data.summary,
          websiteTitle: 'Marketing Brochure'
        });
      } else {
        setError(response.data.error || 'Failed to generate brochure');
      }
    } catch (err: any) {
      console.error('Error generating brochure:', err);
      
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('An unexpected error occurred while generating the brochure.');
      }
    } finally {
      setIsGeneratingBrochure(false);
    }
  };

  const handleNewSummary = () => {
    setSummaryData(null);
    setError(null);
    setUrl('');
    setMode('normal');
  };

  return (
    <>
      <Head>
        <title>AI Website Summarizer</title>
        <meta name="description" content="Get intelligent summaries of any website using AI. Fast, accurate, and powered by advanced language models." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 relative overflow-hidden">
        {/* Professional background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-600/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-emerald-600/8 to-teal-600/8 rounded-full blur-3xl"></div>
          
          {/* Additional professional accent elements */}
          <div className="absolute top-10 right-1/4 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-10 left-1/4 w-48 h-48 bg-emerald-500/8 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '3s' }}></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-8 min-h-screen flex flex-col">
          {/* Modern Header */}
          <header className="text-center mb-16 pt-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl mb-6 shadow-lg shadow-emerald-500/30">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              AI Website{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Summarizer
              </span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed font-light">
              Transform any website into a concise, intelligent summary in seconds. 
              Powered by advanced AI technology.
            </p>
          </header>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col justify-center">
            {!summaryData && !isLoading && !isStreaming && (
              <div className="max-w-4xl mx-auto w-full space-y-12">
                {/* URL Input Section */}
                <div className="space-y-8">
                  <UrlInput
                    value={url}
                    onChange={setUrl}
                    onSubmit={handleSubmit}
                    onStreamSubmit={handleStreamSubmit}
                    disabled={isLoading || isStreaming}
                    mode={mode}
                    onModeChange={setMode}
                  />
                </div>

                {/* Error Display */}
                {error && (
                  <div className="max-w-2xl mx-auto">
                    <div className="bg-red-500/10 backdrop-blur-sm border border-red-400/20 rounded-2xl p-6 text-center animate-fade-in">
                      <div className="flex items-center justify-center space-x-2 mb-3">
                        <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-red-300">Something went wrong</h3>
                      </div>
                      <p className="text-red-200 mb-4">{error}</p>
                      <button
                        onClick={() => setError(null)}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-xl transition-colors duration-300 border border-red-400/20"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}

                {/* Features Section */}
                <div className="grid md:grid-cols-3 gap-8 mt-20">
                  <div className="text-center p-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">Lightning Fast</h3>
                    <p className="text-white/60 leading-relaxed">Get comprehensive summaries in seconds, not minutes</p>
                  </div>
                  
                  <div className="text-center p-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 hover:bg-white/10 transition-all duration-300 group" style={{ animationDelay: '0.1s' }}>
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">AI Powered</h3>
                    <p className="text-white/60 leading-relaxed">Advanced language models for accurate, intelligent analysis</p>
                  </div>
                  
                  <div className="text-center p-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 hover:bg-white/10 transition-all duration-300 group" style={{ animationDelay: '0.2s' }}>
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">Precise & Accurate</h3>
                    <p className="text-white/60 leading-relaxed">Extract key insights and main points with precision</p>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="max-w-4xl mx-auto w-full">
                <Loader message={
                  mode === 'roast' ? "Preparing the roast session... 🔥" :
                  mode === 'angry' ? "Gathering critical thoughts... ⚡" :
                  "Analyzing website content and generating summary..."
                } />
              </div>
            )}

            {/* Streaming State */}
            {isStreaming && (
              <div className="max-w-4xl mx-auto w-full">
                <Loader message="Streaming content in real-time... ⚡" />
              </div>
            )}

            {/* Summary Display */}
            {summaryData && (
              <div className="max-w-4xl mx-auto w-full">
                <SummaryDisplay
                  summary={summaryData.summary}
                  websiteTitle={summaryData.websiteTitle}
                  mode={mode}
                  onGenerateBrochure={handleGenerateBrochure}
                  isGeneratingBrochure={isGeneratingBrochure}
                />
                
                {/* New Summary Button */}
                <div className="text-center mt-12">
                  <button
                    onClick={handleNewSummary}
                    className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl border border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/30 font-medium"
                  >
                    Summarize Another Website
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="text-center mt-16 py-8">
            <p className="text-white/40 text-sm">
              Built with AI technology • Privacy-focused • No data stored
            </p>
          </footer>
        </div>
      </main>
    </>
  );
};

export default Home; 