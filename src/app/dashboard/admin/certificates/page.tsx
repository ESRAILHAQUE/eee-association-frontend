'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Loader2, AlertTriangle, Award, X, Users, Check,
  Calendar, CheckSquare, Square,
} from 'lucide-react';
import {
  fetchEvents,
  fetchEventAttendance,
  issueCertificates,
  type Event,
  type AttendanceRecord,
} from '@/lib/api';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

export default function AdminCertificatesPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [modalEvent, setModalEvent] = useState<Event | null>(null);
  const [attendees, setAttendees] = useState<AttendanceRecord[]>([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [issuing, setIssuing] = useState(false);
  const [issueError, setIssueError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEvents({ status: 'completed' });
      setEvents(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openModal = async (ev: Event) => {
    setModalEvent(ev);
    setIssueError(null);
    setSuccessMsg(null);
    setLoadingAttendees(true);
    try {
      const data = await fetchEventAttendance(ev.id);
      setAttendees(data);
      setSelectedIds(new Set(data.map((a) => a.user?.id ?? a.id)));
    } catch (e) {
      setIssueError(e instanceof Error ? e.message : 'Failed to load attendees');
      setAttendees([]);
    } finally {
      setLoadingAttendees(false);
    }
  };

  const closeModal = () => {
    setModalEvent(null);
    setAttendees([]);
    setSelectedIds(new Set());
    setIssueError(null);
    setSuccessMsg(null);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === attendees.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(attendees.map((a) => a.user?.id ?? a.id)));
    }
  };

  const handleIssue = async () => {
    if (!modalEvent || selectedIds.size === 0) return;
    setIssuing(true);
    setIssueError(null);
    try {
      await issueCertificates(modalEvent.id, Array.from(selectedIds));
      setSuccessMsg(`Certificates issued to ${selectedIds.size} student(s) successfully!`);
    } catch (e) {
      setIssueError(e instanceof Error ? e.message : 'Failed to issue certificates');
    } finally {
      setIssuing(false);
    }
  };

  const handleIssueAll = async (ev: Event) => {
    const data = await fetchEventAttendance(ev.id).catch(() => []);
    if (data.length === 0) { alert('No attendees found for this event.'); return; }
    if (!confirm(`Issue certificates to all ${data.length} attendees of "${ev.title}"?`)) return;
    try {
      await issueCertificates(ev.id, data.map((a) => a.user?.id ?? a.id));
      alert(`Certificates issued to ${data.length} student(s).`);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to issue certificates');
    }
  };

  return (
    <div className="flex flex-1 flex-col p-4 md:p-8 overflow-x-hidden">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap gap-2 text-sm text-slate-500 mb-4">
        <Link href="/dashboard/admin" className="hover:text-primary transition-colors font-medium">
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Certificates</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">Certificate Management</h1>
        <p className="text-slate-500 text-sm">Issue participation certificates for all completed events.</p>
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-slate-500 py-16 justify-center">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading completed events…</span>
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
          <Award className="w-12 h-12 opacity-30" />
          <p className="text-sm">No completed events found.</p>
        </div>
      )}

      {!loading && !error && events.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((ev) => (
            <div key={ev.id} className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700 border border-green-200 mb-2">
                    Completed
                  </span>
                  <h3 className="font-bold text-slate-900 truncate">{ev.title}</h3>
                </div>
                <Award className="w-5 h-5 text-amber-400 shrink-0" />
              </div>

              <div className="flex flex-col gap-1 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(ev.startAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  {ev._count.rsvps} RSVP(s)
                </span>
              </div>

              <div className="flex gap-2 mt-auto">
                <button
                  type="button"
                  onClick={() => openModal(ev)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-primary hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-bold transition shadow shadow-primary/20"
                >
                  <Award className="w-3.5 h-3.5" />
                  Issue Certificates
                </button>
                <button
                  type="button"
                  onClick={() => handleIssueAll(ev)}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-bold transition"
                  title="Issue to all attendees"
                >
                  <Check className="w-3.5 h-3.5" />
                  All
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Issue Certificates Modal */}
      {modalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-slate-900">Issue Certificates</h2>
              </div>
              <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-3 border-b border-slate-50 shrink-0">
              <p className="font-semibold text-slate-900">{modalEvent.title}</p>
              <p className="text-sm text-slate-500">{formatDate(modalEvent.startAt)}</p>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {loadingAttendees ? (
                <div className="flex items-center gap-2 text-slate-500 py-8 justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Loading attendees…</span>
                </div>
              ) : attendees.length === 0 ? (
                <p className="text-center text-slate-400 text-sm py-8">No attendees found for this event.</p>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <button type="button" onClick={toggleAll} className="flex items-center gap-1.5 text-sm text-primary hover:underline font-medium">
                      {selectedIds.size === attendees.length
                        ? <CheckSquare className="w-4 h-4" />
                        : <Square className="w-4 h-4" />}
                      {selectedIds.size === attendees.length ? 'Deselect All' : 'Select All'}
                    </button>
                    <span className="text-xs text-slate-400">({selectedIds.size} selected)</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {attendees.map((a) => {
                      const userId = a.user?.id ?? a.id;
                      const checked = selectedIds.has(userId);
                      return (
                        <label key={a.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleSelect(userId)}
                            className="accent-primary w-4 h-4"
                          />
                          <div>
                            <p className="text-sm font-medium text-slate-900">{a.user?.fullName ?? 'Unknown'}</p>
                            <p className="text-xs text-slate-400">{a.user?.registrationNumber ?? ''}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </>
              )}

              {issueError && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm mt-4">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {issueError}
                </div>
              )}
              {successMsg && (
                <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm mt-4">
                  <Check className="w-4 h-4 shrink-0" />
                  {successMsg}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 shrink-0">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 text-sm font-medium transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleIssue}
                disabled={issuing || selectedIds.size === 0 || loadingAttendees}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-blue-700 transition disabled:opacity-60"
              >
                {issuing && <Loader2 className="w-4 h-4 animate-spin" />}
                {issuing ? 'Issuing…' : `Issue to ${selectedIds.size} Student(s)`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
