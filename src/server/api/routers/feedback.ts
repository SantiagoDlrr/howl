import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "howl/server/api/trpc";

export const feedbackRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({
      consultantId: z.number().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const results = await ctx.db.client_feedback.findMany({
        where: input.consultantId
          ? { consultant: { id: input.consultantId } }
          : undefined,
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
            rating: true,
            user_id: true,
        },
        },
        },
      });
      return results;
    }),
});