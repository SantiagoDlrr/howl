"use client";
import { api } from "howl/trpc/react";

const SampleGet = () => {
    const { data: calls, isLoading, error } = api.calls.getCalls.useQuery();
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            {calls && calls.length > 0 ? (
                <ul>
                    {calls.map((call) => (
                        <div className="flex flex-row gap-5" key={call.id}>
                            <div>Call ID: {call.id}</div>
                            <div>Client ID: {call.client_id}</div>
                            <div>Consultant ID: {call.consultant_id}</div>
                            <div>Context: {call.context} </div>
                            {/* Add more fields as needed */}
                        </div>
                    ))}
                </ul>
            ) : (
                <p>No calls found.</p>
            )}
        </div>
    )
}

export default SampleGet;