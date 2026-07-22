/* ─── Navigation ─── */
export const NAV_ITEMS = [
  { label: 'Features', href: '#features' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

/* ─── Features ─── */
export const FEATURES = [
  {
    icon: 'FolderKanban',
    title: 'Project Management',
    description: 'Plan, track, and manage all your construction projects from one centralized dashboard with real-time updates.',
  },
  {
    icon: 'HardHat',
    title: 'Worker Marketplace',
    description: 'Browse professional worker profiles, invite talent, and build your ideal team for every project.',
  },
  {
    icon: 'Shield',
    title: 'Role-Based Access',
    description: 'Secure, permission-based access for contractors, homeowners, and workers with granular control.',
  },
  {
    icon: 'Package',
    title: 'Material Tracking',
    description: 'Track material procurement, usage, and inventory across all your active projects in real time.',
  },
  {
    icon: 'CalendarCheck',
    title: 'Attendance',
    description: 'Digital attendance tracking with geo-verification. Know who is on-site and when, every day.',
  },
  {
    icon: 'Receipt',
    title: 'Expense Management',
    description: 'Log, categorize, and monitor all project expenses. Generate reports and maintain full financial transparency.',
  },
  {
    icon: 'GitBranch',
    title: 'Progress Timeline',
    description: 'Visual project timeline with milestones, photo updates, and completion tracking visible to all stakeholders.',
  },
  {
    icon: 'Camera',
    title: 'Photo Uploads',
    description: 'Workers upload progress photos. Contractors review, approve, and share updates with homeowners seamlessly.',
  },
  {
    icon: 'Bell',
    title: 'Notifications',
    description: 'Stay informed with real-time notifications for task updates, approvals, deadlines, and project milestones.',
  },
  {
    icon: 'BarChart3',
    title: 'Analytics',
    description: 'Data-driven insights into project performance, worker productivity, expenses, and timelines.',
  },
];

/* ─── How It Works ─── */
export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: 'Contractor Creates Project',
    description: 'Set up your project with details, budget, timeline, and requirements in minutes.',
  },
  {
    step: 2,
    title: 'Invites Homeowner',
    description: 'Homeowner receives an invitation to view progress, budgets, and approved updates.',
  },
  {
    step: 3,
    title: 'Hires Workers',
    description: 'Browse the marketplace, invite skilled workers, and assemble your project team.',
  },
  {
    step: 4,
    title: 'Workers Upload Completed Work',
    description: 'Workers submit task completions with photos and descriptions for review.',
  },
  {
    step: 5,
    title: 'Contractor Reviews & Approves',
    description: 'Contractor reviews submissions, provides feedback, and approves completed work.',
  },
  {
    step: 6,
    title: 'Updates Visible to Homeowner',
    description: 'Approved updates are automatically shared with the homeowner in real time.',
  },
  {
    step: 7,
    title: 'Project Completion',
    description: 'Project wraps up with full documentation, photos, expense reports, and analytics.',
  },
];

/* ─── Worker Profiles ─── */
export const WORKER_PROFILES = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    skill: 'Mason',
    experience: '12 years',
    rating: 4.8,
    availability: 'Available',
    avatar: 'RK',
  },
  {
    id: '2',
    name: 'Arun Sharma',
    skill: 'Electrician',
    experience: '8 years',
    rating: 4.9,
    availability: 'Available',
    avatar: 'AS',
  },
  {
    id: '3',
    name: 'Vikram Singh',
    skill: 'Plumber',
    experience: '10 years',
    rating: 4.7,
    availability: 'Busy',
    avatar: 'VS',
  },
  {
    id: '4',
    name: 'Suresh Patel',
    skill: 'Carpenter',
    experience: '15 years',
    rating: 4.9,
    availability: 'Available',
    avatar: 'SP',
  },
];

