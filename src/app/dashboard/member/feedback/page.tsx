'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Loader2, AlertTriangle, Plus, X, MessageCircle, ShieldOff, Eye,
} from 'lucide-react';
import {
  fetchFeedbacks, submitFeedback, getStoredUser, type FeedbackItem,
} from '@/lib/api';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  reviewed: 'bg-blue-50 text-blue-700 border-blue-200',
  resolved: 'bg-green-50 text-green-700 border-green-200',
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function MemberFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const currentUser = getStoredUser();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFeedbacks();
      // Filter to own submissions (non-anonymous show submittedBy, anonymous ones are own)
      const mine = data.filter(
        (f) => !f.isAnonymous && f.submittedBy?.id === currentUser?.id
          || f.isAnonymous,
      );
      setFeedbacks(mine);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load feedbacks');
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="flex flex-1 flex-col p-4 md:p-8 overflow-x-hidden">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap gap-2 text-sm text-slate-500 mb-4">
        <Link href="/dashboard/member" className="hover:text-primary transition-colors font-medium">Home</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Feedback</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">Feedback & Suggestions</h1>
          <p className="text-slate-500 text-sm">Share your thoughts to help improve the association.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition shrink-0"
        >
          <Plus className="w-4 h-4" /> Submit Feedback
        </button>
      </div>

      {/* Privacy Note */}
      <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-6">
        <ShieldOff className="w-4 h-4 text-blue-600 shrink-0" />
        <p className="text-sm text-blue-700">
          <strong>Privacy Notice:</strong> Your identity is protected when submitting anonymously.
        </p>
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-slate-500 py-16 justify-center">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading feedbacks…
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm mb-6">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {!loading && !error && feedbacks.length === 0 && (
        <div className="flex flex-col items-center py-20 text-slate-400 gap-3">
          <MessageCircle className="w-10 h-10 opacity-30" />
          <p className="text-sm">No feedback submitted yet. Share your thoughts!</p>
        </div>
      )}

      {!loading && !error && feedbacks.length > 0 && (
        <div className="flex flex-col gap-4">
          {feedbacks.map((fb) => (
            <div key={fb.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-semibold capitalize ${STATUS_STYLES[fb.status] ?? 'bg-slate-100 text-slate-600'}`}>
                  {fb.status}
                </span>
                {fb.isAnonymous ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-500">
                    <ShieldOff className="w-3 h-3" /> Anonymous
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-500">
                    <Eye className="w-3 h-3" /> Visible
                  </span>
                )}
                <span className="text-xs text-slate-400 ml-auto">{timeAgo(fb.createdAt)}</span>
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{fb.title}</h3>
              <p className="text-sm text-slate-600">{fb.content}</p>
              {fb.resolution && (
                <div className="mt-3 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                  <p className="text-xs text-slate-600"><span className="font-semibold">Resolution:</span> {fb.resolution}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <FeedbackModal
          onClose={() => setShowModal(false)}
          onCreated={() => { setShowModal(false); load(); }}
        />
      )}
    </div>
  );
}

function FeedbackModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ title: '', content: '', isAnonymous: false });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErr(null);
    try {
      await submitFeedback(form);
      onCreated();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Submit Feedback</h2>
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
              placeholder="Brief subject of your feedback"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Feedback</label>
            <textarea
              required
              rows={5}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
              placeholder="Share your thoughts, suggestions, or concerns…"
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              onClick={() => setForm({ ...form, isAnonymous: !form.isAnonymous })}
              className={`w-10 h-5 rounded-full transition-colors relative ${form.isAnonymous ? 'bg-primary' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.isAnonymous ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
            <span className="text-sm text-slate-700">Submit Anonymously</span>
            {form.isAnonymous && (
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Identity hidden</span>
            )}
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition">Cancel</button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
