'use client';

import { useState } from 'react';
import DAContainer from '../../_components/SCD/DeepAnalisis/DAContainer';
// Import the new components
import ClientInsightPage from '../testttt/page';
import FeedbackManagerPage from '../testFM/page';

const SCD = () => {
  const [activePanel, setActivePanel] = useState<string | null>(null);

  return (
    <div className="flex w-full pt-16 h-[calc(100vh-4rem)]">
      <div className="flex-1 bg-gray-50 overflow-auto">
        {/* Header section matching HowlX style */}
        <div className="container mx-auto px-6 py-8">
  
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          
          {/* Client Insight Card */}
          <div 
            className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
              activePanel === 'ClientInsight' ? 'ring-4 ring-purple-500' : ''
            }`}
            onClick={() => setActivePanel('ClientInsight')}
          >
            <div className="h-[700px] relative">
              {/* Background Image Container */}
              <div className="absolute inset-0">
                <img 
                  src="/images/sr.jpg" 
                  alt="Smart Recommendations"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-purple-500/20"></div>
              </div>
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="mb-2">
                  <span className="inline-block px-3 py-1 bg-purple-500/80 rounded-full text-sm font-medium">
                    Agent Companion
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">ClientInsight</h3>
                <p className="text-sm text-gray-200 leading-relaxed">
                  Personalized customer context built from previous interactions, emotional tone, and key topics—empowering agents with a single AI-powered briefing per client.
                </p>
              </div>
            </div>
          </div>

          {/* Feedback Manager Card */}
          <div 
            className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
              activePanel === 'FeedbackManager' ? 'ring-4 ring-orange-500' : ''
            }`}
            onClick={() => setActivePanel('FeedbackManager')}
          >
            <div className="h-[700px] relative">
              {/* Background Image Container */}
              <div className="absolute inset-0">
                <img 
                  src="/images/gc.jpg" 
                  alt="General Chat"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-orange-500/20"></div>
              </div>
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="mb-2">
                  <span className="inline-block px-3 py-1 bg-orange-500/80 rounded-full text-sm font-medium">
                    Agent Companion
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">Feedback Manager</h3>
                <p className="text-sm text-gray-200 leading-relaxed">
                  AI-driven performance insights that compare customer satisfaction and behavior over time—helping agents track progress and act on weekly feedback.
                </p>
              </div>
            </div>
          </div>

          {/* Deep Analysis Card */}
          <div 
            className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
              activePanel === 'deep-analysis' ? 'ring-4 ring-blue-500' : ''
            }`}
            onClick={() => setActivePanel('deep-analysis')}
          >
            <div className="h-[700px] relative">
              {/* Background Image Container */}
              <div className="absolute inset-0">
                <img 
                  src="/images/da.jpg" 
                  alt="Deep Analysis"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-blue-500/20"></div>
              </div>
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="mb-2">
                  <span className="inline-block px-3 py-1 bg-blue-500/80 rounded-full text-sm font-medium">
                    RAG Interface
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">Deep Analysis</h3>
                <p className="text-sm text-gray-200 leading-relaxed">
                  Advanced analytics dashboard with comprehensive data visualization and performance metrics for strategic decision making.
                </p>
              </div>
            </div>
          </div>
                  </div>

          {/* Content Panels - Below cards layout */}
          <div className="mt-12">
            {activePanel === 'deep-analysis' && (
              <div className="w-full">
                <DAContainer />
              </div>
            )}
            
            {activePanel === 'ClientInsight' && (
              <div className="w-full">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-700">Client Insight</h2>
                </div>
                <ClientInsightPage />
              </div>
            )}
            
            {activePanel === 'FeedbackManager' && (
              <div className="w-full">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-700">Feedback Manager</h2>
                </div>
                <FeedbackManagerPage />
              </div>
            )}
            
            {!activePanel && (
              <div className="text-center p-12 bg-white/80 backdrop-blur rounded-2xl border border-gray-200 w-full max-w-2xl mx-auto">
                <h2 className="text-xl font-medium mb-4 text-gray-900">Select a module above to get started</h2>
                <p className="text-gray-600">Click on one of the cards above to access the corresponding features.</p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default SCD;