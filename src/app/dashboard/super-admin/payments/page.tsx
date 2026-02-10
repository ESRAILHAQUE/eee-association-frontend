'use client';

import { CreditCard, DollarSign, TrendingUp, Calendar, Download, Filter } from 'lucide-react';

const summaryCards = [
  { label: 'Total Collected', value: '$48,920', sub: 'This academic year', icon: DollarSign, tone: 'primary' },
  { label: 'Pending Dues', value: '$6,380', sub: 'Across all batches', icon: CreditCard, tone: 'amber' },
  { label: 'Successful Transactions', value: '1,284', sub: 'Last 90 days', icon: TrendingUp, tone: 'emerald' },
];

const payments = [
  { id: 'TXN-98213', name: 'Batch 2024 Membership', amount: '$1,200', method: 'Online', status: 'Success', date: 'Today, 10:23 AM' },
  { id: 'TXN-98190', name: 'Workshop Registration', amount: '$540', method: 'Cash', status: 'Pending', date: 'Yesterday, 4:12 PM' },
  { id: 'TXN-98133', name: 'Event Sponsorship', amount: '$5,000', method: 'Bank', status: 'Success', date: '2 days ago' },
  { id: 'TXN-98021', name: 'Late Fee', amount: '$80', method: 'Online', status: 'Failed', date: '1 week ago' },
];

export default function SuperAdminPaymentsPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
            Payments Overview
          </h1>
          <p className="text-slate-500 max-w-2xl">
            Consolidated view of all association payments — membership fees, events, sponsorships and penalties across
            batches.
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
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {summaryCards.map((card) => {
          const toneClasses =
            card.tone === 'primary'
              ? 'bg-blue-50 text-blue-700'
              : card.tone === 'amber'
                ? 'bg-amber-50 text-amber-700'
                : 'bg-emerald-50 text-emerald-700';
          return (
            <div
              key={card.label}
              className="rounded-xl border border-slate-200 bg-surface p-4 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {card.label}
                </p>
                <div className={`inline-flex items-center justify-center rounded-full px-2 py-1 text-xs ${toneClasses}`}>
                  <card.icon className="w-3 h-3 mr-1" />
                  This year
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{card.value}</p>
              <p className="text-xs text-slate-500">{card.sub}</p>
            </div>
          );
        })}
      </section>

      <section className="rounded-xl border border-slate-200 bg-surface overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Calendar className="w-4 h-4" />
            Recent Transactions
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            View full history
          </button>
        </div>

        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <div className="col-span-3">Reference</div>
          <div className="col-span-3">Purpose</div>
          <div className="col-span-2">Method</div>
          <div className="col-span-2">Amount</div>
          <div className="col-span-2 text-right">Status</div>
        </div>
        <div className="divide-y divide-slate-200">
          {payments.map((txn) => (
            <div
              key={txn.id}
              className="grid grid-cols-12 gap-4 px-4 py-3 text-sm items-center hover:bg-slate-50 transition-colors"
            >
              <div className="col-span-3 font-mono text-xs text-slate-500">{txn.id}</div>
              <div className="col-span-3 text-slate-900">{txn.name}</div>
              <div className="col-span-2 text-slate-600">{txn.method}</div>
              <div className="col-span-2 font-semibold text-slate-900">{txn.amount}</div>
              <div className="col-span-2 flex flex-col items-end gap-1">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                    txn.status === 'Success'
                      ? 'bg-emerald-50 text-emerald-700'
                      : txn.status === 'Pending'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {txn.status}
                </span>
                <span className="text-[11px] text-slate-500">{txn.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

