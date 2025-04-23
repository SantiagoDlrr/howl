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

    get: protectedProcedure
        .input(z.number().nullable())
        .query(async ({ctx, input}) => {
            if (!input) {
                return ctx.db.client.findMany({
                    include: {
                        company: true,
                    }
                })
            } else {
                return ctx.db.client.findMany({
                    where: {
                        id: input,
                    },
                    include: {
                        company: true,
                    }
                })
            }
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

    getById: protectedProcedure
        .input(z.number())
        .query(async ({ctx, input}) => {
            return ctx.db.client.findUnique({
                where: {
                    id: input,
                },
                include: {
                    company: true,
                }
            })
        }),

    getAll: protectedProcedure
        .query(async ({ctx}) => {
            return ctx.db.client.findMany({
                include: {
                    company: true,
                }
            })
        }
    ),
})