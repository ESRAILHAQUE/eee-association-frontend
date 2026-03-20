'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Clock, Shield, Loader2, AlertTriangle, Search, RefreshCw } from 'lucide-react';
import { fetchLoginLogs, type LoginLog } from '@/lib/api';

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(iso).toLocaleDateString();
}

export default function SuperAdminLogsPage() {
  const [logs, setLogs] = useState<LoginLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLoginLogs({ limit: 100 });
      setLogs(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load logs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = logs.filter((l) => {
    const q = search.toLowerCase();
    return !q || l.user.fullName.toLowerCase().includes(q) || l.user.registrationNumber.toLowerCase().includes(q) || (l.ip ?? '').includes(q);
  });

  return (
    <div className="w-full max-w-[1280px] flex flex-col gap-6">
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/dashboard/super-admin" className="hover:text-primary font-medium">Home</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">System Logs</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" /> System Logs
          </h1>
          <p className="text-slate-500 text-sm mt-1">Monitor login activity and security events.</p>
        </div>
        <button type="button" onClick={load} className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by user, registration, or IP…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-9 pr-4 rounded-xl bg-white border border-slate-200 shadow-sm text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {loading && <div className="flex items-center justify-center gap-3 text-slate-500 py-16"><Loader2 className="w-5 h-5 animate-spin" /> Loading logs…</div>}
      {error && <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm"><AlertTriangle className="w-4 h-4 shrink-0" /> {error}</div>}

      {!loading && !error && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">IP Address</th>
                  <th className="px-6 py-4">Device / Browser</th>
                  <th className="px-6 py-4">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">No logs found.</td></tr>
                )}
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900 text-sm">{log.user.fullName}</p>
                      <p className="text-xs text-slate-500">{log.user.registrationNumber}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-xs font-medium text-slate-700 capitalize">
                        {log.user.currentRole.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-slate-600">{log.ip ?? '—'}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 max-w-[200px] truncate">{log.userAgent ?? '—'}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> {timeAgo(log.loggedAt)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-500">
            {filtered.length} log{filtered.length !== 1 ? 's' : ''} shown
          </div>
        </div>
      )}
    </div>
  );
}
