import { useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

interface ClientMetrics {
  client_id: number;
  avg_duration: number;
  avg_satisfaction: number;
  total_calls: number;
  first_name: string;
  last_name: string;
  email: string;
}

type SortableKey = "client_id" | "avg_duration" | "avg_satisfaction" | "total_calls";

const sortBy = (
  data: ClientMetrics[],
  key: SortableKey,
  asc: boolean
) => {
  return [...data].sort((a, b) => {
    return asc ? a[key] - b[key] : b[key] - a[key];
  });
};

// Gradient avatar colors array
const avatarGradients = [
  "bg-gradient-to-br from-purple-400 to-purple-600",
  "bg-gradient-to-br from-blue-400 to-blue-600", 
  "bg-gradient-to-br from-orange-400 to-orange-600",
  "bg-gradient-to-br from-green-400 to-green-600",
  "bg-gradient-to-br from-pink-400 to-pink-600",
  "bg-gradient-to-br from-indigo-400 to-indigo-600",
  "bg-gradient-to-br from-red-400 to-red-600",
  "bg-gradient-to-br from-yellow-400 to-yellow-600",
  "bg-gradient-to-br from-teal-400 to-teal-600",
  "bg-gradient-to-br from-cyan-400 to-cyan-600"
];

// Function to get initials from first and last name
const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
};

// Function to get consistent gradient for a client based on their ID
const getAvatarGradient = (clientId: number): string => {
  return avatarGradients[clientId % avatarGradients.length]!;
};

export function TopClientsTable({ data }: { data: ClientMetrics[] }) {
  const [sortKey, setSortKey] = useState<SortableKey>("total_calls");
  const [asc, setAsc] = useState(false);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Top 5 Clientes por número de llamadas</h3>
        <div className="flex items-center justify-center h-32">
          <p className="text-sm text-gray-500">No hay datos disponibles para mostrar.</p>
        </div>
      </div>
    );
  }

  const handleSort = (key: SortableKey) => {
    if (key === sortKey) {
      setAsc(!asc);
    } else {
      setSortKey(key);
      setAsc(key === "avg_satisfaction" ? true : false); // Default ascending for satisfaction
    }
  };

  const sorted = sortBy(data, sortKey, asc).slice(0, 5);

  const SortIcon = ({ column }: { column: SortableKey }) => {
    if (sortKey !== column) return null;
    return asc ? (
      <ArrowUp className="inline w-3 h-3 ml-1 text-gray-400" />
    ) : (
      <ArrowDown className="inline w-3 h-3 ml-1 text-gray-400" />
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Top 5 Clientes por número de llamadas</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Cliente
              </th>
              <th 
                className="text-left py-2 px-2 text-xs font-medium text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700 transition-colors"
                onClick={() => handleSort("avg_duration")}
              >
                Duración Promedio
                <SortIcon column="avg_duration" />
              </th>
              <th 
                className="text-left py-2 px-2 text-xs font-medium text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700 transition-colors"
                onClick={() => handleSort("avg_satisfaction")}
              >
                Satisfacción Promedio
                <SortIcon column="avg_satisfaction" />
              </th>
              <th 
                className="text-left py-2 px-2 text-xs font-medium text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700 transition-colors"
                onClick={() => handleSort("total_calls")}
              >
                # Llamadas
                <SortIcon column="total_calls" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map((client, index) => (
              <tr 
                key={client.client_id} 
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="py-3 px-2">
                  <div className="flex items-center gap-3">
                    {/* Avatar with gradient and initials */}
                    <div className={`w-10 h-10 ${getAvatarGradient(client.client_id)} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                      {getInitials(client.first_name, client.last_name)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900 text-sm">
                        {client.first_name} {client.last_name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {client.email}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-2 text-gray-700 font-medium text-sm">
                  {(client.avg_duration / 60).toFixed(2)} min
                </td>
                <td className="py-3 px-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500 text-white">
                    {client.avg_satisfaction.toFixed(2)}
                  </span>
                </td>
                <td className="py-3 px-2 text-gray-700 font-semibold">
                  {client.total_calls}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Optional: Show ranking indicators */}
      <div className="mt-3 flex justify-between items-center text-xs text-gray-400">
        <span>Ordenado por: {
          sortKey === "total_calls" ? "Duración promedio" :
          sortKey === "avg_duration" ? "Duración promedio" :
          sortKey === "avg_satisfaction" ? "Satisfacción promedio" :
          "ID de cliente"
        }</span>
        <span>Mostrando top 5 de {data.length} clientes</span>
      </div>
    </div>
  );
}