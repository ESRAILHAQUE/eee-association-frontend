'use client';

import Link from 'next/link';
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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const welcomeStats = [
  { label: 'Status', value: 'Active Member', icon: CheckCircle },
  { label: 'Contribution', value: '$120.00', icon: Wallet },
  { label: 'Points', value: '850 XP', icon: Trophy },
];

const upcomingEvents = [
  {
    title: 'Intro to Embedded Systems',
    date: 'OCT 24',
    time: '2:00 PM',
    type: 'Workshop',
    typeColor: 'bg-blue-100 dark:bg-blue-900/30 text-primary',
    excerpt: 'Learn the basics of microcontrollers and sensor integration in this hands-on session.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
    cta: 'Register Now',
    primary: true,
  },
  {
    title: 'Future of Power Grids',
    date: 'NOV 02',
    time: '10:00 AM',
    type: 'Seminar',
    typeColor: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    excerpt: 'Guest lecture by Dr. Sarah Chen on renewable energy integration in modern grids.',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400',
    cta: 'View Details',
    primary: false,
  },
];

const quickResources = [
  { label: 'Digital Library', icon: BookOpen },
  { label: 'Past Papers', icon: FileText },
  { label: 'Faculty', icon: GraduationCap },
  { label: 'Exam Cell', icon: ClipboardList },
];

const latestNotices = [
  { title: 'Lab Exam Schedule', badge: 'New', urgent: true, body: 'End semester lab exams for 3rd year start from Nov 15th. Check detailed timetable.' },
  { title: 'Scholarship Applications', body: 'Merit scholarship applications are open until Oct 30th. Submit at admin office.' },
  { title: 'IEEE Membership Drive', body: 'Join the global community. 50% discount for first year students this week.' },
];

const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
const firstDayOffset = 3; // Oct 1 is Wed

export default function MemberDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-primary rounded-xl p-8 relative overflow-hidden text-white shadow-lg shadow-primary/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -ml-8 -mb-8 blur-xl" />
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2">Welcome back, Alex!</h1>
              <p className="text-blue-100 mb-6 max-w-lg">
                You have 2 upcoming events this week and your membership status is active. Keep up the
                great work!
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
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Upcoming Events</h3>
              <Link href="/dashboard/member/events" className="text-sm text-primary font-medium hover:underline">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.title}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden group hover:shadow-md transition-all"
                >
                  <div className="h-32 w-full bg-cover bg-center relative" style={{ backgroundImage: `url(${event.image})` }}>
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur text-xs font-bold px-2 py-1 rounded text-slate-900 dark:text-white shadow-sm">
                      {event.date}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${event.typeColor}`}>
                        {event.type}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {event.time}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
                      {event.title}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                      {event.excerpt}
                    </p>
                    <button
                      type="button"
                      className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                        event.primary
                          ? 'bg-primary text-white hover:bg-blue-700'
                          : 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {event.cta}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Resources</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickResources.map((r) => (
                <Link
                  key={r.label}
                  href="#"
                  className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-primary/50 hover:shadow-md transition-all group"
                >
                  <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <r.icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {r.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Megaphone className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Latest Notices</h3>
            </div>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {latestNotices.map((notice) => (
                <div
                  key={notice.title}
                  className={`p-3 rounded-lg border-l-4 ${
                    notice.urgent
                      ? 'bg-red-50 dark:bg-red-900/10 border-red-500'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{notice.title}</h4>
                    {notice.badge && (
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {notice.body}
                  </p>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="w-full mt-4 text-xs font-medium text-primary hover:text-blue-700 flex items-center justify-center gap-1"
            >
              View Archive <span>→</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">October 2023</h3>
              <div className="flex gap-1">
                <button type="button" className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-500">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button type="button" className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-500">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-slate-400 font-medium">
              <div>Su</div>
              <div>Mo</div>
              <div>Tu</div>
              <div>We</div>
              <div>Th</div>
              <div>Fr</div>
              <div>Sa</div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {[28, 29, 30].map((d) => (
                <div key={d} className="p-1.5 text-slate-300 dark:text-slate-600">
                  {d}
                </div>
              ))}
              {calendarDays.map((d) => (
                <div
                  key={d}
                  className={`p-1.5 rounded cursor-pointer ${
                    d === 24
                      ? 'bg-primary text-white font-bold shadow-md shadow-primary/30'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {d}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 text-[150px]">
              ✓
            </div>
            <h3 className="font-bold text-lg mb-1">Annual Due</h3>
            <p className="text-slate-400 text-sm mb-4">Fall Semester 2023</p>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl font-bold">$15.00</span>
              <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">
                PAID
              </span>
            </div>
            <button
              type="button"
              className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition-colors border border-white/10"
            >
              View Receipt
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
