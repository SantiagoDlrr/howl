interface Props {
  role: "user" | "assistant";
  text: string;
}

export const ChatMessage: React.FC<Props> = ({ role, text }) => {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
          isUser
            ? "bg-purple-500 text-white rounded-br-none"
            : "bg-gray-100 text-gray-800 rounded-bl-none"
        }`}
      >
        {text}
      </div>
    </div>
  );
};