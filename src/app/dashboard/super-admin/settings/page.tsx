'use client';

import { Globe2, Bell, Lock, CreditCard, Database } from 'lucide-react';

export default function SuperAdminSettingsPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
          System Settings
        </h1>
        <p className="text-slate-500 max-w-2xl">
          Global preferences for the Department of EEE platform. Changes here affect all dashboards and members.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-surface p-5 flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-lg bg-blue-50 text-primary p-2">
              <Globe2 className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-slate-900">Platform</h2>
              <p className="text-xs text-slate-500">
                Academic year, default currency and localization options.
              </p>
            </div>
          </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-700">Current academic session</span>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  2024 - 2025
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-700">Currency</span>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  BDT (৳)
                </span>
              </div>
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

        <div className="rounded-xl border border-slate-200 bg-surface p-5 flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-lg bg-slate-100 text-slate-700 p-2">
              <Lock className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-slate-900">Security</h2>
              <p className="text-xs text-slate-500">
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

        <div className="rounded-xl border border-slate-200 bg-surface p-5 flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-lg bg-purple-50 text-purple-700 p-2">
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-slate-900">Payments</h2>
              <p className="text-xs text-slate-500">
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

      <section className="rounded-xl border border-dashed border-slate-300 bg-surface p-5 flex items-start gap-3">
        <div className="mt-1 rounded-lg bg-slate-100 text-slate-700 p-2">
          <Database className="w-4 h-4" />
        </div>
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-slate-900">Advanced configuration</h2>
          <p className="text-xs text-slate-500">
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
      <span className="text-slate-700 text-sm">{label}</span>
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="peer h-5 w-9 cursor-pointer rounded-full border border-slate-300 bg-slate-200 transition-colors checked:bg-primary checked:border-primary"
      />
    </label>
  );
}

