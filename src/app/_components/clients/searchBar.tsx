interface SearchBarProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    setCurrentPage: (page: number) => void;
    classname?: string;
}

const SearchBar = ({searchTerm, setSearchTerm, setCurrentPage, classname} : SearchBarProps) => {
    return (
        <div className={`relative flex-grow ${classname && ` ${classname}`}`}>
          <input
            data-cy="searchbar"
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
    )
}

export default SearchBar;