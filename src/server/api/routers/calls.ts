import { callSchema } from "@/app/utils/schemas/callSchema";
import { createTRPCRouter, protectedProcedure } from "howl/server/api/trpc";

export const callRouter = createTRPCRouter({

  getAll: protectedProcedure
  .query(async ({ ctx }) => {
    const calls = await ctx.db.calls.findMany({
      include: {
        client: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
          }
        }
      }
    });

    return calls;
  }),

  getByConsultantId: protectedProcedure
  .query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        consultant: {
          select: {
            id: true,
          }
        }
      }
    });
    const id = user?.consultant ? user.consultant[0]?.id : undefined;
    if (!id) {
      return [];
    }

    const calls = await ctx.db.calls.findMany({
      where: {
        consultant_id: id,
      },
      include: {
        client: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
          }
        }
      }
    });
    return calls;
  }),

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

    let result;
    let message;

    // Update the existing call if it exists
    if (existingCall) {
      result = await ctx.db.calls.update({ // Added await here
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
      });
      message = "actualizada";
    } else {
      // If no existing call, create a new one
      result = await ctx.db.calls.create({ // Added await here
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
      });
      message = "creada";
    }

    // --- DEBUGGING LOGS START ---
    console.log("Backend - Prisma operation result:", result);
    // --- DEBUGGING LOGS END ---

    return { message: message, result: result }
  }),
});