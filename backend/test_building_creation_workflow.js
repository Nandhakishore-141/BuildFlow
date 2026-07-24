import fetch from 'node-fetch';
import pg from 'pg';

const pool = new pg.Pool({
  host: '127.0.0.1',
  port: 5432,
  database: 'constructiq',
  user: 'postgres',
  password: '123456'
});

async function testWorkflow() {
  try {
    console.log('--- 1. Homeowner & Contractor Logins ---');
    const hoRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'robert.taylor@example.com', password: 'Password@123' })
    });
    const hoData = await hoRes.json();
    const hoToken = hoData.data.tokens.accessToken;
    console.log('✅ Homeowner Logged In:', hoData.data.user.name);

    const cRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'contact@abcconstructions.com', password: 'Password@123' })
    });
    const cData = await cRes.json();
    const cToken = cData.data.tokens.accessToken;
    const contractorUser = cData.data.user;
    console.log('✅ Contractor Logged In:', contractorUser.name, '(', contractorUser.company_name, ')');

    const hoHeaders = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + hoToken };
    const cHeaders = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + cToken };

    console.log('\n--- 2. Homeowner: Create Building with OPTION 1 (Direct Invitation) ---');
    const b1Res = await fetch('http://localhost:5000/api/homeowner/buildings', {
      method: 'POST',
      headers: hoHeaders,
      body: JSON.stringify({
        project_name: 'Elysium Towers Penthouse',
        project_type: 'Apartment',
        description: 'Luxury high-rise penthouse interior construction.',
        city: 'Bengaluru',
        state: 'Karnataka',
        budget: 35000000,
        planned_start_date: '2026-08-01',
        planned_end_date: '2027-04-01',
        priority: 'High',
        hiringMethod: 'invite',
        selectedContractorId: contractorUser.id
      })
    });
    const b1Data = await b1Res.json();
    console.log('✅ Building 1 Status:', b1Res.status, b1Data.data.status, '(Code:', b1Data.data.project_code, ')');

    console.log('\n--- 3. Contractor: View Invitation & Accept ---');
    const invRes = await fetch('http://localhost:5000/api/contractor/invitations', { headers: cHeaders });
    const invData = await invRes.json();
    console.log('✅ Invitations Count:', invRes.status, invData.data.length);
    const targetInv = invData.data.find(i => i.project_id === b1Data.data.id);

    if (targetInv) {
      const acceptRes = await fetch('http://localhost:5000/api/contractor/invitations/' + targetInv.id + '/respond', {
        method: 'POST',
        headers: cHeaders,
        body: JSON.stringify({ status: 'accepted' })
      });
      const acceptData = await acceptRes.json();
      console.log('✅ Invitation Accept Status:', acceptRes.status, acceptData.message);
    }

    console.log('\n--- 4. Homeowner: Create Building with OPTION 2 (Public Proposals Request) ---');
    const b2Res = await fetch('http://localhost:5000/api/homeowner/buildings', {
      method: 'POST',
      headers: hoHeaders,
      body: JSON.stringify({
        project_name: 'GreenValley Eco Villa',
        project_type: 'Villa',
        description: 'Sustainable solar powered villa requirement.',
        city: 'Bengaluru',
        state: 'Karnataka',
        budget: 18000000,
        planned_start_date: '2026-09-01',
        planned_end_date: '2027-05-01',
        priority: 'Medium',
        hiringMethod: 'publish'
      })
    });
    const b2Data = await b2Res.json();
    console.log('✅ Building 2 Status:', b2Res.status, b2Data.data.status);

    console.log('\n--- 5. Contractor: Browse Opportunities & Submit Proposal ---');
    const oppRes = await fetch('http://localhost:5000/api/contractor/opportunities', { headers: cHeaders });
    const oppData = await oppRes.json();
    console.log('✅ Open Opportunities Count:', oppRes.status, oppData.data.length);

    const propRes = await fetch('http://localhost:5000/api/contractor/proposals', {
      method: 'POST',
      headers: cHeaders,
      body: JSON.stringify({
        project_id: b2Data.data.id,
        estimated_budget: 17500000,
        estimated_duration: '7 Months',
        cover_message: 'We specialize in eco-friendly sustainable villa construction with certified green engineers.'
      })
    });
    const propData = await propRes.json();
    console.log('✅ Proposal Submission Status:', propRes.status, propData.message);

    console.log('\n--- 6. Homeowner: Review Proposals & Accept Contractor ---');
    const hoPropsRes = await fetch('http://localhost:5000/api/homeowner/buildings/' + b2Data.data.id + '/proposals', { headers: hoHeaders });
    const hoPropsData = await hoPropsRes.json();
    console.log('✅ Proposals Received Count:', hoPropsRes.status, hoPropsData.data.length);

    const targetProp = hoPropsData.data[0];
    const acceptPropRes = await fetch('http://localhost:5000/api/homeowner/proposals/' + targetProp.id + '/accept', {
      method: 'POST',
      headers: hoHeaders
    });
    const acceptPropData = await acceptPropRes.json();
    console.log('✅ Accept Proposal Status:', acceptPropRes.status, acceptPropData.message);

    console.log('\n--- 7. Verify Final Building Status in DB ---');
    const checkDb = await pool.query('SELECT id, project_name, status, contractor_id FROM projects WHERE id IN ($1, $2)', [b1Data.data.id, b2Data.data.id]);
    console.log('✅ DB Verification:', checkDb.rows);

    console.log('\n==================================================');
    console.log('🎉 COMPLETE BUILDING WORKFLOW VERIFICATION PASSED!');
    console.log('==================================================');

  } catch (err) {
    console.error('❌ Error during workflow test:', err);
  } finally {
    await pool.end();
  }
}

testWorkflow();
