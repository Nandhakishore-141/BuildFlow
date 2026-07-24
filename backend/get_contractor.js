import db from './src/config/db.js';

async function getContractors() {
  const res = await db.query("SELECT id, name, email, company_name FROM users WHERE role = 'Contractor' LIMIT 5");
  console.log(res.rows);
}
getContractors();
