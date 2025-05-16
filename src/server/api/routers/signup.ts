import { z } from "zod";
import bcrypt from 'bcryptjs';

import {
  createTRPCRouter,
  publicProcedure,
} from "howl/server/api/trpc";

export const signupRouter = createTRPCRouter({
    signup: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email"),
        password: z.string().min(6, "Password must be at least 6 characters long"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, email, password } = input;

      // Check if the user already exists
      const existingUser = await ctx.db.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new Error("User already exists");
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the new user
      const user = await ctx.db.user.create({
        data: { name, email, hashedPassword },
      });

      return { success: true, user };
    }),

    deleteUser: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.delete({
        where: {
          email: input.email,
        },
      });
    }),
})