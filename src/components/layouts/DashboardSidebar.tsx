"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Megaphone,
  FileText,
  Settings,
  Calendar,
  BookOpen,
  MessageSquare,
  User,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DASHBOARD_NAV, ROUTES } from "@/lib/constants";

const iconMap = {
  LayoutDashboard,
  Users,
  CreditCard,
  Megaphone,
  FileText,
  Settings,
  Calendar,
  BookOpen,
  MessageSquare,
  User,
};

type NavKey = keyof typeof DASHBOARD_NAV;
type NavItem = { href: string; label: string; icon: keyof typeof iconMap | "Logo" };

export interface DashboardSidebarProps {
  variant: NavKey;
  title: string;
  subtitle: string;
  user?: { name: string; role: string; avatar?: string };
  showFooter?: boolean;
}

export default function DashboardSidebar({
  variant,
  title,
  subtitle,
  user,
  showFooter = true,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const navItems = DASHBOARD_NAV[variant] as unknown as NavItem[];
  const settingsHrefMap: Record<NavKey, string> = {
    admin: ROUTES.adminSettings,
    superAdmin: ROUTES.superAdminSettings,
    cr: ROUTES.crSettings,
    moderator: ROUTES.moderatorSettings,
    member: ROUTES.memberSettings,
  };
  const settingsHref = settingsHrefMap[variant];

  return (
    <aside className="w-64 h-full flex flex-col bg-surface dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 hidden md:flex">
      <div className="p-6 flex flex-col gap-6 h-full">
        <div className="flex items-center gap-3">
          <div className="size-12 flex items-center justify-center shrink-0 overflow-hidden">
            <Image
              src="/images/SEC-Logo.png"
              alt="Sylhet Engineering College logo"
              width={40}
              height={40}
              className="object-contain"
              unoptimized
            />
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="text-slate-900 dark:text-white text-base font-bold leading-normal truncate">
              {title}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-normal leading-normal truncate">
              {subtitle}
            </p>
          </div>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => {
            const isLogoIcon = item.icon === "Logo";
            const Icon = !isLogoIcon ? iconMap[item.icon as keyof typeof iconMap] : null;
            // Role-base (e.g. /dashboard/cr) must match exactly so sub-routes don't highlight Dashboard
            const segmentCount = item.href.split('/').filter(Boolean).length;
            const isRoleBase = segmentCount === 2;
            const isActive =
              pathname === item.href ||
              (item.href !== '#' && !isRoleBase && pathname.startsWith(item.href + '/'));
            return (
              <Link
                key={item.href + item.label}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                {isLogoIcon ? (
                  <div className="w-5 h-5 rounded-md bg-white/90 flex items-center justify-center shrink-0 overflow-hidden">
                    <Image
                      src="/images/SEC-Logo.png"
                      alt="Reports"
                      width={20}
                      height={20}
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                ) : (
                  Icon && <Icon className="w-5 h-5 shrink-0" />
                )}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {showFooter && (
          <div className="flex flex-col gap-2 border-t border-slate-200 dark:border-slate-800 pt-4">
            <Link
              href={settingsHref}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span className="text-sm font-medium">Settings</span>
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Logout</span>
            </Link>
          </div>
        )}

        {user && (
          <div className="flex items-center gap-3 px-3 py-2 border-t border-slate-200 dark:border-slate-800 pt-4 mt-auto">
            <div className="size-9 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center shrink-0" />
            <div className="flex flex-col min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.role}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
