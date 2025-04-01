export default function ReportView({ transcript }: { transcript: string }) {
    return (
      <div className="bg-white p-10 max-w-3xl mx-auto text-black leading-relaxed">
        <h1 className="text-2xl font-bold mb-2">Título del Reporte ✏️</h1>
        <p className="text-gray-500 text-sm mb-6">Fecha de llamada, duración, calificación, etc.</p>
        <div className="space-y-6">
          <div>
            <h2 className="font-bold text-lg text-purple-600">Feedback</h2>
            <p>{transcript}</p>
          </div>
          <div>
            <h2 className="font-bold text-lg text-purple-600">Temas Clave</h2>
            <ul className="list-disc ml-6 text-sm">
              <li>Item generado por IA...</li>
            </ul>
          </div>
          <div>
            <h2 className="font-bold text-lg text-purple-600">Emociones</h2>
            <ol className="list-decimal ml-6 text-sm">
              <li>Inicio con frustración leve</li>
              <li>Se mantiene cooperativo</li>
              <li>Finaliza con tranquilidad</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }