'use client';

import { Users, AlertCircle, Megaphone, Search, Filter, Plus, FileText } from 'lucide-react';
import Link from 'next/link';

const stats = [
  {
    label: 'Total Students',
    value: '60',
    badge: '+2 New',
    badgeColor: 'bg-green-50 text-green-700',
    icon: Users,
    iconBg: 'bg-blue-50 text-primary',
  },
  {
    label: 'Fees Pending',
    value: '12',
    suffix: 'students',
    badge: 'Action Req',
    badgeColor: 'bg-red-50 text-red-700',
    icon: AlertCircle,
    iconBg: 'bg-orange-50 text-orange-600',
  },
  {
    label: 'Active Notices',
    value: '5',
    icon: Megaphone,
    iconBg: 'bg-purple-50 text-purple-600',
  },
];

const feeRows = [
  { rollNo: '2024-EEE-001', name: 'Sarah Miller', amount: '$4,500', status: 'Paid' },
  { rollNo: '2024-EEE-015', name: 'Alex Johnson', amount: '$4,500', status: 'Pending' },
  { rollNo: '2024-EEE-023', name: 'Michael Kim', amount: '$4,500', status: 'Paid' },
  { rollNo: '2024-EEE-045', name: 'Emily Davis', amount: '$4,500', status: 'Pending' },
];

const batchNotices = [
  { title: 'Exam Schedule Out', time: '2h ago', body: 'The mid-semester exam schedule has been released. Check the department board.', link: 'View Attachment', icon: 'article', iconBg: 'bg-blue-100 text-primary' },
  { title: 'Lab Submission Deadline', time: 'Yesterday', body: "Don't forget to submit your Control Systems lab records by Friday, 5 PM.", icon: 'warning', iconBg: 'bg-orange-100 text-orange-600' },
  { title: 'Workshop Registration', time: '2 days ago', body: 'Registration for the IoT workshop closes this weekend.', icon: 'event', iconBg: 'bg-green-100 text-green-600' },
];

export default function CRDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Welcome back, John
          </h1>
          <p className="text-slate-500 text-base">
            Here&apos;s what&apos;s happening in Batch 2024 today.
          </p>
        </div>
        <div className="text-sm text-slate-500 font-medium bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
          Academic Year 2024-2025
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-primary/30 transition-colors group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              {stat.badge && (
                <span className={`px-2 py-1 text-xs font-bold rounded ${stat.badgeColor}`}>
                  {stat.badge}
                </span>
              )}
            </div>
            <p className="text-slate-500 text-sm font-medium mb-1">
              {stat.label}
            </p>
            <h3 className="text-3xl font-bold text-slate-900 group-hover:text-primary transition-colors">
              {stat.value} {stat.suffix && <span className="text-sm font-normal text-slate-400">{stat.suffix}</span>}
            </h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Fee Status Overview</h2>
            <Link href="/dashboard/cr/fee-management" className="text-sm font-medium text-primary hover:text-blue-700">
              View All
            </Link>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name or roll no..."
                  className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-primary/50 text-slate-900 placeholder-slate-400"
                />
              </div>
              <button
                type="button"
                className="px-3 py-2 text-slate-600 bg-slate-50 rounded-lg flex items-center gap-2 text-sm font-medium"
              >
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-4">Roll No</th>
                    <th className="px-6 py-4">Student Name</th>
                    <th className="px-6 py-4">Semester Fee</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {feeRows.map((row) => (
                    <tr key={row.rollNo} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{row.rollNo}</td>
                      <td className="px-6 py-4 text-slate-700">{row.name}</td>
                      <td className="px-6 py-4 text-slate-600">{row.amount}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            row.status === 'Paid'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          <span className={`size-1.5 rounded-full ${row.status === 'Paid' ? 'bg-green-500' : 'bg-red-500'}`} />
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button type="button" className="text-slate-400 hover:text-primary transition-colors p-1">
                          ✎
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-center">
              <button type="button" className="text-xs text-slate-500 hover:text-primary font-medium flex items-center gap-1">
                Show more students <span>▼</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-slate-900">Batch Notices</h2>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Post Announcement</h3>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Title"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-transparent focus:border-primary/50 rounded-lg outline-none transition-colors text-slate-900"
              />
              <textarea
                placeholder="What's happening?"
                rows={3}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-transparent focus:border-primary/50 rounded-lg outline-none transition-colors text-slate-900 resize-none"
              />
              <div className="flex justify-between items-center mt-1">
                <button type="button" className="text-slate-400 hover:text-primary transition-colors p-1 rounded hover:bg-slate-100">
                  <FileText className="w-5 h-5" />
                </button>
                <button type="button" className="bg-primary hover:bg-blue-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors shadow-sm">
                  Post
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col gap-4 max-h-[400px] overflow-y-auto">
            {batchNotices.map((notice) => (
              <div
                key={notice.title}
                className="flex gap-3 pb-4 border-b border-slate-200 last:border-0 last:pb-0"
              >
                <div className="flex-shrink-0 mt-1">
                  <div className={`size-8 rounded-full flex items-center justify-center ${notice.iconBg}`}>
                    <Megaphone className="w-4 h-4" />
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="flex justify-between items-start w-full">
                    <h4 className="text-sm font-semibold text-slate-800">{notice.title}</h4>
                    <span className="text-[10px] text-slate-400 shrink-0">{notice.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{notice.body}</p>
                  {notice.link && (
                    <Link href="#" className="text-xs font-medium text-primary mt-2 inline-block hover:underline">
                      {notice.link}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
