import { CallLogEntry, SortDirection, TimeSort, FilterOptions } from './types/callLogTypes';

export const generateFilterOptions = (logs: CallLogEntry[]): FilterOptions => {
  return {
    companies: [...new Set(logs.map(log => log.clientCompany))],
    categories: [...new Set(logs.map(log => log.category))],
    ratings: [...new Set(logs.map(log => log.rating))]
  };
};

export const filterAndSortLogs = (
  logs: CallLogEntry[],
  selectedCompany: string,
  selectedCategory: string,
  selectedRating: string,
  searchTerm: string,
  sortBy: SortDirection,
  timeSort: TimeSort
): CallLogEntry[] => {
  return logs
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
};