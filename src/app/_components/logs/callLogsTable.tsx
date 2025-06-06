"use client"
import React, { useState, useEffect, useMemo } from 'react';
import type { CallLogEntry, SortDirection, TimeSort } from '@/app/utils/types/callLogTypes';
import type { UserRoleData } from '@/app/utils/services/userService';
import { getUserRole } from '@/app/utils/services/userService';
import { getCallLogs, getSupervisedConsultants } from '@/app/utils/services/callLogsService';
import { generateFilterOptions, filterAndSortLogs } from '@/app/utils/filterUtils';
import LogsTable from './logsTable';
import FilterBar from './filterBar';
import Pagination from './pagination';
import { Sparkles } from 'lucide-react'; // Import Sparkles

const LOGS_PER_PAGE = 10;

const CallLogsTable: React.FC = () => {
  // Estado de datos
  const [callLogs, setCallLogs] = useState<CallLogEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRoleData | null>(null);
  const [, setSupervisedConsultants] = useState<number[]>([]);

  // Estado para filtros y búsqueda
  const [sortBy, setSortBy] = useState<SortDirection>('newest');
  const [timeSort, setTimeSort] = useState<TimeSort>('none');
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Obtener rol de usuario
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        setLoading(true); // Start loading when fetching user role
        console.log("Obteniendo rol de usuario...");
        
        const data = await getUserRole();
        console.log("Rol obtenido:", data);
        setUserRole(data);
        
        if (data.role === 'supervisor') {
          const consultants = await getSupervisedConsultants(Number(data.consultantId));
          setSupervisedConsultants(consultants);
        }
      } catch (err) {
        console.error('Error obteniendo rol de usuario:', err);
        setError(err instanceof Error ? err.message : 'Error obteniendo rol de usuario');
        setLoading(false); // Stop loading on error
      }
    };

    void fetchUserRole();
  }, []);

  // Obtener datos de logs de llamadas
  useEffect(() => {
    const fetchCallLogs = async () => {
      try {
        // Only fetch data when we have user role information
        if (!userRole) return;
        
        // If we are already loading for userRole, this will continue the loading state
        // If userRole was loaded in a previous render, this will start loading for logs
        setLoading(true); 

        const data = await getCallLogs();
        setCallLogs(data);
      } catch (err) {
        console.error('Error obteniendo logs de llamadas:', err);
        setError(err instanceof Error ? err.message : 'Error obteniendo logs de llamadas');
      } finally {
        setLoading(false); // Stop loading after logs are fetched or on error
      }
    };

    // Only get call logs if user role info is available
    if (userRole) {
      void fetchCallLogs();
    }
  }, [userRole]); // Re-fetch logs if userRole changes (e.g., if it was null and now has a value)

  // Generar opciones de filtro únicas
  const filterOptions = useMemo(() => 
    generateFilterOptions(callLogs), 
    [callLogs]
  );

  // Filtrar y ordenar logs
  const filteredLogs = useMemo(() => 
    filterAndSortLogs(
      callLogs,
      selectedCompany,
      selectedCategory,
      selectedRating,
      searchTerm,
      sortBy,
      timeSort
    ),
    [callLogs, selectedCompany, selectedCategory, selectedRating, searchTerm, sortBy, timeSort]
  );

  // Obtener logs actuales para paginación
  const indexOfLastLog = currentPage * LOGS_PER_PAGE;
  const indexOfFirstLog = indexOfLastLog - LOGS_PER_PAGE;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / LOGS_PER_PAGE);

  // Cambiar página
  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  // Restablecer filtros
  const resetFilters = () => {
    setSelectedCompany('');
    setSelectedCategory('');
    setSelectedRating('');
    setSearchTerm('');
    setSortBy('newest');
    setCurrentPage(1);
    setTimeSort('none');
  };

  // --- LOADING STATES WITH GIF ---
  // If loading and userRole is NOT yet set (first fetch)
  if (loading && !userRole) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-12">
        <div className="mb-6">
          <img 
            src="/images/loading.gif" 
            alt="Cargando rol de usuario..." 
            className="w-20 h-20 mx-auto"
          />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Cargando perfil de usuario...</h3>
        <p className="text-gray-500 mb-4">Obteniendo tu nivel de acceso y permisos.</p>
        <div className="flex items-center justify-center gap-2 text-sm text-[#B351FF]">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>Un momento por favor</span>
        </div>
      </div>
    );
  }

  // If loading and userRole IS set (fetching call logs now)
  if (loading) { 
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-12">
        <div className="mb-6">
          <img 
            src="/images/loading.gif" 
            alt="Cargando registros de llamadas..." 
            className="w-20 h-20 mx-auto"
          />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Cargando registros de llamadas...</h3>
        <p className="text-gray-500 mb-4">Obteniendo datos de todas las interacciones.</p>
        <div className="flex items-center justify-center gap-2 text-sm text-[#B351FF]">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>Preparando el dashboard</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="w-full p-20 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-4 w-full p-20">
      {/* Indicador de rol */}
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
      
      {/* Barra de filtros */}
      <FilterBar 
        filterOptions={filterOptions}
        sortBy={sortBy}
        timeSort={timeSort}
        selectedCompany={selectedCompany}
        selectedCategory={selectedCategory}
        selectedRating={selectedRating}
        searchTerm={searchTerm}
        onSortChange={(sort) => {
          setSortBy(sort);
          setCurrentPage(1);
        }}
        onCompanyChange={(company) => {
          setSelectedCompany(company);
          setCurrentPage(1);
        }}
        onCategoryChange={(category) => {
          setSelectedCategory(category);
          setCurrentPage(1);
        }}
        onRatingChange={(rating) => {
          setSelectedRating(rating);
          setCurrentPage(1);
        }}
        onTimeSortChange={(sort) => {
          setTimeSort(sort);
          setCurrentPage(1);
        }}
        onSearchChange={(search) => {
          setSearchTerm(search);
          setCurrentPage(1);
        }}
        onResetFilters={resetFilters}
      />

      {/* Tabla de logs */}
      <LogsTable logs={currentLogs} />
      
      {/* Mensaje sin resultados */}
      {filteredLogs.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No se encontraron registros que coincidan con tus filtros
        </div>
      )}

      {/* Paginación */}
      {filteredLogs.length > 0 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          itemsCount={filteredLogs.length}
          itemsPerPage={LOGS_PER_PAGE}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default CallLogsTable;