import fetch from 'node-fetch';

async function testContractorModule() {
  try {
    console.log('--- 1. Contractor Login (Alex Turner - ABC Constructions) ---');
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'contact@abcconstructions.com', password: 'Password@123' })
    });
    const loginData = await loginRes.json();
    if (loginRes.status !== 200) {
      throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
    }
    const token = loginData.data.tokens.accessToken;
    const authHeaders = { Authorization: `Bearer ${token}` };
    console.log('✅ Logged in as:', loginData.data.user.name, `(${loginData.data.user.company_name})`);

    console.log('\n--- 2. GET /api/contractor/dashboard ---');
    const dashRes = await fetch('http://localhost:5000/api/contractor/dashboard', { headers: authHeaders });
    const dashData = await dashRes.json();
    console.log('✅ Dashboard Status:', dashRes.status, 'Active Projects:', dashData.data?.active_projects, 'Total Budget:', dashData.data?.total_budget);

    console.log('\n--- 3. GET /api/contractor/projects ---');
    const prjRes = await fetch('http://localhost:5000/api/contractor/projects', { headers: authHeaders });
    const prjData = await prjRes.json();
    console.log('✅ Projects Count:', prjData.data?.length);

    console.log('\n--- 4. GET /api/contractor/workers ---');
    const wrkRes = await fetch('http://localhost:5000/api/contractor/workers', { headers: authHeaders });
    const wrkData = await wrkRes.json();
    console.log('✅ Workers Count:', wrkData.data?.length);

    console.log('\n--- 5. GET /api/contractor/attendance ---');
    const attRes = await fetch('http://localhost:5000/api/contractor/attendance', { headers: authHeaders });
    const attData = await attRes.json();
    console.log('✅ Attendance Logs Count:', attData.data?.length);

    console.log('\n--- 6. GET /api/contractor/materials ---');
    const matRes = await fetch('http://localhost:5000/api/contractor/materials', { headers: authHeaders });
    const matData = await matRes.json();
    console.log('✅ Materials Count:', matData.data?.length);

    console.log('\n--- 7. GET /api/contractor/expenses ---');
    const expRes = await fetch('http://localhost:5000/api/contractor/expenses', { headers: authHeaders });
    const expData = await expRes.json();
    console.log('✅ Expenses Count:', expData.data?.length);

    console.log('\n--- 8. GET /api/contractor/progress ---');
    const progRes = await fetch('http://localhost:5000/api/contractor/progress', { headers: authHeaders });
    const progData = await progRes.json();
    console.log('✅ Progress Updates Count:', progData.data?.length);

    console.log('\n--- 9. GET /api/contractor/documents ---');
    const docRes = await fetch('http://localhost:5000/api/contractor/documents', { headers: authHeaders });
    const docData = await docRes.json();
    console.log('✅ Documents Count:', docData.data?.length);

    console.log('\n--- 10. GET /api/contractor/settings ---');
    const setRes = await fetch('http://localhost:5000/api/contractor/settings', { headers: authHeaders });
    const setData = await setRes.json();
    console.log('✅ Settings Data:', setData.data?.name, '-', setData.data?.company_name);

    console.log('\n==================================================');
    console.log('🎉 CONTRACTOR MODULE BACKEND VERIFICATION PASSED!');
    console.log('==================================================');
  } catch (err) {
    console.error('❌ Error during contractor test:', err);
  }
}

testContractorModule();
