'use client';

import { Search, Bell, ChevronDown } from 'lucide-react';

export interface DashboardHeaderProps {
  title: string;
  searchPlaceholder?: string;
  user?: { name: string; role: string };
}

export default function DashboardHeader({
  title,
  searchPlaceholder = 'Search...',
  user = { name: 'Admin User', role: 'Super Admin' },
}: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 sticky top-0 z-10 shrink-0">
      <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight">{title}</h2>
      <div className="flex items-center gap-6">
        <div className="hidden md:flex relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="w-64 pl-10 pr-3 py-2 rounded-lg border-none bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary text-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
          </button>
          <button
            type="button"
            className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="size-9 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0" />
            <div className="hidden lg:flex flex-col items-start mr-2">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{user.role}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden lg:block" />
          </button>
        </div>
      </div>
    </header>
  );
}
