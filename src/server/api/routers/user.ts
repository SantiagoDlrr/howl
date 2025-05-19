import { createTRPCRouter, protectedProcedure } from "howl/server/api/trpc";

export const userRouter = createTRPCRouter({
    getConsultantId: protectedProcedure
    .query(async ({ ctx }) => {
        const user = await ctx.db.user.findUnique({
            where: {
                id: ctx.session.user.id,
            },
            select: {
                consultant: {
                    select: {
                        id: true,
                    }
                }
            }
        });

        const id = user?.consultant ? user.consultant[0]?.id : undefined;
        if (!id) {
            return -1;
        }
        return id;
    }),
})