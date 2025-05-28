import ClientsController from "@/app/controllers/clientController";
import SessionController from "@/app/controllers/sessionController";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const sessionController = SessionController.getInstance();
    const clientsController = ClientsController.getInstance();
    const sessionResponse = await sessionController.getSession(req);

    if (sessionResponse.status === 200) {
        const clients = await clientsController.getClients();
        console.log("Clients fetched successfully:", clients);
        return NextResponse.json(clients);
    }

    return sessionResponse;
}