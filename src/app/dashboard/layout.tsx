'use client';

import { usePathname } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';

type Role = 'admin' | 'superAdmin' | 'cr' | 'moderator' | 'member';

function getRoleFromPath(pathname: string): Role {
  if (pathname.startsWith('/dashboard/super-admin')) return 'superAdmin';
  if (pathname.startsWith('/dashboard/cr')) return 'cr';
  if (pathname.startsWith('/dashboard/moderator')) return 'moderator';
  if (pathname.startsWith('/dashboard/member')) return 'member';
  return 'admin';
}

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const role = getRoleFromPath(pathname);

  return <DashboardLayout role={role}>{children}</DashboardLayout>;
}
