import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { SessionData } from "@/app/utils/types/sessionData";

class SessionController {
    static instance: SessionController | null = null;
    
    static getInstance = () => {
        if (!this.instance) {
            this.instance = new SessionController();
        }
        return this.instance;
    }

    async getSession(req: Request) {
        const authHeader = req.headers.get("authorization");

        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Missing or invalid token" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return NextResponse.json({ error: "Token not provided" }, { status: 401 });
        }

        try {
            if (!process.env.JWT_SECRET) {
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as SessionData as {
                id: string;
                email: string;
                name?: string;
            };

            return NextResponse.json(decoded, { status: 200 });

        } catch (err) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
     
    }
}

export default SessionController;