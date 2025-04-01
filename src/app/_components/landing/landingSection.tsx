"use client";

import Button from "../button";
import Wave from "./wave";
import { api } from "howl/trpc/react";

const LandingSection = () => {

    const { data, isLoading, error } = api.apiRouter.helloWorld.useQuery();
    const getEmbedding = api.apiRouter.embedding.useMutation({
        onSuccess: (data) => {
            console.log('Embedding created:', data);
        },
        onError: (error) => {
            console.error('Error creating embedding:', error);
        },
    })

    const handleClick = () => {
        getEmbedding.mutate({ text: "Hola, ¿cómo estás?" });
    }
    // const addData = api.calls.createCall.useMutation({
    //     onSuccess: (data) => {
    //         console.log('Call created:', data);
    //     },
    //     onError: (error) => {
    //         setError(error.message);
    //         console.error('Error creating call:', error);
    //     },
    // })
    // console.log("RESULT", data.Message, isLoading, error);
    // const result = data?.Message || "Loading...";

    return (
        <div className="flex flex-row justify-between w-full px-20">
            <div className="flex w-1/2 min-h-screen flex-col items-start justify-center">
                <h1 className="text-5xl font-bold">
                    Análisis de <span className="text-primary">llamadas</span>
                </h1>
                <p className="text-lg py-3">
                    Empoderando empresas mediante el servicio al cliente.
                </p>

                <div className="flex flex-row gap-6 pt-7">
                    <Button label="Login" href="/login" />
                    <Button label="Registro" secondary href="/register" />
                </div>
            </div>
            <div className="pt-20">
                {data?.Message} aaa
            </div>
            <button onClick={handleClick}>
                Call
            </button>
            <Wave />
        </div>
    )
}

export default LandingSection;