interface CommentItemProps {
  comment: {
    client: { firstname: string; lastname: string } | null;
    feedback: string;
    timestamp: string;
  };
}

export default function CommentItem({ comment }: CommentItemProps) {
  const date = new Date(comment.timestamp);
  const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${date.getFullYear()}`;
  const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}`;

  return (
    <div className="bg-gray-50 p-3 rounded-md border">
      <p className="text-sm text-gray-500 mb-1">
        Comentario de {comment.client?.firstname} {comment.client?.lastname} —{" "}
        {formattedDate} {formattedTime}
      </p>
      <p className="text-gray-800 italic">{comment.feedback}</p>
    </div>
  );
}