import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "howl/server/api/trpc";

export const feedbackRouter = createTRPCRouter({
    getAll: publicProcedure
    .query(async ({ ctx }) => {
        const results = await ctx.db.client_feedback.findMany({
            include: {
                client: {
                    select: {
                        id: true,
                        firstname: true,
                        lastname: true,
                    },
                },
                consultant: {
                    select: {   
                        id: true,
                        firstname: true,
                        lastname: true,
                        email: true,
                    },
                },
            }
        })
        return results;
    }),

})