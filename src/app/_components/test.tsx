"use client";
import { api } from "howl/trpc/react";

const Test = () => {
    const { data, isLoading, error } = api.microsoft.getCallRecords.useQuery();
    console.log("RESULTTTTTCLIETN", data);

    // if (isLoading) return <p>Loading...</p>;
    // if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="bg-red-400 py-20">
            hi
        </div>
        //   <pre className="whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
    );
}

export default Test;