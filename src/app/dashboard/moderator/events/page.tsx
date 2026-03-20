'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Calendar, MapPin, Loader2, AlertTriangle, Check, Ban,
  Users, Clock, Filter,
} from 'lucide-react';
import { fetchEvents, updateEventStatus, type Event, type EventStatus } from '@/lib/api';

const STATUS_TABS: { label: string; value: EventStatus | 'all' }[] = [
  { label: 'Pending', value: 'draft' },
  { label: 'All', value: 'all' },
  { label: 'Published', value: 'published' },
  { label: 'Cancelled', value: 'cancelled' },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export default function ModeratorEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<EventStatus | 'all'>('draft');
  const [actionLoading, setActionLoading] = useState<Set<string>>(new Set());

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

  const handleStatus = async (id: string, status: EventStatus) => {
    setActionLoading((prev) => new Set(prev).add(id));
    try {
      const updated = await updateEventStatus(id, status);
      setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to update');
    } finally {
      setActionLoading((prev) => { const s = new Set(prev); s.delete(id); return s; });
    }
  };

  const draftCount = events.filter((e) => e.status === 'draft').length;
  const filtered = events.filter((e) => activeTab === 'all' || e.status === activeTab);

  return (
    <div className="flex flex-1 flex-col p-4 md:p-8 overflow-x-hidden gap-6">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap gap-2 text-sm text-slate-500">
        <Link href="/dashboard/moderator" className="hover:text-primary transition-colors font-medium">Home</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Event Proposals</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">Event Proposals</h1>
        <p className="text-slate-500 text-sm">
          Review events proposed by CRs and forward approved ones to admin.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Pending Review', value: events.filter((e) => e.status === 'draft').length, color: 'text-yellow-600' },
          { label: 'Published', value: events.filter((e) => e.status === 'published').length, color: 'text-green-600' },
          { label: 'Cancelled', value: events.filter((e) => e.status === 'cancelled').length, color: 'text-red-600' },
          { label: 'Completed', value: events.filter((e) => e.status === 'completed').length, color: 'text-slate-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-slate-400 shrink-0" />
        <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`relative px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.value
                  ? 'bg-white shadow-sm text-slate-900'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
              {tab.value === 'draft' && draftCount > 0 && (
                <span className="ml-1 bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                  {draftCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="flex items-center gap-3 text-slate-500 py-16 justify-center">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading proposals…
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* Event Cards */}
      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-slate-400 gap-3">
              <Calendar className="w-10 h-10 opacity-30" />
              <p className="text-sm">No proposals in this category.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filtered.map((event) => {
                const busy = actionLoading.has(event.id);
                return (
                  <div key={event.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${
                            event.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                            event.status === 'published' ? 'bg-green-100 text-green-700' :
                            event.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {event.status === 'draft' ? 'Pending' : event.status}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 capitalize">
                            {event.eventType}
                          </span>
                          {event.targetBatch && (
                            <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                              Batch {event.targetBatch}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-slate-900 text-base mb-1">{event.title}</h3>
                        <p className="text-sm text-slate-500 mb-3 line-clamp-2">{event.description}</p>
                        <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(event.startAt)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {formatTime(event.startAt)} – {formatTime(event.endAt)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            {event.venue}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" />
                            {event._count.rsvps} registered
                          </span>
                        </div>
                        <div className="mt-2 text-xs text-slate-400">
                          Proposed by <span className="font-medium text-slate-600">{event.createdBy.fullName}</span>
                        </div>
                      </div>

                      {/* Actions (only for pending) */}
                      {event.status === 'draft' && (
                        <div className="flex sm:flex-col gap-2 sm:self-start">
                          <button
                            type="button"
                            onClick={() => handleStatus(event.id, 'published')}
                            disabled={busy}
                            className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium hover:bg-green-100 transition disabled:opacity-60"
                          >
                            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatus(event.id, 'cancelled')}
                            disabled={busy}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition disabled:opacity-60"
                          >
                            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
                            Reject
                          </button>
                        </div>
                      )}
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
