'use client';

import { Calendar, BookOpen, MessageSquare } from 'lucide-react';

export default function ModeratorSettingsPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
          Moderator Settings
        </h1>
        <p className="text-slate-500 max-w-2xl">
          Preferences for managing events, resources and forum discussions as a moderator.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-surface p-5 flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-lg bg-blue-50 text-primary p-2">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-slate-900">Events</h2>
              <p className="text-xs text-slate-500">
                Control how new event proposals should be reviewed and highlighted.
              </p>
            </div>
          </div>
          <div className="space-y-4 text-sm">
            <SettingToggle label="Highlight events created by faculty" defaultChecked />
            <SettingToggle label="Require two moderators to approve a flagship event" />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-surface p-5 flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-lg bg-emerald-50 text-emerald-600 p-2">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-slate-900">Resources</h2>
              <p className="text-xs text-slate-500">
                Decide what type of study materials appear in the Resources tab for students.
              </p>
            </div>
          </div>
          <div className="space-y-4 text-sm">
            <SettingToggle label="Allow members to upload PDF resources" defaultChecked />
            <SettingToggle label="Require approval before a resource becomes public" defaultChecked />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-surface p-5 flex flex-col gap-4 md:col-span-2">
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-lg bg-slate-100 text-slate-700 p-2">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-slate-900">Forum moderation</h2>
              <p className="text-xs text-slate-500">
                Lightweight controls that describe how the discussion forum should be moderated.
              </p>
            </div>
          </div>
          <div className="space-y-4 text-sm">
            <SettingToggle label="Auto-hide posts reported by 5+ members" defaultChecked />
            <SettingToggle label="Send email when a thread is locked" />
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

