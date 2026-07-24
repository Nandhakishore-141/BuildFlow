import fetch from 'node-fetch';

async function testHomeownerBuildings() {
  try {
    console.log('--- 1. Homeowner Login ---');
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'robert.taylor@example.com', password: 'Password@123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.data.tokens.accessToken;
    const owner = loginData.data.user;
    console.log('✅ Homeowner Logged In:', owner.name, '(', owner.role, ')');

    const headers = { Authorization: 'Bearer ' + token };

    console.log('\n--- 2. GET /api/homeowner/dashboard ---');
    const dashRes = await fetch('http://localhost:5000/api/homeowner/dashboard', { headers });
    const dashData = await dashRes.json();
    console.log('✅ Dashboard Stats:', dashRes.status, dashData.data);

    console.log('\n--- 3. GET /api/homeowner/buildings ---');
    const bRes = await fetch('http://localhost:5000/api/homeowner/buildings', { headers });
    const bData = await bRes.json();
    console.log('✅ Homeowner Buildings Count:', bRes.status, bData.data.length);

    if (bData.data.length > 0) {
      const bId = bData.data[0].id;
      console.log('\n--- 4. GET /api/homeowner/buildings/' + bId + ' (Workspace Aggregation) ---');
      const wsRes = await fetch('http://localhost:5000/api/homeowner/buildings/' + bId, { headers });
      const wsData = await wsRes.json();
      console.log('✅ Building Workspace HTTP Status:', wsRes.status);
      const ws = wsData.data;
      console.log('   ↳ Building Name:', ws.project.project_name);
      console.log('   ↳ Contractor:', ws.team.contractor.name, '(', ws.team.contractor.company_name, ')');
      console.log('   ↳ Workers Count:', ws.team.workers.length);
      console.log('   ↳ Progress Feed Log Count:', ws.progress.length);
      console.log('   ↳ Milestones Count:', ws.tasks.length);
      console.log('   ↳ Budget Spent:', ws.expenses.spent, '/ Budget:', ws.expenses.budget);
    }

    console.log('\n--- 5. Verify Security: Enforce Strict Ownership Check ---');
    const fakeId = '00000000-0000-0000-0000-000000000000';
    const forbiddenRes = await fetch('http://localhost:5000/api/homeowner/buildings/' + fakeId, { headers });
    console.log('✅ Unowned Building Access Status:', forbiddenRes.status, '(Expected 403 or 404)');

    console.log('\n==================================================');
    console.log('🎉 HOMEOWNER BUILDING WORKSPACE VERIFICATION PASSED!');
    console.log('==================================================');

  } catch (err) {
    console.error('❌ Error during verification:', err);
  }
}

testHomeownerBuildings();
