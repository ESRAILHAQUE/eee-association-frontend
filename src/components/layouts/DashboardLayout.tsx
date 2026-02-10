'use client';

import { useRouter } from 'next/navigation';
import DashboardSidebar from '@/components/layouts/DashboardSidebar';
import DashboardHeader from '@/components/layouts/DashboardHeader';
import { clearStoredAuth } from '@/lib/api';
import { ROUTES } from '@/lib/constants';
import type { AuthUser } from '@/lib/api';

type Role = 'admin' | 'superAdmin' | 'cr' | 'moderator' | 'member';

const ROLE_CONFIG: Record<
  Role,
  { title: string; subtitle: string; headerTitle: string; searchPlaceholder?: string }
> = {
  admin: {
    title: 'Department of EEE',
    subtitle: 'Admin Panel',
    headerTitle: 'Admin Dashboard',
    searchPlaceholder: 'Search students, batches...',
  },
  superAdmin: {
    title: 'Department of EEE',
    subtitle: 'Super Admin',
    headerTitle: 'Admin Console',
    searchPlaceholder: 'Search...',
  },
  cr: {
    title: 'Department of EEE',
    subtitle: 'Batch 2024',
    headerTitle: 'CR Dashboard',
  },
  moderator: {
    title: 'Department of EEE',
    subtitle: 'Moderator Panel',
    headerTitle: 'Moderator Dashboard',
  },
  member: {
    title: 'Department of EEE',
    subtitle: 'Student Portal',
    headerTitle: 'Member Dashboard',
  },
};

const ROLE_LABEL: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  cr: 'Class Rep',
  moderator: 'Moderator',
  student: 'Member',
};

export interface DashboardLayoutProps {
  role: Role;
  user?: AuthUser | null;
  children: React.ReactNode;
}

export default function DashboardLayout({ role, user: authUser, children }: DashboardLayoutProps) {
  const router = useRouter();
  const config = ROLE_CONFIG[role];

  const showFooter = role !== 'cr' && role !== 'member';
  const user = {
    name: authUser?.fullName ?? (role === 'superAdmin' ? 'Super Admin' : role === 'admin' ? 'Admin' : role === 'cr' ? 'Class Rep' : role === 'moderator' ? 'Moderator' : 'Member'),
    role: ROLE_LABEL[authUser?.currentRole ?? 'student'] ?? 'Member',
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--background)]">
      <DashboardSidebar
        variant={role}
        title={config.title}
        subtitle={config.subtitle}
        user={role === 'cr' ? user : role === 'moderator' ? user : undefined}
        showFooter={showFooter}
        onLogout={() => {
          clearStoredAuth();
          router.push(ROUTES.home);
        }}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          title={config.headerTitle}
          searchPlaceholder={config.searchPlaceholder}
          user={user}
          role={role}
          onLogout={() => {
            clearStoredAuth();
            router.push(ROUTES.home);
          }}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="w-full max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