/* ─── Role-Based Access ─── */
export const ROLES = [
  {
    role: 'Contractor',
    description: 'Full project control and management capabilities.',
    permissions: [
      'Manage projects',
      'Assign workers',
      'Track expenses',
      'Approve work',
      'Manage materials',
    ],
    gradient: 'from-gold-500 to-gold-600',
  },
  {
    role: 'Homeowner',
    description: 'Transparent view into project progress and budget.',
    permissions: [
      'View project progress',
      'View approved photos',
      'Track budget',
      'Receive updates',
      'Cannot access worker private info',
    ],
    gradient: 'from-neutral-700 to-neutral-800',
  },
  {
    role: 'Worker',
    description: 'Task management and progress tracking tools.',
    permissions: [
      'Receive tasks',
      'Upload work',
      'Track attendance',
      'Update progress',
      'Manage personal profile',
    ],
    gradient: 'from-neutral-800 to-neutral-900',
  },
];

/* ─── Testimonials ─── */
export const TESTIMONIALS = [
  {
    id: '1',
    name: 'Anand Mehta',
    role: 'Senior Contractor',
    company: 'Mehta Constructions',
    content: 'BuildFlow completely transformed how we manage our projects. The transparency with homeowners has been a game-changer. We reduced project delays by 40%.',
    avatar: 'AM',
    rating: 5,
  },
  {
    id: '2',
    name: 'Priya Nair',
    role: 'Homeowner',
    company: 'Residential Project',
    content: 'For the first time, I could actually see what was happening with my home construction in real time. No more guessing or endless phone calls.',
    avatar: 'PN',
    rating: 5,
  },
  {
    id: '3',
    name: 'Deepak Verma',
    role: 'Civil Engineer',
    company: 'Verma & Associates',
    content: 'The worker marketplace alone saved us weeks of hiring. Plus, the expense tracking has made our financial reporting effortless.',
    avatar: 'DV',
    rating: 5,
  },
];

/* ─── FAQ ─── */
export const FAQ_ITEMS = [
  {
    question: 'What is BuildFlow?',
    answer: 'BuildFlow is a modern construction management platform that connects contractors, homeowners, and workers. It provides tools for project management, expense tracking, worker coordination, and real-time progress updates — all from one platform.',
  },
  {
    question: 'Who is BuildFlow designed for?',
    answer: 'BuildFlow is built for construction contractors, civil engineers, homeowners, and skilled workers. Whether you manage large commercial projects or residential builds, BuildFlow scales to fit your needs.',
  },
  {
    question: 'Is BuildFlow free to use?',
    answer: 'BuildFlow offers a free tier for small projects with up to 3 team members. For larger teams and advanced features like analytics, custom reports, and unlimited projects, we offer Professional and Enterprise plans.',
  },
  {
    question: 'How does the Worker Marketplace work?',
    answer: 'Workers create professional profiles showcasing their skills, experience, and ratings. Contractors can browse available workers, send invitations, and workers can accept or decline. It streamlines the hiring process.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. BuildFlow uses enterprise-grade encryption, role-based access controls, and regular security audits. Your project data, financial records, and personal information are fully protected.',
  },
  {
    question: 'Can homeowners see all project details?',
    answer: 'Homeowners see only what contractors approve — including progress photos, budget summaries, and milestone updates. Sensitive information like worker costs and internal notes remain private.',
  },
];

/* ─── Comparison ─── */
export const TRADITIONAL_METHODS = [
  'WhatsApp Groups',
  'Excel Spreadsheets',
  'Phone Calls',
  'Paper Records',
  'Manual Tracking',
  'No Analytics',
];

export const BUILDFLOW_METHODS = [
  'Centralized Dashboard',
  'Real-time Updates',
  'Role Permissions',
  'Secure Documents',
  'Progress Tracking',
  'Built-in Analytics',
];

/* ─── Footer ─── */
export const FOOTER_SECTIONS = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Solutions', href: '#solutions' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Changelog', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '#' },
      { label: 'API Reference', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Community', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#contact' },
      { label: 'Press', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
      { label: 'Security', href: '#' },
    ],
  },
];

/* ─── Trust Logos ─── */
export const TRUST_COMPANIES = [
  'ConstructCorp',
  'BuildWise',
  'UrbanEdge',
  'MetroBuild',
  'SitePro',
  'FoundationX',
];
