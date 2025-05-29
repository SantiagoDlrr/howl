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

      const splitDate = new Date();
      if (input.interval === "semana") splitDate.setDate(splitDate.getDate() - 7);
      else if (input.interval === "mes") splitDate.setDate(splitDate.getDate() - 30);
      else splitDate.setDate(splitDate.getDate() - 1);

      return generateFeedbackMetrics(calls, splitDate);
    }),
});