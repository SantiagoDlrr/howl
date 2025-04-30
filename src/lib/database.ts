import pkg from 'pg';
const { Pool } = pkg;
import type { Pool as PgPool, QueryResultRow } from 'pg'; // 👈 Aquí importas el tipo Pool
import dotenv from 'dotenv';

dotenv.config();

declare global {
  // eslint-disable-next-line no-var
  var _pool: PgPool | undefined;
}

const pool: PgPool = global._pool || new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 18510,
  ssl: {
    rejectUnauthorized: false,
  },
});

if (process.env.NODE_ENV !== 'production') {
  global._pool = pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  sql: string,
  params?: (string | number | boolean | null)[]
): Promise<T[]> {
  const client = await pool.connect();
  try {
    const result = await client.query<T>(sql, params);
    return result.rows;
  } catch (error) {
    if (error instanceof Error) {
      console.error('🛑 Database query error:', error.message);
    } else {
      console.error('🛑 Database query error: Unexpected error', error);
    }
    throw error;
  } finally {
    client.release();
  }
}