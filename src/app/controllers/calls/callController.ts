import { SessionData } from "@/app/utils/types/sessionData";
import { db } from "@/server/db";

class CallsController {
    private static instance: CallsController;

    static getInstance(): CallsController {
        if (!this.instance) {
            this.instance = new CallsController();
        }
        return this.instance;
    }

    async getCalls(sessionData: SessionData) {
        // console.log("Session Data:", sessionData);
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
                }
              }
            }
          });

        return calls;
    }
}

export default CallsController;