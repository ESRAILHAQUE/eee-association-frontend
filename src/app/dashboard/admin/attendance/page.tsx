'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Loader2, AlertTriangle, Users, Calendar, MapPin, X,
  UserCheck,
} from 'lucide-react';
import {
  fetchEvents,
  fetchEventAttendance,
  type Event,
  type AttendanceRecord,
} from '@/lib/api';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function AdminAttendancePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [modalEvent, setModalEvent] = useState<Event | null>(null);
  const [attendees, setAttendees] = useState<AttendanceRecord[]>([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [attendeeError, setAttendeeError] = useState<string | null>(null);

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

  const openAttendees = async (ev: Event) => {
    setModalEvent(ev);
    setAttendees([]);
    setAttendeeError(null);
    setLoadingAttendees(true);
    try {
      const data = await fetchEventAttendance(ev.id);
      setAttendees(data);
    } catch (e) {
      setAttendeeError(e instanceof Error ? e.message : 'Failed to load attendees');
    } finally {
      setLoadingAttendees(false);
    }
  };

  const closeModal = () => {
    setModalEvent(null);
    setAttendees([]);
    setAttendeeError(null);
  };

  const STATUS_BADGE: Record<string, string> = {
    published: 'bg-green-100 text-green-700 border-green-200',
    completed: 'bg-slate-100 text-slate-600 border-slate-200',
    draft: 'bg-amber-100 text-amber-700 border-amber-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <div className="flex flex-1 flex-col p-4 md:p-8 overflow-x-hidden">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap gap-2 text-sm text-slate-500 mb-4">
        <Link href="/dashboard/admin" className="hover:text-primary transition-colors font-medium">
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Attendance</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">Attendance Overview</h1>
        <p className="text-slate-500 text-sm">View attendance records for all events.</p>
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-slate-500 py-16 justify-center">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading events…</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm mb-6">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {!loading && !error && events.length === 0 && (
        <div className="flex flex-col items-center py-20 text-slate-400 gap-3">
          <Calendar className="w-12 h-12 opacity-30" />
          <p className="text-sm">No events found.</p>
        </div>
      )}

      {!loading && !error && events.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Event</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Venue</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">RSVPs</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-900 max-w-[200px] truncate">{ev.title}</td>
                    <td className="py-3 px-4 text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(ev.startAt)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      <span className="flex items-center gap-1.5 truncate max-w-[120px]">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        {ev.venue}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border capitalize ${STATUS_BADGE[ev.status] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {ev.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2.5 py-0.5 text-xs font-bold">
                        <Users className="w-3 h-3" />
                        {ev._count.rsvps}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => openAttendees(ev)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-blue-700 text-white text-xs font-bold transition"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        View Attendees
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Attendees Modal */}
      {modalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <div>
                <h2 className="font-bold text-slate-900">{modalEvent.title}</h2>
                <p className="text-xs text-slate-500">{formatDateTime(modalEvent.startAt)} · {modalEvent.venue}</p>
              </div>
              <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {loadingAttendees ? (
                <div className="flex items-center gap-2 text-slate-500 py-8 justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Loading attendees…</span>
                </div>
              ) : attendeeError ? (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {attendeeError}
                </div>
              ) : attendees.length === 0 ? (
                <div className="flex flex-col items-center py-10 text-slate-400 gap-2">
                  <Users className="w-8 h-8 opacity-30" />
                  <p className="text-sm">No attendees recorded.</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-100">
                    <tr>
                      <th className="text-left py-2 px-2 font-semibold text-slate-600">Name</th>
                      <th className="text-left py-2 px-2 font-semibold text-slate-600">Reg No</th>
                      <th className="text-left py-2 px-2 font-semibold text-slate-600">Scanned At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendees.map((a) => (
                      <tr key={a.id} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="py-2.5 px-2 font-medium text-slate-900">{a.user?.fullName ?? '—'}</td>
                        <td className="py-2.5 px-2 text-slate-500">{a.user?.registrationNumber ?? '—'}</td>
                        <td className="py-2.5 px-2 text-slate-400 text-xs">{formatDateTime(a.scannedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="px-6 py-3 border-t border-slate-100 shrink-0 flex justify-between items-center">
              <span className="text-sm text-slate-500">
                {!loadingAttendees && <>{attendees.length} attendee(s)</>}
              </span>
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 text-sm font-medium transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
