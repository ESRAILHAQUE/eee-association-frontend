'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, Mail, Download, Eye, Loader2, AlertTriangle } from 'lucide-react';
import { fetchUsers, type UserListItem } from '@/lib/api';

export default function CRStudentsPage() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Backend scopes this to CR's batch automatically via auth middleware
      const data = await fetchUsers({ role: 'student', search: search || undefined });
      setUsers(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load students');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <div className="flex flex-col w-full max-w-[1280px] gap-6">
      <nav className="flex items-center text-sm font-medium text-slate-500">
        <Link href="/dashboard/cr" className="hover:text-primary transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900">My Batch Students</span>
      </nav>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-slate-900 text-xl md:text-2xl font-bold">My Batch Students</h1>
          <p className="text-slate-600 text-sm mt-1">Students in your batch only.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            const csv = [
              ['Name', 'Registration No.', 'Email', 'Batch'],
              ...users.map((u) => [u.fullName, u.registrationNumber, u.institutionalEmail, u.profile?.batch ?? '']),
            ].map((r) => r.join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'batch-students.csv'; a.click();
          }}
          className="h-10 px-4 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors"
        >
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name or registration number…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-9 pr-4 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm"
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-3 text-slate-500 py-16">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading students…
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {!loading && !error && (
        <div className="w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Reg. No.</th>
                  <th className="px-6 py-4">Batch</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">
                      No students found in your batch.
                    </td>
                  </tr>
                )}
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 shrink-0 flex items-center justify-center text-blue-700 text-xs font-bold">
                          {u.fullName.charAt(0).toUpperCase()}
                        </div>
                        <p className="font-medium text-slate-900 text-sm">{u.fullName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{u.registrationNumber}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-xs font-medium text-blue-700">
                        {u.profile?.batch ?? '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <a href={`mailto:${u.institutionalEmail}`} className="flex items-center gap-2 text-primary hover:underline text-sm">
                        <Mail className="w-3.5 h-3.5" /> {u.institutionalEmail}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition"
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-500">
            {users.length} student{users.length !== 1 ? 's' : ''} in your batch
          </div>
        </div>
      )}
    </div>
  );
}
