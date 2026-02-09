'use client';

import { Bell, Users, ClipboardList } from 'lucide-react';

export default function CrSettingsPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          CR Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
          Personal preferences for the Class Representative dashboard for Batch 2024.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-surface dark:bg-slate-900 p-5 flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-primary p-2">
              <Users className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Batch</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Basic information for the batch you manage. Actual data can be synced from the backend later.
              </p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-700 dark:text-slate-200">Current batch</span>
              <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800/80 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-200">
                EEE Batch 2024
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-700 dark:text-slate-200">Total students (display only)</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">60</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-surface dark:bg-slate-900 p-5 flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 p-2">
              <Bell className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Notifications</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                When should the CR receive alerts for their batch.
              </p>
            </div>
          </div>
          <div className="space-y-4 text-sm">
            <SettingToggle label="Notify me when a new notice targets my batch" defaultChecked />
            <SettingToggle label="Daily summary of students with pending fees" defaultChecked />
            <SettingToggle label="Remind me 1 day before exams or events" />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-surface dark:bg-slate-900 p-5 flex flex-col gap-4 md:col-span-2">
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 p-2">
              <ClipboardList className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Task list</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                How the to-do items on your dashboard should be ordered.
              </p>
            </div>
          </div>
          <div className="space-y-4 text-sm">
            <SettingToggle label="Show fee-related tasks at the top" defaultChecked />
            <SettingToggle label="Hide completed tasks automatically after 7 days" />
          </div>
        </div>
      </section>
    </div>
  );
}

interface SettingToggleProps {
  label: string;
  defaultChecked?: boolean;
}

function SettingToggle({ label, defaultChecked }: SettingToggleProps) {
  return (
    <label className="flex items-center justify-between gap-4">
      <span className="text-slate-700 dark:text-slate-200 text-sm">{label}</span>
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="peer h-5 w-9 cursor-pointer rounded-full border border-slate-300 bg-slate-200 transition-colors checked:bg-primary checked:border-primary"
      />
    </label>
  );
}

