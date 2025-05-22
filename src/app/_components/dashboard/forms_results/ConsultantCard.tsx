import CommentItem from "./CommentItem";

interface ConsultantCardProps {
  consultant: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    rating: number;
  };
  comments: {
    client: { firstname: string; lastname: string } | null;
    feedback: string;
    timestamp: string;
  }[];
  currentPage: number;
  onPageChange: (newPage: number) => void;
}

const COMMENTS_PER_PAGE = 3;

export default function ConsultantCard({
  consultant,
  comments,
  currentPage,
  onPageChange,
}: ConsultantCardProps) {
  const totalPages = Math.ceil(comments.length / COMMENTS_PER_PAGE);
  const start = (currentPage - 1) * COMMENTS_PER_PAGE;
  const visibleComments = comments.slice(start, start + COMMENTS_PER_PAGE);

  return (
    <div className="bg-white border rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          {consultant.firstname} {consultant.lastname}
        </h3>
        <p className="text-sm text-gray-600">{consultant.email}</p>
        <p className="text-sm text-gray-700 mt-1">
          ⭐ {consultant.rating ?? "N/A"} / 5.0
        </p>
      </div>

      <div className="space-y-3 mt-4">
        {visibleComments.map((comment, i) => (
          <CommentItem key={i} comment={comment} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            className="px-3 py-1 border rounded text-sm bg-gray-100 hover:bg-gray-200"
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span className="text-sm text-gray-600">
            Página {currentPage} de {totalPages}
          </span>
          <button
            className="px-3 py-1 border rounded text-sm bg-gray-100 hover:bg-gray-200"
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}