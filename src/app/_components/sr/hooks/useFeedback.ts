// hooks/useFeedback.ts
/*import { api } from "@/trpc/react";
import { useState } from "react";

export function useFeedbackManager() {
  const [interval, setInterval] = useState<"day" | "week" | "month">("day");
  const consultantId = 1;

  const feedbackQuery = api.feedbackManager.getCallsByInterval.useQuery(
    { consultantId, interval },
    {
      // keepPreviousData: true, // opcional, mantiene datos mientras carga
    }
  );

  const fetchFeedback = (newInterval: "day" | "week" | "month") => {
    setInterval(newInterval);
  };

  return {
    reports: feedbackQuery.data ?? [],
    isLoading: feedbackQuery.isFetching,
    fetchFeedback,
  };
}*/