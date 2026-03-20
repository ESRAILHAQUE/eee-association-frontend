'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, TrendingUp, DollarSign, Calendar, BarChart2, Activity } from 'lucide-react';
import { fetchUsers, fetchEvents, fetchAnalyticsOverview, type UserListItem, type Event, type AnalyticsOverview } from '@/lib/api';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
const MONTHLY_GROWTH = [28, 42, 35, 60, 53, 71, 88];

function StatCard({
  label,
  value,
  icon: Icon,
  bg,
  iconColor,
  sub,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  bg: string;
  iconColor: string;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <h3 className="text-3xl font-black text-slate-900 mt-1">{value}</h3>
        </div>
        <div className={`p-2.5 rounded-xl ${bg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
      {sub && <p className="text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

export default function AnalyticsPage() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([fetchUsers(), fetchEvents(), fetchAnalyticsOverview()])
      .then(([u, e, o]) => {
        setUsers(u);
        setEvents(e);
        setOverview(o);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const roleCounts = users.reduce<Record<string, number>>((acc, u) => {
    const r = u.currentRole || 'unknown';
    acc[r] = (acc[r] || 0) + 1;
    return acc;
  }, {});

  const totalStudents = roleCounts['student'] || 0;
  const totalCRs = roleCounts['cr'] || 0;
  const totalAdmins = (roleCounts['admin'] || 0) + (roleCounts['super_admin'] || 0);
  const totalModerators = roleCounts['moderator'] || 0;

  const roleBarData = Object.entries(roleCounts).map(([role, count]) => ({
    role: role.replace('_', ' '),
    count,
    pct: users.length > 0 ? Math.round((count / users.length) * 100) : 0,
  }));

  const maxRoleCount = Math.max(...roleBarData.map((r) => r.count), 1);

  const eventsByStatus = events.reduce<Record<string, number>>((acc, e) => {
    acc[e.status] = (acc[e.status] || 0) + 1;
    return acc;
  }, {});

  const maxGrowth = Math.max(...MONTHLY_GROWTH);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1280px] flex flex-col gap-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/dashboard/super-admin" className="hover:text-primary font-medium transition-colors">
          Home
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-900 font-semibold">Analytics</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 rounded-xl">
            <BarChart2 className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            System Analytics
          </h1>
        </div>
        <p className="text-slate-500 max-w-2xl">
          Overview of platform usage, user distribution, and key system metrics.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value={users.length}
          icon={Users}
          bg="bg-blue-50"
          iconColor="text-primary"
          sub="All registered accounts"
        />
        <StatCard
          label="Total Students"
          value={totalStudents}
          icon={Users}
          bg="bg-emerald-50"
          iconColor="text-emerald-600"
          sub={`${users.length > 0 ? Math.round((totalStudents / users.length) * 100) : 0}% of total users`}
        />
        <StatCard
          label="Class Representatives"
          value={totalCRs}
          icon={TrendingUp}
          bg="bg-purple-50"
          iconColor="text-purple-600"
          sub="Active CRs"
        />
        <StatCard
          label="Admins & Moderators"
          value={totalAdmins + totalModerators}
          icon={Activity}
          bg="bg-orange-50"
          iconColor="text-orange-600"
          sub="Management staff"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Distribution Bar Chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">User Distribution by Role</h2>
            <p className="text-sm text-slate-500 mt-0.5">Breakdown of registered users across all roles</p>
          </div>
          <div className="flex flex-col gap-4 flex-1">
            {roleBarData.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">No user data available</p>
            ) : (
              roleBarData.map(({ role, count, pct }) => (
                <div key={role} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700 capitalize">{role}</span>
                    <span className="text-slate-500 font-mono">{count} ({pct}%)</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-700"
                      style={{ width: `${Math.round((count / maxRoleCount) * 100)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Monthly Growth Chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Monthly Growth</h2>
            <p className="text-sm text-slate-500 mt-0.5">New user registrations — Jan to Jul 2025</p>
          </div>
          <div className="flex items-end gap-3 h-48 flex-1">
            {MONTHS.map((month, i) => {
              const heightPct = Math.round((MONTHLY_GROWTH[i] / maxGrowth) * 100);
              return (
                <div key={month} className="group flex flex-col items-center gap-2 flex-1 h-full justify-end">
                  <div className="relative w-full flex justify-center">
                    <div
                      className="w-full max-w-[40px] rounded-t-md bg-gradient-to-t from-primary to-blue-300 group-hover:opacity-80 transition-opacity"
                      style={{ height: `${heightPct * 1.6}px` }}
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-0.5 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {MONTHLY_GROWTH[i]}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-500">{month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fee Overview & Event Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fee Overview */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Fee Overview</h2>
              <p className="text-xs text-slate-500">Academic year summary</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
              <p className="text-xs font-medium text-green-700 uppercase tracking-wide">Total Collected</p>
              <p className="text-2xl font-black text-green-800 mt-1">৳{Number(overview?.fees.totalCollected ?? 0).toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
              <p className="text-xs font-medium text-amber-700 uppercase tracking-wide">Pending</p>
              <p className="text-2xl font-black text-amber-800 mt-1">৳{Number(overview?.fees.totalDue ?? 0).toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Collection Rate</span>
              <span className="text-sm font-bold text-slate-900">
                {overview?.fees.totalExpected && Number(overview.fees.totalExpected) > 0
                  ? `${Math.round((Number(overview.fees.totalCollected) / Number(overview.fees.totalExpected)) * 100)}%`
                  : '—'}
              </span>
            </div>
            <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                style={{
                  width: overview?.fees.totalExpected && Number(overview.fees.totalExpected) > 0
                    ? `${Math.round((Number(overview.fees.totalCollected) / Number(overview.fees.totalExpected)) * 100)}%`
                    : '0%',
                }}
              />
            </div>
          </div>
        </div>

        {/* Event Stats */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Event Statistics</h2>
              <p className="text-xs text-slate-500">Total events: {events.length}</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {(['published', 'completed', 'draft', 'cancelled'] as const).map((status) => {
              const count = eventsByStatus[status] || 0;
              const total = events.length || 1;
              const colors: Record<string, string> = {
                published: 'bg-blue-500',
                completed: 'bg-emerald-500',
                draft: 'bg-slate-400',
                cancelled: 'bg-red-400',
              };
              const bgLight: Record<string, string> = {
                published: 'bg-blue-50 text-blue-700',
                completed: 'bg-emerald-50 text-emerald-700',
                draft: 'bg-slate-100 text-slate-700',
                cancelled: 'bg-red-50 text-red-700',
              };
              return (
                <div key={status} className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize min-w-[80px] text-center ${bgLight[status]}`}>
                    {status}
                  </span>
                  <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colors[status]} rounded-full transition-all duration-700`}
                      style={{ width: `${Math.round((count / total) * 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-700 min-w-[2ch] text-right">{count}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
            <span>Total events tracked</span>
            <span className="font-bold text-slate-900">{events.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
