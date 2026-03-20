'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Loader2, AlertTriangle, ClipboardList, Check, X,
  Calendar, User,
} from 'lucide-react';
import {
  fetchLeaveRequests,
  reviewLeaveRequest,
  type LeaveRequest,
} from '@/lib/api';

type StatusTab = 'pending' | 'approved' | 'rejected';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  approved: 'bg-green-100 text-green-700 border-green-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
};

export default function AdminLeaveRequestsPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<StatusTab>('pending');

  // Review modal
  const [reviewTarget, setReviewTarget] = useState<{ req: LeaveRequest; action: 'approved' | 'rejected' } | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [reviewing, setReviewing] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLeaveRequests();
      setRequests(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = requests.filter((r) => r.status === activeTab);

  const openReview = (req: LeaveRequest, action: 'approved' | 'rejected') => {
    setReviewTarget({ req, action });
    setReviewNote('');
    setReviewError(null);
  };

  const closeReview = () => {
    setReviewTarget(null);
    setReviewNote('');
    setReviewError(null);
  };

  const handleReview = async () => {
    if (!reviewTarget) return;
    setReviewing(true);
    setReviewError(null);
    try {
      await reviewLeaveRequest(reviewTarget.req.id, {
        status: reviewTarget.action,
        reviewNote: reviewNote.trim() || undefined,
      });
      await load();
      closeReview();
    } catch (e) {
      setReviewError(e instanceof Error ? e.message : 'Failed to review request');
    } finally {
      setReviewing(false);
    }
  };

  const tabs: StatusTab[] = ['pending', 'approved', 'rejected'];

  return (
    <div className="flex flex-1 flex-col p-4 md:p-8 overflow-x-hidden">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap gap-2 text-sm text-slate-500 mb-4">
        <Link href="/dashboard/admin" className="hover:text-primary transition-colors font-medium">
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Leave Requests</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">Leave Requests</h1>
        <p className="text-slate-500 text-sm">Review and manage leave requests from all students.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-semibold capitalize transition-all ${
              activeTab === tab
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-slate-500 py-16 justify-center">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading leave requests…</span>
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
          <ClipboardList className="w-12 h-12 opacity-30" />
          <p className="text-sm">No {activeTab} leave requests.</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Student</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Title</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Leave Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Return Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Status</th>
                  {activeTab === 'pending' && (
                    <th className="text-left py-3 px-4 font-semibold text-slate-600">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((req) => (
                  <tr key={req.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                          <User className="w-3.5 h-3.5 text-slate-500" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{req.user?.fullName ?? 'Unknown'}</p>
                          <p className="text-xs text-slate-400">{req.user?.registrationNumber ?? ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900 max-w-[180px] truncate">{req.title}</td>
                    <td className="py-3 px-4 text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(req.leaveDate)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(req.returnDate)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border capitalize ${STATUS_STYLES[req.status] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {req.status}
                      </span>
                    </td>
                    {activeTab === 'pending' && (
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openReview(req, 'approved')}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-bold transition"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => openReview(req, 'rejected')}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold transition"
                          >
                            <X className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900 capitalize">
                {reviewTarget.action === 'approved' ? 'Approve' : 'Reject'} Leave Request
              </h2>
              <button type="button" onClick={closeReview} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <div className="bg-slate-50 rounded-lg p-3 text-sm">
                <p className="font-semibold text-slate-900">{reviewTarget.req.title}</p>
                <p className="text-slate-500 text-xs mt-0.5">
                  {reviewTarget.req.user?.fullName} · {formatDate(reviewTarget.req.leaveDate)} → {formatDate(reviewTarget.req.returnDate)}
                </p>
                {reviewTarget.req.reason && (
                  <p className="text-slate-600 text-xs mt-1.5 italic">"{reviewTarget.req.reason}"</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Review Note <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="Add a note for the student…"
                  className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
                />
              </div>
              {reviewError && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {reviewError}
                </p>
              )}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeReview}
                  className="px-4 py-2 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReview}
                  disabled={reviewing}
                  className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white text-sm font-bold transition disabled:opacity-60 ${
                    reviewTarget.action === 'approved'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {reviewing && <Loader2 className="w-4 h-4 animate-spin" />}
                  {reviewing ? 'Saving…' : reviewTarget.action === 'approved' ? 'Approve' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
