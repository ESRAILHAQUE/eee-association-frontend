'use client';

import { Globe2, Bell, Lock, CreditCard, Database } from 'lucide-react';

export default function SuperAdminSettingsPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          System Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
          Global preferences for the Department of EEE platform. Changes here affect all dashboards and members.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-surface dark:bg-slate-900 p-5 flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-primary p-2">
              <Globe2 className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Platform</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Academic year, default currency and localization options.
              </p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-700 dark:text-slate-200">Current academic session</span>
              <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800/80 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-200">
                2024 - 2025
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-700 dark:text-slate-200">Currency</span>
              <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800/80 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-200">
                BDT (৳)
              </span>
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
                Control default email and in-app notifications for all users. Individuals can override in their profile.
              </p>
            </div>
          </div>
          <div className="space-y-4 text-sm">
            <SettingToggle label="Send email for new notices" defaultChecked />
            <SettingToggle label="Notify CRs for pending fees summary" defaultChecked />
            <SettingToggle label="Weekly activity digest to Super Admins" />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-surface dark:bg-slate-900 p-5 flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 p-2">
              <Lock className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Security</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Basic security controls for logins and sensitive actions like payments and user role changes.
              </p>
            </div>
          </div>
          <div className="space-y-4 text-sm">
            <SettingToggle label="Require OTP for Super Admin login" defaultChecked />
            <SettingToggle label="Email alert for failed login attempts" defaultChecked />
            <SettingToggle label="Lock account after 5 failed attempts" />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-surface dark:bg-slate-900 p-5 flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 p-2">
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Payments</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                High level toggles for payment gateways and test mode. Detailed configuration can live in backend.
              </p>
            </div>
          </div>
          <div className="space-y-4 text-sm">
            <SettingToggle label="Enable online payments for membership" defaultChecked />
            <SettingToggle label="Enable sandbox / test mode" />
            <SettingToggle label="Allow CRs to mark cash payments as collected" defaultChecked />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-surface dark:bg-slate-900/60 p-5 flex items-start gap-3">
        <div className="mt-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 p-2">
          <Database className="w-4 h-4" />
        </div>
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Advanced configuration</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Actual persistence of these settings and integration with the backend can be wired later. For now this screen
            acts as the UX reference for engineers.
          </p>
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

