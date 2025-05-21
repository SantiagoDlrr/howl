//root.ts
import { postRouter } from "howl/server/api/routers/post";
import { signupRouter } from "howl/server/api/routers/signup";
import { createCallerFactory, createTRPCRouter } from "howl/server/api/trpc";
import { feedbackRouter } from "./routers/feedback";
import { companyRouter } from "./routers/company";
import { clientRouter } from "./routers/companyClient";
import { chatTestRouter } from "@/app/smartRecom/routers/chatTest";
import { clientInsightRouter } from "@/app/smartRecom/routers/clientInsight";
import { clientResolverRouter } from "@/app/smartRecom/routers/clientResolver";
import { callRouter } from "./routers/calls";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  signup: signupRouter,
  feedback: feedbackRouter,
  company: companyRouter,
  companyClient: clientRouter,
  chatTest: chatTestRouter,
  clientInsight: clientInsightRouter,
  clientResolver: clientResolverRouter,
  calls: callRouter,
  user: userRouter,

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
