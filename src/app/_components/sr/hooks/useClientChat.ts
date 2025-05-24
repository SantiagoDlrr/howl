import { useState } from "react";
import { api } from "@/trpc/react";

export function useClientChat(onClientDetected: (id: number) => void) {
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [chatInput, setChatInput] = useState("");

  const chatMutation = api.clientResolver.conversationalResolve.useMutation();

  const sendChat = () => {
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatHistory((prev) => [...prev, `Tú: ${userMsg}`]);
    setChatInput("");

    chatMutation.mutate({ message: userMsg }, {
      onSuccess: (res) => {
        try {
          const parsed = JSON.parse(res.response);
          setChatHistory((prev) => [...prev, `AI: ${parsed.message}`]);

          if (parsed?.type === "client" && parsed?.id) {
            onClientDetected(parsed.id);
          }
        } catch {
          setChatHistory((prev) => [...prev, `AI: ${res.response}`]);
        }
      }
    });
  };

  return {
    chatHistory,
    chatInput,
    setChatInput,
    sendChat,
  };
}