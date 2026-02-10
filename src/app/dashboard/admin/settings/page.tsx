'use client';

import { Bell, Users, ShieldCheck } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
          Admin Settings
        </h1>
        <p className="text-slate-500 max-w-2xl">
          Configure how the EEE department dashboard behaves for batch management, notices and fees.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-surface p-5 flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-lg bg-blue-50 text-primary p-2">
              <Users className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-slate-900">Batch & directory</h2>
              <p className="text-xs text-slate-500">
                Defaults for newly created batches and how students appear in the directory.
              </p>
            </div>
          </div>
          <div className="space-y-4 text-sm">
            <SettingToggle label="Allow CRs to update contact info" defaultChecked />
            <SettingToggle label="Show inactive students in search results" />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-surface p-5 flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-lg bg-emerald-50 text-emerald-600 p-2">
              <Bell className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-slate-900">Notifications</h2>
              <p className="text-xs text-slate-500">
                Default notification rules for admins when notices or fee records change.
              </p>
            </div>
          </div>
          <div className="space-y-4 text-sm">
            <SettingToggle label="Email when a new notice is posted" defaultChecked />
            <SettingToggle label="Daily summary of pending fees" defaultChecked />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-surface p-5 flex flex-col gap-4 md:col-span-2">
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-lg bg-slate-100 text-slate-700 p-2">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-slate-900">Approvals</h2>
              <p className="text-xs text-slate-500">
                Basic UX for how approvals might work later (actual logic to be wired to backend).
              </p>
            </div>
          </div>
          <div className="space-y-4 text-sm">
            <SettingToggle label="Require admin approval before publishing a notice" />
            <SettingToggle label="Lock fee records after semester is closed" defaultChecked />
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
      <span className="text-slate-700 text-sm">{label}</span>
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="peer h-5 w-9 cursor-pointer rounded-full border border-slate-300 bg-slate-200 transition-colors checked:bg-primary checked:border-primary"
      />
    </label>
  );
}

