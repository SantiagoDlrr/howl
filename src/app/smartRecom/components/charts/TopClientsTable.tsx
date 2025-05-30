import { useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

interface ClientMetrics {
  client_id: number;
  avg_duration: number;
  avg_satisfaction: number;
  total_calls: number;
}

const sortBy = (
  data: ClientMetrics[],
  key: keyof ClientMetrics,
  asc: boolean
) => {
  return [...data].sort((a, b) => {
    return asc ? a[key] - b[key] : b[key] - a[key];
  });
};

export function TopClientsTable({ data }: { data: ClientMetrics[] }) {
  const [sortKey, setSortKey] = useState<keyof ClientMetrics>("total_calls");
  const [asc, setAsc] = useState(false);

  const handleSort = (key: keyof ClientMetrics) => {
    if (key === sortKey) {
      setAsc(!asc);
    } else {
      setSortKey(key);
      setAsc(true);
    }
  };

  const sorted = sortBy(data, sortKey, asc).slice(0, 5);

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-3">Top 5 Clientes por número de llamadas</h3>
      <table className="w-full text-sm text-left">
        <thead className="text-gray-500 border-b">
          <tr>
            <th className="cursor-pointer py-2" onClick={() => handleSort("client_id")}>
              Client ID {sortKey === "client_id" && (asc ? <ArrowUp className="inline w-3 h-3" /> : <ArrowDown className="inline w-3 h-3" />)}
            </th>
            <th className="cursor-pointer py-2" onClick={() => handleSort("avg_duration")}>
              Duración Promedio {sortKey === "avg_duration" && (asc ? <ArrowUp className="inline w-3 h-3" /> : <ArrowDown className="inline w-3 h-3" />)}
            </th>
            <th className="cursor-pointer py-2" onClick={() => handleSort("avg_satisfaction")}>
              Satisfacción Promedio {sortKey === "avg_satisfaction" && (asc ? <ArrowUp className="inline w-3 h-3" /> : <ArrowDown className="inline w-3 h-3" />)}
            </th>
            <th className="cursor-pointer py-2" onClick={() => handleSort("total_calls")}>
              # Llamadas {sortKey === "total_calls" && (asc ? <ArrowUp className="inline w-3 h-3" /> : <ArrowDown className="inline w-3 h-3" />)}
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((client) => (
            <tr key={client.client_id} className="border-b hover:bg-gray-50">
              <td className="py-2">#{client.client_id}</td>
              <td>{(client.avg_duration / 60).toFixed(2)} min</td>
              <td>{client.avg_satisfaction.toFixed(2)}</td>
              <td>{client.total_calls}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}