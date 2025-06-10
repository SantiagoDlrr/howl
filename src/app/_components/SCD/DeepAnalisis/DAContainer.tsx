// // DAContainer.tsx
// 'use client';
// import { useEffect, useState } from 'react';
// import SlidingChatPanel from './slidingChatPannel';
// import RagResponsePanel from './ragResponsePannel';
// import { MessageSquare, Sparkles } from 'lucide-react';
// import type { FileData, Report, TranscriptEntry } from '@/app/utils/types/main';


// interface Source {
//   call_id: string;
//   text: string;
//   score: number;
// }

// interface ResponseData {
//   answer: string;
//   sources: Source[];
// }

// const DAContainer = () => {
//   const [callIds, setCallIds] = useState<string[]>([]);
//   const [question, setQuestion] = useState('');
//   const [responseData, setResponseData] = useState<ResponseData | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // NEW STATE: To hold the list of available calls from sessionStorage
//   const [availableCallsFromContext, setAvailableCallsFromContext] = useState<{ id: string; name: string }[]>([]);

//   // Load saved data from localStorage and sessionStorage on component mount
//   useEffect(() => {
//     // Load DAContainer's specific data from localStorage
//     const savedCallIds = localStorage.getItem('ragChatCallIds');
//     const savedResponse = localStorage.getItem('ragChatResponse');
//     const savedQuestion = localStorage.getItem('ragChatQuestion');

//     if (savedCallIds) {
//       setCallIds(JSON.parse(savedCallIds));
//     }

//     if (savedResponse) {
//       setResponseData(JSON.parse(savedResponse));
//     }

//     if (savedQuestion) {
//       setQuestion(savedQuestion);
//     }

//     // NEW: Load files (calls) from MainPage's sessionStorage
//     if (typeof window !== 'undefined') { // Ensure running in a browser environment
//       const savedFiles = sessionStorage.getItem('howlx-files');
//       if (savedFiles) {
//         try {
//           const filesData: FileData[] = JSON.parse(savedFiles);
//           // Map FileData to the format expected by SlidingChatPanel: { id: string, name: string }
//           const mappedCalls = filesData.map(file => ({
//             id: file.id.toString(), // Convert number ID to string
//             name: file.name
//           }));
//           setAvailableCallsFromContext(mappedCalls);
//         } catch (e) {
//           console.error("Failed to parse 'howlx-files' from sessionStorage:", e);
//           // Optionally clear corrupted data or handle gracefully
//           // sessionStorage.removeItem('howlx-files');
//         }
//       }
//     }
//   }, []); // Empty dependency array means this runs once on mount

//   // Update localStorage when DAContainer's data changes
//   useEffect(() => {
//     localStorage.setItem('ragChatCallIds', JSON.stringify(callIds));
//   }, [callIds]);

//   useEffect(() => {
//     if (responseData) {
//       localStorage.setItem('ragChatResponse', JSON.stringify(responseData));
//     }
//   }, [responseData]);

//   useEffect(() => {
//     localStorage.setItem('ragChatQuestion', question);
//   }, [question]);

//   const handleAddCallId = (callId: string) => {
//     // Optional: You might want to validate if the callId exists in `availableCallsFromContext`
//     // to prevent adding arbitrary IDs if that's a requirement.
//     if (callId && !callIds.includes(callId)) {
//       setCallIds([...callIds, callId]);
//     }
//   };

//   const handleRemoveCallId = (callId: string) => {
//     setCallIds(callIds.filter(id => id !== callId));
//   };

//   const handleSubmitQuestion = async () => {
//     if (!question) {
//       setError("Please enter a question.");
//       return;
//     }

