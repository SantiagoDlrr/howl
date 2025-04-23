import { clientSchema } from "@/app/utils/schemas/clientSchema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const clientRouter = createTRPCRouter({
    createClient: protectedProcedure
        .input(clientSchema)
        .mutation(async ({ctx, input}) => {
            return ctx.db.client.create({
                data: {
                    ...input,
                }
            })
        }),

    getByCompanyId: protectedProcedure
        .input(z.number())
        .query(async ({ctx, input}) => {
            return ctx.db.client.findMany({
                where: {
                    company_id: input,
                },
            })
        }),
})