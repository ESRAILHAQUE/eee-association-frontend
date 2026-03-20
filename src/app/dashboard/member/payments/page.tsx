'use client';

import { useState, useEffect, useCallback } from 'react';
import { CreditCard, Calendar, Download, CheckCircle, AlertTriangle, Loader2, Clock } from 'lucide-react';
import { fetchMyFees, type FeeRecord } from '@/lib/api';

const STATUS_MAP = {
  paid: { label: 'Paid', icon: CheckCircle, cls: 'bg-emerald-50 text-emerald-700' },
  partial: { label: 'Partial', icon: Clock, cls: 'bg-amber-50 text-amber-700' },
  unpaid: { label: 'Unpaid', icon: AlertTriangle, cls: 'bg-red-50 text-red-600' },
};

function fmt(val: string | number) {
  return `৳${Number(val).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

export default function MemberPaymentsPage() {
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMyFees();
      setFees(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const totalPaid = fees.reduce((sum, f) => sum + Number(f.paidAmount), 0);
  const totalDue = fees.reduce((sum, f) => sum + Number(f.dueAmount), 0);
  const nextUnpaid = fees.find((f) => f.paymentStatus !== 'paid');

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl">
      <header className="space-y-1">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">Payments</h1>
        <p className="text-slate-500">Track your semester fee payments for the EEE Association.</p>
      </header>

      {!loading && !error && (
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col gap-2 shadow-sm">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Paid</p>
            <p className="text-2xl font-bold text-emerald-600">{fmt(totalPaid)}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col gap-2 shadow-sm">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Due</p>
            <p className="text-2xl font-bold text-amber-600">{fmt(totalDue)}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col gap-2 shadow-sm">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Semesters</p>
            <p className="text-2xl font-bold text-slate-900">{fees.length}</p>
            {nextUnpaid && (
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Sem {nextUnpaid.semesterNumber} pending
              </p>
            )}
          </div>
        </section>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-3 text-slate-500 py-16">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading payments…
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {!loading && !error && (
        <section className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <CreditCard className="w-4 h-4" /> Fee Records
            </div>
            <button
              type="button"
              onClick={() => {
                const csv = [
                  ['Semester', 'Total Amount', 'Paid', 'Due', 'Status', 'Payment Method', 'Paid On'],
                  ...fees.map((f) => [String(f.semesterNumber), f.feeAmount, f.paidAmount, f.dueAmount, f.paymentStatus, f.paymentMethod ?? '', f.paymentDate ? new Date(f.paymentDate).toLocaleDateString() : '']),
                ].map((r) => r.join(',')).join('\n');
                const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'my-fees.csv'; a.click();
              }}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              <Download className="w-3 h-3" /> Export
            </button>
          </div>

          {fees.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm">No fee records yet.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {fees.map((f) => {
                const s = STATUS_MAP[f.paymentStatus];
                const Icon = s.icon;
                return (
                  <div key={f.id} className="flex flex-col md:grid md:grid-cols-12 gap-3 px-5 py-4 text-sm items-center hover:bg-slate-50 transition-colors">
                    <div className="md:col-span-4 w-full">
                      <p className="font-semibold text-slate-900">Semester {f.semesterNumber}</p>
                      <p className="text-xs text-slate-500">{f.paymentMethod ? `via ${f.paymentMethod}` : 'Association fee'}</p>
                    </div>
                    <div className="md:col-span-2 w-full text-slate-700 font-medium">{fmt(f.feeAmount)}</div>
                    <div className="md:col-span-2 w-full text-emerald-600 font-medium text-xs">Paid: {fmt(f.paidAmount)}</div>
                    <div className="md:col-span-2 w-full text-red-600 font-medium text-xs">Due: {fmt(f.dueAmount)}</div>
                    <div className="md:col-span-2 w-full flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${s.cls}`}>
                        <Icon className="w-3 h-3" /> {s.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
