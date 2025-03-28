"use client"
import React, { useState, useMemo } from 'react';

// Define the structure of a single log entry
interface CallLogEntry {
  callDate: string;
  client: string;
  clientCompany: string;
  category: string;
  rating: string;
  time: string;
}

// Sample data to populate the table
const sampleCallLogs: CallLogEntry[] = [
  {
    callDate: 'Feb 18 2025',
    client: 'Roberto',
    clientCompany: 'Microsoft',
    category: 'Sales',
    rating: 'Positive',
    time: '2:41'
  },
  {
    callDate: 'Feb 17 2025',
    client: 'Maria',
    clientCompany: 'Google',
    category: 'Support',
    rating: 'Negative',
    time: '3:15'
  },
  {
    callDate: 'Feb 16 2025',
    client: 'John',
    clientCompany: 'Apple',
    category: 'Sales',
    rating: 'Positive',
    time: '1:45'
  },
  {
    callDate: 'Feb 15 2025',
    client: 'Alice',
    clientCompany: 'Amazon',
    category: 'Support',
    rating: 'Positive',
    time: '4:20'
  },
  {
    callDate: 'Feb 14 2025',
    client: 'Carlos',
    clientCompany: 'Tesla',
    category: 'Technical',
    rating: 'Negative',
    time: '2:30'
  },
  {
    callDate: 'Feb 13 2025',
    client: 'Sophia',
    clientCompany: 'Meta',
    category: 'Sales',
    rating: 'Positive',
    time: '3:10'
  },
  {
    callDate: 'Feb 12 2025',
    client: 'James',
    clientCompany: 'Netflix',
    category: 'Support',
    rating: 'Negative',
    time: '2:50'
  },
  {
    callDate: 'Feb 11 2025',
    client: 'Emma',
    clientCompany: 'Spotify',
    category: 'Technical',
    rating: 'Positive',
    time: '1:35'
  },
  {
    callDate: 'Feb 10 2025',
    client: 'Liam',
    clientCompany: 'Adobe',
    category: 'Sales',
    rating: 'Positive',
    time: '2:25'
  },
  {
    callDate: 'Feb 09 2025',
    client: 'Olivia',
    clientCompany: 'Intel',
    category: 'Support',
    rating: 'Negative',
    time: '3:05'
  },
  {
    callDate: 'Feb 08 2025',
    client: 'Noah',
    clientCompany: 'IBM',
    category: 'Technical',
    rating: 'Positive',
    time: '4:00'
  },
  {
    callDate: 'Feb 07 2025',
    client: 'Ava',
    clientCompany: 'Oracle',
    category: 'Sales',
    rating: 'Negative',
    time: '2:15'
  },
  {
    callDate: 'Feb 06 2025',
    client: 'Ethan',
    clientCompany: 'Cisco',
    category: 'Support',
    rating: 'Positive',
    time: '3:40'
  }
];

const CallLogsTable: React.FC = () => {
  // State for filters and search
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const logsPerPage = 10;

  // Dynamically generate unique filter options
  const filterOptions = useMemo(() => {
    return {
      companies: [...new Set(sampleCallLogs.map(log => log.clientCompany))],
      categories: [...new Set(sampleCallLogs.map(log => log.category))],
      ratings: [...new Set(sampleCallLogs.map(log => log.rating))]
    };
  }, []);

  // Filtered and sorted logs
  const filteredLogs = useMemo(() => {
    return sampleCallLogs
      .filter(log => 
        (!selectedCompany || log.clientCompany === selectedCompany) &&
        (!selectedCategory || log.category === selectedCategory) &&
        (!selectedRating || log.rating === selectedRating) &&
        (searchTerm === '' || 
          Object.values(log).some(value => 
            value.toLowerCase().includes(searchTerm.toLowerCase())
          ))
      )
      .sort((a, b) => {
        const dateA = new Date(a.callDate).getTime();
        const dateB = new Date(b.callDate).getTime();
        return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
      });
  }, [selectedCompany, selectedCategory, selectedRating, searchTerm, sortBy]);

  // Get current logs for pagination
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

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

      {/* Table */}
      <div className="w-full overflow-x-auto rounded border border-black">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3 text-left">Call Date</th>
              <th className="p-3 text-left">Client</th>
              <th className="p-3 text-left">Client Company</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Rating</th>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-left">AI Menu</th>
            </tr>
          </thead>
          <tbody>
            {currentLogs.map((log, index) => (
              <tr 
                key={index} 
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="p-3">{log.callDate}</td>
                <td className="p-3">{log.client}</td>
                <td className="p-3">{log.clientCompany}</td>
                <td className="p-3">
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                    {log.category}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`
                    font-semibold 
                    ${log.rating === 'Positive' ? 'text-green-600' : 'text-red-600'}
                  `}>
                    {log.rating}
                  </span>
                </td>
                <td className="p-3">{log.time}</td>
                <td className="p-3">
                  <button className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition-colors">
                    View AI
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* No results message */}
        {filteredLogs.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No logs found matching your filters
          </div>
        )}
      </div>

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