'use client';

import { useEffect, useState } from 'react';
import { User, Mail, Phone, School, Calendar, Edit2, Loader2, Save, X } from 'lucide-react';
import { fetchProfile, updateMyProfile } from '@/lib/api';

export default function MemberProfilePage() {
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchProfile>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ personalEmail: '', phoneNumber: '' });

  useEffect(() => {
    let cancelled = false;
    fetchProfile()
      .then((res) => {
        if (!cancelled) {
          setData(res);
          setForm({
            personalEmail: res.profile && typeof (res.profile as any).personalEmail === 'string' ? (res.profile as any).personalEmail : '',
            phoneNumber: res.profile && typeof (res.profile as any).phoneNumber === 'string' ? (res.profile as any).phoneNumber : ''
          });
        }
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

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateMyProfile(form);
      // Update local state to reflect changes without a reload
      setData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          profile: {
            ...((prev.profile as any) || {}),
            personalEmail: form.personalEmail,
            phoneNumber: form.phoneNumber
          }
        };
      });
      setIsEditing(false);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setForm({
      personalEmail: profile?.personalEmail ? String(profile.personalEmail) : '',
      phoneNumber: profile?.phoneNumber ? String(profile.phoneNumber) : ''
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl">
      <header className="flex justify-between items-start gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
            Profile
          </h1>
          <p className="text-slate-500">
            {pending
              ? 'Your account is pending verification. Full profile will be available after admin approval.'
              : 'Your profile information from the association database.'}
          </p>
        </div>
        {!pending && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit Info
          </button>
        )}
        {isEditing && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60 transition-colors"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        )}
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
          {isEditing ? (
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                <Mail className="w-4 h-4" />
              </div>
              <div className="flex flex-col w-full">
                <span className="text-xs text-slate-500">Personal Email</span>
                <input
                  type="email"
                  value={form.personalEmail}
                  onChange={(e) => setForm({ ...form, personalEmail: e.target.value })}
                  className="w-full px-2 py-1 mt-1 rounded border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white"
                />
              </div>
            </div>
          ) : (
            <InfoRow
              icon={Mail}
              label="Personal Email"
              value={profile?.personalEmail ? String(profile.personalEmail) : '—'}
            />
          )}

          {isEditing ? (
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                <Phone className="w-4 h-4" />
              </div>
              <div className="flex flex-col w-full">
                <span className="text-xs text-slate-500">Phone Number</span>
                <input
                  type="text"
                  value={form.phoneNumber}
                  onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                  className="w-full px-2 py-1 mt-1 rounded border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white"
                />
              </div>
            </div>
          ) : (
            <InfoRow
              icon={Phone}
              label="Phone"
              value={profile?.phoneNumber ? String(profile.phoneNumber) : '—'}
            />
          )}

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

        {profile?.address != null && profile.address !== '' && !isEditing ? (
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
