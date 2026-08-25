import app from '../src/app.js';

const server = app.listen(5096, async () => {
  console.log('Testing full application suite on port 5096...\n');

  const testEndpoints = [
    // 1. CONTRACTOR (17 Endpoints)
    { role: 'Contractor', email: 'contact@abcconstructions.com', method: 'GET', url: '/api/contractor/dashboard' },
    { role: 'Contractor', email: 'contact@abcconstructions.com', method: 'GET', url: '/api/contractor/projects' },
    { role: 'Contractor', email: 'contact@abcconstructions.com', method: 'GET', url: '/api/contractor/projects/prj-00000000000000000000000000000001' },
    { role: 'Contractor', email: 'contact@abcconstructions.com', method: 'GET', url: '/api/contractor/workers' },
    { role: 'Contractor', email: 'contact@abcconstructions.com', method: 'GET', url: '/api/contractor/projects/prj-00000000000000000000000000000001/available-workers' },
    { role: 'Contractor', email: 'contact@abcconstructions.com', method: 'GET', url: '/api/contractor/attendance' },
    { role: 'Contractor', email: 'contact@abcconstructions.com', method: 'GET', url: '/api/contractor/materials' },
    { role: 'Contractor', email: 'contact@abcconstructions.com', method: 'GET', url: '/api/contractor/expenses' },
    { role: 'Contractor', email: 'contact@abcconstructions.com', method: 'GET', url: '/api/contractor/progress' },
    { role: 'Contractor', email: 'contact@abcconstructions.com', method: 'GET', url: '/api/contractor/documents' },
    { role: 'Contractor', email: 'contact@abcconstructions.com', method: 'GET', url: '/api/contractor/settings' },
    { role: 'Contractor', email: 'contact@abcconstructions.com', method: 'GET', url: '/api/contractor/opportunities' },
    { role: 'Contractor', email: 'contact@abcconstructions.com', method: 'GET', url: '/api/contractor/invitations' },
    { role: 'Contractor', email: 'contact@abcconstructions.com', method: 'GET', url: '/api/contractor/calendar' },
    { role: 'Contractor', email: 'contact@abcconstructions.com', method: 'GET', url: '/api/contractor/projects/prj-00000000000000000000000000000001/tasks' },
    { role: 'Contractor', email: 'contact@abcconstructions.com', method: 'GET', url: '/api/contractor/projects/prj-00000000000000000000000000000001/milestones' },
    { role: 'Contractor', email: 'contact@abcconstructions.com', method: 'GET', url: '/api/contractor/projects/prj-00000000000000000000000000000001/work-updates' },

    // 2. HOMEOWNER (9 Endpoints)
    { role: 'Homeowner', email: 'robert.taylor@example.com', method: 'GET', url: '/api/homeowner/dashboard' },
    { role: 'Homeowner', email: 'robert.taylor@example.com', method: 'GET', url: '/api/homeowner/buildings' },
    { role: 'Homeowner', email: 'robert.taylor@example.com', method: 'GET', url: '/api/homeowner/verified-contractors' },
    { role: 'Homeowner', email: 'robert.taylor@example.com', method: 'GET', url: '/api/homeowner/buildings/prj-00000000000000000000000000000001' },
    { role: 'Homeowner', email: 'robert.taylor@example.com', method: 'GET', url: '/api/homeowner/buildings/prj-00000000000000000000000000000001/proposals' },
    { role: 'Homeowner', email: 'robert.taylor@example.com', method: 'GET', url: '/api/homeowner/projects/prj-00000000000000000000000000000001/progress' },
    { role: 'Homeowner', email: 'robert.taylor@example.com', method: 'GET', url: '/api/homeowner/projects/prj-00000000000000000000000000000001/expenses' },
    { role: 'Homeowner', email: 'robert.taylor@example.com', method: 'GET', url: '/api/homeowner/projects/prj-00000000000000000000000000000001/documents' },
    { role: 'Homeowner', email: 'robert.taylor@example.com', method: 'GET', url: '/api/homeowner/notifications' },

    // 3. WORKER (7 Endpoints)
    { role: 'Worker', email: 'arjun.sharma@worker.constructiq.com', method: 'GET', url: '/api/worker/dashboard' },
    { role: 'Worker', email: 'arjun.sharma@worker.constructiq.com', method: 'GET', url: '/api/worker/tasks' },
    { role: 'Worker', email: 'arjun.sharma@worker.constructiq.com', method: 'GET', url: '/api/worker/attendance' },
    { role: 'Worker', email: 'arjun.sharma@worker.constructiq.com', method: 'GET', url: '/api/worker/invitations' },
    { role: 'Worker', email: 'arjun.sharma@worker.constructiq.com', method: 'GET', url: '/api/worker/announcements' },
    { role: 'Worker', email: 'arjun.sharma@worker.constructiq.com', method: 'GET', url: '/api/worker/profile' },
    { role: 'Worker', email: 'arjun.sharma@worker.constructiq.com', method: 'GET', url: '/api/worker/notifications' },

    // 4. ADMIN (11 Endpoints)
    { role: 'Admin', email: 'admin@constructiq.com', method: 'GET', url: '/api/admin/dashboard' },
    { role: 'Admin', email: 'admin@constructiq.com', method: 'GET', url: '/api/admin/analytics' },
    { role: 'Admin', email: 'admin@constructiq.com', method: 'GET', url: '/api/admin/users' },
    { role: 'Admin', email: 'admin@constructiq.com', method: 'GET', url: '/api/admin/contractors' },
    { role: 'Admin', email: 'admin@constructiq.com', method: 'GET', url: '/api/admin/homeowners' },
    { role: 'Admin', email: 'admin@constructiq.com', method: 'GET', url: '/api/admin/workers' },
    { role: 'Admin', email: 'admin@constructiq.com', method: 'GET', url: '/api/admin/projects' },
    { role: 'Admin', email: 'admin@constructiq.com', method: 'GET', url: '/api/admin/reports' },
    { role: 'Admin', email: 'admin@constructiq.com', method: 'GET', url: '/api/admin/announcements' },
    { role: 'Admin', email: 'admin@constructiq.com', method: 'GET', url: '/api/admin/audit-logs' },
    { role: 'Admin', email: 'admin@constructiq.com', method: 'GET', url: '/api/admin/notifications' }
  ];

  const tokenCache = {};
  let passed = 0;
  let failed = 0;

  for (const test of testEndpoints) {
    if (!tokenCache[test.email]) {
      const loginRes = await fetch('http://localhost:5096/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: test.email, password: 'pass' })
      });
      const loginData = await loginRes.json();
      tokenCache[test.email] = loginData.data?.tokens?.accessToken;
    }

    const token = tokenCache[test.email];
    try {
      const res = await fetch('http://localhost:5096' + test.url, {
        method: test.method,
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const json = await res.json();
      if (res.status === 200) {
        console.log(`[PASS] ${test.role.padEnd(11)} | ${test.url}`);
        passed++;
      } else {
        console.error(`[FAIL] ${test.role.padEnd(11)} | ${test.url} -> Status ${res.status}:`, json);
        failed++;
      }
    } catch (e) {
      console.error(`[ERROR] ${test.role.padEnd(11)} | ${test.url} ->`, e.message);
      failed++;
    }
  }

  console.log('\n======================================================');
  console.log(`TOTAL TESTED: ${testEndpoints.length} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log(failed === 0 ? '✓ 100% OF ALL ROLE ENDPOINTS ARE WORKING FLAWLESSLY!' : '✗ Some tests failed');
  console.log('======================================================\n');

  server.close();
  process.exit(failed === 0 ? 0 : 1);
});
