import { query } from '@/lib/database';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        // Extract user ID from query parameters
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("id");

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Check if user is an Administrator
        const isAdmin = await query(
            `SELECT 1 FROM administrator WHERE administrator_id = ?`, 
            [userId]
        );

        // Check if user is a Supervisor
        const isSupervisor = await query(
            `SELECT 1 FROM supervisor WHERE supervisor_id = ?`, 
            [userId]
        );

        // Determine role
        //hola
        let role = "consultant"; // Default role
        if (isAdmin.length > 0) role = "administrator";
        else if (isSupervisor.length > 0) role = "supervisor";

        return NextResponse.json({ id: userId, role });

    } catch (error) {
        console.error("Error fetching user role:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}