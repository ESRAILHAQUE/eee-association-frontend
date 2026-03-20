'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, Calendar, MapPin, Loader2, AlertTriangle, Users, CheckCircle2 } from 'lucide-react';
import { fetchEvents, rsvpEvent, cancelRsvpEvent, type Event, type EventType } from '@/lib/api';

const TYPE_COLORS: Record<EventType, string> = {
  workshop: 'bg-blue-100 text-blue-700 border-blue-200',
  seminar: 'bg-purple-100 text-purple-700 border-purple-200',
  competition: 'bg-orange-100 text-orange-700 border-orange-200',
  cultural: 'bg-pink-100 text-pink-700 border-pink-200',
  meeting: 'bg-slate-100 text-slate-700 border-slate-200',
  other: 'bg-gray-100 text-gray-700 border-gray-200',
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return {
    month: d.toLocaleDateString('en-US', { month: 'short' }),
    day: d.getDate().toString(),
    full: d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  };
}

export default function MemberEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<EventType | 'all'>('all');
  // Track RSVP'd events locally (would normally come from backend)
  const [rsvpd, setRsvpd] = useState<Set<string>>(new Set());
  const [rsvpLoading, setRsvpLoading] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEvents();
      setEvents(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleRsvp = async (eventId: string) => {
    if (rsvpLoading.has(eventId)) return;
    setRsvpLoading((prev) => new Set(prev).add(eventId));
    try {
      if (rsvpd.has(eventId)) {
        await cancelRsvpEvent(eventId);
        setRsvpd((prev) => { const s = new Set(prev); s.delete(eventId); return s; });
        setEvents((prev) =>
          prev.map((e) => e.id === eventId ? { ...e, _count: { rsvps: e._count.rsvps - 1 } } : e),
        );
      } else {
        await rsvpEvent(eventId);
        setRsvpd((prev) => new Set(prev).add(eventId));
        setEvents((prev) =>
          prev.map((e) => e.id === eventId ? { ...e, _count: { rsvps: e._count.rsvps + 1 } } : e),
        );
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : 'RSVP failed');
    } finally {
      setRsvpLoading((prev) => { const s = new Set(prev); s.delete(eventId); return s; });
    }
  };

  const eventTypes: EventType[] = ['workshop', 'seminar', 'competition', 'cultural', 'meeting', 'other'];

  const filtered = events.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.venue.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || e.eventType === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="w-full max-w-[1280px] flex flex-col gap-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/dashboard/member" className="hover:text-primary font-medium">Home</Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">Events</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-slate-900 text-3xl md:text-4xl font-black leading-tight tracking-tight">
          EEE Department Events
        </h1>
        <p className="text-slate-500 text-sm mt-1 max-w-2xl">
          Discover upcoming workshops, seminars, and association events. Register to participate.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search events…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-9 pr-3 py-2.5 rounded-lg bg-white ring-1 ring-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition ${
              typeFilter === 'all' ? 'bg-primary text-white' : 'bg-white ring-1 ring-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Types
          </button>
          {eventTypes.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition ${
                typeFilter === t ? 'bg-primary text-white' : 'bg-white ring-1 ring-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="flex items-center gap-3 text-slate-500 py-16 justify-center">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading events…</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Events Grid */}
      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-slate-400 gap-3">
              <Calendar className="w-10 h-10 opacity-30" />
              <p className="text-sm">No events found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((event) => {
                const start = formatDate(event.startAt);
                const end = formatDate(event.endAt);
                const isRsvpd = rsvpd.has(event.id);
                const isBusy = rsvpLoading.has(event.id);
                const isFull = event.maxCapacity != null && event._count.rsvps >= event.maxCapacity && !isRsvpd;

                return (
                  <div key={event.id} className="group flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
                    {/* Date badge header */}
                    <div className="relative h-12 bg-gradient-to-r from-primary/10 to-blue-50 flex items-center px-5 justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-white rounded-lg px-2.5 py-1 text-center shadow-sm">
                          <p className="text-[10px] font-bold text-slate-500 uppercase">{start.month}</p>
                          <p className="text-base font-black text-slate-900 leading-none">{start.day}</p>
                        </div>
                        <span className="text-xs text-slate-500">{start.time} – {end.time}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold border capitalize ${TYPE_COLORS[event.eventType]}`}>
                        {event.eventType}
                      </span>
                    </div>

                    <div className="flex flex-col flex-1 p-5 gap-3">
                      <h3 className="text-base font-bold text-slate-900 line-clamp-2">{event.title}</h3>
                      <p className="text-sm text-slate-500 line-clamp-2">{event.description}</p>

                      <div className="flex flex-col gap-1.5 mt-auto">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <MapPin className="w-3.5 h-3.5" />
                          {event.venue}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Users className="w-3.5 h-3.5" />
                          {event._count.rsvps} registered
                          {event.maxCapacity && ` / ${event.maxCapacity} spots`}
                        </div>
                        {event.targetBatch && (
                          <span className="text-xs text-blue-600 font-medium">Batch {event.targetBatch}</span>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => handleRsvp(event.id)}
                          disabled={isBusy || isFull}
                          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                            isRsvpd
                              ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                              : isFull
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : 'bg-primary text-white hover:bg-blue-700 shadow-sm shadow-primary/30'
                          }`}
                        >
                          {isBusy ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : isRsvpd ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              Registered — Cancel?
                            </>
                          ) : isFull ? (
                            'Event Full'
                          ) : (
                            'Register Now'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
