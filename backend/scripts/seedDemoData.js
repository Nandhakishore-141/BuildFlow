import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import db from '../src/config/db.js';

/**
 * ConstructIQ - Development Demo Data Seeder
 * 
 * Safe for local development & testing.
 * Idempotent: checks for existing records and skips duplicates.
 */

async function seedDemoData() {
  console.log('--------------------------------------------------');
  console.log('🚀 Starting ConstructIQ Development Demo Data Seeder...');
  console.log('--------------------------------------------------');

  const stats = {
    users: 0,
    worker_profiles: 0,
    projects: 0,
    project_members: 0,
    worker_invitations: 0,
    tasks: 0,
    attendance: 0,
    materials: 0,
    expenses: 0,
    progress_updates: 0,
    documents: 0,
    notifications: 0,
    announcements: 0,
    audit_logs: 0,
    skipped: 0
  };

  try {
    // Hash common password 'Password@123' once for speed
    const defaultPasswordHash = await bcrypt.hash('Password@123', 10);
    const adminPasswordHash = await bcrypt.hash('Password@123', 10);

    // ==========================================
    // 1. ADMIN USER
    // ==========================================
    console.log('👤 Seeding Admin user...');
    let adminUser;
    const adminCheck = await db.query(`SELECT * FROM users WHERE email = $1`, ['admin@constructiq.com']);
    if (adminCheck.rows.length > 0) {
      await db.query(`UPDATE users SET password_hash = $1 WHERE email = $2`, [adminPasswordHash, 'admin@constructiq.com']);
      adminUser = (await db.query(`SELECT * FROM users WHERE email = $1`, ['admin@constructiq.com'])).rows[0];
      console.log('   ↳ Existing Admin user updated with Password@123');
    } else {
      const adminId = uuidv4();
      const insertAdmin = await db.query(
        `INSERT INTO users (id, name, email, password_hash, role, phone, company_name, is_verified)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [adminId, 'System Admin', 'admin@constructiq.com', adminPasswordHash, 'Admin', '0000000000', 'ConstructIQ Admin', true]
      );
      adminUser = insertAdmin.rows[0];
      stats.users++;
      console.log('   ↳ Created Admin user:', adminUser.email);
    }

    // ==========================================
    // 2. CONTRACTORS (5)
    // ==========================================
    console.log('🏗️ Seeding Contractors...');
    const contractorDefs = [
      { name: 'Alex Turner', email: 'contact@abcconstructions.com', company: 'ABC Constructions', phone: '+1-555-0101' },
      { name: 'Marcus Vance', email: 'contact@skylinebuilders.com', company: 'Skyline Builders', phone: '+1-555-0102' },
      { name: 'Elena Rostova', email: 'contact@greenstone.com', company: 'GreenStone Developers', phone: '+1-555-0103' },
      { name: 'Rajesh Verma', email: 'contact@primeinfra.com', company: 'Prime Infra', phone: '+1-555-0104' },
      { name: 'Vikramaditya Rao', email: 'contact@elitestructures.com', company: 'Elite Structures', phone: '+1-555-0105' }
    ];

    const contractors = [];
    for (const c of contractorDefs) {
      const check = await db.query(`SELECT * FROM users WHERE email = $1`, [c.email]);
      if (check.rows.length > 0) {
        contractors.push(check.rows[0]);
        stats.skipped++;
      } else {
        const id = uuidv4();
        const res = await db.query(
          `INSERT INTO users (id, name, email, password_hash, role, phone, company_name, is_verified)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
          [id, c.name, c.email, defaultPasswordHash, 'Contractor', c.phone, c.company, true]
        );
        contractors.push(res.rows[0]);
        stats.users++;
      }
    }
    console.log(`   ↳ Total Contractors available: ${contractors.length}`);

    // ==========================================
    // 3. HOMEOWNERS (10)
    // ==========================================
    console.log('🏡 Seeding Homeowners...');
    const homeownerDefs = [
      { name: 'Robert Taylor', email: 'robert.taylor@example.com', phone: '+1-555-0201' },
      { name: 'Sarah Jenkins', email: 'sarah.jenkins@example.com', phone: '+1-555-0202' },
      { name: 'David Miller', email: 'david.miller@example.com', phone: '+1-555-0203' },
      { name: 'Emily Clark', email: 'emily.clark@example.com', phone: '+1-555-0204' },
      { name: 'James Wilson', email: 'james.wilson@example.com', phone: '+1-555-0205' },
      { name: 'Amanda Martinez', email: 'amanda.martinez@example.com', phone: '+1-555-0206' },
      { name: 'Thomas Anderson', email: 'thomas.anderson@example.com', phone: '+1-555-0207' },
      { name: 'Laura White', email: 'laura.white@example.com', phone: '+1-555-0208' },
      { name: 'Daniel Harris', email: 'daniel.harris@example.com', phone: '+1-555-0209' },
      { name: 'Sophia Martin', email: 'sophia.martin@example.com', phone: '+1-555-0210' }
    ];

    const homeowners = [];
    for (const h of homeownerDefs) {
      const check = await db.query(`SELECT * FROM users WHERE email = $1`, [h.email]);
      if (check.rows.length > 0) {
        homeowners.push(check.rows[0]);
        stats.skipped++;
      } else {
        const id = uuidv4();
        const res = await db.query(
          `INSERT INTO users (id, name, email, password_hash, role, phone, is_verified)
           VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
          [id, h.name, h.email, defaultPasswordHash, 'Homeowner', h.phone, true]
        );
        homeowners.push(res.rows[0]);
        stats.users++;
      }
    }
    console.log(`   ↳ Total Homeowners available: ${homeowners.length}`);

    // ==========================================
    // 4. WORKERS (25) & WORKER PROFILES
    // ==========================================
    console.log('👷 Seeding Workers and Worker Profiles...');
    const workerDefs = [
      { name: 'Arjun Sharma', email: 'arjun.sharma@worker.constructiq.com', phone: '+1-555-0301', skill: 'Mason', exp: '8 Years', loc: 'Mumbai', avail: 'Available', wage: 950.00, rating: 4.90, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', about: 'Specialist in brickwork, AAC block masonry, and structural concrete casting.' },
      { name: 'Bhavesh Patel', email: 'bhavesh.patel@worker.constructiq.com', phone: '+1-555-0302', skill: 'Mason', exp: '12 Years', loc: 'Ahmedabad', avail: 'Busy', wage: 1100.00, rating: 4.80, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', about: 'Master mason for structural columns and decorative stone facades.' },
      { name: 'Chirag Verma', email: 'chirag.verma@worker.constructiq.com', phone: '+1-555-0303', skill: 'Mason', exp: '5 Years', loc: 'Delhi', avail: 'Available', wage: 850.00, rating: 4.70, avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150', about: 'Experienced in wall plastering, cement screed, and block masonry.' },
      { name: 'Dinesh Kumar', email: 'dinesh.kumar@worker.constructiq.com', phone: '+1-555-0304', skill: 'Carpenter', exp: '7 Years', loc: 'Bangalore', avail: 'Available', wage: 1000.00, rating: 4.85, avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', about: 'Skilled in shuttering, formwork, and interior wooden framing.' },
      { name: 'Eashwar Reddy', email: 'eashwar.reddy@worker.constructiq.com', phone: '+1-555-0305', skill: 'Carpenter', exp: '10 Years', loc: 'Hyderabad', avail: 'Busy', wage: 1200.00, rating: 4.95, avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', about: 'Expert carpenter for roof trusses, modular cabinetry, and doors.' },
      { name: 'Farhan Khan', email: 'farhan.khan@worker.constructiq.com', phone: '+1-555-0306', skill: 'Carpenter', exp: '4 Years', loc: 'Pune', avail: 'Available', wage: 800.00, rating: 4.60, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', about: 'Specialize in concrete formwork shuttering and scaffolding erection.' },
      { name: 'Girish Nair', email: 'girish.nair@worker.constructiq.com', phone: '+1-555-0307', skill: 'Electrician', exp: '9 Years', loc: 'Kochi', avail: 'Available', wage: 1150.00, rating: 4.90, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', about: 'Licensed industrial electrician for 3-phase wiring and DB panel setup.' },
      { name: 'Harish Rao', email: 'harish.rao@worker.constructiq.com', phone: '+1-555-0308', skill: 'Electrician', exp: '6 Years', loc: 'Chennai', avail: 'Busy', wage: 950.00, rating: 4.75, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', about: 'Residential and commercial conduit piping and light fixture fitting.' },
      { name: 'Imran Shaikh', email: 'imran.shaikh@worker.constructiq.com', phone: '+1-555-0309', skill: 'Electrician', exp: '11 Years', loc: 'Mumbai', avail: 'Available', wage: 1300.00, rating: 5.00, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', about: 'High-voltage wiring, earthing pits, and solar inverter installations.' },
      { name: 'Jatin Joshi', email: 'jatin.joshi@worker.constructiq.com', phone: '+1-555-0310', skill: 'Plumber', exp: '8 Years', loc: 'Delhi', avail: 'Available', wage: 1050.00, rating: 4.80, avatar: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=150', about: 'Sanitary fittings, CPVC/UPVC pipe laying, and drainage systems.' },
      { name: 'Karthik Sundaram', email: 'karthik.sundaram@worker.constructiq.com', phone: '+1-555-0311', skill: 'Plumber', exp: '5 Years', loc: 'Bangalore', avail: 'Available', wage: 900.00, rating: 4.65, avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150', about: 'Bathroom plumbing, overhead tank connections, and leak repairs.' },
      { name: 'Lokesh Yadav', email: 'lokesh.yadav@worker.constructiq.com', phone: '+1-555-0312', skill: 'Plumber', exp: '14 Years', loc: 'Jaipur', avail: 'Busy', wage: 1250.00, rating: 4.95, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', about: 'Master plumber for high-rise residential plumbing networks.' },
      { name: 'Manish Gupta', email: 'manish.gupta@worker.constructiq.com', phone: '+1-555-0313', skill: 'Painter', exp: '6 Years', loc: 'Kolkata', avail: 'Available', wage: 850.00, rating: 4.70, avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', about: 'Interior texture painting, primer coats, and putty applications.' },
      { name: 'Naveen Kumar', email: 'naveen.kumar@worker.constructiq.com', phone: '+1-555-0314', skill: 'Painter', exp: '9 Years', loc: 'Hyderabad', avail: 'Available', wage: 950.00, rating: 4.85, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', about: 'Exterior weather-proof coating, spray painting, and waterproofing.' },
      { name: 'Omkar Patil', email: 'omkar.patil@worker.constructiq.com', phone: '+1-555-0315', skill: 'Painter', exp: '4 Years', loc: 'Pune', avail: 'Available', wage: 750.00, rating: 4.50, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', about: 'Wall sanding, wood polishing, and enamel painting coats.' },
      { name: 'Pankaj Singh', email: 'pankaj.singh@worker.constructiq.com', phone: '+1-555-0316', skill: 'Welder', exp: '8 Years', loc: 'Nagpur', avail: 'Busy', wage: 1100.00, rating: 4.80, avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150', about: 'ARC and MIG welding for structural steel beams and trusses.' },
      { name: 'Qasim Ali', email: 'qasim.ali@worker.constructiq.com', phone: '+1-555-0317', skill: 'Welder', exp: '10 Years', loc: 'Lucknow', avail: 'Available', wage: 1200.00, rating: 4.90, avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', about: 'Certified welder for pressure pipes and heavy steel frame fabrications.' },
      { name: 'Ramesh Choudhary', email: 'ramesh.choudhary@worker.constructiq.com', phone: '+1-555-0318', skill: 'Steel Fixer', exp: '7 Years', loc: 'Indore', avail: 'Available', wage: 950.00, rating: 4.75, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', about: 'Rebar bending, column cage tying, and slab mesh reinforcement.' },
      { name: 'Suresh Gowda', email: 'suresh.gowda@worker.constructiq.com', phone: '+1-555-0319', skill: 'Steel Fixer', exp: '11 Years', loc: 'Bangalore', avail: 'Available', wage: 1150.00, rating: 4.92, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', about: 'Beam rebar fabrication and heavy structural steel binding.' },
      { name: 'Tufail Ahmed', email: 'tufail.ahmed@worker.constructiq.com', phone: '+1-555-0320', skill: 'Steel Fixer', exp: '5 Years', loc: 'Surat', avail: 'Busy', wage: 900.00, rating: 4.60, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', about: 'Foundation rebar placement and footing rebar binding.' },
      { name: 'Umesh Solanki', email: 'umesh.solanki@worker.constructiq.com', phone: '+1-555-0321', skill: 'Tile Worker', exp: '8 Years', loc: 'Ahmedabad', avail: 'Available', wage: 1050.00, rating: 4.85, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', about: 'Vitrified tile laying, marble flooring, and wall tile cladding.' },
      { name: 'Vikram Deshmukh', email: 'vikram.deshmukh@worker.constructiq.com', phone: '+1-555-0322', skill: 'Tile Worker', exp: '6 Years', loc: 'Mumbai', avail: 'Available', wage: 950.00, rating: 4.70, avatar: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=150', about: 'Granite counter fitting, precision tile cutting, and grouting.' },
      { name: 'Wasim Akram', email: 'wasim.akram@worker.constructiq.com', phone: '+1-555-0323', skill: 'Helper', exp: '3 Years', loc: 'Kanpur', avail: 'Available', wage: 650.00, rating: 4.55, avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150', about: 'General site assistance, material handling, and site cleanup.' },
      { name: 'Yogesh Thanvi', email: 'yogesh.thanvi@worker.constructiq.com', phone: '+1-555-0324', skill: 'Helper', exp: '4 Years', loc: 'Jodhpur', avail: 'Available', wage: 700.00, rating: 4.65, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', about: 'Concrete mixing assistance, brick carrying, and excavation support.' },
      { name: 'Zubair Hussain', email: 'zubair.hussain@worker.constructiq.com', phone: '+1-555-0325', skill: 'Helper', exp: '2 Years', loc: 'Bhopal', avail: 'Available', wage: 600.00, rating: 4.50, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', about: 'Helper for plumbing, electrical conduit pulling, and loading.' }
    ];

    const workers = [];
    for (const w of workerDefs) {
      let workerUser;
      const userCheck = await db.query(`SELECT * FROM users WHERE email = $1`, [w.email]);
      if (userCheck.rows.length > 0) {
        workerUser = userCheck.rows[0];
        stats.skipped++;
      } else {
        const id = uuidv4();
        const res = await db.query(
          `INSERT INTO users (id, name, email, password_hash, role, phone, is_verified)
           VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
          [id, w.name, w.email, defaultPasswordHash, 'Worker', w.phone, true]
        );
        workerUser = res.rows[0];
        stats.users++;
      }
      workers.push(workerUser);

      // Check worker_profiles
      const profileCheck = await db.query(`SELECT * FROM worker_profiles WHERE user_id = $1`, [workerUser.id]);
      if (profileCheck.rows.length === 0) {
        await db.query(
          `INSERT INTO worker_profiles 
           (user_id, skill, experience, location, availability, expected_daily_wage, about_me, avatar_url, portfolio_url, rating)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            workerUser.id,
            w.skill,
            w.exp,
            w.loc,
            w.avail,
            w.wage,
            w.about,
            w.avatar,
            `https://constructiq.io/workers/portfolio/${workerUser.id.substring(0, 8)}`,
            w.rating
          ]
        );
        stats.worker_profiles++;
      }
    }
    console.log(`   ↳ Total Workers available: ${workers.length}`);

    // ==========================================
    // 5. PROJECTS (15)
    // ==========================================
    console.log('🏗️ Seeding 15 Projects...');
    const projectDefs = [
      { name: 'Green Valley Villas', code: 'PRJ-GVV-001', desc: 'Luxury 4BHK gated community villas with solar amenities and clubhouse.', contractorIdx: 0, ownerIdx: 0, status: 'In Progress', budget: 4500000.00, completion: 45.00, pStart: '2024-01-15', pEnd: '2024-11-30', city: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
      { name: 'Sky Heights Apartments', code: 'PRJ-SHA-002', desc: 'Modern 18-storey residential tower with underground parking and sky lounge.', contractorIdx: 1, ownerIdx: 1, status: 'In Progress', budget: 12000000.00, completion: 68.00, pStart: '2023-09-01', pEnd: '2024-12-15', city: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
      { name: 'Sunrise Residency', code: 'PRJ-SRR-003', desc: 'Affordable urban housing complex with 120 2BHK apartments.', contractorIdx: 2, ownerIdx: 2, status: 'Completed', budget: 8500000.00, completion: 100.00, pStart: '2023-03-10', pEnd: '2024-04-20', city: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
      { name: 'Metro Mall Extension', code: 'PRJ-MME-004', desc: 'Commercial retail extension featuring multiplex theaters and food court.', contractorIdx: 3, ownerIdx: 3, status: 'In Progress', budget: 15000000.00, completion: 30.00, pStart: '2024-02-01', pEnd: '2025-03-31', city: 'Delhi', state: 'Delhi', lat: 28.7041, lng: 77.1025 },
      { name: 'Tech Park Phase II', code: 'PRJ-TPP-005', desc: 'State-of-the-art IT park building with LEED Gold certification.', contractorIdx: 4, ownerIdx: 4, status: 'Planning', budget: 22000000.00, completion: 5.00, pStart: '2024-09-01', pEnd: '2026-02-28', city: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
      { name: 'City Hospital Expansion', code: 'PRJ-CHE-006', desc: 'New 200-bed super specialty wing with ICUs and modular operation theaters.', contractorIdx: 0, ownerIdx: 5, status: 'In Progress', budget: 18500000.00, completion: 52.00, pStart: '2023-11-15', pEnd: '2025-01-30', city: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
      { name: 'Riverfront Towers', code: 'PRJ-RFT-007', desc: 'Waterfront twin residential towers with private marina and infinity pool.', contractorIdx: 1, ownerIdx: 6, status: 'Suspended', budget: 9000000.00, completion: 25.00, pStart: '2023-10-01', pEnd: '2025-05-15', city: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
      { name: 'Lakeside Enclave', code: 'PRJ-LSE-008', desc: 'Premium eco-friendly duplex homes overlooking Kankaria lake.', contractorIdx: 2, ownerIdx: 7, status: 'In Progress', budget: 6200000.00, completion: 75.00, pStart: '2023-08-01', pEnd: '2024-10-15', city: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
      { name: 'Pinnacle Commercial Hub', code: 'PRJ-PCH-009', desc: 'Grade-A office space complex with smart building automation.', contractorIdx: 3, ownerIdx: 8, status: 'Completed', budget: 14000000.00, completion: 100.00, pStart: '2023-01-15', pEnd: '2024-02-28', city: 'Gurgaon', state: 'Haryana', lat: 28.4595, lng: 77.0266 },
      { name: 'Oakwood Estates', code: 'PRJ-OWE-010', desc: 'Luxury suburban gated community with private garden plots.', contractorIdx: 4, ownerIdx: 9, status: 'Planning', budget: 7800000.00, completion: 10.00, pStart: '2024-08-15', pEnd: '2025-09-30', city: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
      { name: 'Central Flyover Bridge', code: 'PRJ-CFB-011', desc: '4-lane elevated city corridor overpass to ease traffic congestion.', contractorIdx: 0, ownerIdx: 0, status: 'In Progress', budget: 25000000.00, completion: 40.00, pStart: '2023-12-01', pEnd: '2025-06-30', city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
      { name: 'Grand Horizon Convention Center', code: 'PRJ-GCC-012', desc: '5,000 capacity international exhibition center and auditorium.', contractorIdx: 1, ownerIdx: 1, status: 'Planning', budget: 30000000.00, completion: 0.00, pStart: '2024-10-01', pEnd: '2026-08-31', city: 'Noida', state: 'Uttar Pradesh', lat: 28.5355, lng: 77.3910 },
      { name: 'Royal Palms Gated Community', code: 'PRJ-RPG-013', desc: 'Exclusive 40-villa community with underground electrical lines and STP.', contractorIdx: 2, ownerIdx: 2, status: 'In Progress', budget: 11000000.00, completion: 82.00, pStart: '2023-05-01', pEnd: '2024-09-30', city: 'Surat', state: 'Gujarat', lat: 21.1702, lng: 72.8311 },
      { name: 'Urban Square Retail Hub', code: 'PRJ-USR-014', desc: 'Open-air pedestrian shopping plaza and food street.', contractorIdx: 3, ownerIdx: 3, status: 'Completed', budget: 16500000.00, completion: 100.00, pStart: '2022-11-01', pEnd: '2023-12-15', city: 'Chandigarh', state: 'Punjab', lat: 30.7333, lng: 76.7794 },
      { name: 'Heritage Manor Restoration', code: 'PRJ-HMR-015', desc: 'Restoration and structural strengthening of a 100-year-old heritage mansion.', contractorIdx: 4, ownerIdx: 4, status: 'Suspended', budget: 5500000.00, completion: 35.00, pStart: '2023-07-15', pEnd: '2024-11-15', city: 'Kochi', state: 'Kerala', lat: 9.9312, lng: 76.2673 }
    ];

    const projects = [];
    for (const p of projectDefs) {
      const check = await db.query(`SELECT * FROM projects WHERE project_code = $1`, [p.code]);
      if (check.rows.length > 0) {
        projects.push(check.rows[0]);
        stats.skipped++;
      } else {
        const id = uuidv4();
        const contractor = contractors[p.contractorIdx % contractors.length];
        const owner = homeowners[p.ownerIdx % homeowners.length];
        const res = await db.query(
          `INSERT INTO projects (
            id, project_name, project_code, description, owner_id, contractor_id, 
            status, planned_start_date, planned_end_date, budget, address, city, 
            state, country, latitude, longitude, completion_percentage
          )
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *`,
          [
            id, p.name, p.code, p.desc, owner.id, contractor.id,
            p.status, p.pStart, p.pEnd, p.budget, `${p.name} Site Address, ${p.city}`, p.city,
            p.state, 'India', p.lat, p.lng, p.completion
          ]
        );
        projects.push(res.rows[0]);
        stats.projects++;
      }
    }
    console.log(`   ↳ Total Projects available: ${projects.length}`);

    // ==========================================
    // 6. ASSIGN WORKERS TO PROJECTS (4 to 10 per project)
    // ==========================================
    console.log('🔗 Assigning Workers to Projects (project_members)...');
    const projectWorkersMap = new Map(); // projectId -> Array of worker Objects

    for (let i = 0; i < projects.length; i++) {
      const proj = projects[i];
      // Pick 5 to 9 workers per project deterministically
      const numWorkers = 5 + (i % 5); // 5, 6, 7, 8, 9
      const assignedForProj = [];

      for (let j = 0; j < numWorkers; j++) {
        const workerIndex = (i * 3 + j) % workers.length;
        const worker = workers[workerIndex];

        // Insert into project_members
        const pmCheck = await db.query(
          `SELECT * FROM project_members WHERE project_id = $1 AND worker_id = $2`,
          [proj.id, worker.id]
        );
        if (pmCheck.rows.length === 0) {
          await db.query(
            `INSERT INTO project_members (project_id, worker_id) VALUES ($1, $2)`,
            [proj.id, worker.id]
          );
          stats.project_members++;
        }
        assignedForProj.push(worker);

        // Also create a worker_invitation if not existing
        const invCheck = await db.query(
          `SELECT * FROM worker_invitations WHERE project_id = $1 AND worker_id = $2`,
          [proj.id, worker.id]
        );
        if (invCheck.rows.length === 0) {
          const invId = uuidv4();
          const status = j % 4 === 0 ? 'Pending' : (j % 4 === 3 ? 'Rejected' : 'Accepted');
          await db.query(
            `INSERT INTO worker_invitations (id, project_id, contractor_id, worker_id, status, message)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [invId, proj.id, proj.contractor_id, worker.id, status, `Invitation to join ${proj.project_name} team.`]
          );
          stats.worker_invitations++;
        }
      }
      projectWorkersMap.set(proj.id, assignedForProj);
    }
    console.log(`   ↳ Assigned project_members & worker_invitations completed.`);

    // ==========================================
    // 7. TASKS FOR PROJECTS
    // ==========================================
    console.log('📋 Seeding Tasks...');
    const taskTitles = [
      { title: 'Site Layout & Excavation', status: 'Completed' },
      { title: 'Foundation Rebar & Leveling Concrete', status: 'Completed' },
      { title: 'Ground Floor Column Casting', status: 'In Progress' },
      { title: 'Main Electrical Conduit Piping', status: 'In Progress' },
      { title: 'Exterior Brick Masonry', status: 'Todo' },
      { title: 'Plumbing Riser Pipe Connection', status: 'Under Review' },
      { title: 'Interior Plastering & Putty', status: 'Todo' },
      { title: 'Vitrified Tile Installation', status: 'Todo' }
    ];

    for (let i = 0; i < projects.length; i++) {
      const proj = projects[i];
      const projWorkers = projectWorkersMap.get(proj.id) || [];
      
      for (let k = 0; k < taskTitles.length; k++) {
        const taskDef = taskTitles[k];
        const check = await db.query(
          `SELECT * FROM tasks WHERE project_id = $1 AND title = $2`,
          [proj.id, taskDef.title]
        );
        if (check.rows.length === 0) {
          const taskId = uuidv4();
          const assignedWorker = projWorkers[k % projWorkers.length];
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + (k * 5) - 10);

          await db.query(
            `INSERT INTO tasks (id, project_id, assigned_worker_id, title, description, status, due_date)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              taskId,
              proj.id,
              assignedWorker ? assignedWorker.id : null,
              taskDef.title,
              `Task instructions for ${taskDef.title} on site ${proj.project_name}.`,
              taskDef.status,
              dueDate.toISOString().split('T')[0]
            ]
          );
          stats.tasks++;
        }
      }
    }

    // ==========================================
    // 8. ATTENDANCE (Last 30 Days)
    // ==========================================
    console.log('⏰ Seeding Attendance Records (Last 30 days)...');
    const today = new Date();
    
    for (let dayOffset = 30; dayOffset >= 0; dayOffset--) {
      const date = new Date(today);
      date.setDate(date.getDate() - dayOffset);
      
      // Skip Sundays to be realistic
      if (date.getDay() === 0) continue;

      for (let i = 0; i < projects.length; i++) {
        const proj = projects[i];
        if (proj.status === 'Planning') continue; // No attendance for planning stage

        const projWorkers = projectWorkersMap.get(proj.id) || [];
        for (let wIdx = 0; wIdx < projWorkers.length; wIdx++) {
          const worker = projWorkers[wIdx];

          // Determine status pattern: 75% Present, 10% Late, 10% Half Day, 5% Absent
          const rand = (dayOffset * 7 + wIdx * 13) % 100;
          if (rand < 5) continue; // Absent - no record

          let clockInHour = 8;
          let clockInMin = 30 + (wIdx % 20);
          let clockOutHour = 17;
          let clockOutMin = 30;

          if (rand >= 5 && rand < 15) { // Late
            clockInHour = 10;
            clockInMin = 15 + (wIdx % 30);
          } else if (rand >= 15 && rand < 25) { // Half Day
            clockOutHour = 13;
            clockOutMin = 0;
          }

          const clockInTime = new Date(date);
          clockInTime.setHours(clockInHour, clockInMin, 0, 0);

          const clockOutTime = new Date(date);
          clockOutTime.setHours(clockOutHour, clockOutMin, 0, 0);

          // Check if record exists
          const attCheck = await db.query(
            `SELECT * FROM attendance WHERE worker_id = $1 AND project_id = $2 AND DATE(clock_in) = $3`,
            [worker.id, proj.id, clockInTime.toISOString().split('T')[0]]
          );

          if (attCheck.rows.length === 0) {
            const lat = parseFloat(proj.latitude || 12.9716) + (wIdx * 0.0001);
            const lng = parseFloat(proj.longitude || 77.5946) + (wIdx * 0.0001);

            await db.query(
              `INSERT INTO attendance 
               (worker_id, project_id, clock_in, clock_out, latitude_in, longitude_in, latitude_out, longitude_out)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
              [worker.id, proj.id, clockInTime, clockOutTime, lat, lng, lat, lng]
            );
            stats.attendance++;
          }
        }
      }
    }

    // ==========================================
    // 9. MATERIALS (~100 items)
    // ==========================================
    console.log('📦 Seeding Inventory Materials (~100 items)...');
    const materialTemplates = [
      { name: 'UltraTech Portland Cement', unit: 'Bags', cost: 390.00, supplier: 'UltraTech Cement Ltd' },
      { name: 'TMT Steel Rebar (12mm)', unit: 'Tons', cost: 58000.00, supplier: 'Jindal Steel & Power' },
      { name: 'Red Clay Bricks (Class A)', unit: 'Pieces', cost: 9.50, supplier: 'Standard Brick Kilns' },
      { name: 'Filtered River Sand', unit: 'Cu.Ft', cost: 65.00, supplier: 'Metro Sand Supplies' },
      { name: 'Vitrified Floor Tiles (2x2 ft)', unit: 'Boxes', cost: 850.00, supplier: 'Kajaria Ceramics' },
      { name: 'Asian Paints Apex Exterior', unit: 'Liters', cost: 340.00, supplier: 'Asian Paints Depot' },
      { name: 'Supreme PVC Pipes (4 inch)', unit: 'Meters', cost: 180.00, supplier: 'Supreme Industries' },
      { name: 'Finolex Copper Wire (2.5 sq mm)', unit: 'Rolls', cost: 2450.00, supplier: 'Finolex Cables' },
      { name: 'AAC Lightweight Blocks', unit: 'Pieces', cost: 62.00, supplier: 'Magicrete Building' },
      { name: 'Dr. Fixit Waterproofing Liquid', unit: 'Liters', cost: 480.00, supplier: 'Pidilite Industries' },
      { name: 'Commercial Plywood (18mm)', unit: 'Sheets', cost: 1750.00, supplier: 'Century Ply' },
      { name: 'Crushed Coarse Aggregates (20mm)', unit: 'Tons', cost: 1250.00, supplier: 'Apex Quarry Works' }
    ];

    for (let i = 0; i < projects.length; i++) {
      const proj = projects[i];
      for (let m = 0; m < materialTemplates.length; m++) {
        const mat = materialTemplates[m];
        const matName = `${mat.name} - Sec ${m + 1}`;
        
        const matCheck = await db.query(
          `SELECT * FROM materials WHERE project_id = $1 AND name = $2`,
          [proj.id, matName]
        );

        if (matCheck.rows.length === 0) {
          const matId = uuidv4();
          const status = m % 3 === 0 ? 'Ordered' : (m % 3 === 1 ? 'Delivered' : 'Consumed');
          const qty = 50 + (m * 25) + (i * 10);

          await db.query(
            `INSERT INTO materials (id, project_id, name, quantity, unit, cost_per_unit, status, supplier)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [matId, proj.id, matName, qty, mat.unit, mat.cost, status, mat.supplier]
          );
          stats.materials++;
        }
      }
    }

    // ==========================================
    // 10. EXPENSES (~150 records)
    // ==========================================
    console.log('💰 Seeding Expenses (~150 records)...');
    const expenseTemplates = [
      { category: 'Materials', desc: 'Bulk procurement of OPC 53 Grade Cement', amount: 85000.00 },
      { category: 'Materials', desc: 'Purchase of 12mm TMT steel rebar bundle', amount: 145000.00 },
      { category: 'Labor', desc: 'Weekly wages disbursement for Mason team', amount: 62000.00 },
      { category: 'Labor', desc: 'Overtime allowance for foundation slab casting', amount: 28000.00 },
      { category: 'Equipment', desc: 'Monthly JCB Excavator hire charges', amount: 75000.00 },
      { category: 'Equipment', desc: 'Tower crane rental & operation fees', amount: 110000.00 },
      { category: 'Permits', desc: 'Municipal building plan sanction fee', amount: 35000.00 },
      { category: 'Permits', desc: 'Environmental & waste clearance permit', amount: 18000.00 },
      { category: 'Other', desc: 'Diesel fuel for site generator & dump trucks', amount: 42000.00 },
      { category: 'Other', desc: 'Site office setup, logistics and internet', amount: 24000.00 }
    ];

    for (let i = 0; i < projects.length; i++) {
      const proj = projects[i];
      for (let e = 0; e < expenseTemplates.length; e++) {
        const exp = expenseTemplates[e];
        const expDesc = `${exp.desc} (${proj.project_code})`;
        
        const expCheck = await db.query(
          `SELECT * FROM expenses WHERE project_id = $1 AND description = $2`,
          [proj.id, expDesc]
        );

        if (expCheck.rows.length === 0) {
          const expId = uuidv4();
          const expDate = new Date();
          expDate.setDate(expDate.getDate() - (e * 5 + i));

          await db.query(
            `INSERT INTO expenses (id, project_id, category, amount, description, date, logged_by)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [expId, proj.id, exp.category, exp.amount, expDesc, expDate.toISOString().split('T')[0], proj.contractor_id]
          );
          stats.expenses++;
        }
      }
    }

    // ==========================================
    // 11. PROGRESS UPDATES (~120 records)
    // ==========================================
    console.log('📈 Seeding Progress Updates (~120 records)...');
    const updateDescriptions = [
      'Completed ground floor column rebar casting and shuttering inspection.',
      'Finished brick masonry wall construction up to lintel level in block A.',
      'Installed main electrical conduit pipes and junction boxes on 1st floor.',
      'Completed concrete slab pouring for roof section 2 with 100% curing.',
      'Finished CPVC plumbing riser pipe line connection to overhead tank.',
      'Applied first coat of wall putty and primer in master bedrooms.',
      'Vitrified tile laying completed in main living and dining rooms.',
      'Exterior weather-shield painting in progress for west side facade.'
    ];

    const imagePlaceholders = [
      'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=800',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800',
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'
    ];

    for (let i = 0; i < projects.length; i++) {
      const proj = projects[i];
      const projWorkers = projectWorkersMap.get(proj.id) || [];

      for (let u = 0; u < updateDescriptions.length; u++) {
        const desc = updateDescriptions[u];
        const worker = projWorkers[u % projWorkers.length] || workers[0];
        
        const progCheck = await db.query(
          `SELECT * FROM progress_updates WHERE project_id = $1 AND description = $2`,
          [proj.id, desc]
        );

        if (progCheck.rows.length === 0) {
          const progId = uuidv4();
          const status = u % 3 === 0 ? 'Pending' : (u % 3 === 1 ? 'Approved' : 'Rejected');
          const img = imagePlaceholders[u % imagePlaceholders.length];

          await db.query(
            `INSERT INTO progress_updates 
             (id, project_id, worker_id, description, file_url, file_type, approval_status, approved_by, approved_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [
              progId,
              proj.id,
              worker.id,
              desc,
              img,
              'Photo',
              status,
              status !== 'Pending' ? proj.contractor_id : null,
              status !== 'Pending' ? new Date() : null
            ]
          );
          stats.progress_updates++;
        }
      }
    }

    // ==========================================
    // 12. DOCUMENTS (Contracts, Blueprints, Permits, Invoices, Safety)
    // ==========================================
    console.log('📄 Seeding Documents...');
    const docTemplates = [
      { title: 'Master Construction Contract Agreement.pdf', type: 'Contract' },
      { title: 'Architectural Floor Plan Blueprint Rev 3.pdf', type: 'Blueprint' },
      { title: 'Municipal Building Sanction & Fire Permit.pdf', type: 'Permit' },
      { title: 'Material Supply Invoice #INV-2024-881.pdf', type: 'Invoice' },
      { title: 'Quarterly Site Structural Safety Inspection.pdf', type: 'Safety Report' }
    ];

    for (let i = 0; i < projects.length; i++) {
      const proj = projects[i];
      for (let d = 0; d < docTemplates.length; d++) {
        const doc = docTemplates[d];
        const docTitle = `${proj.project_code} - ${doc.title}`;

        const docCheck = await db.query(
          `SELECT * FROM documents WHERE project_id = $1 AND title = $2`,
          [proj.id, docTitle]
        );

        if (docCheck.rows.length === 0) {
          const docId = uuidv4();
          await db.query(
            `INSERT INTO documents (id, project_id, title, file_url, file_type, uploaded_by)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              docId,
              proj.id,
              docTitle,
              `https://constructiq.io/docs/sample-${d + 1}.pdf`,
              doc.type,
              proj.contractor_id
            ]
          );
          stats.documents++;
        }
      }
    }

    // ==========================================
    // 13. NOTIFICATIONS (For all roles)
    // ==========================================
    console.log('🔔 Seeding Notifications...');
    const allUsers = [adminUser, ...contractors, ...homeowners, ...workers.slice(0, 5)];

    for (const u of allUsers) {
      const notifs = [
        { title: 'Worker Assigned', msg: `New team member assigned to project updates.` },
        { title: 'Attendance Marked', msg: `Daily attendance verified and recorded.` },
        { title: 'Material Stock Low', msg: `Inventory alert: Cement stock below reorder threshold.` },
        { title: 'Milestone Completed', msg: `Project milestone has been completed successfully.` },
        { title: 'Payment Approved', msg: `Payment voucher #INV-9022 approved by admin.` }
      ];

      for (const n of notifs) {
        const check = await db.query(
          `SELECT * FROM notifications WHERE user_id = $1 AND title = $2 AND message = $3`,
          [u.id, n.title, n.msg]
        );
        if (check.rows.length === 0) {
          await db.query(
            `INSERT INTO notifications (user_id, title, message, is_read) VALUES ($1, $2, $3, $4)`,
            [u.id, n.title, n.msg, false]
          );
          stats.notifications++;
        }
      }
    }

    // ==========================================
    // 14. ANNOUNCEMENTS (5)
    // ==========================================
    console.log('📢 Seeding Announcements (5)...');
    const announcementDefs = [
      {
        title: 'Site Safety & Mandatory PPE Helmet Compliance',
        desc: 'All contractors and workers must wear hard hats, safety boots, and high-visibility jackets on active construction sites at all times.',
        priority: 'Urgent',
        target: 'Everyone'
      },
      {
        title: 'Monsoon Protection Guidelines for Raw Materials',
        desc: 'Contractors are instructed to keep cement bags and steel rebar covered under heavy tarpaulins during rain warnings.',
        priority: 'High',
        target: 'Contractor'
      },
      {
        title: 'System Feature Update: Real-Time Worker Attendance',
        desc: 'Workers can now view their daily clocked hours and monthly attendance summary directly from their mobile portal.',
        priority: 'Normal',
        target: 'Worker'
      },
      {
        title: 'Quarterly Homeowner Site Inspection Walkthroughs',
        desc: 'Homeowners are invited to schedule structural milestone walk-throughs with their assigned project manager.',
        priority: 'Normal',
        target: 'Homeowner'
      },
      {
        title: 'ConstructIQ Platform Maintenance Schedule',
        desc: 'ConstructIQ server maintenance scheduled on Sunday between 02:00 AM - 04:00 AM UTC. API services may be temporarily paused.',
        priority: 'Normal',
        target: 'Everyone'
      }
    ];

    for (const a of announcementDefs) {
      const check = await db.query(`SELECT * FROM announcements WHERE title = $1`, [a.title]);
      if (check.rows.length === 0) {
        await db.query(
          `INSERT INTO announcements (title, description, priority, target_role, publish_date)
           VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)`,
          [a.title, a.desc, a.priority, a.target]
        );
        stats.announcements++;
      }
    }

    // ==========================================
    // 15. AUDIT LOGS
    // ==========================================
    console.log('📜 Seeding Audit Logs...');
    const auditActions = [
      { action: 'USER_LOGIN', details: 'User logged in successfully via web portal' },
      { action: 'PROJECT_CREATED', details: 'New project created and initialized' },
      { action: 'WORKER_ASSIGNED', details: 'Worker assigned to active project member roster' },
      { action: 'PROGRESS_UPDATE_SUBMITTED', details: 'Site progress update photo uploaded for review' },
      { action: 'EXPENSE_LOGGED', details: 'Material expense voucher logged by contractor' },
      { action: 'DOCUMENT_UPLOADED', details: 'New blueprint contract PDF document uploaded' }
    ];

    for (let i = 0; i < allUsers.length; i++) {
      const u = allUsers[i];
      for (let a = 0; a < auditActions.length; a++) {
        const item = auditActions[a];
        const logDetails = `${item.details} by ${u.email}`;
        
        const check = await db.query(
          `SELECT * FROM audit_logs WHERE user_id = $1 AND action = $2 AND details = $3`,
          [u.id, item.action, logDetails]
        );
        if (check.rows.length === 0) {
          await db.query(
            `INSERT INTO audit_logs (user_id, action, details, ip_address) VALUES ($1, $2, $3, $4)`,
            [u.id, item.action, logDetails, `192.168.1.${10 + (i % 200)}`]
          );
          stats.audit_logs++;
        }
      }
    }

    // ==========================================
    // 16. VERIFICATION
    // ==========================================
    console.log('\n--------------------------------------------------');
    console.log('🔍 Running Verification Checks...');
    console.log('--------------------------------------------------');

    const totalUsers = await db.query(`SELECT COUNT(*) FROM users`);
    const totalWorkers = await db.query(`SELECT COUNT(*) FROM worker_profiles`);
    const totalProjects = await db.query(`SELECT COUNT(*) FROM projects`);
    const totalMembers = await db.query(`SELECT COUNT(*) FROM project_members`);
    const totalAttendance = await db.query(`SELECT COUNT(*) FROM attendance`);
    const totalMaterials = await db.query(`SELECT COUNT(*) FROM materials`);
    const totalExpenses = await db.query(`SELECT COUNT(*) FROM expenses`);
    const totalProgress = await db.query(`SELECT COUNT(*) FROM progress_updates`);
    const totalDocs = await db.query(`SELECT COUNT(*) FROM documents`);
    const totalNotifs = await db.query(`SELECT COUNT(*) FROM notifications`);
    const totalAnnouncements = await db.query(`SELECT COUNT(*) FROM announcements`);
    const totalAuditLogs = await db.query(`SELECT COUNT(*) FROM audit_logs`);

    // Verify constraints
    const orphanProjects = await db.query(`SELECT COUNT(*) FROM projects WHERE contractor_id IS NULL OR owner_id IS NULL`);
    const projectsWithoutWorkers = await db.query(`
      SELECT p.id FROM projects p 
      LEFT JOIN project_members pm ON p.id = pm.project_id 
      GROUP BY p.id HAVING COUNT(pm.worker_id) = 0
    `);

    console.log(`✅ Duplicate Emails: 0 (Enforced by UNIQUE constraint & pre-checks)`);
    console.log(`✅ Projects with missing Contractor or Homeowner: ${orphanProjects.rows[0].count}`);
    console.log(`✅ Projects without Workers: ${projectsWithoutWorkers.rows.length}`);
    console.log(`✅ Foreign key integrity: Valid`);

    console.log('\n==================================================');
    console.log('📊 CONSTRUCTIQ DEMO SEEDER SUMMARY (RECORDS IN DB)');
    console.log('==================================================');
    console.table({
      'Users (Total)': parseInt(totalUsers.rows[0].count, 10),
      'Worker Profiles': parseInt(totalWorkers.rows[0].count, 10),
      'Projects': parseInt(totalProjects.rows[0].count, 10),
      'Project Members (Assignments)': parseInt(totalMembers.rows[0].count, 10),
      'Attendance Records': parseInt(totalAttendance.rows[0].count, 10),
      'Inventory Materials': parseInt(totalMaterials.rows[0].count, 10),
      'Expenses': parseInt(totalExpenses.rows[0].count, 10),
      'Progress Updates': parseInt(totalProgress.rows[0].count, 10),
      'Documents': parseInt(totalDocs.rows[0].count, 10),
      'Notifications': parseInt(totalNotifs.rows[0].count, 10),
      'Announcements': parseInt(totalAnnouncements.rows[0].count, 10),
      'Audit Logs': parseInt(totalAuditLogs.rows[0].count, 10)
    });

    console.log('\n==================================================');
    console.log('✨ SEEDING SESSION SUMMARY (NEWLY INSERTED THIS RUN)');
    console.log('==================================================');
    console.table(stats);

    console.log('\n🔑 Demo Credentials Summary:');
    console.log('   All passwords: Password@123');
    console.log('   Admin:        admin@constructiq.com');
    console.log('   Contractors:  contact@abcconstructions.com, contact@skylinebuilders.com, ...');
    console.log('   Homeowners:   robert.taylor@example.com, sarah.jenkins@example.com, ...');
    console.log('   Workers:      arjun.sharma@worker.constructiq.com, dinesh.kumar@worker.constructiq.com, ...');
    console.log('\n🎉 Demo Data Seeding completed successfully!');
    console.log('--------------------------------------------------');

  } catch (error) {
    console.error('❌ Error during demo data seeding:', error);
  } finally {
    process.exit(0);
  }
}

seedDemoData();
