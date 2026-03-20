'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { FileText, Download, BarChart3, Users, CreditCard, Calendar, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { fetchAnalyticsOverview, fetchFeeStats, type AnalyticsOverview, type FeeStats } from '@/lib/api';

function fmt(val: string | number) {
  return `৳${Number(val).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

export default function AdminReportsPage() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [feeStats, setFeeStats] = useState<FeeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [o, f] = await Promise.all([fetchAnalyticsOverview(), fetchFeeStats()]);
      setOverview(o);
      setFeeStats(f);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load report data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const kpiCards = overview && feeStats ? [
    { label: 'Total Collected', value: fmt(feeStats.totalPaid), sub: `${feeStats.paid} paid records`, icon: CreditCard },
    { label: 'Outstanding Dues', value: fmt(feeStats.totalDue), sub: `${feeStats.pending} unpaid records`, icon: BarChart3 },
    { label: 'Active Students', value: String(overview.users.byRole?.student ?? 0), sub: 'Enrolled', icon: Users },
    { label: 'Events This Year', value: String(overview.events.total), sub: `${overview.events.published} published`, icon: Calendar },
  ] : [];

  const reportTemplates = [
    { name: 'Fee Collection Summary', desc: 'All batches — paid, partial, unpaid breakdown', icon: CreditCard, color: 'text-primary bg-blue-50' },
    { name: 'Student Roster', desc: 'Complete list of registered and verified students', icon: Users, color: 'text-emerald-700 bg-emerald-50' },
    { name: 'Event Participation Report', desc: 'RSVPs and attendance across all events', icon: Calendar, color: 'text-purple-700 bg-purple-50' },
    { name: 'Leave Request Summary', desc: 'Leave approvals and rejections per batch', icon: FileText, color: 'text-amber-700 bg-amber-50' },
  ];

  return (
    <div className="max-w-5xl flex flex-col gap-6">
      <nav className="flex flex-wrap gap-2 text-sm">
        <Link href="/dashboard/admin" className="text-slate-500 hover:text-primary font-medium">Home</Link>
        <span className="text-slate-400">/</span>
        <span className="text-slate-800 font-semibold">Reports</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">Reports & Analytics</h1>
          <p className="text-slate-500 text-sm mt-1">View and export key reports for the EEE Department.</p>
        </div>
        <button type="button" onClick={load} className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {loading && <div className="flex items-center justify-center gap-3 text-slate-500 py-16"><Loader2 className="w-5 h-5 animate-spin" /> Loading report data…</div>}
      {error && <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm"><AlertTriangle className="w-4 h-4 shrink-0" /> {error}</div>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiCards.map((card) => (
              <div key={card.label} className="flex flex-col gap-2 p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-2">
                  <card.icon className="w-4 h-4 text-slate-400" />
                  <p className="text-slate-500 text-xs font-medium">{card.label}</p>
                </div>
                <p className="text-slate-900 text-xl font-bold">{card.value}</p>
                <p className="text-slate-400 text-xs">{card.sub}</p>
              </div>
            ))}
          </div>

          {overview && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <h2 className="text-base font-bold text-slate-900 mb-4">Platform Overview</h2>
                <div className="space-y-3">
                  {[
                    { label: 'Total Users', value: overview.users.total, detail: `${overview.users.verified} verified` },
                    { label: 'New Signups (7d)', value: overview.users.recentSignups, detail: 'this week' },
                    { label: 'Total Events', value: overview.events.total, detail: `${overview.events.draft} drafts` },
                    { label: 'Total Notices', value: overview.notices.total, detail: 'published' },
                    { label: 'Feedback Items', value: overview.feedback.total, detail: 'submitted' },
                    { label: 'Leave Requests', value: overview.leaveRequests.total, detail: 'total' },
                    { label: 'Resources', value: overview.resources.total, detail: 'approved' },
                    { label: 'Active Clubs', value: overview.clubs.total, detail: 'clubs' },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">{row.label}</span>
                      <span className="font-bold text-slate-900">{row.value} <span className="font-normal text-slate-400 text-xs">({row.detail})</span></span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <h2 className="text-base font-bold text-slate-900 mb-4">User Distribution</h2>
                <div className="space-y-3">
                  {Object.entries(overview.users.byRole).map(([role, count]) => {
                    const pct = overview.users.total > 0 ? Math.round((count / overview.users.total) * 100) : 0;
                    return (
                      <div key={role} className="flex flex-col gap-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-700 capitalize">{role.replace('_', ' ')}</span>
                          <span className="text-slate-500 font-mono">{count} ({pct}%)</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Report Templates */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Export Reports</h2>
          <p className="text-sm text-slate-500 mt-0.5">Download data as CSV for further analysis.</p>
        </div>
        <div className="divide-y divide-slate-100">
          {reportTemplates.map((r) => (
            <div key={r.name} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${r.color.split(' ')[1]}`}>
                  <r.icon className={`w-4 h-4 ${r.color.split(' ')[0]}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{r.name}</p>
                  <p className="text-xs text-slate-500">{r.desc}</p>
                </div>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition"
              >
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
