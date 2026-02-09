'use client';

import {
  Users,
  DollarSign,
  Calendar,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  UserPlus,
  Download,
  Megaphone,
  MoreHorizontal,
} from 'lucide-react';

const statCards = [
  {
    label: 'Total Members',
    value: '1,240',
    sub: '+5.2% vs last month',
    icon: Users,
    iconBg: 'bg-blue-50 dark:bg-blue-900/20 text-primary',
    trendUp: true,
  },
  {
    label: 'Funds Collected',
    value: '$12,500',
    sub: '+12% vs last month',
    icon: DollarSign,
    iconBg: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-500',
    trendUp: true,
  },
  {
    label: 'Upcoming Events',
    value: '3',
    sub: 'Next: Spring Hackathon (4d)',
    icon: Calendar,
    iconBg: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-500',
    trendUp: false,
  },
  {
    label: 'System Alerts',
    value: '0',
    sub: 'System Healthy',
    icon: AlertTriangle,
    iconBg: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-500',
    trendUp: false,
  },
];

const barData = [
  { month: 'Jan', value: 40, amount: '$4.2k' },
  { month: 'Feb', value: 65, amount: '$6.8k' },
  { month: 'Mar', value: 35, amount: '$3.5k' },
  { month: 'Apr', value: 85, amount: '$8.9k', active: true },
  { month: 'May', value: 55, amount: '$5.5k' },
  { month: 'Jun', value: 25, amount: '$2.5k' },
  { month: 'Jul', value: 15, amount: '$1.5k' },
];

const pendingApprovals = [
  { name: 'John Smith', detail: 'Student ID Verification', initials: 'JS' },
  { name: 'Ada Lovelace', detail: 'Event Organizer Request', initials: 'AL' },
  { name: 'Mark Twain', detail: 'Payment Refund #8821', initials: 'MT' },
];

const activityLogs = [
  { time: 'Oct 24, 10:32 AM', user: 'Sarah Connor', action: 'Updated profile settings', ip: '192.168.1.1', status: 'Success' },
  { time: 'Oct 24, 09:15 AM', user: 'James Bond', action: 'New member registration', ip: '10.0.0.52', status: 'Success' },
  { time: 'Oct 23, 04:45 PM', user: 'System', action: 'Failed login attempt', ip: '45.23.12.9', status: 'Failed' },
  { time: 'Oct 23, 02:20 PM', user: 'Ellen Ripley', action: 'Generated financial report', ip: '172.16.0.4', status: 'Success' },
];

export default function SuperAdminDashboardPage() {
  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-32"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{card.value}</h3>
              </div>
              <div className={`p-2 rounded-lg ${card.iconBg}`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm font-medium">
              {card.trendUp ? (
                <>
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-green-600 dark:text-green-400">{card.sub}</span>
                </>
              ) : card.label === 'System Alerts' ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-green-600 dark:text-green-400">{card.sub}</span>
                </>
              ) : (
                <span className="text-slate-400">{card.sub}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Financial Overview</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Revenue collection over the current academic year
              </p>
            </div>
            <button type="button" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-col h-[300px]">
            <div className="flex-1 grid grid-cols-7 items-end gap-4 px-2">
              {barData.map((bar) => (
                <div
                  key={bar.month}
                  className="group relative flex flex-col items-center gap-2 h-full justify-end"
                >
                  <div
                    className={`w-full max-w-[40px] rounded-t-sm transition-all relative ${
                      bar.active
                        ? 'bg-primary shadow-lg shadow-primary/20'
                        : 'bg-primary/20 dark:bg-primary/30 group-hover:bg-primary/40'
                    }`}
                    style={{ height: `${bar.value}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {bar.amount}
                    </div>
                  </div>
                  <span
                    className={`text-xs font-medium ${bar.active ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500'}`}
                  >
                    {bar.month}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700 transition-all"
              >
                <UserPlus className="w-7 h-7 text-primary" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Add Admin</span>
              </button>
              <button
                type="button"
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700 transition-all"
              >
                <Download className="w-7 h-7 text-primary" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Export Report</span>
              </button>
              <button
                type="button"
                className="col-span-2 flex items-center justify-center gap-3 p-3 rounded-lg bg-primary hover:bg-blue-700 text-white font-medium transition-colors shadow-sm shadow-primary/30"
              >
                <Megaphone className="w-5 h-5" />
                Broadcast Notification
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pending Approval</h3>
              <span className="bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 text-xs font-bold px-2 py-0.5 rounded-full">
                3 New
              </span>
            </div>
            <div className="space-y-4">
              {pendingApprovals.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors cursor-pointer w-full text-left"
                >
                  <div className="bg-slate-200 dark:bg-slate-700 h-10 w-10 rounded-full flex items-center justify-center text-slate-500 font-bold text-sm shrink-0">
                    {item.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{item.detail}</p>
                  </div>
                  <span className="text-slate-400">›</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity Logs</h3>
          <button type="button" className="text-sm text-primary font-medium hover:underline">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-3 font-semibold">Timestamp</th>
                <th className="px-6 py-3 font-semibold">User</th>
                <th className="px-6 py-3 font-semibold">Action</th>
                <th className="px-6 py-3 font-semibold">IP Address</th>
                <th className="px-6 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {activityLogs.map((log) => (
                <tr
                  key={log.time + log.user}
                  className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                    {log.time}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{log.user}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{log.action}</td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">{log.ip}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-medium px-2.5 py-0.5 rounded border ${
                        log.status === 'Success'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
