'use client';

import { Clock, Shield, Activity, AlertTriangle, Filter } from 'lucide-react';

const logs = [
  {
    type: 'security',
    title: 'New Super Admin login',
    actor: 'Esrail Haque',
    meta: 'Chrome · Dhaka, BD',
    time: 'Just now',
    severity: 'info',
  },
  {
    type: 'user',
    title: 'CR (Batch 2024) created',
    actor: 'Dept Admin',
    meta: 'Role: CR · Batch: 2024',
    time: '25 min ago',
    severity: 'info',
  },
  {
    type: 'payment',
    title: 'Payment gateway configuration updated',
    actor: 'Super Admin',
    meta: 'Provider: SSLCOMMERZ (sandbox)',
    time: '2 h ago',
    severity: 'warning',
  },
  {
    type: 'system',
    title: 'Failed login attempt (3x)',
    actor: 'Unknown',
    meta: 'IP: 192.168.0.24',
    time: 'Yesterday',
    severity: 'critical',
  },
];

function badgeClasses(severity: string) {
  switch (severity) {
    case 'critical':
      return 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200';
    case 'warning':
      return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200';
    default:
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800/80 dark:text-slate-200';
  }
}

export default function SuperAdminLogsPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Activity Logs
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
            Audit trail for important actions across the system — user changes, payments configuration and security
            events.
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </header>

      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-surface dark:bg-slate-900 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            <Activity className="w-4 h-4" />
            Latest events
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-200">
            <Shield className="w-3 h-3" />
            Logs kept for 90 days
          </span>
        </div>
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {logs.map((log) => (
            <div
              key={`${log.title}-${log.time}`}
              className="flex flex-col md:flex-row md:items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
            >
              <div className="flex-1 flex items-start gap-3">
                <div className="mt-1">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${badgeClasses(log.severity)}`}>
                    {log.type.toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-50">{log.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    By <span className="font-medium">{log.actor}</span> · {log.meta}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Clock className="w-3 h-3" />
                <span>{log.time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

