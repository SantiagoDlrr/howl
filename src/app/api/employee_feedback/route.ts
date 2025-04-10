import { query } from '@/lib/database';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const name = searchParams.get('name'); // Extrae el 'name' de la query string

        if (!name) {
            return NextResponse.json({ error: 'Name not provided' }, { status: 400 });
        }
    
        const results = await query(`
            SELECT 
                cf.timestamp, 
                cf.consultant_satisfaction, 
                cf.consultant_feedback, 
                cf.call_satisfaction
            FROM client_feedback cf
            INNER JOIN consultant c ON c.id = cf.agent_id
            WHERE LOWER(TRIM(CONCAT(c.firstname, ' ', c.lastname))) = LOWER(TRIM($1))
            ORDER BY cf.timestamp DESC;
        `, [name]);
        return NextResponse.json(results);
    }
    catch (error) {
        console.error('Error fetching consultant feedback:', error);
        return NextResponse.error();
    }
}