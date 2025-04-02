// import React from 'react';
// import { ChevronUp, User } from 'lucide-react';

// export const aiAssistant: React.FC = () => {
//   return (
//     <div className="bg-white flex flex-col h-full">
//       <div className="p-4 border-b border-t border-gray-200 flex justify-between items-center">
//         <h2 className="text-lg font-medium text-gray-800">Asistente Howl AI</h2>
//         <div className="h-3 w-3 rounded-full bg-green-400" title="Disponible"></div>
//       </div>

//       <div className="flex-1 p-4 flex flex-col justify-between">
//         <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
//           <div className="bg-purple-100 p-4 rounded-full mb-4">
//             <User className="w-8 h-8 text-purple-500" />
//           </div>
//           <p className="text-sm mb-4 max-w-xs">
//             Escribe una pregunta y nuestra IA resumirá al instante los puntos clave, recordará detalles, redactará contenido y descubrirá información a partir de la transcripción.
//           </p>
//         </div>

//         <div className="mt-auto">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Pregúntame algo..."
//               className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//             />
//             <button className="absolute inset-y-0 right-0 flex items-center px-3 text-purple-500">
//               <ChevronUp className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
import React, { useState } from 'react';
import { ChevronUp, User } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AiAssistantProps {
  selectedFileId: number | null; // or string | null, depending on your backend
}

export const aiAssistant: React.FC<AiAssistantProps> = ({ selectedFileId }) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  /**
   * Handle sending the user’s question to the backend chat endpoint.
   */
  const handleSend = async () => {
    if (!inputValue.trim()) return; // no empty questions
    if (!selectedFileId) {
      alert('No call file selected!');
      return;
    }

    // Add the user’s message to local state for display
    const userMsg: Message = { role: 'user', content: inputValue };
    setMessages((prev) => [...prev, userMsg]);

    // Prepare JSON for the backend
    const payload = {
      transcript_id: selectedFileId.toString(), 
      messages: [
        {
          role: 'user',
          content: inputValue,
        },
      ],
    };

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Chat request failed: ${response.statusText}`);
      }
      const data = await response.json();

      // The backend returns { assistant_message: string }
      const aiReply: Message = {
        role: 'assistant',
        content: data.assistant_message || '(No reply)',
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (error) {
      console.error('Error calling /chat endpoint:', error);
      // Optionally show an error in the message list
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Error: Unable to get AI response.' },
      ]);
    } finally {
      // Clear the input field
      setInputValue('');
    }
  };

  return (
    <div className="bg-white flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-t border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-800">Asistente Howl AI</h2>
        <div className="h-3 w-3 rounded-full bg-green-400" title="Disponible"></div>
      </div>

      {/* Messages Display */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <div className="bg-purple-100 p-4 rounded-full mb-4">
              <User className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-sm mb-4 max-w-xs">
              Escribe una pregunta y nuestra IA resumirá al instante los puntos clave,
              recordará detalles, redactará contenido y descubrirá información a partir de la transcripción.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-md text-sm ${
                  msg.role === 'assistant'
                    ? 'bg-gray-100 text-gray-700 self-start'
                    : 'bg-purple-100 text-purple-900 self-end'
                }`}
                style={{ maxWidth: '80%', marginLeft: msg.role === 'assistant' ? 0 : 'auto' }}
              >
                <strong>{msg.role === 'assistant' ? 'Asistente' : 'Tú'}:</strong> {msg.content}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Pregúntame algo..."
            className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
          />
          <button
            className="absolute inset-y-0 right-0 flex items-center px-3 text-purple-500"
            onClick={handleSend}
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