//     if (callIds.length === 0) {
//       setError("Please add at least one call ID.");
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     const requestData = {
//       question: question,
//       // call_ids: callIds // This array contains the string IDs for your API
//       call_ids: ['198']// This array contains the string IDs for your API

//     };

//     try {
//       const response = await fetch('https://howlx.adriangaona.dev/rag_chat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(requestData)
//       });

//       if (!response.ok) {
//         throw new Error(`Server responded with status: ${response.status}`);
//       }

//       const data = await response.json();
//       setResponseData(data);
//     } catch (error) {
//       setError(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
//       <div className="max-w-7xl mx-auto p-6">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="flex items-center justify-center gap-3 mb-4">
//             <div className="p-3 bg-gradient-to-br from-[#B351FF] to-[#9d44e8] rounded-2xl shadow-lg">
//               <Sparkles className="w-8 h-8 text-white" />
//             </div>
//             <h1 className="text-3xl font-bold bg-gradient-to-r from-[#B351FF] to-[#9d44e8] bg-clip-text text-transparent">
//               AI Q&A
//             </h1>
//           </div>
//           <p className="text-gray-600 text-lg max-w-2xl mx-auto">
//             Ask intelligent questions about your call recordings and get instant cited insights with a RAG powered AI
//           </p>
//         </div>

//         {/* Main Content */}
//         <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)] min-h-[700px]">
//           <SlidingChatPanel
//             question={question}
//             callIds={callIds}
//             onQuestionChange={setQuestion}
//             onAddCallId={handleAddCallId}
//             onRemoveCallId={handleRemoveCallId}
//             onSubmitQuestion={handleSubmitQuestion}
//             availableCalls={availableCallsFromContext} // Pass the data from sessionStorage
//           />

//           <RagResponsePanel
//             responseData={responseData}
//             isLoading={isLoading}
//             error={error}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DAContainer;


// DAContainer.tsx
'use client';
import { useEffect, useState } from 'react';
import SlidingChatPanel from './slidingChatPannel';
import RagResponsePanel from './ragResponsePannel';
import { MessageSquare, Sparkles } from 'lucide-react';
import type { CallLogEntry } from '@/app/utils/types/callLogTypes';
import type { UserRoleData } from '@/app/utils/services/userService';
import { getUserRole } from '@/app/utils/services/userService';
import { getCallLogs, getSupervisedConsultants } from '@/app/utils/services/callLogsService';

interface Source {
  call_id: string;
  text: string;
  score: number;
}

interface ResponseData {
  answer: string;
  sources: Source[];
}

// Transform CallLogEntry to the format expected by SlidingChatPanel
interface CallOption {
  id: string;
  name: string;
  callDate: string;
  client: string;
  clientCompany: string;
  category: string;
  rating: string;
}

const DAContainer = () => {
  const [callIds, setCallIds] = useState<string[]>([]);
  const [question, setQuestion] = useState('');
  const [responseData, setResponseData] = useState<ResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // User and call logs state
  const [callLogs, setCallLogs] = useState<CallLogEntry[]>([]);
  const [userRole, setUserRole] = useState<UserRoleData | null>(null);
  const [loadingCalls, setLoadingCalls] = useState<boolean>(true);
  const [callsError, setCallsError] = useState<string | null>(null);
  const [, setSupervisedConsultants] = useState<number[]>([]);

  // Available calls for the chat panel (latest 5 by default)
  const [availableCalls, setAvailableCalls] = useState<CallOption[]>([]);

  // Get user role
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        setLoadingCalls(true);
        console.log("Obteniendo rol de usuario...");
        
        const data = await getUserRole();
        console.log("Rol obtenido:", data);
        setUserRole(data);
        
        if (data.role === 'supervisor') {
          const consultants = await getSupervisedConsultants(Number(data.consultantId));
          setSupervisedConsultants(consultants);
        }
      } catch (err) {
        console.error('Error obteniendo rol de usuario:', err);
        setCallsError(err instanceof Error ? err.message : 'Error obteniendo rol de usuario');
        setLoadingCalls(false);
      }
    };

    void fetchUserRole();
  }, []);

  // Get call logs
  useEffect(() => {
    const fetchCallLogs = async () => {
      try {
        if (!userRole) return;
        
        setLoadingCalls(true);

        const data = await getCallLogs();
        setCallLogs(data);
        
        // Transform to CallOption format and get latest 5
        const transformedCalls: CallOption[] = data
          .sort((a, b) => new Date(b.callDate).getTime() - new Date(a.callDate).getTime()) // Sort by newest first
          .slice(0, 5) // Get latest 5
          .map(log => ({
            id: log.id.toString(),
            name: log.tittle || `Call with ${log.client || `${log.clientFirstName} ${log.clientLastName}`.trim()}`,
            callDate: log.callDate,
            client: log.client || `${log.clientFirstName} ${log.clientLastName}`.trim(),
            clientCompany: log.clientCompany,
            category: log.category,
            rating: log.rating
          }));
        
        setAvailableCalls(transformedCalls);
      } catch (err) {
        console.error('Error obteniendo logs de llamadas:', err);
        setCallsError(err instanceof Error ? err.message : 'Error obteniendo logs de llamadas');
      } finally {
        setLoadingCalls(false);
      }
    };

    if (userRole) {
      void fetchCallLogs();
    }
  }, [userRole]);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedCallIds = localStorage.getItem('ragChatCallIds');
    const savedResponse = localStorage.getItem('ragChatResponse');
    const savedQuestion = localStorage.getItem('ragChatQuestion');

    if (savedCallIds) {
      setCallIds(JSON.parse(savedCallIds));
    }

    if (savedResponse) {
      setResponseData(JSON.parse(savedResponse));
    }

    if (savedQuestion) {
      setQuestion(savedQuestion);
    }
  }, []);

  // Update localStorage when data changes
  useEffect(() => {
    localStorage.setItem('ragChatCallIds', JSON.stringify(callIds));
  }, [callIds]);

  useEffect(() => {
    if (responseData) {
      localStorage.setItem('ragChatResponse', JSON.stringify(responseData));
    }
  }, [responseData]);

  useEffect(() => {
    localStorage.setItem('ragChatQuestion', question);
  }, [question]);

  // Handle search functionality - search through all call logs
  const handleSearchCalls = (searchTerm: string): CallOption[] => {
    if (!searchTerm.trim()) {
      // Return latest 5 calls when no search term
      return callLogs
        .sort((a, b) => new Date(b.callDate).getTime() - new Date(a.callDate).getTime())
        .slice(0, 5)
        .map(log => ({
          id: log.id.toString(),
          name: log.tittle || `Call with ${log.client || `${log.clientFirstName} ${log.clientLastName}`.trim()}`,
          callDate: log.callDate,
          client: log.client || `${log.clientFirstName} ${log.clientLastName}`.trim(),
          clientCompany: log.clientCompany,
          category: log.category,
          rating: log.rating
        }));
    }

    const filtered = callLogs.filter(log => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (log.tittle && log.tittle.toLowerCase().includes(searchLower)) ||
        (log.client && log.client.toLowerCase().includes(searchLower)) ||
        (log.clientFirstName && log.clientFirstName.toLowerCase().includes(searchLower)) ||
        (log.clientLastName && log.clientLastName.toLowerCase().includes(searchLower)) ||
        (log.clientCompany && log.clientCompany.toLowerCase().includes(searchLower)) ||
        (log.category && log.category.toLowerCase().includes(searchLower)) ||
        (log.rating && log.rating.toLowerCase().includes(searchLower)) ||
        (log.summary && log.summary.toLowerCase().includes(searchLower)) ||
        (log.feedback && log.feedback.toLowerCase().includes(searchLower))
      );
    });

    return filtered
      .sort((a, b) => new Date(b.callDate).getTime() - new Date(a.callDate).getTime())
      .map(log => ({
        id: log.id.toString(),
        name: log.tittle || `Call with ${log.client || `${log.clientFirstName} ${log.clientLastName}`.trim()}`,
        callDate: log.callDate,
        client: log.client || `${log.clientFirstName} ${log.clientLastName}`.trim(),
        clientCompany: log.clientCompany,
        category: log.category,
        rating: log.rating
      }));
  };

  const handleAddCallId = (callId: string) => {
    if (callId && !callIds.includes(callId)) {
      setCallIds([...callIds, callId]);
    }
  };

  const handleRemoveCallId = (callId: string) => {
    setCallIds(callIds.filter(id => id !== callId));
  };

  const handleSubmitQuestion = async () => {
    if (!question) {
      setError("Please enter a question.");
      return;
    }

    if (callIds.length === 0) {
      setError("Please add at least one call ID.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const requestData = {
      question: question,
      call_ids: callIds
    };

    try {
      const response = await fetch('https://howlx.adriangaona.dev/rag_chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      setResponseData(data);
    } catch (error) {
      setError(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading states similar to CallLogsTable
  if (loadingCalls && !userRole) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-12">
        <div className="mb-6">
          <img 
            src="/images/loading.gif" 
            alt="Cargando rol de usuario..." 
            className="w-20 h-20 mx-auto"
          />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Cargando perfil de usuario...</h3>
        <p className="text-gray-500 mb-4">Obteniendo tu nivel de acceso y permisos.</p>
        <div className="flex items-center justify-center gap-2 text-sm text-[#B351FF]">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>Un momento por favor</span>
        </div>
      </div>
    );
  }

  if (loadingCalls) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-12">
        <div className="mb-6">
          <img 
            src="/images/loading.gif" 
            alt="Cargando registros de llamadas..." 
            className="w-20 h-20 mx-auto"
          />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Cargando registros de llamadas...</h3>
        <p className="text-gray-500 mb-4">Obteniendo datos de todas las interacciones.</p>
        <div className="flex items-center justify-center gap-2 text-sm text-[#B351FF]">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>Preparando el AI Q&A</span>
        </div>
      </div>
    );
  }

  if (callsError) {
    return <div className="w-full p-20 text-center text-red-500">Error: {callsError}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-[#B351FF] to-[#9d44e8] rounded-2xl shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#B351FF] to-[#9d44e8] bg-clip-text text-transparent">
              AI Q&A
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Ask intelligent questions about your call recordings and get instant cited insights with a RAG powered AI
          </p>
        </div>

        {/* User Role Indicator */}
        {userRole && (
          <div className="bg-blue-50 p-3 rounded-md mb-6 max-w-7xl mx-auto">
            <span className="font-semibold">Rol actual:</span> {
              userRole.role === 'administrator' ? 'Administrador' :
              userRole.role === 'supervisor' ? 'Supervisor' : 'Consultor'
            }
            {userRole.role !== 'administrator' && (
              <span className="ml-2 text-gray-500">
                (Mostrando tus llamadas según tu nivel de acceso)
              </span>
            )}
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-250px)] min-h-[700px]">
          <SlidingChatPanel
            question={question}
            callIds={callIds}
            onQuestionChange={setQuestion}
            onAddCallId={handleAddCallId}
            onRemoveCallId={handleRemoveCallId}
            onSubmitQuestion={handleSubmitQuestion}
            availableCalls={availableCalls}
            onSearchCalls={handleSearchCalls}
            allCallLogs={callLogs}
          />

          <RagResponsePanel
            responseData={responseData}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default DAContainer;