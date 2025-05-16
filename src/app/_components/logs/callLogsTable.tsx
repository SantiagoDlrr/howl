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
import Spinner from '../spinner';


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
        setLoading(true);
        console.log("Obteniendo rol de usuario...");
        
        // Usar el servicio en lugar de fetch directamente
        const data = await getUserRole();
        console.log("Rol obtenido:", data);
        setUserRole(data);
        
        // Si el usuario es un supervisor, obtener consultores supervisados
        if (data.role === 'supervisor') {
          const consultants = await getSupervisedConsultants(Number(data.consultantId));
          setSupervisedConsultants(consultants);
        }
      } catch (err) {
        console.error('Error obteniendo rol de usuario:', err);
        setError(err instanceof Error ? err.message : 'Error obteniendo rol de usuario');
      }
    };

    void fetchUserRole();
  }, []);

  // Obtener datos de logs de llamadas
  useEffect(() => {
    const fetchCallLogs = async () => {
      try {
        // Solo obtener datos cuando tengamos información del rol del usuario
        if (!userRole) return;
        
        const data = await getCallLogs();
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

  if (loading && !userRole) {
    return <Spinner />;
  }

  if (loading) {
    return <Spinner />;
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