import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "howl/server/api/trpc";
//import { resolveClientOrCompany } from "../services/clientResolver";
import { chatClientController } from "../services/conversationalClientResolver";

export const clientResolverRouter = createTRPCRouter({
  /*OLD: resolveClient: publicProcedure
    .input(z.object({ query: z.string() }))
    .mutation(async ({ input }) => {
      return resolveClientOrCompany(input.query);
    }),*/

  conversationalResolve: publicProcedure
    .input(z.object({ message: z.string() }))
    .mutation(async ({ input }) => {
      const response = await chatClientController(input.message);
      return { response };
    }),
});