import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "howl/server/api/trpc";
import { getCallsByRangeSP } from "../services/feedbackManagerService";

export const feedbackManagerRouter = createTRPCRouter({
  getCallsByInterval: publicProcedure
    .input(z.object({
      consultantId: z.number(),
      interval: z.enum(["dia", "semana", "mes"]),
    }))
    .query(async ({ input }) => {
      const formattedDate = new Date().toISOString().split("T")[0]!;

      const calls = await getCallsByRangeSP(
        input.consultantId,
        formattedDate,
        input.interval
      );

      return calls.map((call) => ({
        id: call.id,
        name: call.name,
        summary: call.summary,
        satisfaction: call.satisfaction,
        duration: call.duration,
        date: call.date,
      }));
    }),
});