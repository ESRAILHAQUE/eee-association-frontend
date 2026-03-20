'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Wallet, CheckCircle, Clock, AlertCircle, Download, Search,
  Loader2, AlertTriangle, CreditCard, X,
} from 'lucide-react';
import { fetchFees, fetchFeeStats, recordFeePayment, type FeeRecord, type FeeStats } from '@/lib/api';

const STATUS_STYLES = {
  paid: 'bg-green-100 text-green-700',
  partial: 'bg-amber-100 text-amber-700',
  unpaid: 'bg-red-100 text-red-700',
};

function fmt(val: string | number) {
  return `৳${Number(val).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

export default function CRFeeManagementPage() {
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [stats, setStats] = useState<FeeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentModal, setPaymentModal] = useState<FeeRecord | null>(null);

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
      setError(e instanceof Error ? e.message : 'Failed to load fee data');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { load(); }, [load]);

  const filtered = fees.filter((f) => {
    const q = search.toLowerCase();
    return !q || f.user?.fullName.toLowerCase().includes(q) || f.user?.registrationNumber.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-7xl flex flex-col gap-6">
      <nav className="flex flex-wrap gap-2 text-sm">
        <Link href="/dashboard/cr" className="text-slate-500 hover:text-primary font-medium">Home</Link>
        <span className="text-slate-400">/</span>
        <span className="text-slate-800 font-semibold">Fee Management</span>
      </nav>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">Batch Fee Management</h1>
          <p className="text-slate-500 text-sm mt-1">Track and record payments for your batch students.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            const csv = [
              ['Name', 'Reg. No.', 'Semester', 'Amount', 'Paid', 'Due', 'Status'],
              ...filtered.map((f) => [f.user?.fullName ?? '', f.user?.registrationNumber ?? '', String(f.semesterNumber), f.feeAmount, f.paidAmount, f.dueAmount, f.paymentStatus]),
            ].map((r) => r.join(',')).join('\n');
            const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'batch-fees.csv'; a.click();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Expected', value: fmt(stats.totalFeeAmount), icon: Wallet, bg: 'bg-slate-100 text-slate-600' },
            { label: 'Collected', value: fmt(stats.totalPaid), icon: CheckCircle, bg: 'bg-green-100 text-green-700' },
            { label: 'Due', value: fmt(stats.totalDue), icon: Clock, bg: 'bg-amber-100 text-amber-700' },
            { label: 'Unpaid Records', value: String(stats.pending), icon: AlertCircle, bg: 'bg-red-100 text-red-600' },
          ].map((s) => (
            <div key={s.label} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <p className="text-slate-500 text-xs font-medium">{s.label}</p>
                <div className={`p-1.5 rounded-md ${s.bg}`}><s.icon className="w-4 h-4" /></div>
              </div>
              <p className="text-slate-900 text-xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
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

      {loading && <div className="flex items-center justify-center gap-3 text-slate-500 py-16"><Loader2 className="w-5 h-5 animate-spin" /> Loading…</div>}
      {error && <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm"><AlertTriangle className="w-4 h-4 shrink-0" /> {error}</div>}

      {!loading && !error && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  <th className="px-5 py-4">Student</th>
                  <th className="px-5 py-4">Semester</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Paid</th>
                  <th className="px-5 py-4">Due</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="px-5 py-12 text-center text-slate-400 text-sm">No fee records found for your batch.</td></tr>
                )}
                {filtered.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900 text-sm">{f.user?.fullName ?? '—'}</p>
                      <p className="text-xs text-slate-500">{f.user?.registrationNumber}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">Sem {f.semesterNumber}</td>
                    <td className="px-5 py-4 text-sm font-medium text-slate-900">{fmt(f.feeAmount)}</td>
                    <td className="px-5 py-4 text-sm text-green-700">{fmt(f.paidAmount)}</td>
                    <td className="px-5 py-4 text-sm text-red-600">{fmt(f.dueAmount)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[f.paymentStatus]}`}>
                        {f.paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {f.paymentStatus !== 'paid' && (
                        <button
                          type="button"
                          onClick={() => setPaymentModal(f)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:opacity-90 transition"
                        >
                          <CreditCard className="w-3.5 h-3.5" /> Record
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {paymentModal && (
        <RecordPaymentModal
          fee={paymentModal}
          onClose={() => setPaymentModal(null)}
          onSaved={() => { setPaymentModal(null); load(); }}
        />
      )}
    </div>
  );
}

function RecordPaymentModal({ fee, onClose, onSaved }: { fee: FeeRecord; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ paidAmount: 0, paymentMethod: '', transactionReference: '' });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setErr(null);
    try {
      await recordFeePayment(fee.id, form);
      onSaved();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold">Record Payment</h2>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100"><X className="w-4 h-4" /></button>
        </div>
        <div className="px-6 py-3 bg-slate-50 text-sm text-slate-600 border-b border-slate-100">
          <p className="font-semibold text-slate-900">{fee.user?.fullName}</p>
          <p>Due: <strong>৳{Number(fee.dueAmount).toLocaleString()}</strong> · Semester {fee.semesterNumber}</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {err && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{err}</p>}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Amount (৳)</label>
            <input type="number" min="0.01" step="0.01" required value={form.paidAmount} onChange={(e) => setForm({ ...form, paidAmount: parseFloat(e.target.value) })} className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Method</label>
            <input type="text" placeholder="Cash / bKash / Bank…" value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Reference</label>
            <input type="text" placeholder="Transaction reference (optional)" value={form.transactionReference} onChange={(e) => setForm({ ...form, transactionReference: e.target.value })} className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100">Cancel</button>
            <button type="submit" disabled={submitting} className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-60">
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />} Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
