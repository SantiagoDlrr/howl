import { db } from "@/server/db";

class ClientsController {
    private static instance: ClientsController;

    private constructor() {}

    public static getInstance(): ClientsController {
        if (!this.instance) {
            this.instance = new ClientsController();
        }
        return this.instance;
    }

    public async getClients(): Promise<any> {
        const clients = await db.client.findMany({
            include: {
                company: true,
            }
        })

        return clients;
    }
}

export default ClientsController;