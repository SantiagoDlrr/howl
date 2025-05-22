import { createTRPCRouter, protectedProcedure } from "howl/server/api/trpc";

export const consultantRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.consultant.findMany({
      select: {
        id: true,
        firstname: true,
        lastname: true,
      },
    });
  }),
});