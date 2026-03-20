'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Plus, Calendar, MapPin, Loader2, AlertTriangle, X,
  Users, Clock, CheckCircle2, XCircle, AlertCircle,
} from 'lucide-react';
import { fetchEvents, createEvent, type Event, type EventType } from '@/lib/api';

const EVENT_TYPES: EventType[] = ['workshop', 'seminar', 'competition', 'cultural', 'meeting', 'other'];

const STATUS_BADGE: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  draft: {
    label: 'Pending Approval',
    className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: <AlertCircle className="w-3.5 h-3.5" />,
  },
  published: {
    label: 'Approved',
    className: 'bg-green-100 text-green-700 border-green-200',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  cancelled: {
    label: 'Rejected',
    className: 'bg-red-100 text-red-700 border-red-200',
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
  completed: {
    label: 'Completed',
    className: 'bg-slate-100 text-slate-600 border-slate-200',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export default function CREventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    eventType: 'workshop' as EventType,
    venue: '',
    startAt: '',
    endAt: '',
    maxCapacity: '',
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.venue || !form.startAt || !form.endAt) {
      setFormError('All required fields must be filled');
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      // CR's batch is auto-assigned by backend; event starts as draft
      await createEvent({
        title: form.title,
        description: form.description,
        eventType: form.eventType,
        venue: form.venue,
        startAt: new Date(form.startAt).toISOString(),
        endAt: new Date(form.endAt).toISOString(),
        maxCapacity: form.maxCapacity ? Number(form.maxCapacity) : null,
      });
      setForm({ title: '', description: '', eventType: 'workshop', venue: '', startAt: '', endAt: '', maxCapacity: '' });
      setShowForm(false);
      await load();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Failed to submit proposal');
    } finally {
      setSubmitting(false);
    }
  };

  const myEvents = events.filter((e) => e.createdBy.currentRole === 'cr');
  const otherEvents = events.filter((e) => e.status === 'published' && e.createdBy.currentRole !== 'cr');

  return (
    <div className="flex flex-1 flex-col p-4 md:p-8 overflow-x-hidden gap-6">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap gap-2 text-sm text-slate-500">
        <Link href="/dashboard/cr" className="hover:text-primary transition-colors font-medium">Home</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Events</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">Events</h1>
          <p className="text-slate-500 text-sm">
            Propose batch events — they go to admin for approval before being published.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-primary/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Propose Event
        </button>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="flex items-center gap-3 text-slate-500 py-16 justify-center">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading events…
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* My Proposals */}
          <section>
            <h2 className="text-base font-bold mb-3">My Proposals</h2>
            {myEvents.length === 0 ? (
              <div className="bg-white rounded-xl border border-dashed border-slate-200 py-10 flex flex-col items-center text-slate-400 gap-2">
                <Calendar className="w-8 h-8 opacity-30" />
                <p className="text-sm">No proposals yet. Submit your first event!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myEvents.map((event) => (
                  <CREventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </section>

          {/* Batch Events (published by admin) */}
          {otherEvents.length > 0 && (
            <section>
              <h2 className="text-base font-bold mb-3">Upcoming Batch Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {otherEvents.map((event) => (
                  <CREventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Propose Event Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">Propose a Batch Event</h2>
              <button type="button" onClick={() => { setShowForm(false); setFormError(null); }} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              {formError && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{formError}</p>
              )}
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                This event will be submitted for admin approval before it goes live.
                Your batch will be automatically assigned.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">Title *</label>
                  <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm" placeholder="Event title" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">Description *</label>
                  <textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none" placeholder="What is this event about?" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Type</label>
                  <select value={form.eventType} onChange={(e) => setForm((f) => ({ ...f, eventType: e.target.value as EventType }))} className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary capitalize">
                    {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Venue *</label>
                  <input type="text" value={form.venue} onChange={(e) => setForm((f) => ({ ...f, venue: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm" placeholder="Room / Location" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Start Date & Time *</label>
                  <input type="datetime-local" value={form.startAt} onChange={(e) => setForm((f) => ({ ...f, startAt: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">End Date & Time *</label>
                  <input type="datetime-local" value={form.endAt} onChange={(e) => setForm((f) => ({ ...f, endAt: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">Max Capacity (optional)</label>
                  <input type="number" min="1" value={form.maxCapacity} onChange={(e) => setForm((f) => ({ ...f, maxCapacity: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm" placeholder="Leave blank for unlimited" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setFormError(null); }} className="px-4 py-2 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 text-sm font-medium transition">Cancel</button>
                <button type="submit" disabled={submitting} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-blue-700 transition disabled:opacity-60">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? 'Submitting…' : 'Submit Proposal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function CREventCard({ event }: { event: Event }) {
  const badge = STATUS_BADGE[event.status] ?? STATUS_BADGE.draft;
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-slate-900 text-base line-clamp-2">{event.title}</h3>
        <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border shrink-0 ${badge.className}`}>
          {badge.icon}
          {badge.label}
        </span>
      </div>
      <p className="text-sm text-slate-500 line-clamp-2">{event.description}</p>
      <div className="flex flex-col gap-1.5 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5" />
          {formatDate(event.startAt)}
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5" />
          {formatTime(event.startAt)} – {formatTime(event.endAt)}
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5" />
          {event.venue}
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5" />
          {event._count.rsvps} registered
          {event.maxCapacity && ` / ${event.maxCapacity}`}
        </div>
      </div>
    </div>
  );
}
