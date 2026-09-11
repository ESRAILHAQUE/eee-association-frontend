'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  CheckCircle,
  Wallet,
  Trophy,
  Calendar,
  Clock,
  BookOpen,
  FileText,
  GraduationCap,
  ClipboardList,
  Megaphone,
} from 'lucide-react';
import { fetchProfile, fetchEvents, fetchNotices, fetchMyFees, Event, Notice, FeeRecord } from '@/lib/api';

const quickResources = [
  { label: 'Digital Library', icon: BookOpen, href: '/dashboard/member/resources' },
  { label: 'Past Papers', icon: FileText, href: '/dashboard/member/resources' },
  { label: 'Mentorship', icon: GraduationCap, href: '/dashboard/member/mentorship' },
  { label: 'Certificates', icon: ClipboardList, href: '/dashboard/member/certificates' },
];

export default function MemberDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [fees, setFees] = useState<FeeRecord[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetchProfile().catch(() => null),
      fetchEvents({ status: 'published' }).catch(() => []),
      fetchNotices().catch(() => []),
      fetchMyFees().catch(() => [])
    ]).then(([p, e, n, f]) => {
      if (!cancelled) {
        setProfileData(p);
        setEvents(e.slice(0, 2));
        setNotices(n.slice(0, 4));
        setFees(f);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-slate-500 font-medium">Loading your dashboard...</div>
      </div>
    );
  }

  const user = profileData?.user;
  
  let totalPaid = 0;
  let hasPendingDue = false;
  let latestFee: FeeRecord | null = null;
  
  if (fees && fees.length > 0) {
    fees.forEach(f => {
      totalPaid += parseFloat(f.paidAmount || '0');
      if (parseFloat(f.dueAmount || '0') > 0) {
        hasPendingDue = true;
      }
    });
    latestFee = fees[0];
  }

  const welcomeStats = [
    { label: 'Status', value: user?.isVerified ? 'Active Member' : 'Pending', icon: CheckCircle },
    { label: 'Contribution', value: `৳${totalPaid.toFixed(2)}`, icon: Wallet },
    { label: 'Role', value: user?.currentRole?.toUpperCase() || 'STUDENT', icon: Trophy },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-8 relative overflow-hidden text-white shadow-lg shadow-slate-900/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -ml-8 -mb-8 blur-xl" />
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.fullName?.split(' ')[0] || 'Member'}!</h1>
              <p className="text-blue-100 mb-6 max-w-lg">
                You have {events.length} upcoming events this week and your membership status is {user?.isVerified ? 'active' : 'pending'}. Keep up the great work!
              </p>
              <div className="flex flex-wrap gap-4">
                {welcomeStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10 flex items-center gap-3"
                  >
                    <stat.icon className="w-6 h-6 text-green-300" />
                    <div>
                      <p className="text-xs text-blue-100 uppercase font-medium tracking-wider">
                        {stat.label}
                      </p>
                      <p className="text-base font-bold">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Upcoming Events</h3>
              <Link href="/dashboard/member/events" className="text-sm text-primary font-medium hover:underline">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.length === 0 ? (
                <div className="col-span-2 p-6 text-center text-slate-500 border border-slate-200 rounded-xl bg-white">
                  No upcoming events at the moment.
                </div>
              ) : (
                events.map((event, idx) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden group hover:shadow-md transition-all flex flex-col"
                  >
                    <div className="h-32 w-full bg-cover bg-center relative bg-slate-100 flex items-center justify-center">
                      <Calendar className="w-10 h-10 text-slate-300" />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded text-slate-900 shadow-sm">
                        {new Date(event.startAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }).toUpperCase()}
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide bg-blue-100 text-primary">
                          {event.eventType}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(event.startAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors line-clamp-1">
                        {event.title}
                      </h4>
                      <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-1">
                        {event.description}
                      </p>
                      <Link
                        href="/dashboard/member/events"
                        className={`block text-center w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                          idx === 0
                            ? 'bg-[#0F172B] text-white hover:bg-[#1a233a]'
                            : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {idx === 0 ? 'Register Now' : 'View Details'}
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Resources</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickResources.map((r) => (
                <Link
                  key={r.label}
                  href={r.href}
                  className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-xl hover:border-primary/50 hover:shadow-md transition-all group"
                >
                  <div className="h-12 w-12 rounded-full bg-blue-50 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <r.icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 text-center">
                    {r.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 text-[150px]">
              {hasPendingDue ? '!' : '✓'}
            </div>
            <h3 className="font-bold text-lg mb-1">
              {latestFee ? `Semester ${latestFee.semesterNumber} Due` : 'Annual Due'}
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              {latestFee ? `Fee Amount: ৳${latestFee.feeAmount}` : 'No active fees'}
            </p>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl font-bold">
                ৳{latestFee?.dueAmount ?? '0.00'}
              </span>
              {latestFee && (
                <span className={`text-xs font-bold px-2 py-1 rounded ${
                  latestFee.paymentStatus === 'paid' ? 'bg-green-500/20 text-green-400' :
                  latestFee.paymentStatus === 'partial' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {latestFee.paymentStatus.toUpperCase()}
                </span>
              )}
            </div>
            <Link
              href="/dashboard/member/payments"
              className="block text-center w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition-colors border border-white/10"
            >
              {hasPendingDue ? 'Pay Now' : 'View Receipts'}
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Megaphone className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-slate-900">Latest Notices</h3>
            </div>
            <div className="space-y-4 flex-1 overflow-y-auto pr-2">
              {notices.length === 0 ? (
                <p className="text-sm text-slate-500">No notices available.</p>
              ) : (
                notices.map((notice) => (
                  <div
                    key={notice.id}
                    className={`p-3 rounded-lg border-l-4 ${
                      notice.isUrgent
                        ? 'bg-red-50 border-red-500'
                        : 'bg-slate-50 border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{notice.title}</h4>
                      {notice.isPinned && (
                        <span className="shrink-0 text-[10px] text-slate-500 bg-white px-1.5 py-0.5 rounded shadow-sm border border-slate-200">
                          Pinned
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {notice.content}
                    </p>
                  </div>
                ))
              )}
            </div>
            <Link
              href="/dashboard/member/notices"
              className="w-full mt-4 text-xs font-medium text-primary hover:text-blue-700 flex items-center justify-center gap-1"
            >
              View Archive <span>→</span>
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}
