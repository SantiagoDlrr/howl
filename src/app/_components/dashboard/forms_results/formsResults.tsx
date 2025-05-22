"use client";
import { api } from "howl/trpc/react";
import { useEffect, useState } from "react";
import Spinner from "../../spinner";
import ConsultantCard from "./ConsultantCard";


type Consultant = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  rating: number;
  user_id: string | null;
};

type ConsultantFeedbackGroup = {
  consultant: Consultant;
  seen: Set<string>;
  comments: Array<{
    client: { firstname: string; lastname: string } | null;
    feedback: string;
    timestamp: string;
  }>;
};

export default function FormsResults() {
  const [selectedConsultantId, setSelectedConsultantId] = useState<number | undefined>(undefined);
  const [consultantPages, setConsultantPages] = useState<Record<number, number>>({});

  const { data: consultantList, isLoading: loadingConsultants } = api.consultant.getAll.useQuery();
  const { data: results, isLoading, error, refetch } = api.feedback.getAll.useQuery(
    selectedConsultantId ? { consultantId: selectedConsultantId } : {}
  );

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 10000);
    return () => clearInterval(interval);
  }, [refetch]);

  useEffect(() => {
    setConsultantPages({});
  }, [results]);

  if (isLoading || loadingConsultants) return <Spinner />;
  if (error) return <div className="text-center text-red-500">Error: {error.message}</div>;

  const groupedByConsultant = results?.reduce((acc: Record<number, ConsultantFeedbackGroup>, feedback) => {
    const consultant = feedback.consultant;
    const id = consultant?.id;
    if (!consultant || id == null) return acc;
    const key = `${feedback.consultant_feedback}-${feedback.timestamp}`;

    if (!acc[id]) {
      acc[id] = {
        consultant: {
          ...consultant,
          rating: consultant.rating ?? 0, // ensure number
        },
        seen: new Set<string>(),
        comments: [],
      };
    }

    if (!acc[id].seen.has(key)) {
      acc[id].comments.push({
        client: feedback.client ?? null,
        feedback: feedback.consultant_feedback ?? '',
        timestamp: feedback.timestamp instanceof Date ? feedback.timestamp.toISOString() : String(feedback.timestamp),
      });
      acc[id].seen.add(key);
    }

    return acc;
  }, {});

  return (
    <div className="w-full px-4 sm:px-8 my-10">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Comentarios de encuestas</h2>

      <div className="flex justify-center mb-8">
        <select
          className="border rounded px-3 py-1"
          onChange={e => setSelectedConsultantId(e.target.value === "" ? undefined : parseInt(e.target.value))}
          value={selectedConsultantId ?? ""}
        >
          <option value="">Todos</option>
          {consultantList?.map(c => (
            <option key={c.id} value={c.id}>{c.firstname} {c.lastname}</option>
          ))}
        </select>
      </div>

      <div className="space-y-6">
        {groupedByConsultant &&
          Object.values(groupedByConsultant).map(({ consultant, comments }) => (
            <ConsultantCard
              key={consultant.id}
              consultant={consultant}
              comments={comments}
              currentPage={consultantPages[consultant.id] ?? 1}
              onPageChange={(newPage) =>
                setConsultantPages((pages) => ({ ...pages, [consultant.id]: newPage }))
              }
            />
          ))}
      </div>
    </div>
  );
}