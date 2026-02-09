'use client';

import Link from 'next/link';
import { Wallet, CheckCircle, Clock, AlertCircle, Download, Table, Search } from 'lucide-react';

const stats = [
  { label: 'Total Expected', value: '₹5,00,000', sub: 'Target Set', icon: Wallet, iconBg: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300' },
  { label: 'Total Collected', value: '₹4,25,000', sub: '+12% from last week', icon: CheckCircle, iconBg: 'bg-primary/10 text-primary' },
  { label: 'Pending', value: '₹75,000', sub: '15% remaining', icon: Clock, iconBg: 'bg-orange-500/10 text-orange-500' },
  { label: 'Overdue', value: '12', sub: 'Students', icon: AlertCircle, iconBg: 'bg-red-500/10 text-red-500' },
];

const feeRows = [
  { rollNo: '2021-EEE-001', name: 'Rahul Kumar', amount: '₹4,500', status: 'Paid', date: 'Oct 20' },
  { rollNo: '2021-EEE-002', name: 'Priya Singh', amount: '₹4,500', status: 'Pending', date: '-' },
  { rollNo: '2021-EEE-003', name: 'Amit Patel', amount: '₹4,500', status: 'Paid', date: 'Oct 18' },
  { rollNo: '2021-EEE-004', name: 'Sneha Reddy', amount: '₹4,500', status: 'Overdue', date: '-' },
];

export default function CRFeeManagementPage() {
  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex flex-wrap gap-2 text-sm">
        <Link href="/dashboard/cr" className="text-slate-500 hover:text-primary transition-colors font-medium">Home</Link>
        <span className="text-slate-400">/</span>
        <span className="text-slate-800 dark:text-white font-semibold">Fee Collection Batch 2021-2025</span>
      </div>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight">Fee Collection: Batch 2021-2025</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base">Track payments, manage records, and export financial reports for the current semester.</p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"><Download className="w-5 h-5" />Export PDF</button>
          <button type="button" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-primary/20"><Table className="w-5 h-5" />Export Excel</button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
              <div className={`p-1.5 rounded-md ${stat.iconBg}`}><stat.icon className="w-5 h-5" /></div>
            </div>
            <p className="text-slate-900 dark:text-white text-2xl font-bold mt-1">{stat.value}</p>
            <p className="text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-1 mt-1">{stat.label === 'Total Collected' && <span>↗</span>}{stat.sub}</p>
          </div>
        ))}
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Search student by name or roll number..." className="w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 pl-10 pr-4 py-2 rounded-lg text-sm border-none focus:ring-2 focus:ring-primary/50 placeholder-slate-400" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Roll No</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Payment Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {feeRows.map((row) => (
                <tr key={row.rollNo} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{row.rollNo}</td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{row.name}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{row.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${row.status === 'Paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : row.status === 'Overdue' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                      <span className={`size-1.5 rounded-full ${row.status === 'Paid' ? 'bg-green-500' : row.status === 'Overdue' ? 'bg-red-500' : 'bg-amber-500'}`} />
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{row.date}</td>
                  <td className="px-6 py-4 text-right"><button type="button" className="text-primary text-sm font-medium hover:underline">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
