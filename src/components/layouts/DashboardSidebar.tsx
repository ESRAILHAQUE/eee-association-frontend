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
  Bell,
  QrCode,
  Award,
  ClipboardList,
  MessageCircle,
  Star,
  FolderOpen,
  BarChart2,
  ShieldCheck,
  Mail,
  Database,
  Layers,
  GraduationCap,
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
  Bell,
  QrCode,
  Award,
  ClipboardList,
  MessageCircle,
  Star,
  FolderOpen,
  BarChart2,
  ShieldCheck,
  Mail,
  Database,
  Layers,
  GraduationCap,
};

type NavKey = keyof typeof DASHBOARD_NAV;
type NavItem = {
  href: string;
  label: string;
  icon: keyof typeof iconMap | "Logo";
};

export interface DashboardSidebarProps {
  variant: NavKey;
  title: string;
  subtitle: string;
  user?: { name: string; role: string; avatar?: string };
  showFooter?: boolean;
  onLogout?: () => void;
}

export default function DashboardSidebar({
  variant,
  title,
  subtitle,
  user,
  showFooter = true,
  onLogout,
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
    <aside className="w-64 h-full flex flex-col bg-surface border-r border-slate-200 flex-shrink-0 hidden md:flex overflow-hidden">
      {/* Logo / Title — fixed, never scrolls */}
      <div className="p-6 pb-3 flex items-center gap-3 shrink-0">
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
          <h1 className="text-slate-900 text-base font-bold leading-normal truncate">
            {title}
          </h1>
          <p className="text-slate-500 text-xs font-normal leading-normal truncate">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Nav — scrollable */}
      <nav className="flex-1 overflow-y-auto px-6 py-2 flex flex-col gap-1
        [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-slate-200
        [&::-webkit-scrollbar-thumb]:rounded-full
        hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
        {navItems.map((item) => {
          const isLogoIcon = item.icon === "Logo";
          const Icon = !isLogoIcon
            ? iconMap[item.icon as keyof typeof iconMap]
            : null;
          const segmentCount = item.href.split("/").filter(Boolean).length;
          const isRoleBase = segmentCount === 2;
          const isActive =
            pathname === item.href ||
            (item.href !== "#" &&
              !isRoleBase &&
              pathname.startsWith(item.href + "/"));
          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#0F172B] text-white"
                  : "text-slate-700 hover:bg-slate-100",
              )}>
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

      {/* Footer — fixed at bottom, never scrolls */}
      {showFooter && (
        <div className="px-6 py-4 flex flex-col gap-1 border-t border-slate-200 shrink-0">
          <Link
            href={settingsHref}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors">
            <Settings className="w-5 h-5" />
            <span className="text-sm font-medium">Settings</span>
          </Link>
          <button
            type="button"
            onClick={() => onLogout?.()}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-left">
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      )}

      {user && (
        <div className="px-6 py-3 flex items-center gap-3 border-t border-slate-200 shrink-0">
          <div className="size-9 rounded-full bg-slate-200 bg-cover bg-center shrink-0" />
          <div className="flex flex-col min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {user.name}
            </p>
            <p className="text-xs text-slate-500 truncate">{user.role}</p>
          </div>
        </div>
      )}
    </aside>
  );
}
