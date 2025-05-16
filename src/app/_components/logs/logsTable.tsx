"use client"
import React from 'react';
import type { CallLogEntry } from '@/app/utils/types/callLogTypes';

interface LogsTableProps {
  logs: CallLogEntry[];
}

const LogsTable: React.FC<LogsTableProps> = ({ logs }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b text-left">Fecha</th>
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
                {log.clientFirstName && log.clientLastName
                  ? `${log.clientFirstName} ${log.clientLastName}`
                  : log.client}
              </td>
              <td className="py-2 px-4 border-b">{log.clientCompany}</td>
              <td className="py-2 px-4 border-b">{log.category}</td>
              <td className="py-2 px-4 border-b">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  log.rating === 'Excelente' ? 'bg-green-100 text-green-800' :
                  log.rating === 'Bueno' ? 'bg-blue-100 text-blue-800' :
                  log.rating === 'Regular' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {log.rating}
                </span>
              </td>
              <td className="py-2 px-4 border-b">{log.time}</td>
              <td className="py-2 px-4 border-b">
                <button
                  className="text-blue-500 hover:text-blue-700 mr-2"
                  title="Ver detalles"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogsTable;