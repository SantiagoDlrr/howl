'use client'
import { useState } from "react";
import { X, MessageSquare, ListChecks, SmilePlus, HeartPulse, FileText, User, Calendar, Clock } from "lucide-react";

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

  // Función para manejar el click en el backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeReportModal();
    }
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
    if (rating >= 8) return 'text-green-600';
    if (rating >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get rating emoji
  const getRatingEmoji = (rating: number) => {
    if (rating >= 8) return '😃';
    if (rating >= 6) return '😐';
    return '😞';
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow overflow-hidden">
      
      {/* Header with client name and last contact */}
      <div className="bg-indigo-600 p-4 text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {clientInsight.clientName}
          </h2>
          <span className="text-sm text-indigo-100">
            Último contacto: {formatDate(clientInsight.lastContact.toISOString())}
          </span>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto p-4">
        
        {/* Client Information */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            Información del Cliente
          </h3>
          <div className="text-sm">
            <span className="text-gray-500">Cliente:</span>
            <span className="ml-2 font-medium">{clientInsight.clientName}</span>
          </div>
        </div>

        {/* Summary section */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Resumen
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
             {clientInsight.summary}
          </p>
        </div>

        {/* Two-column layout for emotions and topics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          
          {/* Key Emotions */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center gap-2">
              <SmilePlus className="w-5 h-5 text-indigo-600" />
              Emociones Principales
            </h3>
            <div className="flex flex-wrap gap-2">
              {clientInsight.keyEmotions.map((emotion, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium border border-purple-200"
                >
                  {emotion}
                </span>
              ))}
            </div>
          </div>

          {/* Common Topics */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-indigo-600" />
              Temas Comunes
            </h3>
            <div className="flex flex-wrap gap-2">
              {clientInsight.commonTopics.map((topic, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium border border-blue-200"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendation section */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-indigo-600" />
            Recomendación
          </h3>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="prose prose-sm max-w-none text-gray-700">
              {clientInsight.recommendation.split('\n\n').map((paragraph, idx) => {
                // Check if it's a header
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return <h4 key={idx} className="font-semibold text-green-800 mt-3 mb-2">{paragraph.replace(/\*\*/g, '')}</h4>;
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
                return <p key={idx} className="text-sm leading-relaxed">{paragraph}</p>;
              })}
            </div>
          </div>
        </div>

        {/* Reports section */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            Reportes ({clientInsight.reports.length})
          </h3>
          <div className="space-y-3">
            {clientInsight.reports.map((report) => (
              <div
                key={report.id}
                onClick={() => handleReportClick(report)}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-lg p-2">
                    <MessageSquare className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{report.name}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(report.date.toISOString())}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {report.duration}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    report.report.sentiment?.toLowerCase() === 'positivo' || report.report.sentiment?.toLowerCase() === 'positive'
                      ? 'bg-green-100 text-green-800'
                      : report.report.sentiment?.toLowerCase() === 'negativo' || report.report.sentiment?.toLowerCase() === 'negative'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {report.report.sentiment}
                  </span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getRatingColor(report.report.rating)} ${
                    report.report.rating >= 8 ? 'bg-green-100' :
                    report.report.rating >= 6 ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    {report.report.rating}/10 {getRatingEmoji(report.report.rating)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Responsive Report Modal */}
      {showReportModal && selectedReport && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={handleBackdropClick}></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
              
              {/* Header del Modal - Fixed */}
              <div className="flex-shrink-0 flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 bg-white">
                <div className="min-w-0 flex-1 mr-4">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 truncate">
                    {selectedReport.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(selectedReport.date.toISOString())}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {selectedReport.duration}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      selectedReport.report.sentiment?.toLowerCase() === 'positivo' || selectedReport.report.sentiment?.toLowerCase() === 'positive'
                        ? 'bg-green-100 text-green-800'
                        : selectedReport.report.sentiment?.toLowerCase() === 'negativo' || selectedReport.report.sentiment?.toLowerCase() === 'negative'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedReport.report.sentiment}
                    </span>
                  </div>
                </div>
                <button
                  onClick={closeReportModal}
                  className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                </button>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  
                  {/* Summary and Feedback - Responsive Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    
                    {/* Summary */}
                    {selectedReport.report.summary && (
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-indigo-600" />
                          Resumen
                        </h3>
                        <div className="max-h-40 overflow-y-auto">
                          <p className="text-sm text-gray-600 leading-relaxed">{selectedReport.report.summary}</p>
                        </div>
                      </div>
                    )}

                    {/* Feedback */}
                    {selectedReport.report.feedback && (
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                          <MessageSquare className="w-5 h-5 text-indigo-600" />
                          Retroalimentación
                        </h3>
                        <div className="max-h-40 overflow-y-auto">
                          <p className="text-sm text-gray-600 leading-relaxed">{selectedReport.report.feedback}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Topics and Emotions - Responsive Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    
                    {/* Key Topics */}
                    {selectedReport.report.keyTopics && selectedReport.report.keyTopics.length > 0 && (
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                          <ListChecks className="w-5 h-5 text-indigo-600" />
                          Temas Clave
                        </h3>
                        <div className="max-h-32 overflow-y-auto">
                          <div className="flex flex-wrap gap-2">
                            {selectedReport.report.keyTopics.map((topic, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium border border-blue-200">
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Emotions */}
                    {selectedReport.report.emotions && selectedReport.report.emotions.length > 0 && (
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                          <SmilePlus className="w-5 h-5 text-indigo-600" />
                          Emociones
                        </h3>
                        <div className="max-h-32 overflow-y-auto">
                          <div className="flex flex-wrap gap-2">
                            {selectedReport.report.emotions.map((emotion, index) => (
                              <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium border border-purple-200">
                                {emotion}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                      <HeartPulse className="w-5 h-5 text-indigo-600" />
                      Rating
                    </h3>
                    <p className={`text-sm font-medium ${getRatingColor(selectedReport.report.rating)}`}>
                      {selectedReport.report.rating}/100 {getRatingEmoji(selectedReport.report.rating)}
                    </p>
                  </div>

                  {/* Transcript - With enhanced scrolling */}
                  {selectedReport.transcript && selectedReport.transcript.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-indigo-600" />
                        Transcripción
                      </h3>
                      <div className="border border-gray-200 rounded-lg max-h-64 sm:max-h-80 overflow-y-auto bg-gray-50">
                        <div className="p-3 space-y-3">
                          {selectedReport.transcript.map((entry, index) => (
                            <div key={index} className={`p-3 rounded-lg border ${
                              entry.speaker === 'user' 
                                ? 'bg-blue-50 border-blue-200 ml-4' 
                                : 'bg-white border-gray-200 mr-4'
                            }`}>
                              <p className="text-xs font-medium text-gray-600 mb-1 uppercase tracking-wide">
                                {entry.speaker}
                              </p>
                              <p className="text-sm text-gray-800 leading-relaxed">
                                {entry.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500 text-center">
                        {selectedReport.transcript.length} mensajes en la conversación
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Footer del Modal - Fixed */}
              <div className="flex-shrink-0 border-t border-gray-200 p-4 sm:p-6 bg-gray-50">
                <div className="flex justify-end">
                  <button
                    onClick={closeReportModal}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}