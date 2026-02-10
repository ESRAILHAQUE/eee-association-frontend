'use client';

import { useEffect, useState } from 'react';
import { User, Mail, Phone, School, Calendar } from 'lucide-react';
import { fetchProfile } from '@/lib/api';

export default function MemberProfilePage() {
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchProfile>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchProfile()
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load profile');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 w-full max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">Profile</h1>
        <div className="rounded-xl border border-slate-200 bg-surface p-8 text-center text-slate-500">
          Loading profile...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6 w-full max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">Profile</h1>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
          {error}
        </div>
      </div>
    );
  }

  const user = data?.user;
  const profile = data?.profile as Record<string, unknown> | null | undefined;
  const pending = data?.pending ?? false;

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
          Profile
        </h1>
        <p className="text-slate-500">
          {pending
            ? 'Your account is pending verification. Full profile will be available after admin approval.'
            : 'Your profile information from the association database.'}
        </p>
      </header>

      <section className="rounded-xl border border-slate-200 bg-surface p-5 flex flex-col gap-5">
        <div className="flex items-start gap-4">
          <div className="size-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-700">
            <User className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-slate-900">
              {user?.fullName ?? '—'}
            </h2>
            <p className="text-sm text-slate-500">
              {user?.registrationNumber
                ? `Reg. ${user.registrationNumber}`
                : ''}
              {profile?.department ? ` · ${String(profile.department)}` : ''}
              {profile?.batch ? ` · Batch ${String(profile.batch)}` : ''}
            </p>
          </div>
        </div>

        <dl className="grid gap-4 md:grid-cols-2 text-sm">
          <InfoRow
            icon={Mail}
            label="Institutional Email"
            value={user?.institutionalEmail ?? '—'}
          />
          <InfoRow
            icon={Mail}
            label="Personal Email"
            value={profile?.personalEmail ? String(profile.personalEmail) : '—'}
          />
          <InfoRow
            icon={Phone}
            label="Phone"
            value={profile?.phoneNumber ? String(profile.phoneNumber) : '—'}
          />
          <InfoRow
            icon={School}
            label="Registration / Student ID"
            value={user?.registrationNumber ?? (profile?.rollNumber ? String(profile.rollNumber) : '—')}
          />
          <InfoRow
            icon={School}
            label="Batch"
            value={profile?.batch ? String(profile.batch) : '—'}
          />
          <InfoRow
            icon={Calendar}
            label="Joined / Updated"
            value={profile?.createdAt ? new Date(String(profile.createdAt)).toLocaleDateString() : '—'}
          />
        </dl>

        {profile?.address != null && profile.address !== '' ? (
          <div className="border-t border-dashed border-slate-200 pt-4">
            <span className="text-xs text-slate-500">Address</span>
            <p className="text-sm text-slate-900 mt-1">{String(profile.address)}</p>
          </div>
        ) : null}
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
