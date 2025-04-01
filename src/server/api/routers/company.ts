import { z } from 'zod';
import { companySchema } from 'howl/app/utils/schemas/schemas';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from 'howl/server/api/trpc';

export const companyRouter = createTRPCRouter({
    createCompany: publicProcedure
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
        })
})
