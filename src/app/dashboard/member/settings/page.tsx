'use client';

import { Bell, Palette, Globe2 } from 'lucide-react';

export default function MemberSettingsPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
          Member Settings
        </h1>
        <p className="text-slate-500 max-w-2xl">
          Personal preferences for notifications and appearance for a general student / association member.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-surface p-5 flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-lg bg-emerald-50 text-emerald-600 p-2">
              <Bell className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-slate-900">Notifications</h2>
              <p className="text-xs text-slate-500">
                Control how you want to be notified about events, notices and payments.
              </p>
            </div>
          </div>
          <div className="space-y-4 text-sm">
            <SettingToggle label="Email me about new events" defaultChecked />
            <SettingToggle label="Send reminders for payment due dates" defaultChecked />
            <SettingToggle label="Weekly summary of new resources" />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-surface p-5 flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-lg bg-blue-50 text-primary p-2">
              <Palette className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-slate-900">Appearance</h2>
              <p className="text-xs text-slate-500">
                Theme preferences for your dashboard. Actual theming can be wired later.
              </p>
            </div>
          </div>
          <div className="space-y-4 text-sm">
            <SettingToggle label="Use dark mode when available" defaultChecked />
            <SettingToggle label="Reduce motion / animations" />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-surface p-5 flex flex-col gap-4 md:col-span-2">
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-lg bg-slate-100 text-slate-700 p-2">
              <Globe2 className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-slate-900">Language & region</h2>
              <p className="text-xs text-slate-500">
                Basic language / region toggles. Final implementation can be internationalized later.
              </p>
            </div>
          </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-700">Preferred language</span>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  English (default)
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-700">Time zone</span>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  Asia/Dhaka (GMT+6)
                </span>
              </div>
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

