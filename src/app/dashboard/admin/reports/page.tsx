'use client';

import Link from 'next/link';
import { FileText, Download, BarChart3, Users, CreditCard, Calendar } from 'lucide-react';

const kpiCards = [
  { label: 'Total Collections', value: '₹4,25,000', sub: 'This semester', icon: CreditCard },
  { label: 'Outstanding Dues', value: '₹75,000', sub: 'Across all years', icon: BarChart3 },
  { label: 'Active Students', value: '450', sub: 'Enrolled in EEE', icon: Users },
  { label: 'Reports Generated', value: '18', sub: 'Last 30 days', icon: FileText },
];

const reportRows = [
  { name: 'Semester-wise Fee Summary', scope: 'All Batches', lastRun: 'Today, 10:30 AM', format: 'PDF, XLSX' },
  { name: 'Defaulter List', scope: '4th Year', lastRun: 'Yesterday, 5:10 PM', format: 'PDF' },
  { name: 'Event Participation Overview', scope: 'Department Events', lastRun: 'Oct 21, 3:45 PM', format: 'PDF, CSV' },
  { name: 'Scholarship & Waiver Report', scope: 'All Years', lastRun: 'Oct 18, 11:00 AM', format: 'PDF' },
];

export default function AdminReportsPage() {
  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8">
      <nav className="flex flex-wrap gap-2 text-sm text-slate-500">
        <Link
          href="/dashboard/admin"
          className="hover:text-primary transition-colors font-medium"
        >
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Reports</span>
      </nav>

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-slate-900 text-xl md:text-2xl font-bold">
            Analytics & Reports
          </h1>
          <p className="text-slate-500 text-base max-w-2xl">
            Generate downloadable summaries for fees, students, and activities to share with
            department leadership.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-sm text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Download className="w-5 h-5" />
            Export All
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold cursor-pointer hover:bg-slate-800 transition-colors"
          >
            <FileText className="w-5 h-5" />
            Create Custom Report
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <div
            key={card.label}
            className="flex flex-col gap-2 p-5 rounded-sm border border-slate-200 bg-white shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-slate-700 text-sm font-medium">
                {card.label}
              </p>
              <span className="p-1.5 rounded-md bg-primary/10 text-slate-800">
                <card.icon className="w-4 h-4" />
              </span>
            </div>
            <p className="text-slate-900 text-2xl font-bold">
              {card.value}
            </p>
            <p className="text-xs text-slate-600">{card.sub}</p>
          </div>
        ))}
      </section>

      <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-slate-800">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Saved Report Templates
              </h2>
              <p className="text-xs text-slate-500">
                Quickly re-run commonly used reports.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="text-xs font-medium text-slate-700 hover:text-slate-800 cursor-pointer"
          >
            Manage templates
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-800 uppercase">
              <tr>
                <th className="px-6 py-3">Report Name</th>
                <th className="px-6 py-3">Scope</th>
                <th className="px-6 py-3">Last Run</th>
                <th className="px-6 py-3">Formats</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {reportRows.map((row) => (
                <tr key={row.name} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {row.name}
                  </td>
                  <td className="px-6 py-4 text-slate-800">
                    {row.scope}
                  </td>
                  <td className="px-6 py-4 text-slate-800">
                    {row.lastRun}
                  </td>
                  <td className="px-6 py-4 text-slate-800">
                    {row.format}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      className="text-slate-700 text-xs font-semibold hover:underline mr-3 cursor-pointer"
                    >
                      Run now
                    </button>
                    <button
                      type="button"
                      className="text-slate-700 text-xs cursor-pointer"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

