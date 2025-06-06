'use client'
import { useState } from "react";
import { X, MessageSquare, ListChecks, SmilePlus, HeartPulse, FileText, User, Calendar, Clock } from "lucide-react";

// ESTA MAL ESTO DEBERÍA IMPORTAR DEL MODEL QUE YA HICE
// Assuming ClientInsight is defined elsewhere or this is its definition for this component
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

// NEW INTERFACE: Define the type for the data passed to onCallSelect
interface SelectedCallData {
  id: string;
  name: string;
  date: Date;
  duration: number;
  clientName: string;
  report: ClientInsight['reports'][number]['report'];
}

export default function EnhancedClientInsight({
  clientInsight,
  onCallSelect
}: {
  clientInsight: ClientInsight;
  onCallSelect?: (callData: SelectedCallData) => void; // FIX: Changed 'any' to SelectedCallData
}) {
  const [selectedReport, setSelectedReport] = useState<ClientInsight['reports'][number] | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  // If no client insight data is available yet
  if (!clientInsight) {
    return (
      <div className="p-6 rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm h-full shadow-sm">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#B351FF]/20 to-purple-200/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-[#B351FF]" />
            </div>
            <p className="text-gray-500 font-medium">No hay datos del cliente disponibles</p>
            <p className="text-gray-400 text-sm">Inicia una conversación para obtener insights</p>
          </div>
        </div>
      </div>
    );
  }

  const handleReportClick = (report: ClientInsight['reports'][number]) => {
    setSelectedReport(report);
    setShowReportModal(true);

    // If onCallSelect is provided, call it with the report data
    if (onCallSelect) {
      onCallSelect({
        id: report.id,
        name: report.name,
        date: report.date,
        duration: report.duration,
        clientName: clientInsight.clientName,
        report: report.report
      });
    }
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

  // REMOVED: getSentimentColor function as it was unused per lint warning
  // const getSentimentColor = (sentiment: string) => {
  //   if (!sentiment) return 'text-gray-500';
  //   switch (sentiment.toLowerCase()) {
  //     case 'positivo':
  //     case 'positive':
  //       return 'text-green-600';
  //     case 'negativo':
  //     case 'negative':
  //       return 'text-red-600';
  //     default:
  //       return 'text-yellow-600';
  //   }
  // };

  // Get rating color
  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-600';
    if (rating >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get rating emoji
  // const getRatingEmoji = (rating: number) => {
  //   if (rating >= 8) return '😃';
  //   if (rating >= 6) return '😐';
  //   return '😞';
  // };

  return (
    <div className="flex flex-col h-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">

      {/* Header with client name and last contact */}
      <div className="bg-gradient-to-r from-[#B351FF] to-[#9d44e8] p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold mb-1">
              {clientInsight.clientName}
            </h2>
            <span className="text-sm text-purple-100 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Último contacto: {formatDate(clientInsight.lastContact.toISOString())}
            </span>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto p-6">

        {/* Client Information */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-xl p-6 mb-6 border border-purple-200/50">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-[#B351FF]" />
            Información del Cliente
          </h3>
          <div className="text-sm">
            <span className="text-gray-500">Cliente:</span>
            <span className="ml-2 font-medium">{clientInsight.clientName}</span>
          </div>
        </div>

        {/* Summary section */}
        <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 mb-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#B351FF]" />
            Resumen
          </h3>
          <p className="text-gray-600 leading-relaxed">
             {clientInsight.summary}
          </p>
        </div>

        {/* Two-column layout for emotions and topics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {/* Key Emotions */}
          <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <SmilePlus className="w-5 h-5 text-[#B351FF]" />
              Emociones Principales
            </h3>
            <div className="flex flex-wrap gap-2">
              {clientInsight.keyEmotions.map((emotion, index) => (
                <span
                  key={index}
                  className="px-3 py-2 bg-gradient-to-r from-purple-100 to-purple-200/50 text-purple-800 rounded-xl text-sm font-medium border border-purple-200/50 hover:shadow-sm transition-all"
                >
                  {emotion}
                </span>
              ))}
            </div>
          </div>

          {/* Common Topics */}
          <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-[#B351FF]" />
              Temas Comunes
            </h3>
            <div className="flex flex-wrap gap-2">
              {clientInsight.commonTopics.map((topic, index) => (
                <span
                  key={index}
                  className="px-3 py-2 bg-gradient-to-r from-blue-100 to-blue-200/50 text-blue-800 rounded-xl text-sm font-medium border border-blue-200/50 hover:shadow-sm transition-all"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendation section */}
        <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 mb-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-[#B351FF]" />
            Recomendación
          </h3>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50/50 p-6 rounded-xl border border-green-200/50">
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
        <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#B351FF]" />
            Reportes ({clientInsight.reports.length})
          </h3>
          <div className="space-y-3">
            {clientInsight.reports.map((report) => (
              <div
                key={report.id}
                onClick={() => handleReportClick(report)}
                className="flex items-center justify-between p-4 border border-gray-200/50 rounded-xl cursor-pointer hover:bg-gradient-to-r hover:from-[#B351FF]/5 hover:to-purple-50/50 transition-all duration-200 hover:shadow-md hover:scale-[1.02] bg-white/40 backdrop-blur-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 bg-gradient-to-br from-[#B351FF]/20 to-purple-200/50 rounded-xl p-3">
                    <MessageSquare className="h-5 w-5 text-[#B351FF]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{report.name}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(report.date.toISOString())}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {report.duration} min
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-3 py-1.5 rounded-xl border ${
                    report.report.sentiment?.toLowerCase() === 'positivo' || report.report.sentiment?.toLowerCase() === 'positive'
                      ? 'bg-green-100/80 text-green-800 border-green-200/50'
                      : report.report.sentiment?.toLowerCase() === 'negativo' || report.report.sentiment?.toLowerCase() === 'negative'
                      ? 'bg-red-100/80 text-red-800 border-red-200/50'
                      : 'bg-yellow-100/80 text-yellow-800 border-yellow-200/50'
                  }`}>
                    {report.report.sentiment}
                  </span>
                  <span className={`text-xs font-medium px-3 py-1.5 rounded-xl border ${getRatingColor(report.report.rating)} ${
                    report.report.rating >= 8 ? 'bg-green-100/80 border-green-200/50' :
                    report.report.rating >= 6 ? 'bg-yellow-100/80 border-yellow-200/50' : 'bg-red-100/80 border-red-200/50'
                  }`}>
                    {report.report.rating}/10 
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fadeIn" onClick={handleBackdropClick}></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4 animate-scaleIn">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-6xl h-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col border border-gray-200/50">

              {/* Header del Modal - Fixed */}
              <div className="flex-shrink-0 flex justify-between items-center p-4 sm:p-6 bg-gradient-to-r from-[#B351FF] to-[#9d44e8] text-white rounded-t-2xl">
                <div className="min-w-0 flex-1 mr-4">
                  <h2 className="text-xl sm:text-2xl font-semibold truncate">
                    {selectedReport.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-purple-100">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(selectedReport.date.toISOString())}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {selectedReport.duration} min
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      selectedReport.report.sentiment?.toLowerCase() === 'positivo' || selectedReport.report.sentiment?.toLowerCase() === 'positive'
                        ? 'bg-green-100/20 text-green-200 border-green-300/30'
                        : selectedReport.report.sentiment?.toLowerCase() === 'negativo' || selectedReport.report.sentiment?.toLowerCase() === 'negative'
                        ? 'bg-red-100/20 text-red-200 border-red-300/30'
                        : 'bg-yellow-100/20 text-yellow-200 border-yellow-300/30'
                    }`}>
                      {selectedReport.report.sentiment}
                    </span>
                  </div>
                </div>
                <button
                  onClick={closeReportModal}
                  className="flex-shrink-0 p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">

                  {/* Summary and Feedback - Full Width Sections */}
                  <div className="space-y-4 sm:space-y-6">

                    {/* Summary */}
                    {selectedReport.report.summary && (
                      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 shadow-sm">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-[#B351FF]" />
                          Resumen
                        </h3>
                        <div className="max-h-40 overflow-y-auto">
                          <p className="text-gray-600 leading-relaxed">{selectedReport.report.summary}</p>
                        </div>
                      </div>
                    )}

                    {/* Feedback */}
                    {selectedReport.report.feedback && (
                      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 shadow-sm">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <MessageSquare className="w-5 h-5 text-[#B351FF]" />
                          Retroalimentación
                        </h3>
                        <div className="max-h-40 overflow-y-auto">
                          <p className="text-gray-600 leading-relaxed">{selectedReport.report.feedback}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Topics and Emotions - Responsive Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

                    {/* Key Topics */}
                    {selectedReport.report.keyTopics && selectedReport.report.keyTopics.length > 0 && (
                      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 shadow-sm">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <ListChecks className="w-5 h-5 text-[#B351FF]" />
                          Temas Clave
                        </h3>
                        <div className="max-h-32 overflow-y-auto">
                          <div className="flex flex-wrap gap-2">
                            {selectedReport.report.keyTopics.map((topic, index) => (
                              <span key={index} className="px-3 py-1.5 bg-blue-100/80 text-blue-800 rounded-xl text-sm font-medium border border-blue-200/50">
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Emotions */}
                    {selectedReport.report.emotions && selectedReport.report.emotions.length > 0 && (
                      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 shadow-sm">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <SmilePlus className="w-5 h-5 text-[#B351FF]" />
                          Emociones
                        </h3>
                        <div className="max-h-32 overflow-y-auto">
                          <div className="flex flex-wrap gap-2">
                            {selectedReport.report.emotions.map((emotion, index) => (
                              <span key={index} className="px-3 py-1.5 bg-purple-100/80 text-purple-800 rounded-xl text-sm font-medium border border-purple-200/50">
                                {emotion}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <HeartPulse className="w-5 h-5 text-[#B351FF]" />
                      Rating
                    </h3>
                    <p className={`font-medium ${getRatingColor(selectedReport.report.rating)}`}>
                      {selectedReport.report.rating}/10 
                    </p>
                  </div>

                  {/* Transcript - With enhanced scrolling */}
                  {selectedReport.transcript && selectedReport.transcript.length > 0 && (
                    <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 shadow-sm">
                      <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-[#B351FF]" />
                        Transcripción
                      </h3>
                      <div className="border border-gray-200/50 rounded-xl max-h-64 sm:max-h-80 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100/50">
                        <div className="p-4 space-y-3">
                          {selectedReport.transcript.map((entry, index) => (
                            <div key={index} className={`p-4 rounded-xl border backdrop-blur-sm ${
                              entry.speaker === 'user'
                                ? 'bg-gradient-to-r from-blue-50/80 to-blue-100/50 border-blue-200/50 ml-4'
                                : 'bg-white/80 border-gray-200/50 mr-4'
                            }`}>
                              <p className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
                                {entry.speaker}
                              </p>
                              <p className="text-sm text-gray-800 leading-relaxed">
                                {entry.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-gray-500 text-center bg-gray-50/50 rounded-lg py-2">
                        {selectedReport.transcript.length} mensajes en la conversación
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer del Modal - Fixed */}
              <div className="flex-shrink-0 border-t border-gray-200/50 p-4 sm:p-6 bg-gray-50/50 rounded-b-2xl">
                <div className="flex justify-end">
                  <button
                    onClick={closeReportModal}
                    className="px-6 py-3 text-gray-600 hover:text-[#B351FF] hover:bg-purple-50 rounded-xl transition-all duration-200 font-medium"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Global Styles for Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}