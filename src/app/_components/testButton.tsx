"use client";

import { useState } from 'react';
import { api } from "howl/trpc/react";
import { callSchema } from '../utils/schemas/schemas';

const CreateCallButton = () => {
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Call the API to create a new call
    const addData = api.calls.createCall.useMutation({
        onSuccess: (data) => {
            console.log('Call created:', data);
        },
        onError: (error) => {
            setError(error.message);
            console.error('Error creating call:', error);
        },
    })

    const handleCreateCall = async () => {
        setCreating(true);
        setError(null);

        try {
            // Example data to create a call
            const callData = {
                context: 'Test from Next', // Example context
                duration: 120, // Example duration
                keywords: ['support', 'customer'], // Example keywords
                date: new Date(), // Example date
                summary: 'Test call summary', // Example summary
                transcript: 'Test call transcript', // Example transcript
                type: 'Support', // Example call type
                satisfaction: 5, // Example satisfaction rating
                consultant_id: 1, // Example consultant ID
                client_id: 2, // Example client ID
            };
            
            //Verify that the info matches the expected schema
            const result = callSchema.safeParse(callData); 
            if (!result.success) {
                const errorMessage = result.error.errors
                    .map((error) => error.message)
                    .join('. ');
                setError(errorMessage);
                alert(errorMessage);
                return;
            }
            
            // Here the request is sent to the server
            addData.mutate(callData);

        } catch (err) {
            setError('Failed to create call');
            console.error(err);
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <button
                onClick={handleCreateCall} // call function to make a call
                disabled={creating}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
                {creating ? 'Creating...' : 'Create Call'}
            </button>
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};

export default CreateCallButton;
