
import {
  createTRPCRouter,
  protectedProcedure,
} from "howl/server/api/trpc";

export const feedbackRouter = createTRPCRouter({
    getAll: protectedProcedure 
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