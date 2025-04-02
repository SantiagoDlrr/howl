import React from 'react';
import Button from '../ui/Button';
import { Call } from '../../types/types';

interface SidebarProps {
  hasItems: boolean;
  calls: Call[];
  selectedCallId: number | string | null; // <--- UPDATED TYPE
  onCallSelect: (id: number | string) => void; // Ensure this matches too

  onAddNewCall: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  hasItems, 
  calls, 
  selectedCallId,
  onCallSelect,
  onAddNewCall
}) => {
  return (
    <div className="w-72 border-r border-gray-200 flex flex-col h-screen">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium">Historial de llamadas</h2>
      </div>
      
      <div className="p-4">
        <Button
          variant="outline"
          icon="+"
          fullWidth
          onClick={onAddNewCall}
        >
          Agregar nueva llamada
        </Button>
      </div>

      {hasItems ? (
        <div className="flex-1 overflow-y-auto">
          {/* Today's date header */}
          <div className="px-4 py-2 text-sm font-medium text-gray-500">
            Hoy
          </div>
          
          {/* Call list */}
          <div className="space-y-1">
            {calls.map(call => (
              <div 
                key={call.id}
                className={`px-4 py-3 cursor-pointer ${selectedCallId === call.id ? 'bg-purple-100' : 'hover:bg-gray-50'}`}
                onClick={() => onCallSelect(call.id)}
              >
                <div className="text-sm font-medium">{call.title}</div>
                <div className="text-xs text-gray-500">
                  {call.category && `${call.category} - `}{call.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-4 text-center text-gray-500">
          <div>
            <p>Aún no tienes ninguna</p>
            <p>llamada cargada</p>
          </div>
        </div>
      )}
      
      {hasItems && (
        <div className="p-4 border-t border-gray-200">
          <button className="w-full py-2 text-sm text-purple-600 hover:text-purple-800">
            Guardar llamadas en log
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;