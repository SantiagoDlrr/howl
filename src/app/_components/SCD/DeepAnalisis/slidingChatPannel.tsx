// 'use client';

// import { useState } from 'react';

// interface SlidingChatPanelProps {
//   question: string;
//   callIds: string[];
//   onQuestionChange: (question: string) => void;
//   onAddCallId: (callId: string) => void;
//   onRemoveCallId: (callId: string) => void;
//   onSubmitQuestion: () => void;
// }

// const SlidingChatPanel = ({
//   question,
//   callIds,
//   onQuestionChange,
//   onAddCallId,
//   onRemoveCallId,
//   onSubmitQuestion
// }: SlidingChatPanelProps) => {
//   const [callIdInput, setCallIdInput] = useState('');

//   const handleAddCallId = () => {
//     if (callIdInput.trim()) {
//       onAddCallId(callIdInput.trim());
//       setCallIdInput('');
//     }
//   };

//   const addSampleCallId = (callId: string) => {
//     onAddCallId(callId);
//   };

//   // Renamed from useQuestion to handleQuestionSelect to avoid React Hook naming convention
//   const handleQuestionSelect = (sampleQuestion: string) => {
//     onQuestionChange(sampleQuestion);
//   };

//   return (
//     <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
//       <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//         <h2 className="text-xl font-semibold text-gray-800">Input</h2>
//       </div>

//       <div className="p-6 flex-1 overflow-y-auto">
//         <div className="mb-6">
//           <label htmlFor="question" className="block mb-2 font-medium text-gray-700">
//             Question:
//           </label>
//           <textarea
//             id="question"
//             value={question}
//             onChange={(e) => onQuestionChange(e.target.value)}
//             placeholder="Enter your question here..."
//             className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500"
//             rows={4}
//           />
//         </div>

//         <div className="mb-6">
//           <label className="block mb-2 font-medium text-gray-700">
//             Call IDs:
//           </label>
//           <div className="flex gap-2 mb-3">
//             <input
//               type="text"
//               value={callIdInput}
//               onChange={(e) => setCallIdInput(e.target.value)}
//               placeholder="Enter call ID (e.g., 122, 123)"
//               className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500"
//             />
//             <button
//               onClick={handleAddCallId}
//               className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
//             >
//               Add
//             </button>
//           </div>

//           <div className="max-h-[150px] overflow-y-auto">
//             {callIds.map((callId) => (
//               <div
//                 key={callId}
//                 className="flex justify-between items-center p-2 mb-2 bg-red-50 rounded-md text-sm"
//               >
//                 <span>Call {callId}</span>
//                 <button
//                   onClick={() => onRemoveCallId(callId)}
//                   className="text-gray-500 hover:text-gray-700 p-1 rounded"
//                 >
//                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <line x1="18" y1="6" x2="6" y2="18"></line>
//                     <line x1="6" y1="6" x2="18" y2="18"></line>
//                   </svg>
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="mb-6">
//           <h3 className="font-medium text-gray-700 mb-2">Sample Call IDs:</h3>
//           <div className="flex flex-wrap gap-2">
//             <button
//               onClick={() => addSampleCallId('122')}
//               className="bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1 rounded-md text-sm transition-colors"
//             >
//               Call 122
//             </button>
//             <button
//               onClick={() => addSampleCallId('123')}
//               className="bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1 rounded-md text-sm transition-colors"
//             >
//               Call 123
//             </button>
//             <button
//               onClick={() => addSampleCallId('124')}
//               className="bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1 rounded-md text-sm transition-colors"
//             >
//               Call 124
//             </button>
//           </div>
//         </div>

//         <div className="mb-6">

//             <div className="flex flex-wrap gap-2">
//             <button
//                 onClick={() => handleQuestionSelect("Can you summarize the main issue discussed in the meeting?")}
//                 className="bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1 rounded-md text-sm transition-colors"
//             >
//                 Meeting Summary
//             </button>
//             <button
//                 onClick={() => handleQuestionSelect("What resolution did the agent provide for the login error?")}
//                 className="bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1 rounded-md text-sm transition-colors"
//             >
//                 Tech Resolution
//             </button>
//             <button
//                 onClick={() => handleQuestionSelect("What are the next steps agreed upon in the call?")}
//                 className="bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1 rounded-md text-sm transition-colors"
//             >
//                 Action Items
//             </button>
//             <button
//                 onClick={() => handleQuestionSelect("Was there any mention of deadlines or delivery dates?")}
//                 className="bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1 rounded-md text-sm transition-colors"
//             >
//                 Deadlines
//             </button>
//             <button
//                 onClick={() => handleQuestionSelect("What did the customer say about their previous experience?")}
//                 className="bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1 rounded-md text-sm transition-colors"
//             >
//                 Customer Feedback
//             </button>
//             <button
//                 onClick={() => handleQuestionSelect("Did the agent confirm the refund process?")}
//                 className="bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1 rounded-md text-sm transition-colors"
//             >
//                 Refund Confirmation
//             </button>
//             <button
//                 onClick={() => handleQuestionSelect("Who will be responsible for the follow-up?")}
//                 className="bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1 rounded-md text-sm transition-colors"
//             >
//                 Responsible Person
//             </button>
//             <button
//                 onClick={() => handleQuestionSelect("Was there any confusion or disagreement during the meeting?")}
//                 className="bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1 rounded-md text-sm transition-colors"
//             >
//                 Disagreements
//             </button>
//             </div>


