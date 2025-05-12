"use client";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    length: number;
    firstIndex: number;
    lastIndex: number;
    paginate: (pageNumber: number) => void;
}

const Pagination = ({ currentPage, totalPages, length, firstIndex, lastIndex, paginate }: PaginationProps) => {
    return (
        <div className="pt-3">
            {length > 0 && (
                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        Mostrando {firstIndex + 1} - {Math.min(lastIndex, length)} de {length} registros
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
    )
}

export default Pagination;