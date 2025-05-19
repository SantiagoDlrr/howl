//smartRecom/routers/clientInsight.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "howl/server/api/trpc";
import { generateClientInsight } from "howl/app/smartRecom/services/clientInsightService";
import { mockClients } from "howl/app/smartRecom/data/mockClientDB";

export const clientInsightRouter = createTRPCRouter({
  getClientInsight: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const client = mockClients.find((c) => c.id === input.id);
      if (!client) throw new Error("Client not found");

      const insight = await generateClientInsight(client.reports);
      return insight;
    }),
});