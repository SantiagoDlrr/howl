import { z } from 'zod';

import {
  createTRPCRouter,
  protectedProcedure,
} from 'howl/server/api/trpc';
import { companySchema } from '@/app/utils/schemas/companySchemas';

export const companyRouter = createTRPCRouter({
    createCompany: protectedProcedure
        .input(companySchema)
        .mutation(async ({ ctx, input }) => {
            const { address, ...companyData } = input;
            return ctx.db.company.create({
                data: {
                    ...companyData,
                    address: address
                        ? {
                              create: address,
                          }
                        : undefined,
                }
            });
    }),

    getAll: protectedProcedure
    .query(async ({ctx}) => {
        return ctx.db.company.findMany({
            include: {
                address: true,
                _count: {
                    select: {
                      client: true,
                    },
                }
            },
            
        });
    }),

    getById: protectedProcedure
    .input(z.number())
    .query(async ({ctx, input}) => {
        return ctx.db.company.findUnique({
            where: {
                id: input,
            },
            include: {
                address: true,
                _count: {
                    select: {
                      client: true,
                    },
                }
            }
        });
    }),

    editCompany: protectedProcedure
        .input(companySchema.extend({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
            const { address, ...companyData } = input;
            return ctx.db.company.update({
                where: {
                    id: input.id,
                },
                data: {
                    ...companyData,
                    address: address
                        ? {
                              update: address,
                          }
                        : undefined,
                }
            });
    }),

    deleteCompany: protectedProcedure
        .input(z.number())
        .mutation(async ({ ctx, input }) => {
            return ctx.db.company.delete({
                where: {
                    id: input,
                }
            });
    }),
    
})