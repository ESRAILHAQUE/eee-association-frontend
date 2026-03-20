'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Search, Plus, Calendar, MapPin, Loader2, AlertTriangle,
  X, Check, Ban, Trash2, Users, ChevronDown,
} from 'lucide-react';
import {
  fetchEvents, createEvent, updateEventStatus, deleteEvent,
  type Event, type EventStatus, type EventType,
} from '@/lib/api';

const BATCHES = ['2019-20', '2020-21', '2021-22', '2022-23', '2023-24', '2024-25'];
const EVENT_TYPES: EventType[] = ['workshop', 'seminar', 'competition', 'cultural', 'meeting', 'other'];

const STATUS_TABS: { label: string; value: EventStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Published', value: 'published' },
  { label: 'Pending Approval', value: 'draft' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

const TYPE_COLORS: Record<EventType, string> = {
  workshop: 'bg-blue-100 text-blue-700 border-blue-200',
  seminar: 'bg-purple-100 text-purple-700 border-purple-200',
  competition: 'bg-orange-100 text-orange-700 border-orange-200',
  cultural: 'bg-pink-100 text-pink-700 border-pink-200',
  meeting: 'bg-slate-100 text-slate-700 border-slate-200',
  other: 'bg-gray-100 text-gray-700 border-gray-200',
};

const STATUS_COLORS: Record<EventStatus, string> = {
  draft: 'bg-yellow-100 text-yellow-700',
  published: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-slate-100 text-slate-600',
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<EventStatus | 'all'>('all');
  const [search, setSearch] = useState('');
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
    targetBatch: '',
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
      await createEvent({
        title: form.title,
        description: form.description,
        eventType: form.eventType,
        venue: form.venue,
        startAt: new Date(form.startAt).toISOString(),
        endAt: new Date(form.endAt).toISOString(),
        targetBatch: form.targetBatch || null,
        maxCapacity: form.maxCapacity ? Number(form.maxCapacity) : null,
      });
      setForm({ title: '', description: '', eventType: 'workshop', venue: '', startAt: '', endAt: '', targetBatch: '', maxCapacity: '' });
      setShowForm(false);
      await load();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Failed to create event');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatus = async (id: string, status: EventStatus) => {
    try {
      const updated = await updateEventStatus(id, status);
      setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  const filtered = events
    .filter((e) => activeTab === 'all' || e.status === activeTab)
    .filter(
      (e) =>
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.venue.toLowerCase().includes(search.toLowerCase()),
    );

  const draftCount = events.filter((e) => e.status === 'draft').length;

  return (
    <div className="w-full max-w-[1280px] flex flex-col gap-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/dashboard/admin" className="hover:text-primary font-medium">Home</Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">Events</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-slate-900 text-3xl md:text-4xl font-black leading-tight tracking-tight">
            Events Management
          </h1>
          <p className="text-slate-500 text-sm mt-1 max-w-2xl">
            Create events, approve proposals from CRs and moderators, and manage all department activities.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 h-10 px-4 bg-primary hover:bg-blue-700 rounded-lg text-white text-sm font-bold shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Event
        </button>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col lg:flex-row gap-3 lg:items-center justify-between bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-lg">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`relative px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.value
                  ? 'bg-white shadow-sm text-primary'
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
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search events…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900"
          />
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
              {filtered.map((event) => (
                <AdminEventCard
                  key={event.id}
                  event={event}
                  onApprove={() => handleStatus(event.id, 'published')}
                  onReject={() => handleStatus(event.id, 'cancelled')}
                  onComplete={() => handleStatus(event.id, 'completed')}
                  onDelete={() => handleDelete(event.id)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Create Event Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">Create New Event</h2>
              <button type="button" onClick={() => { setShowForm(false); setFormError(null); }} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              {formError && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{formError}</p>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">Title *</label>
                  <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm" placeholder="Event title" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">Description *</label>
                  <textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none" placeholder="Event description" />
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
                  <label className="block text-xs font-medium text-slate-700 mb-1">Start *</label>
                  <input type="datetime-local" value={form.startAt} onChange={(e) => setForm((f) => ({ ...f, startAt: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">End *</label>
                  <input type="datetime-local" value={form.endAt} onChange={(e) => setForm((f) => ({ ...f, endAt: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Target Batch</label>
                  <select value={form.targetBatch} onChange={(e) => setForm((f) => ({ ...f, targetBatch: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">All Students</option>
                    {BATCHES.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Max Capacity</label>
                  <input type="number" min="1" value={form.maxCapacity} onChange={(e) => setForm((f) => ({ ...f, maxCapacity: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm" placeholder="Unlimited" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setFormError(null); }} className="px-4 py-2 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 text-sm font-medium transition">Cancel</button>
                <button type="submit" disabled={submitting} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-blue-700 transition disabled:opacity-60">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? 'Creating…' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminEventCard({
  event,
  onApprove,
  onReject,
  onComplete,
  onDelete,
}: {
  event: Event;
  onApprove: () => void;
  onReject: () => void;
  onComplete: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="group flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            <span className={`px-2 py-0.5 rounded text-xs font-bold border capitalize ${TYPE_COLORS[event.eventType]}`}>
              {event.eventType}
            </span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${STATUS_COLORS[event.status]}`}>
              {event.status}
            </span>
          </div>
          <div className="relative">
            <button type="button" onClick={() => setOpen(!open)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition">
              <ChevronDown className="w-4 h-4" />
            </button>
            {open && (
              <div className="absolute right-0 top-8 bg-white border border-slate-200 rounded-xl shadow-lg z-10 py-1 min-w-[140px]" onMouseLeave={() => setOpen(false)}>
                {event.status === 'draft' && (
                  <>
                    <button type="button" onClick={() => { onApprove(); setOpen(false); }} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-green-700 hover:bg-green-50 transition">
                      <Check className="w-4 h-4" /> Approve
                    </button>
                    <button type="button" onClick={() => { onReject(); setOpen(false); }} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition">
                      <Ban className="w-4 h-4" /> Reject
                    </button>
                  </>
                )}
                {event.status === 'published' && (
                  <button type="button" onClick={() => { onComplete(); setOpen(false); }} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition">
                    <Check className="w-4 h-4" /> Mark Completed
                  </button>
                )}
                <button type="button" onClick={() => { onDelete(); setOpen(false); }} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <h3 className="text-base font-bold text-slate-900 line-clamp-2">{event.title}</h3>
        <p className="text-sm text-slate-500 line-clamp-2">{event.description}</p>

        {/* Meta */}
        <div className="flex flex-col gap-1.5 mt-auto">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(event.startAt)} · {formatTime(event.startAt)} – {formatTime(event.endAt)}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5" />
            {event.venue}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Users className="w-3.5 h-3.5" />
            {event._count.rsvps} registered
            {event.maxCapacity && ` / ${event.maxCapacity}`}
            {event.targetBatch && ` · Batch ${event.targetBatch}`}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>By {event.createdBy.fullName}</span>
          {event.status === 'draft' && (
            <div className="flex gap-2">
              <button type="button" onClick={onApprove} className="flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 rounded-lg font-medium hover:bg-green-100 transition text-xs">
                <Check className="w-3.5 h-3.5" /> Approve
              </button>
              <button type="button" onClick={onReject} className="flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition text-xs">
                <Ban className="w-3.5 h-3.5" /> Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
