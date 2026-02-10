'use client';

import { Search, Filter, UserPlus, ShieldCheck, Mail, MoreHorizontal, User } from 'lucide-react';

const users = [
  { name: 'Esrail Haque', email: 'esrail@example.com', role: 'Super Admin', status: 'Active', lastActive: 'Just now' },
  { name: 'Dept Admin', email: 'admin@eee.edu', role: 'Admin', status: 'Active', lastActive: '2h ago' },
  { name: 'CR - Batch 2024', email: 'cr2024@eee.edu', role: 'CR', status: 'Active', lastActive: 'Yesterday' },
  { name: 'Moderator Panel', email: 'mod@eee.edu', role: 'Moderator', status: 'Suspended', lastActive: '7d ago' },
];

export default function SuperAdminUsersPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
            User Management
          </h1>
          <p className="text-slate-500 max-w-2xl">
            Manage all association users across roles. Control access for Super Admins, Admins, CRs, Moderators and Members
            from a single place.
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary/30 hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email or role..."
            className="w-full bg-transparent border-0 text-sm outline-none placeholder:text-slate-400 text-slate-900"
          />
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">
            <ShieldCheck className="w-3 h-3" />
            Role-based access enforced
          </span>
        </div>
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-surface">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 border-b border-slate-200">
          <div className="col-span-4 flex items-center gap-2">
            <User className="w-4 h-4" />
            User
          </div>
          <div className="col-span-2">Role</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-3">Last active</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>
        <div className="divide-y divide-slate-200">
          {users.map((user) => (
            <div
              key={user.email}
              className="grid grid-cols-12 gap-4 px-4 py-3 text-sm items-center hover:bg-slate-50 transition-colors"
            >
              <div className="col-span-4 flex items-center gap-3">
                <div className="size-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                  {user.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-slate-900">{user.name}</span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Mail className="w-3 h-3" />
                    {user.email}
                  </span>
                </div>
              </div>
              <div className="col-span-2">
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                  {user.role}
                </span>
              </div>
              <div className="col-span-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                    user.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {user.status}
                </span>
              </div>
              <div className="col-span-3 text-slate-500">{user.lastActive}</div>
              <div className="col-span-1 flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

