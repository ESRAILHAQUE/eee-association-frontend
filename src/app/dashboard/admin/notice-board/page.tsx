'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Search, Pin, Calendar, Edit3, X, Loader2,
  AlertTriangle, Plus, Trash2, Megaphone, Filter,
} from 'lucide-react';
import { fetchNotices, createNotice, deleteNotice, type Notice, type NoticeTarget } from '@/lib/api';

const BATCHES = ['2019-20', '2020-21', '2021-22', '2022-23', '2023-24', '2024-25'];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AdminNoticeBoardPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterTarget, setFilterTarget] = useState<NoticeTarget | 'all_filter'>('all_filter');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    content: '',
    targetType: 'all' as NoticeTarget,
    batch: '',
    isPinned: false,
    isUrgent: false,
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotices(
        filterTarget !== 'all_filter'
          ? { targetType: filterTarget as NoticeTarget }
          : undefined,
      );
      setNotices(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load notices');
    } finally {
      setLoading(false);
    }
  }, [filterTarget]);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setFormError('Title and content are required');
      return;
    }
    if (form.targetType === 'batch_specific' && !form.batch) {
      setFormError('Please select a batch');
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      await createNotice({
        title: form.title,
        content: form.content,
        targetType: form.targetType,
        batch: form.targetType === 'batch_specific' ? form.batch : undefined,
        isPinned: form.isPinned,
        isUrgent: form.isUrgent,
      });
      setForm({ title: '', content: '', targetType: 'all', batch: '', isPinned: false, isUrgent: false });
      setShowForm(false);
      await load();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Failed to post notice');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this notice?')) return;
    try {
      await deleteNotice(id);
      setNotices((prev) => prev.filter((n) => n.id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  const filtered = notices.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase()),
  );
  const pinned = filtered.filter((n) => n.isPinned);
  const latest = filtered.filter((n) => !n.isPinned);

  return (
    <div className="flex flex-1 flex-col overflow-x-hidden">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap gap-2 text-sm text-slate-500 mb-4">
        <Link href="/dashboard/admin" className="hover:text-primary transition-colors font-medium">
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Notice Board</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-slate-900 text-xl md:text-2xl font-bold">Notice Board</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Post notices to all students, a specific batch, or both.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-lg font-bold cursor-pointer w-fit transition"
        >
          <Plus className="w-4 h-4" /> Post Notice
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search notices…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-4 py-3 rounded-lg bg-white text-slate-900 ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-slate-400 text-sm transition"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={filterTarget}
            onChange={(e) => setFilterTarget(e.target.value as NoticeTarget | 'all_filter')}
            className="px-3 py-3 rounded-lg bg-white ring-1 ring-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            <option value="all_filter">All Targets</option>
            <option value="all">Global (All Students)</option>
            <option value="batch_specific">Batch-Specific</option>
          </select>
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="flex items-center gap-3 text-slate-500 py-16 justify-center">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading notices…</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm mb-6">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Pinned */}
          {pinned.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <Pin className="w-4 h-4 text-amber-500 fill-current" />
                <h2 className="text-base font-bold">Pinned & Important</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pinned.map((n) => (
                  <AdminNoticeCard key={n.id} notice={n} onDelete={handleDelete} />
                ))}
              </div>
            </section>
          )}

          {/* Latest */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Latest Announcements</h2>
              <span className="text-xs text-slate-400">{latest.length} notices</span>
            </div>
            {latest.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-slate-400 gap-3">
                <Megaphone className="w-10 h-10 opacity-30" />
                <p className="text-sm">No notices yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {latest.map((n) => (
                  <AdminNoticeCard key={n.id} notice={n} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {/* Create Notice Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-slate-700" />
                <h2 className="font-bold text-slate-900">Post New Notice</h2>
              </div>
              <button
                type="button"
                onClick={() => { setShowForm(false); setFormError(null); }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              {formError && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {formError}
                </p>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Notice title…"
                  className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                <textarea
                  rows={4}
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  placeholder="Notice content…"
                  className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Target Audience</label>
                <select
                  value={form.targetType}
                  onChange={(e) => setForm((f) => ({ ...f, targetType: e.target.value as NoticeTarget, batch: '' }))}
                  className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  <option value="all">All Students</option>
                  <option value="batch_specific">Specific Batch</option>
                </select>
              </div>
              {form.targetType === 'batch_specific' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Select Batch</label>
                  <select
                    value={form.batch}
                    onChange={(e) => setForm((f) => ({ ...f, batch: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    <option value="">— Select batch —</option>
                    {BATCHES.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.isPinned}
                    onChange={(e) => setForm((f) => ({ ...f, isPinned: e.target.checked }))}
                    className="accent-slate-700"
                  />
                  Pin this notice
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.isUrgent}
                    onChange={(e) => setForm((f) => ({ ...f, isUrgent: e.target.checked }))}
                    className="accent-red-500"
                  />
                  Mark as urgent
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setFormError(null); }}
                  className="px-4 py-2 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-slate-800 text-white text-sm font-bold hover:bg-slate-900 transition disabled:opacity-60"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? 'Posting…' : 'Post Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminNoticeCard({
  notice,
  onDelete,
}: {
  notice: Notice;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row bg-white p-5 rounded-sm border border-slate-100 shadow-sm hover:shadow-md transition-all group">
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {notice.isUrgent && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700 border border-red-200">
              Urgent
            </span>
          )}
          {notice.isPinned && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
              Pinned
            </span>
          )}
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
            {notice.targetType === 'all' ? 'All Students' : `Batch: ${notice.batch}`}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {timeAgo(notice.createdAt)}
          </span>
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">{notice.title}</h3>
        <p className="text-slate-600 text-sm line-clamp-2 mb-3">{notice.content}</p>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">
            {notice.createdBy.fullName.slice(0, 2).toUpperCase()}
          </div>
          {notice.createdBy.fullName}
        </div>
      </div>
      <div className="mt-4 sm:mt-0 sm:ml-4 flex items-center sm:self-start gap-2">
        <button
          type="button"
          onClick={() => onDelete(notice.id)}
          className="p-2 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
