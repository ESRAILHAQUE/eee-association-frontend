'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Loader2, AlertTriangle, QrCode, Copy, Check, Calendar,
  Users, ChevronDown, Clock, Info,
} from 'lucide-react';
import {
  fetchEvents,
  generateQR,
  fetchEventAttendance,
  type Event,
  type AttendanceQRData,
  type AttendanceRecord,
} from '@/lib/api';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function useCountdown(expiresAt: string | null) {
  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  useEffect(() => {
    if (!expiresAt) return;
    const tick = () => {
      const diff = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
      setSecondsLeft(diff);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  return { secondsLeft, label: `${mins}:${secs.toString().padStart(2, '0')}` };
}

export default function CRAttendancePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedEventId, setSelectedEventId] = useState('');
  const [qrData, setQrData] = useState<AttendanceQRData | null>(null);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Attendance records per event
  const [records, setRecords] = useState<Map<string, AttendanceRecord[]>>(new Map());
  const [loadingRecords, setLoadingRecords] = useState(false);

  const { label: countdownLabel, secondsLeft } = useCountdown(qrData?.expiresAt ?? null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEvents({ status: 'published' });
      setEvents(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Load attendance records for all events once events are fetched
  useEffect(() => {
    if (events.length === 0) return;
    setLoadingRecords(true);
    Promise.allSettled(events.map((ev) => fetchEventAttendance(ev.id).then((r) => ({ id: ev.id, r }))))
      .then((results) => {
        const map = new Map<string, AttendanceRecord[]>();
        results.forEach((res) => {
          if (res.status === 'fulfilled') {
            map.set(res.value.id, res.value.r);
          }
        });
        setRecords(map);
      })
      .finally(() => setLoadingRecords(false));
  }, [events]);

  const handleGenerateQR = async () => {
    if (!selectedEventId) return;
    setGenerating(true);
    setGenError(null);
    setQrData(null);
    try {
      const data = await generateQR(selectedEventId);
      setQrData(data);
    } catch (e) {
      setGenError(e instanceof Error ? e.message : 'Failed to generate QR');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!qrData) return;
    await navigator.clipboard.writeText(qrData.token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-1 flex-col p-4 md:p-8 overflow-x-hidden">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap gap-2 text-sm text-slate-500 mb-4">
        <Link href="/dashboard/cr" className="hover:text-primary transition-colors font-medium">
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Attendance</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">Attendance Management</h1>
        <p className="text-slate-500 text-sm">Generate QR codes for events and track your batch attendance</p>
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

      {!loading && !error && (
        <div className="flex flex-col gap-8">
          {/* Section A: Generate QR Code */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <QrCode className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold">Generate QR Code</h2>
            </div>

            <div className="flex items-center gap-2 mb-4 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
              <Info className="w-4 h-4 shrink-0" />
              Students scan this token in their app to mark attendance.
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <select
                  value={selectedEventId}
                  onChange={(e) => { setSelectedEventId(e.target.value); setQrData(null); setGenError(null); }}
                  className="w-full appearance-none px-3 py-2.5 rounded-lg ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white"
                >
                  <option value="">Select a published event…</option>
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title} — {formatDate(ev.startAt)}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={handleGenerateQR}
                disabled={!selectedEventId || generating}
                className="flex items-center gap-2 bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-60 whitespace-nowrap"
              >
                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <QrCode className="w-4 h-4" />}
                {generating ? 'Generating…' : 'Generate QR'}
              </button>
            </div>

            {genError && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm mb-4">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {genError}
              </div>
            )}

            {qrData && (
              <div className="flex flex-col items-center gap-4 mt-4">
                <div className="w-full max-w-md bg-slate-950 rounded-2xl p-8 text-center relative">
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">Attendance Token</p>
                  <p className="text-white font-mono text-2xl font-black break-all leading-tight mb-4">
                    {qrData.token}
                  </p>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-2 mx-auto bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy Token'}
                  </button>
                </div>
                <div className={`flex items-center gap-2 text-sm font-semibold ${secondsLeft < 60 ? 'text-red-600' : 'text-slate-600'}`}>
                  <Clock className="w-4 h-4" />
                  Expires in {countdownLabel}
                  {secondsLeft === 0 && <span className="text-red-600 font-bold"> — Expired</span>}
                </div>
              </div>
            )}

            {events.length === 0 && (
              <p className="text-slate-400 text-sm text-center py-6">No published events available.</p>
            )}
          </section>

          {/* Section B: Attendance Records */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold">Attendance Records</h2>
            </div>

            {loadingRecords ? (
              <div className="flex items-center gap-2 text-slate-500 py-6 justify-center">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading records…</span>
              </div>
            ) : events.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-6">No events found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-3 px-4 font-semibold text-slate-600">Event</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-600">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-600">Attendees</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((ev) => (
                      <tr key={ev.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-900">{ev.title}</td>
                        <td className="py-3 px-4 text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(ev.startAt)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2.5 py-0.5 text-xs font-bold">
                            <Users className="w-3 h-3" />
                            {records.get(ev.id)?.length ?? '—'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
