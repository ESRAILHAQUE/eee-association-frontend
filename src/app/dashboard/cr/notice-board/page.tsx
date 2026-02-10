'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Pin, Calendar, FileText, Edit3 } from 'lucide-react';

const pinnedNotices = [
  { title: 'End Semester Exam Schedule Released', date: 'Oct 24, 2023', author: 'Admin', excerpt: 'The final examination schedule for the Fall 2023 semester has been published. Please check your specific batch timings.', tag: 'Urgent', tagColor: 'bg-amber-100 text-amber-800 border-amber-200', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400', cta: 'Read full notice' },
  { title: 'Guest Lecture: Modern Power Systems', date: 'Nov 02, 2023', author: 'Dr. Smith', excerpt: 'Join us for an insightful session on grid modernization and renewable integration by industry expert Dr. A. Smith.', tag: 'Event', tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-200', image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400', cta: 'Register Now' },
  { title: 'Merit Scholarship Applications Open', date: 'Oct 20, 2023', author: 'Office', excerpt: 'Applications for the annual Merit Scholarship for the academic year 2023-2024 are now open. Eligibility criteria attached.', tag: 'Scholarship', tagColor: 'bg-blue-100 text-blue-800 border-blue-200', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400', cta: 'Download Form' },
];

const latestNotices = [
  { title: 'Digital Signal Processing Lab Manual Submission', meta: '2nd Year', time: '2 hours ago', body: 'All students are required to submit their lab manuals for Experiment 4 by this Friday. Late submissions will not be graded.', author: 'Prof. John Doe' },
  { title: 'IEEE Membership Drive 2024', meta: 'General', time: 'Yesterday', body: "Join the world's largest technical professional organization. Membership benefits include access to journals, conferences, and networking events.", author: 'Student Branch', attachment: 'Brochure.pdf' },
  { title: 'Final Year Project Review - Phase 1', meta: '4th Year', time: '2 days ago', body: 'The first review for final year projects is scheduled for next Monday. All teams must prepare a 10-minute presentation.', author: 'Head of Dept.' },
];

export default function CRNoticeBoardPage() {
  const [search, setSearch] = useState('');
  return (
    <div className="flex flex-1 flex-col p-4 md:p-8 overflow-x-hidden">
      <nav className="flex flex-wrap gap-2 text-sm text-slate-500 mb-4">
        <Link
          href="/dashboard/cr"
          className="hover:text-primary transition-colors font-medium"
        >
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">
          Notice Board
        </span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Notice Board</h1>
          <p className="text-slate-500 max-w-2xl">Stay updated with the latest announcements, exam schedules, and events from the EEE Department.</p>
        </div>
        <button type="button" className="flex items-center gap-2 bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-primary/30 transition-all shrink-0">
          <Edit3 className="w-5 h-5" /> Post Notice
        </button>
      </div>
      <div className="mb-10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input type="text" placeholder="Search notices by keyword, date, or author..." value={search} onChange={(e) => setSearch(e.target.value)} className="block w-full pl-11 pr-4 py-3.5 rounded-xl border-none bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-primary placeholder:text-slate-400 transition-all text-base" />
        </div>
      </div>
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Pin className="w-5 h-5 text-amber-500 fill-current" />
          <h2 className="text-xl font-bold">Pinned & Important</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pinnedNotices.map((notice) => (
            <div key={notice.title} className="group relative flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-100 ring-1 ring-amber-500/20">
              <div className="absolute top-3 right-3 z-10">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${notice.tagColor}`}>{notice.tag}</span>
              </div>
              <div className="h-40 w-full bg-cover bg-center" style={{ backgroundImage: `url(${notice.image})` }}><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" /></div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <Calendar className="w-4 h-4" /><span>{notice.date}</span><span className="w-1 h-1 rounded-full bg-slate-300" /><span>{notice.author}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">{notice.title}</h3>
                <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-1">{notice.excerpt}</p>
                <button type="button" className="mt-auto text-sm font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all">{notice.cta} <span>→</span></button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Latest Announcements</h2>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="hidden sm:inline">Sort by:</span>
            <select className="bg-transparent border-none py-0 pl-2 pr-8 text-sm font-medium focus:ring-0 cursor-pointer">
              <option>Newest First</option>
              <option>Oldest First</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {latestNotices.map((notice) => (
            <div key={notice.title} className="flex flex-col sm:flex-row bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">{notice.meta}</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{notice.time}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">{notice.title}</h3>
                <p className="text-slate-600 text-sm mb-3">{notice.body}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">{notice.author.slice(0, 2).toUpperCase()}</div>
                    {notice.author}
                  </div>
                  {notice.attachment && (
                    <span className="text-xs text-primary flex items-center gap-1 font-medium bg-primary/5 px-2 py-0.5 rounded">
                      <FileText className="w-3.5 h-3.5" />{notice.attachment}
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-4 flex items-center sm:self-center">
                <button type="button" className="w-full sm:w-auto px-4 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium transition-colors flex items-center justify-center gap-2 border border-slate-200">View</button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <button type="button" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors flex items-center gap-1">Load more notices <span>▼</span></button>
        </div>
      </section>
    </div>
  );
}
