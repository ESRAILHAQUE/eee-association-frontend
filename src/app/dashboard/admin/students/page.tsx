'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Search, Mail, Download, Phone, Eye, Loader2, AlertTriangle,
  CheckCircle2, XCircle, Shield, ShieldOff, MoreVertical, Edit
} from 'lucide-react';
import { fetchUsers, fetchBatches, verifyUser, toggleUserBlock, type UserListItem, getStoredToken } from '@/lib/api';
import EditStudentModal from './EditStudentModal';

const ROLE_LABELS: Record<string, string> = {
  student: 'Student',
  cr: 'CR',
  moderator: 'Moderator',
  admin: 'Admin',
  super_admin: 'Super Admin',
};

export default function AdminStudentsPage() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [batchFilter, setBatchFilter] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [editingStudent, setEditingStudent] = useState<any | null>(null);
  const [allBatches, setAllBatches] = useState<string[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [data, batchData] = await Promise.all([
        fetchUsers({
          search: search || undefined,
          batch: batchFilter || undefined,
          role: 'student',
        }),
        fetchBatches()
      ]);
      setUsers(data);
      setAllBatches(batchData.map(b => b.name));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load students');
    } finally {
      setLoading(false);
    }
  }, [search, batchFilter]);

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const handleEditSave = async (payload: any) => {
    if(!editingStudent) return;
    try {
      const token = getStoredToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/users/${editingStudent.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to update student');
      setEditingStudent(null);
      load();
    } catch (err: any) {
      throw err;
    }
  };

  const handleVerify = async (userId: string) => {
    setActionLoading(userId);
    try {
      await verifyUser(userId);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isVerified: true } : u)),
      );
    } catch { /* ignore */ }
    setActionLoading(null);
  };

  const handleBlock = async (userId: string, isBlock: boolean) => {
    setActionLoading(userId);
    try {
      await toggleUserBlock(userId, isBlock);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isBlock } : u)),
      );
    } catch { /* ignore */ }
    setActionLoading(null);
  };

  return (
    <div className="flex flex-col w-full max-w-[1280px] gap-6">
      <nav className="flex items-center text-sm font-medium text-slate-500">
        <Link href="/dashboard/admin" className="hover:text-primary transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900">Student Directory</span>
      </nav>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-slate-900 text-xl md:text-2xl font-bold">Student Directory</h1>
          <p className="text-slate-600 text-sm mt-1">
            Manage and view all registered students. Search, filter by batch, verify, or block accounts.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            const csv = [
              ['Name', 'Registration No.', 'Email', 'Batch', 'Role', 'Verified', 'Blocked'],
              ...users.map((u) => [
                u.fullName, u.registrationNumber, u.institutionalEmail,
                u.profile?.batch ?? '', u.currentRole, String(u.isVerified), String(u.isBlock),
              ]),
            ].map((row) => row.join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = 'students.csv'; a.click();
          }}
          className="h-10 px-4 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or registration number…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <select
          value={batchFilter}
          onChange={(e) => setBatchFilter(e.target.value)}
          className="h-10 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">All Batches</option>
          {allBatches.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
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
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">
                      No students found.
                    </td>
                  </tr>
                )}
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 shrink-0 flex items-center justify-center text-slate-600 text-xs font-bold">
                          {u.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 text-sm">{u.fullName}</p>
                          <p className="text-xs text-slate-500">{ROLE_LABELS[u.currentRole] ?? u.currentRole}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{u.registrationNumber}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-xs font-medium text-slate-700">
                        {u.profile?.batch ?? '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <a href={`mailto:${u.institutionalEmail}`} className="flex items-center gap-2 text-primary hover:underline text-sm">
                        <Mail className="w-3.5 h-3.5" /> {u.institutionalEmail}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium ${u.isVerified ? 'text-green-600' : 'text-amber-600'}`}>
                          {u.isVerified ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          {u.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                        {u.isBlock && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
                            <ShieldOff className="w-3.5 h-3.5" /> Blocked
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <div className="flex justify-end">
                        <button
                          onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === u.id ? null : u.id); }}
                          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                      {openDropdown === u.id && (
                        <div className="absolute right-6 top-14 z-10 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 overflow-hidden">
                          <button
                            onClick={() => { setEditingStudent(u); setOpenDropdown(null); }}
                            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-primary flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4" /> Edit Info
                          </button>
                          {!u.isVerified && (
                            <button
                              disabled={actionLoading === u.id}
                              onClick={() => { handleVerify(u.id); setOpenDropdown(null); }}
                              className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center gap-2 disabled:opacity-50"
                            >
                              <CheckCircle2 className="w-4 h-4" /> Verify Student
                            </button>
                          )}
                          <button
                            disabled={actionLoading === u.id}
                            onClick={() => { handleBlock(u.id, !u.isBlock); setOpenDropdown(null); }}
                            className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 disabled:opacity-50 ${u.isBlock ? 'text-slate-600 hover:bg-slate-50' : 'text-red-600 hover:bg-red-50'}`}
                          >
                            {u.isBlock ? <Shield className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
                            {u.isBlock ? 'Unblock Student' : 'Block Student'}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!loading && (
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-500">
              {users.length} student{users.length !== 1 ? 's' : ''} found
            </div>
          )}
        </div>
      )}

      {editingStudent && (
        <EditStudentModal
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
}
