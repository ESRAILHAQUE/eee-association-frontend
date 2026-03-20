'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Search,
  Shield,
  CheckCircle,
  XCircle,
  ChevronDown,
  UserCog,
  RefreshCw,
} from 'lucide-react';
import {
  fetchUsers,
  updateUserRole,
  toggleUserBlock,
  verifyUser,
  type UserListItem,
} from '@/lib/api';

const ROLES = ['student', 'cr', 'moderator', 'admin', 'super_admin'] as const;
type Role = (typeof ROLES)[number];

const ROLE_COLORS: Record<string, string> = {
  student: 'bg-slate-100 text-slate-700',
  cr: 'bg-blue-100 text-blue-700',
  moderator: 'bg-purple-100 text-purple-700',
  admin: 'bg-orange-100 text-orange-700',
  super_admin: 'bg-red-100 text-red-700',
};

const PAGE_SIZE = 20;

function RoleBadge({ role }: { role: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${ROLE_COLORS[role] ?? 'bg-slate-100 text-slate-600'}`}>
      {role.replace('_', ' ')}
    </span>
  );
}

export default function RoleManagementPage() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [openRoleDropdown, setOpenRoleDropdown] = useState<string | null>(null);

  const loadUsers = useCallback(() => {
    setLoading(true);
    fetchUsers()
      .then(setUsers)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filtered = users.filter((u) => {
    const matchSearch =
      !search ||
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.institutionalEmail.toLowerCase().includes(search.toLowerCase()) ||
      u.registrationNumber?.toLowerCase().includes(search.toLowerCase());
    const matchRole = !roleFilter || u.currentRole === roleFilter;
    return matchSearch && matchRole;
  });

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = filtered.length > paginated.length;

  async function handleRoleChange(userId: string, role: string) {
    setActionLoading(userId + '-role');
    setOpenRoleDropdown(null);
    try {
      await updateUserRole(userId, role);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, currentRole: role } : u)),
      );
    } catch (err: unknown) {
      alert((err as Error).message);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleToggleBlock(user: UserListItem) {
    setActionLoading(user.id + '-block');
    try {
      await toggleUserBlock(user.id, !user.isBlock);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isBlock: !u.isBlock } : u)),
      );
    } catch (err: unknown) {
      alert((err as Error).message);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleVerify(userId: string) {
    setActionLoading(userId + '-verify');
    try {
      await verifyUser(userId);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isVerified: true } : u)),
      );
    } catch (err: unknown) {
      alert((err as Error).message);
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="w-full max-w-[1280px] flex flex-col gap-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/dashboard/super-admin" className="hover:text-primary font-medium transition-colors">
          Home
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-900 font-semibold">Role Management</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-50 rounded-xl">
              <UserCog className="w-6 h-6 text-orange-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Role Management
            </h1>
          </div>
          <p className="text-slate-500 max-w-2xl">
            Control user roles, verification status, and account access across the platform.
          </p>
        </div>
        <button
          type="button"
          onClick={loadUsers}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2.5 shadow-sm">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by name, email or reg no..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 text-slate-900"
          />
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 shadow-sm">
          <Shield className="w-4 h-4 text-slate-400" />
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="bg-transparent text-sm outline-none text-slate-700 py-2.5 pr-2 cursor-pointer"
          >
            <option value="">All Roles</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>{r.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary */}
      <div className="text-sm text-slate-500">
        Showing <span className="font-semibold text-slate-900">{paginated.length}</span> of{' '}
        <span className="font-semibold text-slate-900">{filtered.length}</span> users
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-7 h-7 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">User</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Reg No</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Current Role</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Last Login</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                      No users found
                    </td>
                  </tr>
                ) : (
                  paginated.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {user.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{user.fullName}</p>
                            <p className="text-xs text-slate-500">{user.institutionalEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-mono text-xs">
                        {user.registrationNumber || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <RoleBadge role={user.currentRole} />
                      </td>
                      <td className="px-4 py-3">
                        {user.isBlock ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-red-50 text-red-700">
                            <XCircle className="w-3 h-3" /> Blocked
                          </span>
                        ) : user.isVerified ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
                            <CheckCircle className="w-3 h-3" /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-amber-50 text-amber-700">
                            Unverified
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {user.lastLoginAt
                          ? new Date(user.lastLoginAt).toLocaleDateString()
                          : 'Never'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {/* Change Role Dropdown */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                setOpenRoleDropdown(
                                  openRoleDropdown === user.id ? null : user.id,
                                )
                              }
                              disabled={actionLoading === user.id + '-role'}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors disabled:opacity-50"
                            >
                              {actionLoading === user.id + '-role' ? (
                                <RefreshCw className="w-3 h-3 animate-spin" />
                              ) : (
                                <>
                                  Role
                                  <ChevronDown className="w-3 h-3" />
                                </>
                              )}
                            </button>
                            {openRoleDropdown === user.id && (
                              <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-slate-200 rounded-xl shadow-lg py-1 min-w-[130px]">
                                {ROLES.map((r) => (
                                  <button
                                    key={r}
                                    type="button"
                                    onClick={() => handleRoleChange(user.id, r)}
                                    className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 capitalize transition-colors ${user.currentRole === r ? 'font-bold text-primary' : 'text-slate-700'}`}
                                  >
                                    {r.replace('_', ' ')}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Block / Unblock */}
                          <button
                            type="button"
                            onClick={() => handleToggleBlock(user)}
                            disabled={actionLoading === user.id + '-block'}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${user.isBlock ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700' : 'bg-red-100 hover:bg-red-200 text-red-700'}`}
                          >
                            {actionLoading === user.id + '-block' ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : user.isBlock ? (
                              'Unblock'
                            ) : (
                              'Block'
                            )}
                          </button>

                          {/* Verify */}
                          {!user.isVerified && (
                            <button
                              type="button"
                              onClick={() => handleVerify(user.id)}
                              disabled={actionLoading === user.id + '-verify'}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors disabled:opacity-50"
                            >
                              {actionLoading === user.id + '-verify' ? (
                                <RefreshCw className="w-3 h-3 animate-spin" />
                              ) : (
                                'Verify'
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {hasMore && (
            <div className="px-4 py-4 border-t border-slate-100 flex justify-center">
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                className="px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                Load More ({filtered.length - paginated.length} remaining)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