//         </div>

//         <button
//           onClick={onSubmitQuestion}
//           className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
//         >
//           Submit Question
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SlidingChatPanel;



'use client';

import { useState } from 'react';

interface SlidingChatPanelProps {
  question: string;
  callIds: string[];
  onQuestionChange: (question: string) => void;
  onAddCallId: (callId: string) => void;
  onRemoveCallId: (callId: string) => void;
  onSubmitQuestion: () => void;
}

const SlidingChatPanel = ({
  question = '',
  callIds = [],
  onQuestionChange,
  onAddCallId,
  onRemoveCallId,
  onSubmitQuestion
}: SlidingChatPanelProps) => {
  const [callIdInput, setCallIdInput] = useState('');

  const handleAddCallId = () => {
    if (callIdInput.trim()) {
      onAddCallId(callIdInput.trim());
      setCallIdInput('');
    }
  };

  const addLatestCall = () => {
    onAddCallId('163');
  };

  const handleQuestionSelect = (sampleQuestion: string) => {
    onQuestionChange(sampleQuestion);
  };

  const predefinedQuestions = [
    {
      text: "What was the issue solved in this call?",
      label: "Issue Solved"
    },
    {
      text: "Was the issue resolved?",
      label: "Resolution Status"
    },
    {
      text: "What was the takeaway from this call?",
      label: "Key Takeaways"
    }
  ];

  return (
    <div className="flex-1 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-medium text-gray-900">Call Analysis</h2>
        <p className="text-gray-500 mt-1 text-sm">Ask questions about your call recordings</p>
      </div>

      <div className="p-6 flex-1 overflow-y-auto space-y-6">
        {/* Question Input */}
        <div className="space-y-3">
          <label htmlFor="question" className="block text-sm font-medium text-gray-900">
            Your Question
          </label>
          <div className="relative">
            <textarea
              id="question"
              value={question}
              onChange={(e) => onQuestionChange(e.target.value)}
              placeholder="What would you like to know about the call?"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
              rows={4}
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              {question?.length || 0} characters
            </div>
          </div>
        </div>

        {/* Predefined Questions */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-900">Quick Questions</h3>
          <div className="grid gap-3">
            {predefinedQuestions.map((q, index) => (
              <button
                key={index}
                onClick={() => handleQuestionSelect(q.text)}
                className="p-3 bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-lg transition-colors text-left"
              >
                <div className="font-medium text-gray-900 mb-1">{q.label}</div>
                <div className="text-sm text-gray-600">{q.text}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Call IDs Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-900">Call IDs</h3>
          
          {/* Add Call ID */}
          <div className="flex gap-3">
            <input
              type="text"
              value={callIdInput}
              onChange={(e) => setCallIdInput(e.target.value)}
              placeholder="Enter call ID (e.g., 122, 123)"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            />
            <button
              onClick={handleAddCallId}
              className="bg-purple-500 hover:bg-purple-600 text-white font-medium px-4 py-3 rounded-lg transition-colors"
            >
              Add
            </button>
          </div>

          {/* Latest Call Button */}
          <button
            onClick={addLatestCall}
            className="w-full p-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors"
          >
            Latest Call
          </button>

          {/* Call IDs List */}
          {callIds && callIds.length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {callIds.map((callId) => (
                <div
                  key={callId}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <span className="font-medium text-gray-900">Call {callId}</span>
                  <button
                    onClick={() => onRemoveCallId(callId)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={onSubmitQuestion}
          disabled={!question?.trim() || !callIds?.length}
          className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          {!question?.trim() || !callIds?.length 
            ? "Enter a question and select call IDs" 
            : "Analyze Calls"
          }
        </button>
      </div>
    </div>
  );
};

export default SlidingChatPanel;