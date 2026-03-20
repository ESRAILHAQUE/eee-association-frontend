'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { CreditCard, DollarSign, TrendingUp, Download, Search, Loader2, AlertTriangle } from 'lucide-react';
import { fetchFees, fetchFeeStats, type FeeRecord, type FeeStats } from '@/lib/api';

const STATUS_STYLES = {
  paid: 'bg-green-100 text-green-700',
  partial: 'bg-amber-100 text-amber-700',
  unpaid: 'bg-red-100 text-red-600',
};

function fmt(val: string | number) {
  return `৳${Number(val).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

export default function SuperAdminPaymentsPage() {
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [stats, setStats] = useState<FeeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [feesData, statsData] = await Promise.all([
        fetchFees({ status: statusFilter || undefined }),
        fetchFeeStats(),
      ]);
      setFees(feesData);
      setStats(statsData);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { load(); }, [load]);

  const filtered = fees.filter((f) => {
    const q = search.toLowerCase();
    return !q || f.user?.fullName.toLowerCase().includes(q) || f.user?.registrationNumber.toLowerCase().includes(q) || (f.transactionReference ?? '').toLowerCase().includes(q);
  });

  return (
    <div className="w-full max-w-[1280px] flex flex-col gap-6">
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/dashboard/super-admin" className="hover:text-primary font-medium">Home</Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">Payments</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payment Management</h1>
          <p className="text-slate-500 text-sm mt-1">Full overview of all association fee records across all batches.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            const csv = [
              ['Name', 'Reg. No.', 'Batch', 'Semester', 'Amount', 'Paid', 'Due', 'Status', 'Method', 'Paid On'],
              ...filtered.map((f) => [f.user?.fullName ?? '', f.user?.registrationNumber ?? '', f.user?.profile?.batch ?? '', String(f.semesterNumber), f.feeAmount, f.paidAmount, f.dueAmount, f.paymentStatus, f.paymentMethod ?? '', f.paymentDate ? new Date(f.paymentDate).toLocaleDateString() : '']),
            ].map((r) => r.join(',')).join('\n');
            const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'all-payments.csv'; a.click();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
        >
          <Download className="w-4 h-4" /> Export All
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Collected', value: fmt(stats.totalPaid), icon: DollarSign, tone: 'text-emerald-700 bg-emerald-50' },
            { label: 'Total Due', value: fmt(stats.totalDue), icon: CreditCard, tone: 'text-amber-700 bg-amber-50' },
            { label: 'Paid Records', value: String(stats.paid), icon: TrendingUp, tone: 'text-primary bg-blue-50' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
              <div className={`p-2.5 rounded-xl ${s.tone.split(' ')[1]}`}>
                <s.icon className={`w-5 h-5 ${s.tone.split(' ')[0]}`} />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, registration, or transaction ref…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700 focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="partial">Partial</option>
          <option value="unpaid">Unpaid</option>
        </select>
      </div>

      {loading && <div className="flex items-center justify-center gap-3 text-slate-500 py-16"><Loader2 className="w-5 h-5 animate-spin" /> Loading payments…</div>}
      {error && <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm"><AlertTriangle className="w-4 h-4 shrink-0" /> {error}</div>}

      {!loading && !error && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Batch</th>
                  <th className="px-6 py-4">Semester</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Paid</th>
                  <th className="px-6 py-4">Due</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4">Paid On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 && (
                  <tr><td colSpan={9} className="px-6 py-12 text-center text-slate-400 text-sm">No payment records found.</td></tr>
                )}
                {filtered.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900 text-sm">{f.user?.fullName ?? '—'}</p>
                      <p className="text-xs text-slate-500">{f.user?.registrationNumber}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{f.user?.profile?.batch ?? '—'}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">Sem {f.semesterNumber}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{fmt(f.feeAmount)}</td>
                    <td className="px-6 py-4 text-sm text-emerald-700">{fmt(f.paidAmount)}</td>
                    <td className="px-6 py-4 text-sm text-red-600">{fmt(f.dueAmount)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[f.paymentStatus]}`}>
                        {f.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{f.paymentMethod ?? '—'}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {f.paymentDate ? new Date(f.paymentDate).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-500">
            {filtered.length} record{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
}
