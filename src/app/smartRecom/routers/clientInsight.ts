//smartRecom/routers/clientInsight.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "howl/server/api/trpc";
import { generateClientInsight } from "howl/app/smartRecom/services/clientInsightService";
import { mockClients } from "howl/app/smartRecom/data/mockClientDB";
import { FileData, ClientInsightResponse } from '../models/types';

export const clientInsightRouter = createTRPCRouter({
  getClientInsight: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const client = await ctx.db.client.findUnique({
        where: { id: input.id },
        include: {
          calls: true,
        }
      });
      // const client = mockClients.find((c) => c.id === input.id);
      if (!client) throw new Error("Client not found");

      const callsFileData = client.calls.map((call) => ({
        client_name: client.firstname + " " + client.lastname,
        id: call.id,
        name: call.name,
        date: call.date,
        type: call.type,
        duration: call.duration,
        report: {
          feedback: call.feedback,
          keyTopics: call.main_ideas,
          emotions: [],
          sentiment: call.sentiment_analysis,
          output: call.output,
          summary: call.summary,
          rating: call.satisfaction,
        },
        // transcript: call.transcript,
        // messages: call.messages,
      })) as FileData[];

      const insight = await generateClientInsight(callsFileData);
      return insight;
    }),
});