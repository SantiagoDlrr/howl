import React, { useState } from 'react';
import { TranscriptEntry } from 'howl/app/types';


const TranscriptSection = ({ transcript }: { transcript: TranscriptEntry[] }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-5">
      <div className="text-sm space-y-6">
        {transcript.length ? (
          transcript.map((entry, index) => (
            <div key={index} className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className={`font-semibold mb-2 ${entry.speaker === 'Alex' ? 'text-blue-600' : 'text-purple-600'}`}>
                {entry.speaker}
              </div>
              <div className="ml-4 text-gray-700 leading-relaxed">{entry.text}</div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center p-8">No transcript available.</p>
        )}
      </div>
    </div>
  );
};

// Example usage inside the main component:
// {activeTab === 'transcript' && <TranscriptSection transcript={transcript} />}

export default TranscriptSection;