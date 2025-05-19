"use client"
import React from 'react';
import type { FilterOptions, SortDirection, TimeSort } from '@/app/utils/types/callLogTypes';

interface FilterBarProps {
  filterOptions: FilterOptions;
  sortBy: SortDirection;
  timeSort: TimeSort;
  selectedCompany: string;
  selectedCategory: string;
  selectedRating: string;
  searchTerm: string;
  onSortChange: (sort: SortDirection) => void;
  onCompanyChange: (company: string) => void;
  onCategoryChange: (category: string) => void;
  onRatingChange: (rating: string) => void;
  onTimeSortChange: (timeSort: TimeSort) => void;
  onSearchChange: (search: string) => void;
  onResetFilters: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filterOptions,
  sortBy,
  timeSort,
  selectedCompany,
  selectedCategory,
  selectedRating,
  searchTerm,
  onSortChange,
  onCompanyChange,
  onCategoryChange,
  onRatingChange,
  onTimeSortChange,
  onSearchChange,
  onResetFilters
}) => {
  return (
    <div className="flex space-x-2">
      {/* Sort By Dropdown */}
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as SortDirection)}
        className="border rounded px-2 py-1"
      >
        <option value="newest">Más reciente</option>
        <option value="oldest">Más antiguo</option>
      </select>

      {/* Company Filter */}
      <select
        value={selectedCompany}
        onChange={(e) => onCompanyChange(e.target.value)}
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
        onChange={(e) => onCategoryChange(e.target.value)}
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
        onChange={(e) => onRatingChange(e.target.value)}
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
        onChange={(e) => onTimeSortChange(e.target.value as TimeSort)}
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
          onChange={(e) => onSearchChange(e.target.value)}
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
        onClick={onResetFilters}
        className="bg-[#F9FBFF] hover:bg-gray-300 rounded px-2 py-1 border border-black"
      >
        Restablecer
      </button>
    </div>
  );
};

export default FilterBar;