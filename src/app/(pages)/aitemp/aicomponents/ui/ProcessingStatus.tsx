import React from 'react';

interface ProcessingStatusProps {
  currentStep: string;
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ currentStep }) => {
  return (
    <div className="mt-6 bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4">
        <h3 className="text-base font-medium text-gray-800 mb-3 flex items-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Procesando
        </h3>
        
        <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 flex items-center">
          <div className="flex-shrink-0 mr-3">
            <div className="h-2 w-2 bg-purple-600 rounded-full animate-pulse"></div>
          </div>
          <p className="text-purple-800 font-medium text-sm">{currentStep}</p>
        </div>
      </div>
    </div>
  );
};

export default ProcessingStatus;