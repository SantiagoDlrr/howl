import { NextResponse } from "next/server";
import SessionController from "@/app/controllers/sessionController";
import CallsController from "@/app/controllers/callController";

export async function GET(req: Request) {
    
    const sessionController = SessionController.getInstance();
    const callsController = CallsController.getInstance();
    const sessionResponse = await sessionController.getSession(req);
    
    if (sessionResponse.status === 200) {
        const sessionData = await sessionResponse.json();
        // console.log("Session Data:", sessionData);
        const calls = await callsController.getCalls(sessionData)
        console.log("Calls fetched successfully:", calls);
        return NextResponse.json(calls);
    }

    return sessionResponse;
}
