"use client"
import React, { useState } from 'react';
import type { CallLogEntry } from '@/app/utils/types/callLogTypes';
import CallDetailsModal from './callDetailsModal';

interface LogsTableProps {
  logs: CallLogEntry[];
}

const LogsTable: React.FC<LogsTableProps> = ({ logs }) => {
  const [selectedCall, setSelectedCall] = useState<CallLogEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (log: CallLogEntry) => {
    setSelectedCall(log);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCall(null);
  };

  return (

    <>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">Fecha</th>
              <th className="py-2 px-4 border-b text-left">Titulo</th>
              <th className="py-2 px-4 border-b text-left">Cliente</th>
              <th className="py-2 px-4 border-b text-left">Empresa</th>
              <th className="py-2 px-4 border-b text-left">Categoría</th>
              <th className="py-2 px-4 border-b text-left">Calificación</th>
              <th className="py-2 px-4 border-b text-left">Duración (min)</th>
              <th className="py-2 px-4 border-b text-left">Acciones</th>

            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">
                  {new Date(log.callDate).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b">
                  {log.tittle || 'Sin título'}
                </td>
                <td className="py-2 px-4 border-b">
                  {log.clientFirstName && log.clientLastName
                    ? `${log.clientFirstName} ${log.clientLastName}`
                    : log.client}
                </td>
                <td className="py-2 px-4 border-b">{log.clientCompany}</td>
                <td className="py-2 px-4 border-b">{log.category}</td>
                <td className="py-2 px-4 border-b">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    log.rating === 'Positive' ? 'bg-green-100 text-green-800' :
                    log.rating === 'Mid' ? 'bg-blue-100 text-blue-800' :
                    log.rating === 'Mid2' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {log.rating}
                  </span>
                </td>
                <td className="py-2 px-4 border-b">2:16</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleViewDetails(log)}
                    className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition-colors"
                  >
                    Ver detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedCall && (
        <CallDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          callLog={selectedCall}
        />
      )}
    </>
  );
};

export default LogsTable;