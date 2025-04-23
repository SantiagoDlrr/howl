import { z } from 'zod';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
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
})