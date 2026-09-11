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
  Loader2
} from 'lucide-react';
import { fetchAnalyticsOverview, fetchFeeStats, fetchNotices, type AnalyticsOverview, type FeeStats, type Notice } from '@/lib/api';

function fmt(val: string | number) {
  return `৳${Number(val).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

const quickActions = [
  { label: 'Create New Batch', icon: Plus, image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400', href: '/dashboard/admin/students' },
  { label: 'Post System Notice', icon: Megaphone, image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400', href: '/dashboard/admin/notice-board' },
  { label: 'Generate Report', icon: BarChart3, image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', href: '/dashboard/admin/reports' },
  { label: 'Verify Payments', icon: ShieldCheck, image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400', href: '/dashboard/admin/fee-management' },
];

export default function AdminDashboardPage() {
  const [animateBars, setAnimateBars] = useState(false);
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [feeStats, setFeeStats] = useState<FeeStats | null>(null);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [o, f, n] = await Promise.all([
          fetchAnalyticsOverview().catch(() => null),
          fetchFeeStats().catch(() => null),
          fetchNotices().catch(() => [])
        ]);
        if (o) setOverview(o);
        if (f) setFeeStats(f);
        setNotices(n.slice(0, 3));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
        setTimeout(() => setAnimateBars(true), 50);
      }
    };
    load();
  }, []);

  const stats = [
    {
      label: 'Total Active Students',
      value: loading ? '...' : (overview?.users.byRole?.student || 0).toString(),
      trend: overview ? `${overview.users.recentSignups} new this week` : '',
      icon: Users,
      iconBg: 'bg-primary/10 text-primary',
      trendUp: true,
    },
    {
      label: 'Fees Collected',
      value: loading ? '...' : (feeStats ? fmt(feeStats.totalPaid) : '৳0'),
      trend: 'Total Collection',
      icon: DollarSign,
      iconBg: 'bg-primary/10 text-primary',
      trendUp: true,
    },
    {
      label: 'Total Users',
      value: loading ? '...' : (overview?.users.total || 0).toString(),
      trend: 'Across all roles',
      icon: School,
      iconBg: 'bg-primary/10 text-primary',
      trendUp: true,
    },
    {
      label: 'Unverified Users',
      value: loading ? '...' : (overview?.users.unverified || 0).toString(),
      trend: 'Requires attention',
      icon: AlertCircle,
      iconBg: 'bg-orange-500/10 text-orange-500',
      trendUp: false,
    },
  ];

  const totalFeeCount = feeStats ? feeStats.totalCount : 0;
  const feeStatusBars = [
    { label: 'Fully Paid', count: feeStats?.paid || 0, color: 'bg-emerald-500' },
    { label: 'Partially Paid', count: feeStats?.partial || 0, color: 'bg-primary' },
    { label: 'Unpaid', count: feeStats?.pending || 0, color: 'bg-orange-400' },
  ].map(item => ({
    ...item,
    percent: totalFeeCount > 0 ? Math.round((item.count / totalFeeCount) * 100) : 0
  }));

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
      <div>
        <h3 className="text-xl md:text-2xl font-bold text-slate-900">Overview</h3>
        <p className="text-slate-500 mt-1">
          Here&apos;s what&apos;s happening in the EEE Department today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-0.5 p-4 rounded-sm bg-white border border-slate-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <span className={`p-1 rounded-lg ${stat.iconBg}`}>
                <stat.icon className="w-4 h-4" />
              </span>
            </div>
            <p className="text-slate-900 text-2xl font-bold">{stat.value}</p>
            <div className="flex items-center gap-1 mt-1.5">
              {stat.trendUp && stat.trend && (
                <span className="text-emerald-500 text-xs font-medium flex items-center gap-0.5">
                  <span>↗</span> {stat.trend}
                </span>
              )}
              {!stat.trendUp && stat.trend && (
                <p className="text-slate-400 text-xs font-medium">{stat.trend}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-slate-900 text-xl md:text-2xl font-bold">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              href={action.href}
              key={action.label}
              className="group flex flex-col items-center justify-center gap-3 p-6 bg-white border border-slate-200 rounded-sm hover:border-primary hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary text-center"
            >
              <div className="p-3 bg-primary/10 text-primary rounded-lg group-hover:scale-110 transition-transform">
                <action.icon className="w-6 h-6" />
              </div>
              <p className="text-slate-900 font-semibold">{action.label}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        <div className="bg-white rounded-sm border border-slate-200 shadow-sm flex flex-col">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Recent Notices</h3>
            <Link
              href="/dashboard/admin/notice-board"
              className="text-sm font-medium  text-slate-600 hover:text-slate-800"
            >
              View All
            </Link>
          </div>
          <div className="flex flex-col divide-y divide-slate-100">
            {loading ? (
               <div className="p-8 flex justify-center text-slate-500"><Loader2 className="w-5 h-5 animate-spin" /></div>
            ) : notices.length === 0 ? (
               <div className="p-8 flex justify-center text-slate-500 text-sm">No recent notices found.</div>
            ) : notices.map((notice) => (
              <div
                key={notice.id}
                className="p-5 hover:bg-slate-50 transition-colors flex gap-4"
              >
                <div
                  className="shrink-0 size-10 rounded-lg flex items-center justify-center bg-blue-100 text-primary"
                >
                  <Megaphone className="w-5 h-5" />
                </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold text-slate-900">{notice.title}</h4>
                    <span className="text-xs text-slate-600 shrink-0">{new Date(notice.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1 line-clamp-1">
                    {notice.content}
                  </p>
                  <div className="mt-2 flex gap-2 flex-wrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                        {notice.targetType === 'all' ? 'All Students' : (notice.batch || 'Batch Specific')}
                      </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-sm border border-slate-200 shadow-sm flex flex-col">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Fee Collection Status</h3>
            <Link href="/dashboard/admin/fee-management" className="text-sm font-medium text-slate-600 hover:text-slate-800">
              View details
            </Link>
          </div>
          <div className="p-6 flex flex-col justify-center flex-1 gap-6">
            {loading ? (
              <div className="flex justify-center text-slate-500 py-8"><Loader2 className="w-5 h-5 animate-spin" /></div>
            ) : feeStatusBars.map((item) => (
              <div key={item.label} className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-medium text-slate-700">
                    {item.label} <span className="text-slate-400 text-xs ml-1">({item.count})</span>
                  </span>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-900">
                      {item.percent}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full ${item.color} transition-all duration-700 ease-out`}
                    style={{ width: animateBars ? `${item.percent}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-slate-50 rounded-b-xl border-t border-slate-100">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">Total Outstanding</span>
              <span className="font-bold text-red-500">{loading ? '...' : (feeStats ? fmt(feeStats.totalDue) : '৳0')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
