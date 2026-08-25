import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'constructiq',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  decimalNumbers: true,
  dateStrings: true,
});

/**
 * Normalizes SQL queries and parameter bindings from PostgreSQL syntax ($1, $2) to MySQL syntax (?)
 */
function normalizeSqlAndParams(sql, params = []) {
  const matches = [...sql.matchAll(/\$(\d+)/g)];
  let reorderedParams = [];

  if (matches.length > 0 && params && params.length > 0) {
    for (const m of matches) {
      const idx = parseInt(m[1], 10) - 1;
      reorderedParams.push(params[idx]);
    }
  } else {
    reorderedParams = params || [];
  }

  let cleanSql = sql
    .replace(/\$\d+/g, '?')
    .replace(/\bILIKE\b/gi, 'LIKE')
    .replace(/::[a-zA-Z0-9_]+/g, '')
    .replace(/\bNULLS\s+LAST\b/gi, '')
    .replace(/\bNULLS\s+FIRST\b/gi, '')
    .replace(/NOW\(\)\s*-\s*INTERVAL\s*'(\d+)\s*hours'/gi, 'NOW() - INTERVAL $1 HOUR')
    .replace(/INTERVAL\s*'(\d+)\s*days'/gi, 'INTERVAL $1 DAY')
    .replace(/RETURNING\s+\*/gi, '')
    .replace(/ON\s+CONFLICT\s*(\([^)]*\))?\s*DO\s+NOTHING/gi, 'ON DUPLICATE KEY UPDATE id=id')
    .replace(/gen_random_uuid\(\)/gi, 'UUID()');

  return { sql: cleanSql, params: reorderedParams };
}

const db = {
  pool,
  async query(sql, params = []) {
    const { sql: formattedSql, params: formattedParams } = normalizeSqlAndParams(sql, params);
    try {
      const [results, fields] = await pool.query(formattedSql, formattedParams);
      if (Array.isArray(results)) {
        return {
          rows: results,
          rowCount: results.length,
          fields
        };
      }
      return {
        rows: [],
        rowCount: results.affectedRows || 0,
        insertId: results.insertId,
        affectedRows: results.affectedRows,
        fields
      };
    } catch (error) {
      console.error('MySQL Query Execution Error:', error.message, '\nSQL:', formattedSql);
      throw error;
    }
  }
};

export default db;
