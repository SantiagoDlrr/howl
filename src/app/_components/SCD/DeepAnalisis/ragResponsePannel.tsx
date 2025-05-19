'use client';

interface Source {
  call_id: string;
  text: string;
  score: number;
}

interface ResponseData {
  answer: string;
  sources: Source[];
}

interface RagResponsePanelProps {
  responseData: ResponseData | null;
  isLoading: boolean;
  error: string | null;
}

const RagResponsePanel = ({ responseData, isLoading, error }: RagResponsePanelProps) => {
  const formatText = (text: string) => {
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-8">
      <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      </div>
      <p>Submit a question to see the response here.</p>
    </div>
  );

  const renderLoading = () => (
    <div className="flex items-center justify-center p-8 text-gray-500">
      <div className="w-6 h-6 border-3 border-red-50 border-t-red-500 rounded-full animate-spin mr-3"></div>
      <span>Processing your question...</span>
    </div>
  );

  const renderError = () => (
    <div>
      <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg mb-4">
        {error}
      </div>
      <p>Please try again with a different question or call IDs.</p>
    </div>
  );

  const renderResponse = () => (
    <div>
      <div className="p-5 bg-red-50 rounded-lg border-l-4 border-red-500 mb-6">
        <h3 className="font-medium mb-2">Answer:</h3>
        <p>{formatText(responseData!.answer)}</p>
      </div>
      
      {responseData!.sources && responseData!.sources.length > 0 ? (
        <div>
          <h3 className="font-medium mb-3">Sources:</h3>
          {responseData!.sources.map((source, index) => (
            <div key={index} className="p-5 bg-gray-50 rounded-lg border-l-4 border-purple-500 mb-4">
              <div className="flex justify-between mb-3 font-medium">
                <span>Source {index + 1}: Call {source.call_id}</span>
                <span>Relevance: {(source.score * 100).toFixed(2)}%</span>
              </div>
              <div className="whitespace-pre-wrap text-sm text-gray-600">
                {formatText(source.text)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No sources provided.</p>
      )}
    </div>
  );

  return (
    <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Response</h2>
      </div>
      
      <div className="p-6 flex-1 overflow-y-auto">
        {isLoading ? renderLoading() : 
         error ? renderError() : 
         responseData ? renderResponse() : 
         renderEmptyState()}
      </div>
    </div>
  );
};

export default RagResponsePanel;