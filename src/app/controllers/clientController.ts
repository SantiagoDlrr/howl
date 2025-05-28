import { db } from "@/server/db";
import { client } from "@prisma/client";

  
class ClientsController {
    private static instance: ClientsController;

    public static getInstance(): ClientsController {
        if (!this.instance) {
            this.instance = new ClientsController();
        }
        return this.instance;
    }

    public async getClients(): Promise<client[]> {
        const clients = await db.client.findMany({
            include: {
                company: true,
            }
        })

        return clients;
    }
}

export default ClientsController;