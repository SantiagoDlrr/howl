'use client';

import { useState } from 'react';
import DAContainer from '../../_components/SCD/DeepAnalisis/DAContainer';

const SCD = () => {
  const [activePanel, setActivePanel] = useState<string | null>(null);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Support Call Dashboard</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
        <button 
          className={`px-6 py-3 rounded-lg font-medium transition-colors
            ${activePanel === 'SmartRecommendations' 
              ? 'bg-red-500 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          onClick={() => setActivePanel('SmartRecommendations')}
        >
          SmartRecommendations Panel
        </button>
        

        
        <button 
          className={`px-6 py-3 rounded-lg font-medium transition-colors
            ${activePanel === 'Chat' 
              ? 'bg-red-500 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          onClick={() => setActivePanel('Chat')}
        >
          Chat Panel
        </button>

        <button 
          className={`px-6 py-3 rounded-lg font-medium transition-colors
            ${activePanel === 'QA' 
              ? 'bg-red-500 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          onClick={() => setActivePanel('QA')}
        >
          Q & A
        </button>

      </div>

      {activePanel === 'QA' && <DAContainer />}
      
      {activePanel === 'SmartRecommendations' && (
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">SmartRecommendations Panel</h2>
          <p className="text-gray-600">SmartRecommendations content would go here.</p>
        </div>
      )}
      
      {activePanel === 'Chat' && (
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Chat Panel</h2>
          <p className="text-gray-600">Chat content would go here.</p>
        </div>
      )}
      
      {!activePanel && (
        <div className="text-center p-12 bg-gray-50 rounded-xl border border-gray-200">
          <h2 className="text-xl font-medium mb-4">Select a panel above to get started</h2>
          <p className="text-gray-600">Click on one of the buttons above to view the corresponding panel.</p>
        </div>
      )}
    </div>
  );
};

export default SCD;