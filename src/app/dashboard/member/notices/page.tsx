'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Search, Pin, Calendar, Loader2, AlertTriangle,
  Megaphone, ChevronDown,
} from 'lucide-react';
import { fetchNotices, type Notice } from '@/lib/api';

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function MemberNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotices();
      setNotices(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load notices');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = notices.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase()),
  );
  const pinned = filtered.filter((n) => n.isPinned);
  const latest = filtered.filter((n) => !n.isPinned);

  return (
    <div className="flex flex-1 flex-col p-4 md:p-8 overflow-x-hidden">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap gap-2 text-sm text-slate-500 mb-4">
        <Link href="/dashboard/member" className="hover:text-primary transition-colors font-medium">
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Notices</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">Notices</h1>
        <p className="text-slate-500 text-sm">
          Stay updated with announcements from your CR and department admin.
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search notices…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-4 py-3 rounded-lg bg-white text-slate-900 ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-slate-400 text-sm transition"
          />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pinned.map((n) => (
                  <PinnedNoticeCard
                    key={n.id}
                    notice={n}
                    expanded={expanded === n.id}
                    onToggle={() => setExpanded(expanded === n.id ? null : n.id)}
                  />
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
            {latest.length === 0 && pinned.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-slate-400 gap-3">
                <Megaphone className="w-10 h-10 opacity-30" />
                <p className="text-sm">No notices for your batch yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {latest.map((n) => (
                  <NoticeRow
                    key={n.id}
                    notice={n}
                    expanded={expanded === n.id}
                    onToggle={() => setExpanded(expanded === n.id ? null : n.id)}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function PinnedNoticeCard({
  notice,
  expanded,
  onToggle,
}: {
  notice: Notice;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`bg-white rounded-xl border shadow-sm transition-all cursor-pointer ${
        notice.isUrgent ? 'border-red-200 ring-1 ring-red-200' : 'border-amber-200 ring-1 ring-amber-200/40'
      }`}
      onClick={onToggle}
    >
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Pin className="w-3.5 h-3.5 text-amber-500 fill-current" />
          {notice.isUrgent && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700 border border-red-200">
              Urgent
            </span>
          )}
          {notice.batch && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
              {notice.batch}
            </span>
          )}
          {!notice.batch && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
              All Students
            </span>
          )}
        </div>
        <h3 className="font-bold text-slate-900 mb-2">{notice.title}</h3>
        <p className={`text-sm text-slate-600 ${expanded ? '' : 'line-clamp-2'}`}>
          {notice.content}
        </p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            {timeAgo(notice.createdAt)} · {notice.createdBy.fullName}
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
        </div>
      </div>
    </div>
  );
}

function NoticeRow({
  notice,
  expanded,
  onToggle,
}: {
  notice: Notice;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer p-5"
      onClick={onToggle}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {notice.isUrgent && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                Urgent
              </span>
            )}
            {notice.batch ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                {notice.batch}
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                All Students
              </span>
            )}
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {timeAgo(notice.createdAt)}
            </span>
          </div>
          <h3 className="font-bold text-slate-900 mb-1">{notice.title}</h3>
          <p className={`text-sm text-slate-600 ${expanded ? '' : 'line-clamp-2'}`}>
            {notice.content}
          </p>
          {expanded && (
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
              <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                {notice.createdBy.fullName.slice(0, 2).toUpperCase()}
              </div>
              Posted by {notice.createdBy.fullName}
            </div>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 mt-1 transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </div>
    </div>
  );
}
