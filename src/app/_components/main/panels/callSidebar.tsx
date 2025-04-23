import React from 'react';
import { List } from 'lucide-react';
import type { FileData } from '@/app/utils/types/main';

interface Props {
  files: FileData[];
  selectedFileIndex: number | null;
  onSelectFile: (index: number) => void;
  onAddNewFile: () => void;
}

export const CallSideBar: React.FC<Props> = ({ files, selectedFileIndex, onSelectFile, onAddNewFile }) => {
  return (
    <div className="bg-white flex flex-col h-full">
      <div className="py-3 px-4 border-b border-t border-gray-200">
        <h2 className="text-md font-medium text-gray-800">Historial de llamadas</h2>
      </div>

      <div className="px-4 py-3">
        <button
          onClick={onAddNewFile}
          className="mx-auto py-2 px-4 border border-gray-300 rounded-md flex items-center justify-center text-sm text-gray-700 hover:bg-gray-50 max-w-xs w-full"
        >
          <span className="mr-1 text-sm">+</span> Agregar nueva llamada
        </button>
      </div>

      <div className="overflow-y-auto flex-1">
        {files.length > 0 && (
          <>
            <div className="px-4 py-2 text-xs text-gray-500">Hoy</div>
            {files.map((file, index) => (
              <div
                key={file.id}
                onClick={() => onSelectFile(index)}
                className={`py-3 px-4 border-b border-gray-100 cursor-pointer hover:bg-purple-50 ${selectedFileIndex === index ? 'bg-purple-100' : ''
                  }`}
              >
                <div className="text-sm font-medium">{file.name}</div>
                <div className="text-xs text-gray-500">Cliente - {file.type}</div>
              </div>
            ))}
          </>
        )}
      </div>

      {files.length > 0 && (
        <div className="px-4 py-3 mt-auto">
          <button className="mx-auto py-2 px-4 bg-primary text-white rounded-md hover:bg-purple-600 flex items-center justify-center text-sm max-w-xs w-full">
            <List className="w-4 h-4 mr-2" />
            Guardar llamadas en log
          </button>
        </div>
      )}
    </div>
  );
};