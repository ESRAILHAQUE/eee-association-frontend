'use client';

import { CreditCard, Calendar, Download, CheckCircle, AlertTriangle } from 'lucide-react';

const payments = [
  { label: 'Membership Fee 2024', amount: '৳500', status: 'Paid', dueDate: 'Jan 15, 2024', paidOn: 'Jan 10, 2024' },
  { label: 'Workshop: Embedded Systems', amount: '৳300', status: 'Pending', dueDate: 'Mar 05, 2024', paidOn: '-' },
  { label: 'T-shirt & Swag Pack', amount: '৳450', status: 'Paid', dueDate: 'Feb 20, 2024', paidOn: 'Feb 18, 2024' },
];

export default function MemberPaymentsPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Payments
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
          Track your membership fees, event registrations and other payments related to the Department of EEE.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-surface dark:bg-slate-900 p-4 flex flex-col gap-2">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Total paid this year
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">৳950</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-surface dark:bg-slate-900 p-4 flex flex-col gap-2">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Pending amount
          </p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-300">৳300</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-surface dark:bg-slate-900 p-4 flex flex-col gap-2">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Next due date
          </p>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <Calendar className="w-4 h-4" />
            <span>Mar 05, 2024</span>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-surface dark:bg-slate-900 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            <CreditCard className="w-4 h-4" />
            Payment history
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Download className="w-3 h-3" />
            Download receipt
          </button>
        </div>
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {payments.map((item) => (
            <div
              key={item.label}
              className="flex flex-col md:grid md:grid-cols-12 gap-3 px-4 py-3 text-sm items-center md:items-start hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
            >
              <div className="md:col-span-4 w-full">
                <p className="font-medium text-slate-900 dark:text-slate-50">{item.label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Association payment</p>
              </div>
              <div className="md:col-span-2 w-full text-slate-700 dark:text-slate-200">{item.amount}</div>
              <div className="md:col-span-3 w-full flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <Calendar className="w-3 h-3" />
                <span>Due: {item.dueDate}</span>
              </div>
              <div className="md:col-span-3 w-full flex items-center gap-2 justify-between md:justify-end">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    item.status === 'Paid'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                  }`}
                >
                  {item.status === 'Paid' ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Paid
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Pending
                    </>
                  )}
                </span>
                <span className="hidden md:inline text-[11px] text-slate-500 dark:text-slate-400">
                  {item.paidOn === '-' ? 'Not yet paid' : `Paid on ${item.paidOn}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

