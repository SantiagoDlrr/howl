import { Loader2 } from 'lucide-react';

export default function LoadingReport() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-600">
      <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
      <h2 className="text-2xl font-semibold">Generando reporte...</h2>
      <p className="mt-2 text-sm text-gray-500 max-w-md">
        Estamos convirtiendo el audio en texto, analizando emociones, temas clave y preparando tu reporte personalizado.
      </p>
    </div>
  );
}