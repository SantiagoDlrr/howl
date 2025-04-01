import { callSchema } from "howl/app/utils/schemas/schemas";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "howl/server/api/trpc";

export const callRouter = createTRPCRouter({

    getCalls: publicProcedure
        .query(async ({ ctx }) => {
            const calls = await ctx.db.calls.findMany({
                include: {
                    call_emotions: true,
                    consultant: true,
                    client: true,
                },
            });

            return calls;
        }),

    getCallByClientId: publicProcedure
        .input(z.object({ client_id: z.number() }))
        .query(async ({ ctx, input }) => {
            const { client_id } = input;
            const calls = await ctx.db.calls.findMany({
                where: {
                    client_id: client_id,
                },
                include: {
                    call_emotions: true,
                    consultant: true,
                    client: true,
                },
            });

            return calls;
        }),

    createCall: publicProcedure
    .input(callSchema)
    .mutation(async ({ ctx, input }) => {
      const { call_emotions, consultant_id, client_id, ...callData } = input;
    
      const data: any = {
        ...callData,
        call_emotions: {
          create: call_emotions ? call_emotions : [],
        },
      };
    
      if (consultant_id) {
        data.consultant = { connect: { id: consultant_id } };
      }
    
      if (client_id) {
        data.client = { connect: { id: client_id } };
      }
    
      const newCall = await ctx.db.calls.create({
        data,
        include: {
          call_emotions: true, 
          consultant: true,
          client: true, 
        },
      });
    
      return newCall;
    }),
    
});

