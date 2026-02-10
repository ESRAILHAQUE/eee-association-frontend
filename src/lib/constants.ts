export const API_BASE =
  (typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_API_URL ?? '') : process.env.NEXT_PUBLIC_API_URL) ||
  'http://localhost:4000/api';

export const THEME = {
  primary: '#135bec',
  backgroundLight: '#f6f6f8',
  backgroundDark: '#101622',
  surfaceLight: '#ffffff',
  surfaceDark: '#1e293b',
  inputBg: '#f8f9fc',
  inputBorder: '#cfd7e7',
  textMain: '#0d121b',
  textSub: '#4c669a',
} as const;

/** Backend CurrentRole -> dashboard base path */
export const ROLE_TO_DASHBOARD: Record<string, string> = {
  super_admin: '/dashboard/super-admin',
  admin: '/dashboard/admin',
  cr: '/dashboard/cr',
  moderator: '/dashboard/moderator',
  student: '/dashboard/member',
};

export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  // Dashboard bases by role (role-prefixed so layout stays correct)
  admin: '/dashboard/admin',
  superAdmin: '/dashboard/super-admin',
  cr: '/dashboard/cr',
  moderator: '/dashboard/moderator',
  member: '/dashboard/member',
  // Role-prefixed feature routes
  adminNoticeBoard: '/dashboard/admin/notice-board',
  adminStudents: '/dashboard/admin/students',
  adminFeeManagement: '/dashboard/admin/fee-management',
  adminEvents: '/dashboard/admin/events',
  crNoticeBoard: '/dashboard/cr/notice-board',
  crStudents: '/dashboard/cr/students',
  crFeeManagement: '/dashboard/cr/fee-management',
  // Super admin feature routes
  superAdminEvents: '/dashboard/super-admin/events',
  superAdminUsers: '/dashboard/super-admin/users',
  superAdminPayments: '/dashboard/super-admin/payments',
  superAdminLogs: '/dashboard/super-admin/logs',
  superAdminSettings: '/dashboard/super-admin/settings',
  // Member feature routes
  memberEvents: '/dashboard/member/events',
  memberPayments: '/dashboard/member/payments',
  memberResources: '/dashboard/member/resources',
  memberProfile: '/dashboard/member/profile',
  // Settings per role
  adminSettings: '/dashboard/admin/settings',
  crSettings: '/dashboard/cr/settings',
  moderatorSettings: '/dashboard/moderator/settings',
  memberSettings: '/dashboard/member/settings',
} as const;

export const DASHBOARD_NAV = {
  admin: [
    { href: '/dashboard/admin', label: 'Dashboard', icon: 'LayoutDashboard' },
    { href: '/dashboard/admin/students', label: 'Batch Management', icon: 'Users' },
    { href: '/dashboard/admin/fee-management', label: 'Fee Tracking', icon: 'CreditCard' },
    { href: '/dashboard/admin/notice-board', label: 'Notices', icon: 'Megaphone' },
    { href: '/dashboard/admin/reports', label: 'Reports', icon: 'FileText' },
  ],
  superAdmin: [
    { href: '/dashboard/super-admin', label: 'Dashboard', icon: 'LayoutDashboard' },
    { href: '/dashboard/super-admin/users', label: 'Users', icon: 'Users' },
    { href: '/dashboard/super-admin/payments', label: 'Payments', icon: 'CreditCard' },
    { href: '/dashboard/super-admin/events', label: 'Events', icon: 'Calendar' },
    { href: '/dashboard/super-admin/logs', label: 'Logs', icon: 'FileText' },
    { href: '/dashboard/super-admin/settings', label: 'Settings', icon: 'Settings' },
  ],
  cr: [
    { href: '/dashboard/cr', label: 'Dashboard', icon: 'LayoutDashboard' },
    { href: '/dashboard/cr/notice-board', label: 'Notice Board', icon: 'Megaphone' },
    { href: '/dashboard/cr/fee-management', label: 'Fee Management', icon: 'CreditCard' },
    { href: '/dashboard/cr/students', label: 'Student Directory', icon: 'Users' },
    { href: '/dashboard/cr/settings', label: 'Settings', icon: 'Settings' },
  ],
  moderator: [
    { href: '/dashboard/moderator', label: 'Dashboard', icon: 'LayoutDashboard' },
    { href: '#', label: 'Event Proposals', icon: 'Calendar' },
    { href: '#', label: 'Resources', icon: 'BookOpen' },
    { href: '#', label: 'Forum', icon: 'MessageSquare' },
    { href: '#', label: 'Users', icon: 'Users' },
  ],
  member: [
    { href: '/dashboard/member', label: 'Dashboard', icon: 'LayoutDashboard' },
    { href: '/dashboard/member/events', label: 'Events', icon: 'Calendar' },
    { href: '/dashboard/member/payments', label: 'Payments', icon: 'CreditCard' },
    { href: '/dashboard/member/resources', label: 'Resources', icon: 'BookOpen' },
    { href: '/dashboard/member/profile', label: 'Profile', icon: 'User' },
  ],
} as const;
