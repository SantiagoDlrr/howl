"use client"
import React, { useState, useMemo, useEffect } from 'react';
import LogsTable from './logsTable';

interface CallLogEntry {
  callDate: string;
  client: string;
  clientCompany: string;
  category: string;
  rating: string;
  time: string;
}

const CallLogsTable: React.FC = () => {
  const [callLogs, setCallLogs] = useState<CallLogEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for filters and search
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [timeSort, setTimeSort] = useState<'none' | 'longer' | 'shorter'>('none');
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const logsPerPage = 10;

  // Fetch data from API
  useEffect(() => {
    const fetchCallLogs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/call-logs'); // Nota: "call-logs" no "call-logs"
        if (!response.ok) {
          throw new Error('Failed to fetch call logs');
        }
        const data = await response.json() as CallLogEntry[];
        setCallLogs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    void fetchCallLogs();
  }, []);

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
        // Orden por fecha (mantén tu lógica existente)
        const dateA = new Date(a.callDate).getTime();
        const dateB = new Date(b.callDate).getTime();
        let sortResult = sortBy === 'newest' ? dateB - dateA : dateA - dateB;

        // Orden por tiempo (nueva lógica)
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

  if (loading) {
    return <div className="w-full p-20 text-center">Loading call logs...</div>;
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
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
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
          <option value="">All Companies</option>
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
          <option value="">All Categories</option>
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
          <option value="">All Ratings</option>
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
          <option value="none">Time: Default</option>
          <option value="longer">Longer First</option>
          <option value="shorter">Shorter First</option>
        </select>

        {/* Search Input */}
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Type to search..."
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
          Reset
        </button>
      </div>

      <LogsTable logs={currentLogs} />
      {/* No results message */}
      {filteredLogs.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No logs found matching your filters
        </div>
      )}

      {/* Pagination */}
      {filteredLogs.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstLog + 1} to {Math.min(indexOfLastLog, filteredLogs.length)} of {filteredLogs.length} entries
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