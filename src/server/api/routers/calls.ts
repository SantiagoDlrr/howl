import { callSchema } from "@/app/utils/schemas/callSchema";
import { createTRPCRouter, protectedProcedure } from "howl/server/api/trpc";

export const callRouter = createTRPCRouter({
  createCall: protectedProcedure
  .input(callSchema)
  .mutation(async ({ ctx, input }) => {
    const { client_id, consultant_id, ...restData } = input;
    // Check if there is already a call with same date and client_id and consultant_id
    const existingCall = await ctx.db.calls.findFirst({
      where: {
        date: restData.date,
        client_id: client_id,
        consultant_id: consultant_id,
      }
    });

    // Update the existing call if it exists
    if (existingCall) {
      const result = ctx.db.calls.update({
        where: {
          id: existingCall.id,
        },
        data: {
          ...restData,
          client: {
            connect: {
              id: client_id,
            }
          },
          consultant: {
            connect: {
              id: consultant_id,
            }
          }
        }
      })

      return { message: "actualizada", result: result }
    }

    // If no existing call, create a new one  
    const result = ctx.db.calls.create({
      data: {
        ...restData,
        client: {
          connect: {
            id: client_id,
          }
        },
        consultant: {
          connect: {
            id: consultant_id,
          }
        }
      }
    })

    return { message: "creada", result: result }
  }),
})