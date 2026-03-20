'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, Download, Plus, Calendar, MapPin, Loader2, AlertTriangle, Users, X } from 'lucide-react';
import { fetchEvents, createEvent, updateEventStatus, deleteEvent, type Event, type EventStatus, type CreateEventPayload } from '@/lib/api';

const STATUS_STYLES: Record<EventStatus, string> = {
  draft: 'bg-slate-100 text-slate-600',
  published: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-600',
  completed: 'bg-green-100 text-green-700',
};

const EVENT_TYPE_STYLES: Record<string, string> = {
  workshop: 'bg-blue-100 text-blue-700 border-blue-200',
  seminar: 'bg-purple-100 text-purple-600 border-purple-200',
  competition: 'bg-orange-100 text-orange-600 border-orange-200',
  cultural: 'bg-pink-100 text-pink-600 border-pink-200',
  meeting: 'bg-slate-100 text-slate-600 border-slate-200',
  other: 'bg-gray-100 text-gray-600 border-gray-200',
};

const TABS: { label: string; status?: EventStatus }[] = [
  { label: 'All' },
  { label: 'Published', status: 'published' },
  { label: 'Draft', status: 'draft' },
  { label: 'Completed', status: 'completed' },
  { label: 'Cancelled', status: 'cancelled' },
];

export default function SuperAdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [showCreate, setShowCreate] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEvents(TABS[activeTab]?.status ? { status: TABS[activeTab].status } : {});
      setEvents(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => { load(); }, [load]);

  const filtered = events.filter((e) => {
    const q = search.toLowerCase();
    return !q || e.title.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q);
  });

  const handleStatusChange = async (id: string, status: EventStatus) => {
    try {
      await updateEventStatus(id, status);
      load();
    } catch { /* ignore */ }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEvent(id);
      load();
    } catch { /* ignore */ }
  };

  return (
    <div className="w-full max-w-[1280px] flex flex-col gap-6">
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/dashboard/super-admin" className="hover:text-primary font-medium">Home</Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">Events</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-slate-900 text-2xl font-bold">Events Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage all department events — publish, complete, or cancel.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              const csv = [
                ['Title', 'Type', 'Status', 'Venue', 'Start', 'End', 'RSVPs'],
                ...events.map((e) => [e.title, e.eventType, e.status, e.venue, e.startAt, e.endAt, String(e._count.rsvps)]),
              ].map((r) => r.join(',')).join('\n');
              const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'events.csv'; a.click();
            }}
            className="flex items-center gap-2 h-10 px-4 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-700 text-sm font-bold shadow-sm transition"
          >
            <Download className="w-4 h-4" /> Export
          </button>
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 h-10 px-4 bg-primary hover:opacity-90 rounded-lg text-white text-sm font-bold shadow-md transition"
          >
            <Plus className="w-4 h-4" /> Create Event
          </button>
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col lg:flex-row gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex p-1 bg-slate-100 rounded-lg self-start lg:self-auto gap-0.5">
          {TABS.map((tab, i) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => setActiveTab(i)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${activeTab === i ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-900'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search events by title or venue…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-slate-50 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 border-none"
          />
        </div>
      </div>

      {loading && <div className="flex items-center justify-center gap-3 text-slate-500 py-16"><Loader2 className="w-5 h-5 animate-spin" /> Loading events…</div>}
      {error && <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm"><AlertTriangle className="w-4 h-4 shrink-0" /> {error}</div>}

      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-slate-400 gap-3">
              <Calendar className="w-10 h-10 opacity-30" />
              <p className="text-sm">No events found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((event) => {
                const start = new Date(event.startAt);
                return (
                  <div key={event.id} className="group flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
                    <div className="p-5 flex-1 flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${EVENT_TYPE_STYLES[event.eventType] ?? 'bg-gray-100 text-gray-600 border-gray-200'} capitalize`}>
                          {event.eventType}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[event.status]}`}>
                          {event.status}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 line-clamp-2">{event.title}</h3>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{event.description}</p>
                      </div>
                      <div className="flex flex-col gap-1.5 mt-auto">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Calendar className="w-4 h-4" />
                          {start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <MapPin className="w-4 h-4" /> {event.venue}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Users className="w-4 h-4" /> {event._count.rsvps} RSVPs
                        </div>
                      </div>
                    </div>
                    <div className="px-5 pb-5 flex items-center gap-2">
                      {event.status === 'draft' && (
                        <button type="button" onClick={() => handleStatusChange(event.id, 'published')} className="flex-1 py-2 rounded-lg bg-primary text-white text-xs font-bold hover:opacity-90 transition">
                          Publish
                        </button>
                      )}
                      {event.status === 'published' && (
                        <button type="button" onClick={() => handleStatusChange(event.id, 'completed')} className="flex-1 py-2 rounded-lg bg-green-600 text-white text-xs font-bold hover:opacity-90 transition">
                          Mark Complete
                        </button>
                      )}
                      {event.status !== 'cancelled' && event.status !== 'completed' && (
                        <button type="button" onClick={() => handleStatusChange(event.id, 'cancelled')} className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition">
                          Cancel
                        </button>
                      )}
                      <button type="button" onClick={() => handleDelete(event.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition" title="Delete">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="text-xs text-slate-400 text-right">{filtered.length} event{filtered.length !== 1 ? 's' : ''}</div>
        </>
      )}

      {showCreate && (
        <CreateEventModal
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); load(); }}
        />
      )}
    </div>
  );
}

function CreateEventModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState<CreateEventPayload>({
    title: '', description: '', eventType: 'workshop', venue: '', startAt: '', endAt: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setErr(null);
    try {
      await createEvent(form);
      onCreated();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold">Create Event</h2>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {err && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{err}</p>}
          {[
            { label: 'Title', key: 'title', type: 'text', placeholder: 'Event title' },
            { label: 'Venue', key: 'venue', type: 'text', placeholder: 'Location / room' },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-slate-700 mb-1">{f.label}</label>
              <input
                type={f.type}
                required
                placeholder={f.placeholder}
                value={(form as unknown as Record<string, string>)[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Event Type</label>
            <select value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value as never })} className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              {['workshop', 'seminar', 'competition', 'cultural', 'meeting', 'other'].map((t) => (
                <option key={t} value={t} className="capitalize">{t}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start</label>
              <input type="datetime-local" required value={form.startAt} onChange={(e) => setForm({ ...form, startAt: e.target.value })} className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End</label>
              <input type="datetime-local" required value={form.endAt} onChange={(e) => setForm({ ...form, endAt: e.target.value })} className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100">Cancel</button>
            <button type="submit" disabled={submitting} className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-60">
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />} Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
