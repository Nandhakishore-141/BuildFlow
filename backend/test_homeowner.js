import pg from 'pg';

const pool = new pg.Pool({
  host: '127.0.0.1',
  port: 5432,
  database: 'constructiq',
  user: 'postgres',
  password: '123456'
});

async function main() {
  const res = await pool.query("SELECT id, name, email, role FROM users WHERE role = 'Homeowner' LIMIT 5");
  console.log('Registered Homeowners in DB:', res.rows);
  await pool.end();
}

main();
