'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Download, Plus, Calendar, MapPin } from 'lucide-react';

const tabs = [
  { label: 'Upcoming', active: true },
  { label: 'Past Events', active: false },
  { label: 'Drafts', count: 2, active: false },
];

const events = [
  { title: 'Introduction to PCB Design', type: 'Workshop', typeColor: 'bg-blue-100 text-primary border-blue-200', excerpt: 'Learn the basics of designing printed circuit boards using Altium Designer. Beginner friendly.', date: 'Oct', day: '12', time: '2:00 PM - 5:00 PM', venue: 'Circuits Lab 304', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', attendees: 14, cta: 'RSVP Now', primary: true },
  { title: 'Career Talk: Renewable Energy', type: 'Seminar', typeColor: 'bg-purple-100 text-purple-600 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400', excerpt: 'Guest lecture by industry experts on career opportunities in renewable energy sector.', date: 'Oct', day: '15', time: '10:00 AM - 12:00 PM', venue: 'Main Auditorium', image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400', attendees: 28, cta: 'View Details', primary: false },
  { title: 'IoT Hands-on Workshop', type: 'Workshop', typeColor: 'bg-blue-100 text-primary border-blue-200', excerpt: 'Build your first IoT project with ESP8266 and NodeMCU. Sensors and kits provided.', date: 'Oct', day: '22', time: '3:00 PM - 6:00 PM', venue: 'Lab 304', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400', attendees: 20, cta: 'RSVP Now', primary: true },
];

export default function AdminEventsPage() {
  const [search, setSearch] = useState('');
  return (
    <div className="w-full max-w-[1280px] flex flex-col gap-6">
      <nav className="flex items-center gap-2 text-sm">
        <Link href="/dashboard/admin" className="text-slate-500 hover:text-primary font-medium">Home</Link>
        <span className="text-slate-400">/</span>
        <span className="text-slate-900 dark:text-white font-medium">Events</span>
      </nav>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">EEE Department Events</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base max-w-2xl">Stay updated with upcoming workshops, seminars, and association meetups. Manage RSVPs and track attendance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" className="flex items-center justify-center gap-2 h-10 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-slate-900 dark:text-white text-sm font-bold shadow-sm transition-all"><Download className="w-5 h-5" /><span className="hidden sm:inline">Export Report</span></button>
          <button type="button" className="flex items-center justify-center gap-2 h-10 px-4 bg-primary hover:bg-blue-700 rounded-lg text-white text-sm font-bold shadow-md transition-all"><Plus className="w-5 h-5" />Create Event</button>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-lg self-start lg:self-auto">
          {tabs.map((tab) => (
            <button key={tab.label} type="button" className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${tab.active ? 'bg-white dark:bg-slate-800 shadow-sm text-primary' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
              {tab.label}
              {tab.count !== undefined && <span className="ml-1 bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full text-[10px]">{tab.count}</span>}
            </button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 flex-1 lg:justify-end">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input type="text" placeholder="Search events by title or venue..." value={search} onChange={(e) => setSearch(e.target.value)} className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-slate-100 dark:bg-slate-900 text-sm placeholder-slate-500 focus:ring-2 focus:ring-primary/20 dark:text-white transition-all" />
          </div>
          <button type="button" className="flex items-center gap-1 h-[42px] px-3 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-200 font-medium whitespace-nowrap transition-colors">Type <span>▼</span></button>
          <button type="button" className="flex items-center gap-1 h-[42px] px-3 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-200 font-medium whitespace-nowrap transition-colors">Date <span>▼</span></button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.title} className="group flex flex-col bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="relative h-48 w-full overflow-hidden">
              <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-lg text-center z-10 shadow-sm">
                <p className="text-xs font-bold text-slate-500 uppercase">{event.date}</p>
                <p className="text-lg font-black text-slate-900 dark:text-white leading-none">{event.day}</p>
              </div>
              <div className="absolute top-3 right-3 z-10"><span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${event.typeColor}`}>{event.type}</span></div>
              <div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url(${event.image})` }} />
            </div>
            <div className="flex flex-col flex-1 p-5 gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2">{event.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{event.excerpt}</p>
              </div>
              <div className="flex flex-col gap-2 mt-auto">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><Calendar className="w-4 h-4" /><span>{event.time}</span></div>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><MapPin className="w-4 h-4" /><span>{event.venue}</span></div>
              </div>
              <div className="pt-4 mt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200" />
                  <div className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-800 bg-slate-300" />
                  <div className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600">+{event.attendees}</div>
                </div>
                <button type="button" className={`text-sm font-bold py-2 px-4 rounded-lg transition-colors shadow-sm ${event.primary ? 'bg-primary hover:bg-blue-600 text-white shadow-primary/30' : 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>{event.cta}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
