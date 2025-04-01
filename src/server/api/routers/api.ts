import { createTRPCRouter, publicProcedure } from "howl/server/api/trpc";
import axios from "axios";
import { z } from "zod";

export const apiRouter = createTRPCRouter({
    helloWorld: publicProcedure.query(async () => {
        try {
            const response = await axios.get("http://0.0.0.0:8000");
            return response.data;
        } catch (error) {
            console.error("Error fetching data from API:", error);
            throw new Error("Failed to fetch data from API");
        }
    }),

    embedding: publicProcedure
        .input(z.object({ text: z.string() }))
        .mutation(async ({ input }) => {
            const response = await axios.post("http://0.0.0.0:8000/embedding", input);
            return response.data;
        })

})