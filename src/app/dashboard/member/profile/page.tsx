'use client';

import { User, Mail, Phone, School, Calendar } from 'lucide-react';

export default function MemberProfilePage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
          Profile
        </h1>
        <p className="text-slate-500">
          Basic student profile for a general association member. Later this can be connected to the university SSO.
        </p>
      </header>

      <section className="rounded-xl border border-slate-200 bg-surface p-5 flex flex-col gap-5">
        <div className="flex items-start gap-4">
          <div className="size-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-700">
            <User className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-slate-900">General Student</h2>
            <p className="text-sm text-slate-500">Department of EEE · Batch 2024</p>
          </div>
        </div>

        <dl className="grid gap-4 md:grid-cols-2 text-sm">
          <InfoRow icon={Mail} label="Email" value="student@example.com" />
          <InfoRow icon={Phone} label="Phone" value="+880 1700-000000" />
          <InfoRow icon={School} label="Student ID" value="2024-EEE-021" />
          <InfoRow icon={Calendar} label="Joined association" value="Jan 2024" />
        </dl>

        <div className="border-t border-dashed border-slate-200 pt-4">
          <p className="text-xs text-slate-500">
            This screen is only a **frontend reference**. Actual profile data (photo, contact, academic details) can later
            come from your authentication system or university database.
          </p>
        </div>
      </section>
    </div>
  );
}

interface InfoRowProps {
  icon: typeof User;
  label: string;
  value: string;
}

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-slate-500">{label}</span>
        <span className="text-sm font-medium text-slate-900">{value}</span>
      </div>
    </div>
  );
}

