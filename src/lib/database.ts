// src/lib/database.ts
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 18510,
  ssl: process.env.DB_SSL === 'true' ? { 
    rejectUnauthorized: false 
  } : false
});

export async function query(sql: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(sql, params);
    return result.rows;
  } finally {
    client.release();
  }
}