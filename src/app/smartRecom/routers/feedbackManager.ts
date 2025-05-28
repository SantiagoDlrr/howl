// routers/feedbackManager.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "howl/server/api/trpc";
import { getMockedCallsForInterval } from "../services/feedbackManagerService";

export const feedbackManagerRouter = createTRPCRouter({
  getCallsByInterval: publicProcedure
    .input(z.object({
      consultantId: z.number(),
      interval: z.enum(["day", "week", "month"]),
    }))
    .query(async ({ input }) => {
      const calls = await getMockedCallsForInterval(input.consultantId, input.interval);
      return calls; // devuelve solo los reportes (simulados)
    }),
});