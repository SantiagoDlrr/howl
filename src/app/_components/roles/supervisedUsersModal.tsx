"use client"
import type { UserTableData } from '@/app/utils/types/roleManagementType';
import React, { useState } from 'react';

interface SupervisedUsersModalProps {
  supervisor: UserTableData;
  availableConsultants: UserTableData[];
  selectedConsultants: number[];
  onSelect: (consultantId: number, isSelected: boolean) => void;
  onClose: () => void;
  onSave: () => void;
  isSaving: boolean;
}

const SupervisedUsersModal: React.FC<SupervisedUsersModalProps> = ({
  supervisor,
  availableConsultants,
  selectedConsultants,
  onSelect,
  onClose,
  onSave,
  isSaving
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Filtrar consultores disponibles por término de búsqueda
  const filteredConsultants = availableConsultants.filter(consultant => 
    consultant.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consultant.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consultant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${consultant.firstName} ${consultant.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Gestionar Consultores Supervisados
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-700 mb-2">
            Asignar consultores que serán supervisados por:
            <span className="font-semibold ml-1">
              {supervisor.firstName} {supervisor.lastName}
            </span>
          </p>
          
          {/* Barra de búsqueda */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Buscar consultores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
            <span className="absolute right-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
          
          {/* Lista de consultores disponibles */}
          <div className="max-h-96 overflow-y-auto border rounded-md">
            {filteredConsultants.length === 0 ? (
              <p className="p-4 text-center text-gray-500">
                No hay consultores disponibles
              </p>
            ) : (
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-4 border-b text-left">Seleccionar</th>
                    <th className="py-2 px-4 border-b text-left">Nombre</th>
                    <th className="py-2 px-4 border-b text-left">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredConsultants.map((consultant) => (
                    <tr key={consultant.consultantId} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">
                        <input
                          type="checkbox"
                          checked={selectedConsultants.includes(consultant.consultantId as number)}
                          onChange={(e) => onSelect(consultant.consultantId as number, e.target.checked)}
                          className="h-5 w-5"
                        />
                      </td>
                      <td className="py-2 px-4 border-b">
                        {consultant.firstName} {consultant.lastName}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {consultant.email}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-100"
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-500 text-black rounded-md hover:bg-blue-600"
            disabled={isSaving}
          >
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupervisedUsersModal;