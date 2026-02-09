'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  DollarSign,
  School,
  AlertCircle,
  Plus,
  Megaphone,
  BarChart3,
  ShieldCheck,
  Calendar,
  Mic,
  AlertTriangle,
} from 'lucide-react';

const stats = [
  {
    label: 'Total Active Students',
    value: '450',
    trend: '+5% from last month',
    icon: Users,
    iconBg: 'bg-primary/10 text-primary',
    trendUp: true,
  },
  {
    label: 'Fees Collected',
    value: '$12,500',
    trend: '+12% vs last year',
    icon: DollarSign,
    iconBg: 'bg-primary/10 text-primary',
    trendUp: true,
  },
  {
    label: 'Active Batches',
    value: '8',
    trend: 'Academic Year 2023-24',
    icon: School,
    iconBg: 'bg-primary/10 text-primary',
    trendUp: false,
  },
  {
    label: 'Pending Approvals',
    value: '12',
    trend: 'Requires attention',
    icon: AlertCircle,
    iconBg: 'bg-orange-500/10 text-orange-500',
    trendUp: false,
  },
];

const quickActions = [
  { label: 'Create New Batch', icon: Plus, image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400' },
  { label: 'Post System Notice', icon: Megaphone, image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400' },
  { label: 'Generate Report', icon: BarChart3, image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400' },
  { label: 'Verify Payments', icon: ShieldCheck, image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400' },
];

const recentNotices = [
  {
    title: 'Mid-term Exam Schedule Released',
    time: 'Today',
    excerpt: 'The final schedule for the upcoming mid-term exams has been published. Please check...',
    tags: ['Year 3', 'Year 4'],
    icon: Calendar,
    iconBg: 'bg-blue-100 dark:bg-blue-900/30 text-primary',
  },
  {
    title: 'Guest Lecture on Power Systems',
    time: 'Yesterday',
    excerpt: 'Dr. Smith from GridCorp will be visiting on Friday for a special session.',
    tags: ['All Students'],
    icon: Mic,
    iconBg: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600',
  },
  {
    title: 'Fee Payment Deadline Extension',
    time: '2 days ago',
    excerpt: 'Due to bank holidays, the deadline has been extended by 48 hours.',
    tags: ['Financial'],
    icon: AlertTriangle,
    iconBg: 'bg-red-100 dark:bg-red-900/30 text-red-600',
  },
];

const feeByYear = [
  { label: '1st Year', percent: 85, color: 'bg-primary' },
  { label: '2nd Year', percent: 62, color: 'bg-primary' },
  { label: '3rd Year', percent: 94, color: 'bg-emerald-500' },
  { label: '4th Year', percent: 45, color: 'bg-orange-400' },
];

export default function AdminDashboardPage() {
  const [animateBars, setAnimateBars] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimateBars(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
      <div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Overview</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Here&apos;s what&apos;s happening in the EEE Department today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-1 p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
              <span className={`p-1.5 rounded-lg ${stat.iconBg}`}>
                <stat.icon className="w-5 h-5" />
              </span>
            </div>
            <p className="text-slate-900 dark:text-white text-3xl font-bold">{stat.value}</p>
            <div className="flex items-center gap-1 mt-2">
              {stat.trendUp && (
                <span className="text-emerald-500 text-xs font-medium flex items-center gap-0.5">
                  <span>↗</span> {stat.trend}
                </span>
              )}
              {!stat.trendUp && (
                <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">{stat.trend}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-slate-900 dark:text-white text-lg font-bold">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.label}
              type="button"
              className="group relative overflow-hidden rounded-xl aspect-[4/3] flex flex-col justify-end p-5 transition-transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-105"
                style={{ backgroundImage: `url(${action.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="relative z-10 flex flex-col items-start gap-2">
                <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg text-white">
                  <action.icon className="w-5 h-5" />
                </div>
                <p className="text-white text-lg font-bold leading-tight">{action.label}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Notices</h3>
            <Link
              href="/dashboard/admin/notice-board"
              className="text-sm font-medium text-primary hover:text-blue-700 dark:hover:text-blue-400"
            >
              View All
            </Link>
          </div>
          <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-700">
            {recentNotices.map((notice) => (
              <div
                key={notice.title}
                className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex gap-4"
              >
                <div
                  className={`shrink-0 size-10 rounded-lg flex items-center justify-center ${notice.iconBg}`}
                >
                  <notice.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{notice.title}</h4>
                    <span className="text-xs text-slate-400 shrink-0">{notice.time}</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                    {notice.excerpt}
                  </p>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {notice.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Fee Collection Status</h3>
            <button type="button" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              ⋮
            </button>
          </div>
          <div className="p-6 flex flex-col justify-center flex-1 gap-6">
            {feeByYear.map((item) => (
              <div key={item.label} className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {item.label}
                  </span>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.percent}%
                    </span>
                    <span className="text-xs text-slate-500 ml-1">Collected</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full ${item.color} transition-all duration-700 ease-out`}
                    style={{ width: animateBars ? `${item.percent}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-b-xl border-t border-slate-100 dark:border-slate-700">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 dark:text-slate-400">Total Outstanding</span>
              <span className="font-bold text-red-500">$3,450.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
