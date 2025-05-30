import SessionController from "@/app/controllers/sessionController";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const sessionController = SessionController.getInstance();
    const sessionResponse = await sessionController.getSession(req);

    if (sessionResponse.status === 200) {
        const sessionData = await sessionResponse.json();
        const userData = await sessionController.getUserDetails(sessionData);
        console.log("User details fetched successfully:", userData);
        return NextResponse.json(userData);
    }

    return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
    );
}