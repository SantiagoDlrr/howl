// 3. routers/feedbackManager.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "howl/server/api/trpc";
import { getCallsByRangeSP, generateFeedbackMetrics } from "../services/feedbackManagerService";

export const feedbackManagerRouter = createTRPCRouter({
  getFeedbackMetrics: publicProcedure
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

      const today = new Date();
      const currentStart = new Date(today);
      const previousStart = new Date(today);

      if (input.interval === "semana") {
        currentStart.setDate(currentStart.getDate() - 7);
        previousStart.setDate(previousStart.getDate() - 14);
      } else if (input.interval === "mes") {
        currentStart.setDate(currentStart.getDate() - 30);
        previousStart.setDate(previousStart.getDate() - 60);
      } else {
        currentStart.setHours(0, 0, 0, 0);
        previousStart.setDate(previousStart.getDate() - 1);
        previousStart.setHours(0, 0, 0, 0);
      }

      return generateFeedbackMetrics(calls, currentStart, previousStart);
    }),
});