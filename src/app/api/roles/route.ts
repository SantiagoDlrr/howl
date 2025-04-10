import { query } from '@/lib/database';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // First, get the consultant.id that matches the user_id
    const consultantResult = await query(
      `SELECT id FROM consultant WHERE user_id = ?`,
      [userId]
    );

    if (consultantResult.length === 0) {
      return NextResponse.json({ error: "Consultant not found for this user" }, { status: 404 });
    }

    const consultantId = consultantResult[0]?.id;

    if (!consultantId) {
      return NextResponse.json({ error: "Consultant ID not found" }, { status: 404 });
    }

    // Check roles based on consultantId
    const isAdmin = await query(
      `SELECT 1 FROM administrator WHERE administrator_id = ?`,
      [consultantId]
    );

    const isSupervisor = await query(
      `SELECT 1 FROM supervisor WHERE supervisor_id = ?`,
      [consultantId]
    );

    let role = "consultant";
    if (isAdmin.length > 0) role = "administrator";
    else if (isSupervisor.length > 0) role = "supervisor";

    return NextResponse.json({ userId, consultantId, role });
  } catch (error) {
    console.error("Error fetching user role:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}