'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Loader2, AlertTriangle, MessageSquare, ChevronDown, Calendar,
} from 'lucide-react';
import {
  fetchFeedbacks,
  updateFeedback,
  type FeedbackItem,
} from '@/lib/api';

type StatusFilter = 'all' | 'open' | 'in_progress' | 'resolved';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

const STATUS_STYLES: Record<string, string> = {
  open: 'bg-blue-100 text-blue-700 border-blue-200',
  in_progress: 'bg-amber-100 text-amber-700 border-amber-200',
  resolved: 'bg-green-100 text-green-700 border-green-200',
};

const STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
};

const NEXT_STATUSES: Record<string, string[]> = {
  open: ['in_progress', 'resolved'],
  in_progress: ['resolved'],
  resolved: [],
};

export default function CRFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<StatusFilter>('all');

  // Per-card update state
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [resolutions, setResolutions] = useState<Record<string, string>>({});
  const [updateErrors, setUpdateErrors] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFeedbacks();
      setFeedbacks(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load feedback');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = feedbacks.filter((f) => filter === 'all' || f.status === filter);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    setUpdateErrors((prev) => ({ ...prev, [id]: '' }));
    try {
      await updateFeedback(id, {
        status: newStatus,
        resolution: resolutions[id] || undefined,
      });
      await load();
    } catch (e) {
      setUpdateErrors((prev) => ({
        ...prev,
        [id]: e instanceof Error ? e.message : 'Update failed',
      }));
    } finally {
      setUpdatingId(null);
    }
  };

  const filterTabs: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
  ];

  return (
    <div className="flex flex-1 flex-col p-4 md:p-8 overflow-x-hidden">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap gap-2 text-sm text-slate-500 mb-4">
        <Link href="/dashboard/cr" className="hover:text-primary transition-colors font-medium">
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Feedback</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">Student Feedback</h1>
        <p className="text-slate-500 text-sm">Manage feedback from your batch students.</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-lg w-fit flex-wrap">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
              filter === tab.value
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-slate-500 py-16 justify-center">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading feedback…</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm mb-6">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center py-20 text-slate-400 gap-3">
          <MessageSquare className="w-12 h-12 opacity-30" />
          <p className="text-sm">No feedback found.</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((fb) => {
            const nextOptions = NEXT_STATUSES[fb.status] ?? [];
            return (
              <div key={fb.id} className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${STATUS_STYLES[fb.status] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {STATUS_LABELS[fb.status] ?? fb.status}
                      </span>
                      {fb.isAnonymous && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                          Anonymous
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 truncate">{fb.title}</h3>
                  </div>
                </div>

                <p className="text-sm text-slate-600 line-clamp-3">{fb.content}</p>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(fb.createdAt)}
                  </span>
                  {!fb.isAnonymous && fb.submittedBy && (
                    <span>{fb.submittedBy.fullName}</span>
                  )}
                </div>

                {fb.resolution && (
                  <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs text-green-700">
                    <span className="font-semibold">Resolution: </span>{fb.resolution}
                  </div>
                )}

                {updateErrors[fb.id] && (
                  <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-2 py-1">
                    {updateErrors[fb.id]}
                  </p>
                )}

                {nextOptions.length > 0 && (
                  <div className="flex flex-col gap-2 pt-1 border-t border-slate-100">
                    <textarea
                      rows={2}
                      placeholder="Resolution note (optional)…"
                      value={resolutions[fb.id] ?? ''}
                      onChange={(e) => setResolutions((prev) => ({ ...prev, [fb.id]: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-xs resize-none"
                    />
                    <div className="flex items-center gap-2 flex-wrap">
                      {nextOptions.map((ns) => (
                        <button
                          key={ns}
                          type="button"
                          onClick={() => handleStatusUpdate(fb.id, ns)}
                          disabled={updatingId === fb.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition disabled:opacity-60 bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                        >
                          {updatingId === fb.id
                            ? <Loader2 className="w-3 h-3 animate-spin" />
                            : <ChevronDown className="w-3 h-3" />}
                          Mark as {STATUS_LABELS[ns] ?? ns}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
