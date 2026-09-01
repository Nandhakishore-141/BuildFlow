import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const sslConfig =
  process.env.DB_SSL === 'false'
    ? undefined
    : {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true,
      };

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '4000', 10),
  ssl: sslConfig,
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
    .replace(/\bRETURNING\b[\s\S]*?(?=;|\)|$)/gi, '')
    .replace(/ON\s+CONFLICT\s*(\([^)]*\))?\s*DO\s+NOTHING/gi, 'ON DUPLICATE KEY UPDATE id=id')
    .replace(/ON\s+CONFLICT\s*(\([^)]*\))?\s*DO\s+UPDATE\s+SET/gi, 'ON DUPLICATE KEY UPDATE')
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
        // Map common MySQL aggregate column names to uniform property names
        const normalizedRows = results.map((row) => {
          if (row && typeof row === 'object') {
            for (const key of Object.keys(row)) {
              if (/^COUNT\(/i.test(key) && !('count' in row)) {
                row.count = row[key];
              }
              if (/^COALESCE\(SUM\(/i.test(key) && !('total' in row) && !('sum' in row)) {
                row.total = row[key];
              }
            }
          }
          return row;
        });

        return {
          rows: normalizedRows,
          rowCount: normalizedRows.length,
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
      const errMsg = error.code ? `[${error.code}] ${error.message || 'Connection timed out or refused'}` : (error.message || String(error));
      console.error('MySQL Query Execution Error:', errMsg, '\nSQL:', formattedSql);
      throw error;
    }
  }
};

export default db;
