import { postRouter } from "howl/server/api/routers/post";
import { registerRouter } from "howl/server/api/routers/register";
import { createCallerFactory, createTRPCRouter } from "howl/server/api/trpc";
import { microsoftRouter } from "howl/server/api/routers/microsoft";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  register: registerRouter,
  microsoft: microsoftRouter
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
