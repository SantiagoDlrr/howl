//smartRecom/routers/chatTest.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "howl/server/api/trpc";
import { askAI } from "../services/aiService";

export const chatTestRouter = createTRPCRouter({
  chatTest: publicProcedure
    .input(z.object({ question: z.string() }))
    .mutation(async ({ input }) => {
      const result = await askAI({
        systemPrompt: 'Responde la siguiente pregunta como un asistente amigable.',
        context: '',
        question: input.question,
      });
      return { response: result };
    }),
});