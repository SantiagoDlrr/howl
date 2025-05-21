// sr/
'use client'
import { useState } from "react";


// ESTA MAL ESTO DEBERÍA IMPORTAR DEL MODEL QUE YA HICE
interface ClientInsight {
  clientName: string;
  lastContact: Date;
  summary: string;
  keyEmotions: string[];
  commonTopics: string[];
  recommendation: string;
  reports: {
    id: string;
    name: string;
    date: Date;
    duration: number;
    report: {
      sentiment: string;
      rating: number;
      summary: string;
      feedback: string;
      keyTopics: string[];
      emotions: string[];
    };
    transcript?: {
      speaker: string;
      text: string;
    }[];
  }[];
}

export default function EnhancedClientInsight({ clientInsight }: { clientInsight: ClientInsight }) {
  const [selectedReport, setSelectedReport] = useState<ClientInsight['reports'][number] | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  // console.log(clientInsight);
  // console.log(clientInsight.reports.length);
  // If no client insight data is available yet
  if (!clientInsight) {
    return (
      <div className="p-4 rounded-lg border border-gray-200 bg-white h-full">
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No client data available yet</p>
        </div>
      </div>
    );
  }

  const handleReportClick = (report: ClientInsight['reports'][number]) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  const closeReportModal = () => {
    setShowReportModal(false);
  };

  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get sentiment color
  const getSentimentColor = (sentiment: string) => {
    if (!sentiment) return 'text-gray-500';
    switch (sentiment.toLowerCase()) {
      case 'positivo':
      case 'positive':
        return 'text-green-600';
      case 'negativo':
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  // Get rating color
  const getRatingColor = (rating: number) => {
    if (rating >= 80) return 'text-green-600';
    if (rating >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get rating emoji
  const getRatingEmoji = (rating: number) => {
    if (rating >= 80) return '😃';
    if (rating >= 60) return '😐';
    return '😞';
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow overflow-hidden">
      {/* Header with client name and last contact */}
      <div className="bg-indigo-50 p-4 border-b border-indigo-100">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-indigo-800">
            {clientInsight.clientName}
          </h2>
          <span className="text-sm text-indigo-600">
            Último contacto: {formatDate(clientInsight.lastContact.toISOString())}
          </span>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Summary section */}
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-700 mb-2">Resumen</h3>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md border border-gray-200">
             {clientInsight.summary}
          </p>
        </div>

        {/* Two-column layout for emotions and topics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Key Emotions */}
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-2">Emociones Principales</h3>
            <div className="flex flex-wrap gap-2">
              {clientInsight.keyEmotions.map((emotion, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium"
                >
                  {emotion}
                </span>
              ))}
            </div>
          </div>

          {/* Common Topics */}
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-2">Temas Comunes</h3>
            <div className="flex flex-wrap gap-2">
              {clientInsight.commonTopics.map((topic, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendation section */}
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-700 mb-2">Recomendación</h3>
          <div className="bg-green-50 p-4 rounded-md border border-green-200">
            <div className="prose prose-sm max-w-none text-gray-700">
              {clientInsight.recommendation.split('\n\n').map((paragraph, idx) => {
                // Check if it's a header
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return <h4 key={idx} className="font-semibold text-green-800 mt-3">{paragraph.replace(/\*\*/g, '')}</h4>;
                }

                // List items
                if (paragraph.includes('*   ')) {
                  const items = paragraph.split('*   ').filter(Boolean);
                  return (
                    <ul key={idx} className="list-disc pl-5 mt-2">
                      {items.map((item, itemIdx) => (
                        <li key={itemIdx} className="text-sm">{item}</li>
                      ))}
                    </ul>
                  );
                }

                // Regular paragraph
                return <p key={idx} className="text-sm">{paragraph}</p>;
              })}
            </div>
          </div>
        </div>

        {/* Reports section */}
        <div>
          <h3 className="text-md font-medium text-gray-700 mb-2">Reportes ({clientInsight.reports.length})</h3>
          <div className="space-y-2">
            {clientInsight.reports.map((report) => (
              <div
                key={report.id}
                onClick={() => handleReportClick(report)}
                className="flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-full p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12-2a2 2 0 00-2 2v8a2 2 0 002 2h2a2 2 0 002-2V6a2 2 0 00-2-2h-2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{report.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(report.date.toISOString())} • {report.duration}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`text-xs font-medium ${getSentimentColor(report.report.sentiment)} mr-2`}>
                    {report.report.sentiment}
                  </span>
                  <span className={`text-xs font-medium ${getRatingColor(report.report.rating)}`}>
                    {report.report.rating}/100 {getRatingEmoji(report.report.rating)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Report modal */}
      {showReportModal && selectedReport && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeReportModal}></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden">
              <div className="flex justify-between items-center border-b p-4">
                <h2 className="text-lg font-semibold text-gray-800">{selectedReport.name}</h2>
                <button onClick={closeReportModal} className="text-gray-500 hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4 overflow-y-auto max-h-[calc(80vh-8rem)]">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Fecha</p>
                    <p className="text-sm">{formatDate(selectedReport.date.toISOString())}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Duración</p>
                    <p className="text-sm">{selectedReport.duration}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500">Resumen</p>
                  <p className="text-sm bg-gray-50 p-2 rounded mt-1">{selectedReport.report.summary}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500">Feedback</p>
                  <p className="text-sm bg-gray-50 p-2 rounded mt-1">{selectedReport.report.feedback}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Temas Clave</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedReport.report.keyTopics.map((topic, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Emociones</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedReport.report.emotions.map((emotion, index) => (
                        <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                          {emotion}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Sentimiento</p>
                    <p className={`text-sm font-medium ${getSentimentColor(selectedReport.report.sentiment)}`}>
                      {selectedReport.report.sentiment}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Rating</p>
                    <p className={`text-sm font-medium ${getRatingColor(selectedReport.report.rating)}`}>
                      {selectedReport.report.rating}/100 {getRatingEmoji(selectedReport.report.rating)}
                    </p>
                  </div>
                </div>

                {selectedReport.transcript && (
                  <div className="mt-4 border-t pt-4">
                    <p className="text-sm font-medium text-gray-500 mb-2">Transcripción</p>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {selectedReport.transcript.map((entry, index) => (
                        <div key={index} className={`p-2 rounded ${entry.speaker === 'user' ? 'bg-blue-50' : 'bg-gray-50'}`}>
                          <p className="text-xs font-medium text-gray-600">{entry.speaker}</p>
                          <p className="text-sm">{entry.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="border-t p-4 flex justify-end">
                <button
                  onClick={closeReportModal}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}