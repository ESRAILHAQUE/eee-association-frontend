'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Loader2, AlertTriangle, CheckCircle, QrCode, Calendar, Clock,
  BarChart3, ScanLine,
} from 'lucide-react';
import { fetchMyAttendance, scanAttendance, type AttendanceRecord } from '@/lib/api';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export default function MemberAttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [token, setToken] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanMsg, setScanMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMyAttendance();
      setRecords(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load attendance');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;
    setScanning(true);
    setScanMsg(null);
    try {
      await scanAttendance(token.trim());
      setScanMsg({ type: 'success', text: 'Attendance marked successfully!' });
      setToken('');
      await load();
    } catch (e) {
      setScanMsg({ type: 'error', text: e instanceof Error ? e.message : 'Failed to mark attendance' });
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col p-4 md:p-8 overflow-x-hidden">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap gap-2 text-sm text-slate-500 mb-4">
        <Link href="/dashboard/member" className="hover:text-primary transition-colors font-medium">Home</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Attendance</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">My Attendance</h1>
        <p className="text-slate-500 text-sm">Track your event attendance and mark new ones via QR token.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
          <p className="text-xs text-slate-500 mb-1 flex items-center gap-1.5"><BarChart3 className="w-3.5 h-3.5" /> Total Events Attended</p>
          <p className="text-3xl font-black text-primary">{loading ? '—' : records.length}</p>
        </div>
      </div>

      {/* Mark Attendance */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 mb-8 max-w-xl">
        <div className="flex items-center gap-2 mb-4">
          <QrCode className="w-5 h-5 text-primary" />
          <h2 className="text-base font-bold text-slate-900">Mark Attendance</h2>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          Enter the QR token provided by your event organizer to mark your attendance.
        </p>
        <form onSubmit={handleScan} className="flex gap-2">
          <input
            type="text"
            placeholder="Paste or type your QR token…"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="flex-1 px-3 py-2.5 rounded-lg ring-1 ring-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
          <button
            type="submit"
            disabled={scanning || !token.trim()}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition disabled:opacity-60 shrink-0"
          >
            {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <ScanLine className="w-4 h-4" />}
            Submit
          </button>
        </form>
        {scanMsg && (
          <div className={`mt-3 flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm border ${
            scanMsg.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-600'
          }`}>
            {scanMsg.type === 'success'
              ? <CheckCircle className="w-4 h-4 shrink-0" />
              : <AlertTriangle className="w-4 h-4 shrink-0" />}
            {scanMsg.text}
          </div>
        )}
      </div>

      {/* History */}
      <section>
        <h2 className="text-base font-bold text-slate-900 mb-4">Attendance History</h2>

        {loading && (
          <div className="flex items-center gap-3 text-slate-500 py-12 justify-center">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading history…
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm mb-6">
            <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {!loading && !error && records.length === 0 && (
          <div className="flex flex-col items-center py-16 text-slate-400 gap-3">
            <Calendar className="w-10 h-10 opacity-30" />
            <p className="text-sm">No attendance records yet. Attend events to get started!</p>
          </div>
        )}

        {!loading && !error && records.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">#</th>
                    <th className="text-left px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Event</th>
                    <th className="text-left px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Event Date</th>
                    <th className="text-left px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Scanned At</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r, idx) => (
                    <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                      <td className="px-5 py-3.5 text-slate-400 font-medium">{idx + 1}</td>
                      <td className="px-5 py-3.5">
                        <span className="font-medium text-slate-900">{r.event?.title ?? '—'}</span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {r.event?.startAt ? formatDate(r.event.startAt) : '—'}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {formatTime(r.scannedAt)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
