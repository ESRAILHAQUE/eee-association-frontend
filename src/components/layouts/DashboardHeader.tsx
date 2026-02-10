'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { ROUTES, DASHBOARD_NAV } from '@/lib/constants';

type RoleKey = 'admin' | 'superAdmin' | 'cr' | 'moderator' | 'member';

export interface DashboardHeaderProps {
  title: string;
  searchPlaceholder?: string;
  user?: { name: string; role: string };
  /** Which dashboard role is currently active – used for profile menu links */
  role?: RoleKey;
  onLogout?: () => void;
}

const demoNotifications = [
  { id: 1, title: 'New notice posted', body: 'Mid-term exam schedule has been published.', time: '5 min ago' },
  { id: 2, title: 'Upcoming event', body: 'Workshop on Embedded Systems starts tomorrow.', time: '1 day ago' },
  { id: 3, title: 'Payment reminder', body: 'Membership fee due next week.', time: '3 days ago' },
];

export default function DashboardHeader({
  title,
  searchPlaceholder = 'Search...',
  user = { name: 'Admin User', role: 'Super Admin' },
  role = 'superAdmin',
  onLogout,
}: DashboardHeaderProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const notificationsRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node) &&
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
        setIsProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleNotifications = () => {
    setIsNotificationsOpen((open) => !open);
    setIsProfileOpen(false);
    if (hasUnread) {
      setHasUnread(false);
    }
  };

  const handleToggleProfile = () => {
    setIsProfileOpen((open) => !open);
    setIsNotificationsOpen(false);
  };

  const dashboardHome =
    role === 'admin'
      ? ROUTES.admin
      : role === 'superAdmin'
        ? ROUTES.superAdmin
        : role === 'cr'
          ? ROUTES.cr
          : role === 'moderator'
            ? ROUTES.moderator
            : ROUTES.member;

  const settingsRoute =
    role === 'admin'
      ? ROUTES.adminSettings
      : role === 'superAdmin'
        ? ROUTES.superAdminSettings
        : role === 'cr'
          ? ROUTES.crSettings
          : role === 'moderator'
            ? ROUTES.moderatorSettings
            : ROUTES.memberSettings;

  const profileRoute = role === 'member' ? ROUTES.memberProfile : undefined;

  // Sidebar-equivalent routes for mobile dropdown (exclude base dashboard + settings)
  const mobileNavItems = [...DASHBOARD_NAV[role]]
    .filter((item) => item.href !== dashboardHome && item.href !== settingsRoute)
    .map((item) => ({ href: item.href, label: item.label }));

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 sticky top-0 z-10 shrink-0">
      <h2 className="text-slate-900 text-xl font-bold leading-tight">{title}</h2>
      <div className="flex items-center gap-6">
        <div className="hidden md:flex relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-900" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="w-64 pl-10 pr-3 py-2 rounded-lg border-none bg-slate-100 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-primary text-sm"
          />
        </div>
        <div className="flex items-center gap-3 relative">
          {/* Notifications */}
          <div ref={notificationsRef} className="relative">
            <button
              type="button"
              onClick={handleToggleNotifications}
              className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {hasUnread && (
                <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white" />
              )}
            </button>
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-900/10 text-sm">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
                  <span className="font-semibold text-slate-900">Notifications</span>
                  <button
                    type="button"
                    className="text-xs font-medium text-primary hover:underline"
                    onClick={() => setHasUnread(false)}
                  >
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {demoNotifications.map((item) => (
                    <div
                      key={item.id}
                      className="px-4 py-3 border-b last:border-b-0 border-slate-100 hover:bg-slate-50 cursor-pointer"
                    >
                      <p className="text-xs text-slate-500">{item.time}</p>
                      <p className="text-sm font-medium text-slate-900">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={handleToggleProfile}
              className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="size-9 rounded-full bg-slate-200 shrink-0" />
              <div className="hidden lg:flex flex-col items-start mr-2">
                <span className="text-sm font-semibold text-slate-900">{user.name}</span>
                <span className="text-xs text-slate-500">{user.role}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden lg:block" />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-900/10 text-sm py-1">
                <div className="px-3 py-2 border-b border-slate-200">
                  <p className="text-xs text-slate-500">Signed in as</p>
                  <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
                </div>
                <nav className="py-1">
                  <Link
                    href={dashboardHome}
                    className="block px-3 py-2 text-slate-700 hover:bg-slate-100"
                  >
                    My dashboard
                  </Link>

                  {/* Mobile-only: show main navigation routes when sidebar is hidden */}
                  {mobileNavItems.length > 0 && (
                    <div className="md:hidden border-t border-slate-200 mt-1 pt-1">
                      {mobileNavItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-3 py-2 text-slate-700 hover:bg-slate-100"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}

                  {profileRoute && (
                    <Link
                      href={profileRoute}
                      className="block px-3 py-2 text-slate-700 hover:bg-slate-100"
                    >
                      My profile
                    </Link>
                  )}
                  <Link
                    href={settingsRoute}
                    className="block px-3 py-2 text-slate-700 hover:bg-slate-100"
                  >
                    Settings
                  </Link>
                </nav>
                <div className="border-t border-slate-200 mt-1 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      onLogout?.();
                    }}
                    className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
