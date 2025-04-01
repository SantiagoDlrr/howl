import { postRouter } from "howl/server/api/routers/post";
import { registerRouter } from "howl/server/api/routers/register";
import { createCallerFactory, createTRPCRouter } from "howl/server/api/trpc";
import { companyRouter } from "howl/server/api/routers/company";
import { callRouter } from "howl/server/api/routers/calls";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  register: registerRouter,
  calls: callRouter,
  company: companyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
