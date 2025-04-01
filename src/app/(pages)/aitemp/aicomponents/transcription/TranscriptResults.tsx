import React, { useState } from 'react';
import { TranscriptData } from '../../types/types';

interface TranscriptResultsProps {
  data: TranscriptData;
}

const TranscriptResults: React.FC<TranscriptResultsProps> = ({ data }) => {
  // Add tab state for switching between summary and transcript
  const [activeTab, setActiveTab] = useState<'summary' | 'transcript'>('summary');

  // Utility to get emotion color
  const getEmotionColor = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case 'happy':
      case 'excited':
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'sad':
      case 'negative':
      case 'angry':
        return 'bg-red-100 text-red-800';
      case 'neutral':
        return 'bg-blue-100 text-blue-800';
      case 'mixed':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Sections to display gard coded at the moment
  const sections = [
    {
      title: "Facturación Incorrecta",
      editIcon: true,
      meta: [
        { label: "Reporte de Llamada", value: "13 de Marzo" },
        { label: "Duración", value: "7 min" },
        { label: "Calificación", value: "80", badge: true }
      ]
    },
    {
      title: "Feedback",
      tag: "AI generated",
      content: `El agente atendió la llamada de manera cordial y mantuvo una actitud profesional durante toda la interacción. Desde el inicio, se 
mostró receptivo y ofreció una respuesta rápida al problema planteado por el cliente. Sin embargo, en lugar de validar de 
inmediato si el cargo adicional correspondía a un error o si existía un registro de activación autorizado, optó por generar una 
solicitud de revisión que tomaría 48 horas en resolverse. Aunque esta acción es un procedimiento válido, pudo haber explorado 
otras soluciones inmediatas que evitarían la espera del cliente. A pesar de este detalle, la llamada se gestionó con eficacia y el 
cliente recibió una respuesta clara sobre el proceso a seguir.`
    },
    {
      title: "Temas Clave",
      tag: "AI generated",
      content: [
        {
          bullet: "•",
          text: `Facturación incorrecta y cargos inesperados: El motivo principal de la llamada fue un cobro adicional en la factura del cliente, 
el cual no había sido reconocido por él. Esta situación generó preocupación y la necesidad de una explicación detallada sobre el 
origen del cargo, lo que llevó al agente a realizar una revisión en el sistema.`
        },
        {
          bullet: "•",
          text: `Revisión de cargos adicionales y transparencia en la facturación: El cliente expresó que no recordaba haber activado el 
servicio adicional, lo que planteó la posibilidad de un error administrativo o una activación involuntaria. En estos casos, es 
fundamental que el agente pueda proporcionar información clara y respaldada sobre cuándo y cómo se realizó la activación para 
evitar confusión o desconfianza.`
        }
      ]
    },
    {
      title: "Emociones",
      tag: "AI generated",
      content: [
        { number: "1.", text: "Cliente inicia con frustración leve." },
        { number: "2.", text: "Se mantiene cooperativo durante la llamada." },
        { number: "3.", text: "Finaliza con tranquilidad tras recibir una solución." }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Title and metadata section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold flex items-center">
            {sections[0].title}
            {sections[0].editIcon && (
              <button className="ml-2 text-gray-500 hover:text-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            )}
          </h1>
          <div className="flex items-center mt-1 text-sm text-gray-500">
            {sections[0].meta.map((item, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="mx-2">•</span>}
                <span>
                  {item.label}: {' '}
                  {item.badge ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {item.value}
                    </span>
                  ) : (
                    item.value
                  )}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className={`px-3 py-1 rounded-md ${getEmotionColor(data.emotion)} text-sm font-medium`}>
          {data.emotion}
        </div>
      </div>

      {/* Tabs for switching between summary and transcript */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('summary')}
            className={`${
              activeTab === 'summary'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            Summary
          </button>
          <button
            onClick={() => setActiveTab('transcript')}
            className={`${
              activeTab === 'transcript'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            Full Transcript
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'summary' ? (
        // Summary Tab Content
        <>
          {/* Content sections */}
          {sections.slice(1).map((section, idx) => (
            <div key={idx} className="border border-gray-100 rounded-lg overflow-hidden">
              <div className="flex items-center bg-white p-4">
                <div className="w-8 h-8 flex items-center justify-center bg-purple-200 text-purple-600 rounded-md mr-3">
                  <span className="text-xl">★</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{section.title}</h2>
                  {section.tag && (
                    <div className="text-xs text-gray-500">{section.tag}</div>
                  )}
                </div>
              </div>
              <div className="p-4 bg-white">
                {typeof section.content === 'string' ? (
                  <p className="text-gray-700">{section.content}</p>
                ) : Array.isArray(section.content) ? (
                  <div className="space-y-3">
                    {section.content.map((item, i) => (
                      <div key={i} className="flex">
                        {('bullet' in item) && (
                          <span className="mr-2 text-gray-700">{item.bullet}</span>
                        )}
                        {('number' in item) && (
                          <span className="mr-2 text-gray-700">{item.number}</span>
                        )}
                        <p className="text-gray-700">{item.text}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ))}

          {/* Key Phrases (aspects) from the original code */}
          {data.aspects && data.aspects.length > 0 && (
            <div className="border border-gray-100 rounded-lg overflow-hidden">
              <div className="flex items-center bg-white p-4">
                <div className="w-8 h-8 flex items-center justify-center bg-purple-200 text-purple-600 rounded-md mr-3">
                  <span className="text-xl">★</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Key Phrases</h2>
                  <div className="text-xs text-gray-500">AI generated</div>
                </div>
              </div>
              <div className="p-4 bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.aspects.map((aspect, idx) => {
                    let sentimentColor = 'bg-gray-100 text-gray-800';
                    if (aspect.sentiment === 'Positive')
                      sentimentColor = 'bg-green-100 text-green-800 border-green-200';
                    else if (aspect.sentiment === 'Negative')
                      sentimentColor = 'bg-red-100 text-red-800 border-red-200';
                    else if (aspect.sentiment === 'Mixed')
                      sentimentColor = 'bg-yellow-100 text-yellow-800 border-yellow-200';
                    else if (aspect.sentiment === 'Neutral')
                      sentimentColor = 'bg-blue-100 text-blue-800 border-blue-200';

                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border ${sentimentColor} text-sm`}
                      >
                        <div className="font-medium">{aspect.text}</div>
                        <div className="text-xs mt-1 opacity-75">{aspect.sentiment}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        // Full Transcript Tab Content
        <div className="border border-gray-100 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between bg-white p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center bg-purple-200 text-purple-600 rounded-md mr-3">
                <span className="text-xl">📝</span>
              </div>
              <h2 className="text-lg font-semibold">Full Transcript</h2>
            </div>
            <button
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(data.transcript);
                  alert('Transcript copied to clipboard!');
                }
              }}
              className="text-sm text-purple-600 hover:text-purple-800 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
              Copy
            </button>
          </div>
          <div className="p-4 bg-white">
            <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed font-mono text-sm">
                {data.transcript}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranscriptResults;