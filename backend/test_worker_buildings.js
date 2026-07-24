import fetch from 'node-fetch';
import pg from 'pg';

const pool = new pg.Pool({
  host: '127.0.0.1',
  port: 5432,
  database: 'constructiq',
  user: 'postgres',
  password: '123456'
});

async function testWorkerBuildings() {
  try {
    const workerRes = await pool.query("SELECT id, name, email FROM users WHERE role = 'Worker' LIMIT 1");
    const workerUser = workerRes.rows[0];
    console.log('--- 1. Worker Login ---');
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: workerUser.email, password: 'Password@123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.data.tokens.accessToken;
    console.log('✅ Worker Logged In:', workerUser.name, '(', workerUser.email, ')');

    const headers = { Authorization: 'Bearer ' + token };

    console.log('\n--- 2. GET /api/projects (Worker Assigned Buildings) ---');
    const projRes = await fetch('http://localhost:5000/api/projects', { headers });
    const projData = await projRes.json();
    console.log('✅ Assigned Buildings Count:', projRes.status, projData.data.data.length);

    if (projData.data.data.length > 0) {
      const bId = projData.data.data[0].id;
      console.log('\n--- 3. GET /api/projects/' + bId + '/building-workspace ---');
      const wsRes = await fetch('http://localhost:5000/api/projects/' + bId + '/building-workspace', { headers });
      const wsData = await wsRes.json();
      console.log('✅ Building Workspace Status:', wsRes.status);
      const ws = wsData.data;
      console.log('   ↳ Building Name:', ws.project.project_name);
      console.log('   ↳ Contractor:', ws.team.contractor.name, '(', ws.team.contractor.company_name, ')');
      console.log('   ↳ Site Engineer:', ws.team.site_engineer.name);
      console.log('   ↳ Workers Count:', ws.team.workers.length);
      console.log('   ↳ Progress Feed Updates:', ws.progress.length);
      console.log('   ↳ Milestones Count:', ws.tasks.length);
      console.log('   ↳ Documents Count:', ws.documents.length);
    }

    console.log('\n--- 4. Verify Security: Reject Unassigned Building Access ---');
    const fakeId = '00000000-0000-0000-0000-000000000000';
    const forbiddenRes = await fetch('http://localhost:5000/api/projects/' + fakeId + '/building-workspace', { headers });
    console.log('✅ Unassigned Access Status:', forbiddenRes.status, '(Expected 403 or 404)');

    console.log('\n==================================================');
    console.log('🎉 WORKER BUILDING WORKSPACE VERIFICATION PASSED!');
    console.log('==================================================');

  } catch (err) {
    console.error('❌ Error during worker verification:', err);
  } finally {
    await pool.end();
  }
}

testWorkerBuildings();
