"use client";
import { client_feedback } from "@prisma/client";
import { api } from "howl/trpc/react";

import type { Prisma } from "@prisma/client";
import { useEffect } from "react";
import Spinner from "../spinner";


const FormsResults = () => {
    const { data: results, isLoading, error, refetch } = api.feedback.getAll.useQuery();

    useEffect(() => {
        const interval = setInterval(() => {
            refetch();
        }, 10000);

        return () => clearInterval(interval);
    }, [refetch]);

    if (isLoading) {
        return (
            <Spinner />
        )
    }
    if (error) {
        return <div className="text-center">Error: {error.message}</div>;
    }


    return (
        <div className="bg-bg-dark my-10 p-10 rounded-md shadow-lg">
            <h2 className="text-xl font-semibold mb-8">Comentarios de encuestas</h2>
            {results && (
                results.map((result, index) => {
                    const date = new Date(result.timestamp);
                    const formattedDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
                    const formattedTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

                    return (
                        <div key={index} className="mb-4 p-4 bg-gray-50 rounded-md">
                            <div className="flex flex-row justify-between items-start">
                                <div className="font-medium">
                                    <span className="font-normal">Comentario de</span> {result.client?.firstname} {result.client?.lastname} <span className="font-normal">sobre</span> {result.consultant?.firstname} {result.consultant?.lastname}
                                </div>
                                <div className="text-text-light text-sm pt-2">
                                    {formattedDate} {formattedTime}
                                </div>
                            </div>
                            {result.consultant_feedback}
                        </div>
                    );
                })
            )}
        </div>
    );
}

export default FormsResults;