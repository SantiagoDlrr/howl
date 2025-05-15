"use client";

import { api } from "@/trpc/react";

export default function DebugInsightPage() {
  const mutation = api.smartInsight.getClientInsight.useMutation();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Test Client Insight</h1>

      <button
        onClick={() => mutation.mutate({ id: "1" })}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Generate Insight for Client 1
      </button>

      {mutation.isLoading && <p className="mt-2">Loading...</p>}
      {mutation.error && (
        <p className="mt-2 text-red-500">Error: {mutation.error.message}</p>
      )}
      {mutation.data && (
        <pre className="mt-4 bg-gray-100 p-4 rounded text-sm overflow-x-auto">
          {JSON.stringify(mutation.data, null, 2)}
        </pre>
      )}
    </div>
  );
}
