import type { SessionData } from "@/app/utils/types/sessionData";
import { db } from "@/server/db";
import z from "zod";
import type { callSchema } from "../utils/schemas/callSchema";

type CallInput = z.infer<typeof callSchema>;

class CallsController {
    private static instance: CallsController;

    static getInstance(): CallsController {
        if (!this.instance) {
            this.instance = new CallsController();
        }
        return this.instance;
    }

    async getCalls(sessionData: SessionData) {
        const id = await db.consultant.findFirst({
            where: {
                user_id: sessionData.id,
            },
        });

        if (!id) {
            return [];
        }

        const calls = await db.calls.findMany({
            where: {
              consultant_id: id.id,
            },
            include: {
              client: {
                select: {
                  id: true,
                  firstname: true,
                  lastname: true,
                  company: {
                    select: {
                       name: true,
                       id: true,
                    }
                  }
                }
              }
            },
            orderBy: {
              date: "desc",
            },
            take: 15,
          });

        return calls;
    }

    async createCall(callData: CallInput) {
      const { client_id, consultant_id, ...restData } = callData;
      const result = db.calls.create({
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
        },
        include: {
          client: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              company: true,
            }
          },
        }
      })
  
      return result;
  }
}

export default CallsController;