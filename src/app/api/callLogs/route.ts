import { query } from '@/lib/database';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const results = await query(`      
      SELECT 
        to_char(calls.date, 'Mon DD YYYY') AS "callDate",
        client.firstname || ' ' || client.lastname AS client,
        company.name AS "clientCompany",
        calls.type AS category,
        CASE 
          WHEN calls.satisfaction >= 7 THEN 'Positive'
          ELSE 'Negative'
        END AS rating,
        calls.duration AS time
      FROM calls
      JOIN client ON calls.client_id = client.id
      JOIN company ON client.company_id = company.id
      ORDER BY calls.date DESC
    `);
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch call logs' },
      { status: 500 }
    );
  }
}
