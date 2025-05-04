import { query } from '@/lib/database';
import { NextResponse } from 'next/server';

// Obtener todas las llamadas de un consultor
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const consultantId = searchParams.get('id'); // Extrae el 'id' de la query string

    if (!consultantId) {
      return NextResponse.json({ error: 'Consultant ID not provided' }, { status: 400 });
    }

    const results = await query(`
      SELECT c.date, co.name as company, c.id as call_id
      FROM calls c
      INNER JOIN client ci ON ci.id = c.client_id
      INNER JOIN company co ON ci.company_id = co.id
      WHERE c.consultant_id = $1
      ORDER BY c.date DESC;
    `, [consultantId]);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching consultant calls:', error);
    return NextResponse.error();
  }
}