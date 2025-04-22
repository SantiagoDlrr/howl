"use client"
import React, { useState, useMemo, useEffect } from 'react';
import LogsTable from './logsTable';

interface CallLogEntry {
  id: number;
  callDate: string;
  client: string;
  clientFirstName?: string;
  clientLastName?: string;
  clientCompany: string;
  consultant_id: number;
  category: string;
  rating: string;
  time: string;
  context?: string;
  summary?: string;
  feedback?: string;
}

interface UserRole {
  userId: string;
  consultantId: number;
  role: 'administrator' | 'supervisor' | 'consultant';
}

const CallLogsTable: React.FC = () => {
  const [callLogs, setCallLogs] = useState<CallLogEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [supervisedConsultants, setSupervisedConsultants] = useState<number[]>([]);

  // State for filters and search
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [timeSort, setTimeSort] = useState<'none' | 'longer' | 'shorter'>('none');
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const logsPerPage = 10;

  // Fetch user role
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        setLoading(true);
        console.log("Obteniendo rol de usuario...");
        const response = await fetch('/api/roles');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch user role');
        }
        
        const data = await response.json();
        console.log("Rol obtenido:", data);
        setUserRole(data);
        
        // Si el usuario es un supervisor, obtener consultores supervisados
        if (data.role === 'supervisor') {
          await fetchSupervisedConsultants(data.consultantId);
        }
      } catch (err) {
        console.error('Error obteniendo rol de usuario:', err);
        setError(err instanceof Error ? err.message : 'Error obteniendo rol de usuario');
      }
    };

    const fetchSupervisedConsultants = async (supervisorId: number) => {
      try {
        console.log("Obteniendo consultores supervisados...");
        const response = await fetch(`/api/supervision?supervisor_id=${supervisorId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch supervised consultants');
        }
        
        const data = await response.json();
        console.log("Consultores supervisados:", data);
        setSupervisedConsultants(data.consultants || []);
      } catch (err) {
        console.error('Error obteniendo consultores supervisados:', err);
      }
    };

    void fetchUserRole();
  }, []);

  // Fetch call logs data
  useEffect(() => {
    const fetchCallLogs = async () => {
      try {
        // Solo obtener datos cuando tengamos información del rol del usuario
        if (!userRole) return;
        
        console.log("Obteniendo logs de llamadas...");
        const response = await fetch('/api/call-logs');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch call logs');
        }
        
        const data = await response.json() as CallLogEntry[];
        console.log(`${data.length} logs de llamadas obtenidos`);
        setCallLogs(data);
      } catch (err) {
        console.error('Error obteniendo logs de llamadas:', err);
        setError(err instanceof Error ? err.message : 'Error obteniendo logs de llamadas');
      } finally {
        setLoading(false);
      }
    };

    // Solo obtener logs de llamadas si tenemos la información del rol
    if (userRole) {
      void fetchCallLogs();
    }
  }, [userRole]);

  // Dynamically generate unique filter options
  const filterOptions = useMemo(() => {
    return {
      companies: [...new Set(callLogs.map(log => log.clientCompany))],
      categories: [...new Set(callLogs.map(log => log.category))],
      ratings: [...new Set(callLogs.map(log => log.rating))]
    };
  }, [callLogs]);

  // Filtered and sorted logs
  const filteredLogs = useMemo(() => {
    return callLogs
      .filter(log =>
        (!selectedCompany || log.clientCompany === selectedCompany) &&
        (!selectedCategory || log.category === selectedCategory) &&
        (!selectedRating || log.rating === selectedRating) &&
        (searchTerm === '' ||
          Object.values(log).some(value =>
            typeof value === 'string' &&
            value.toLowerCase().includes(searchTerm.toLowerCase())
          ))
      )
      .sort((a, b) => {
        // Orden por fecha
        const dateA = new Date(a.callDate).getTime();
        const dateB = new Date(b.callDate).getTime();
        let sortResult = sortBy === 'newest' ? dateB - dateA : dateA - dateB;

        // Orden por tiempo
        if (timeSort !== 'none') {
          const timeA = parseInt(a.time);
          const timeB = parseInt(b.time);
          sortResult = timeSort === 'longer' ? timeB - timeA : timeA - timeB;
        }

        return sortResult;
      });
  }, [callLogs, selectedCompany, selectedCategory, selectedRating, searchTerm, sortBy, timeSort]);

  // Get current logs for pagination
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  if (loading && !userRole) {
    return <div className="w-full p-20 text-center">Cargando información de usuario...</div>;
  }

  if (loading) {
    return <div className="w-full p-20 text-center">Cargando registros de llamadas...</div>;
  }

  if (error) {
    return <div className="w-full p-20 text-center text-red-500">Error: {error}</div>;
  }

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Reset filters and reset to page 1
  const resetFilters = () => {
    setSelectedCompany('');
    setSelectedCategory('');
    setSelectedRating('');
    setSearchTerm('');
    setSortBy('newest');
    setCurrentPage(1);
    setTimeSort('none');
  };

  return (
    <div className="space-y-4 w-full p-20">
      {/* Role indicator */}
      {userRole && (
        <div className="bg-blue-50 p-3 rounded-md mb-4">
          <span className="font-semibold">Rol actual:</span> {
            userRole.role === 'administrator' ? 'Administrador' :
            userRole.role === 'supervisor' ? 'Supervisor' : 'Consultor'
          }
          {userRole.role !== 'administrator' && (
            <span className="ml-2 text-gray-500">
              (Mostrando datos según tu nivel de acceso)
            </span>
          )}
        </div>
      )}
      
      {/* Filters and Search */}
      <div className="flex space-x-2">
        {/* Sort By Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value as 'newest' | 'oldest');
            setCurrentPage(1);
          }}
          className="border rounded px-2 py-1"
        >
          <option value="newest">Más reciente</option>
          <option value="oldest">Más antiguo</option>
        </select>

        {/* Company Filter */}
        <select
          value={selectedCompany}
          onChange={(e) => {
            setSelectedCompany(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded px-2 py-1"
        >
          <option value="">Todas las empresas</option>
          {filterOptions.companies.map(company => (
            <option key={company} value={company}>{company}</option>
          ))}
        </select>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded px-2 py-1"
        >
          <option value="">Todas las categorías</option>
          {filterOptions.categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        {/* Rating Filter */}
        <select
          value={selectedRating}
          onChange={(e) => {
            setSelectedRating(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded px-2 py-1"
        >
          <option value="">Todas las calificaciones</option>
          {filterOptions.ratings.map(rating => (
            <option key={rating} value={rating}>{rating}</option>
          ))}
        </select>

        {/* Time Sort Dropdown */}
        <select
          value={timeSort}
          onChange={(e) => {
            setTimeSort(e.target.value as 'none' | 'longer' | 'shorter');
            setCurrentPage(1);
          }}
          className="border rounded px-2 py-1"
        >
          <option value="none">Tiempo: Predeterminado</option>
          <option value="longer">Más largos primero</option>
          <option value="shorter">Más cortos primero</option>
        </select>

        {/* Search Input */}
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded px-2 py-1 w-full"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400 absolute right-2 top-2 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Reset Filters Button */}
        <button
          onClick={resetFilters}
          className="bg-[#F9FBFF] hover:bg-gray-300 rounded px-2 py-1 border border-black"
        >
          Restablecer
        </button>
      </div>

      <LogsTable logs={currentLogs} />
      
      {/* No results message */}
      {filteredLogs.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No se encontraron registros que coincidan con tus filtros
        </div>
      )}

      {/* Pagination */}
      {filteredLogs.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Mostrando {indexOfFirstLog + 1} a {Math.min(indexOfLastLog, filteredLogs.length)} de {filteredLogs.length} registros
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => paginate(1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded border ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
            >
              «
            </button>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded border ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
            >
              ‹
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-3 py-1 rounded border ${currentPage === number ? 'bg-purple-500 text-white' : 'hover:bg-gray-100'}`}
              >
                {number}
              </button>
            ))}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded border ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
            >
              ›
            </button>
            <button
              onClick={() => paginate(totalPages)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded border ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallLogsTable;