'use client';

import { usePathname } from 'next/navigation';
import DashboardSidebar from '@/components/layouts/DashboardSidebar';
import DashboardHeader from '@/components/layouts/DashboardHeader';

type Role = 'admin' | 'superAdmin' | 'cr' | 'moderator' | 'member';

const ROLE_CONFIG: Record<
  Role,
  { title: string; subtitle: string; headerTitle: string; searchPlaceholder?: string }
> = {
  admin: {
    title: 'EEE Admin',
    subtitle: 'Dept. Association',
    headerTitle: 'Admin Dashboard',
    searchPlaceholder: 'Search students, batches...',
  },
  superAdmin: {
    title: 'EEE Association',
    subtitle: 'Super Admin',
    headerTitle: 'Admin Console',
    searchPlaceholder: 'Search...',
  },
  cr: {
    title: 'EEE Dept',
    subtitle: 'Batch 2024',
    headerTitle: 'CR Dashboard',
  },
  moderator: {
    title: 'EEE Dept.',
    subtitle: 'Moderator Panel',
    headerTitle: 'Moderator Dashboard',
  },
  member: {
    title: 'EEE Association',
    subtitle: 'Student Portal',
    headerTitle: 'Member Dashboard',
  },
};

export interface DashboardLayoutProps {
  role: Role;
  children: React.ReactNode;
}

export default function DashboardLayout({ role, children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const config = ROLE_CONFIG[role];

  const showFooter = role !== 'cr' && role !== 'member';
  const user =
    role === 'cr'
      ? { name: 'John Doe', role: 'Class Rep' }
      : role === 'moderator'
        ? { name: 'Prof. Anderson', role: 'Senior Moderator' }
        : role === 'member'
          ? undefined
          : { name: 'Admin User', role: 'Super Admin' };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--background)]">
      <DashboardSidebar
        variant={role}
        title={config.title}
        subtitle={config.subtitle}
        user={role === 'cr' ? user : role === 'moderator' ? user : undefined}
        showFooter={showFooter}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          title={config.headerTitle}
          searchPlaceholder={config.searchPlaceholder}
          user={user}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
