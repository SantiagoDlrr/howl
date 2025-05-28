import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    
    return NextResponse.json({ valid: true, user: decoded });
  } catch (error) {
    console.log("Token verification error:", error);
    return NextResponse.json({ valid: false, error: "Invalid or expired token" }, { status: 401 });
  }
}
