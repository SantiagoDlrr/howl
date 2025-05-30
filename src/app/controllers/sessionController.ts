import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import type { SessionData } from "@/app/utils/types/sessionData";
import { db } from "@/server/db";

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

    async getConsultantId(sessionData: SessionData) {
        const id = await db.consultant.findFirst({
            where: {
                user_id: sessionData.id,
            },
        });

        return id ? id.id : null;
    }

    async getUserDetails(sessionData: SessionData) {

        const consultantId = await this.getConsultantId(sessionData);
        let callCount = 0;
        let role = "user";

        if (consultantId) {
            callCount = await db.calls.count({
                where: {
                    consultant_id: consultantId,
                },
            });

            // Check if it is supervisor
            const isSupervisor = await db.supervision.findFirst({
                where: {
                    supervisor_id: consultantId,
                },
            });
            if (isSupervisor) {
                role = "supervisor";
            }

            // Check if it is admin
            const isAdmin = await db.administration.findFirst({
                where: {
                    administrator_id: consultantId,
                },
            });
            if (isAdmin) {
                role = "administrator";
            }
            
        } else {
            callCount = 0;
        }

        const user = {
            id: sessionData.id,
            email: sessionData.email,
            name: sessionData.name || "User",
            callCount: callCount,
            role: role,
        };

        return user;
    }
}

export default SessionController;