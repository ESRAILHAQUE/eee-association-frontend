'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Loader2, AlertTriangle, Plus, X, Calendar, FileText, MessageSquare,
} from 'lucide-react';
import {
  fetchMyLeaveRequests, submitLeaveRequest, type LeaveRequest,
} from '@/lib/api';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  approved: 'bg-green-50 text-green-700 border-green-200',
  rejected: 'bg-red-50 text-red-600 border-red-200',
};

export default function MemberLeavePage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMyLeaveRequests();
      setRequests(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="flex flex-1 flex-col p-4 md:p-8 overflow-x-hidden">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap gap-2 text-sm text-slate-500 mb-4">
        <Link href="/dashboard/member" className="hover:text-primary transition-colors font-medium">Home</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Leave Requests</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">Leave Requests</h1>
          <p className="text-slate-500 text-sm">Submit and track your leave requests.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition shrink-0"
        >
          <Plus className="w-4 h-4" /> New Request
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-slate-500 py-16 justify-center">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading requests…
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm mb-6">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {!loading && !error && requests.length === 0 && (
        <div className="flex flex-col items-center py-20 text-slate-400 gap-3">
          <FileText className="w-10 h-10 opacity-30" />
          <p className="text-sm">No leave requests yet. Submit one to get started.</p>
        </div>
      )}

      {!loading && !error && requests.length > 0 && (
        <div className="flex flex-col gap-4">
          {requests.map((req) => (
            <div key={req.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-semibold capitalize ${STATUS_STYLES[req.status] ?? 'bg-slate-100 text-slate-600'}`}>
                      {req.status}
                    </span>
                    <span className="text-xs text-slate-400">Submitted {formatDate(req.createdAt)}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">{req.title}</h3>
                  <p className="text-sm text-slate-600 mb-3">{req.reason}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Leave: <strong className="text-slate-700">{formatDate(req.leaveDate)}</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Return: <strong className="text-slate-700">{formatDate(req.returnDate)}</strong>
                    </span>
                  </div>
                  {req.reviewNote && (
                    <div className="mt-3 flex items-start gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                      <p className="text-xs text-slate-600"><span className="font-semibold">Review Note:</span> {req.reviewNote}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <LeaveModal
          onClose={() => setShowModal(false)}
          onCreated={() => { setShowModal(false); load(); }}
        />
      )}
    </div>
  );
}

function LeaveModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ title: '', reason: '', leaveDate: '', returnDate: '' });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErr(null);
    try {
      await submitLeaveRequest(form);
      onCreated();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">New Leave Request</h2>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {err && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {err}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary transition"
              placeholder="Brief reason for leave"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Detailed Reason</label>
            <textarea
              required
              rows={3}
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
              placeholder="Explain your leave reason in detail…"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Leave Date</label>
              <input
                type="date"
                required
                value={form.leaveDate}
                onChange={(e) => setForm({ ...form, leaveDate: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Return Date</label>
              <input
                type="date"
                required
                value={form.returnDate}
                onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition">Cancel</button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
