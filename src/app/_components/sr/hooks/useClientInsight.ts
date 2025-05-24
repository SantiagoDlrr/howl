import { api } from "@/trpc/react";
import { useState } from "react";
import { ClientInsight } from "@/app/utils/types/ClientInsight";

export function useClientInsight() {
  const [clientInsight, setClientInsight] = useState<ClientInsight | null>(null);
  const insightMutation = api.clientInsight.getClientInsight.useMutation();

  const fetchInsight = (clientId: number) => {
    insightMutation.mutate({ id: clientId}, {
      onSuccess: (insight) => {
        const transformed: ClientInsight = {
          ...insight,
          reports: insight.reports.map((report) => ({
            id: report.id.toString(),
            name: report.name,
            date: report.date,
            duration: report.duration,
            report: {
              sentiment: report.report.sentiment,
              rating: report.report.rating,
              summary: report.report.summary,
              feedback: report.report.feedback,
              keyTopics: report.report.keyTopics,
              emotions: report.report.emotions,
            },
            transcript: report.transcript?.map((t) => ({
              speaker: t.speaker,
              text: t.text,
            })),
          })),
        };
        setClientInsight(transformed);
      }
    });
  };

  return {
    clientInsight,
    fetchInsight,
    isLoading: insightMutation.isPending,
  };
}