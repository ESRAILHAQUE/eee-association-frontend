'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Loader2, AlertTriangle, MessageSquare, Flag, Trash2, RotateCcw,
  Filter, BarChart3,
} from 'lucide-react';
import {
  fetchForumPosts, updatePostStatus, type ForumPostItem,
} from '@/lib/api';

type TabValue = 'all' | 'flagged' | 'active' | 'removed';

const TABS: { label: string; value: TabValue }[] = [
  { label: 'All', value: 'all' },
  { label: 'Flagged', value: 'flagged' },
  { label: 'Active', value: 'active' },
  { label: 'Removed', value: 'removed' },
];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function ModeratorForumPage() {
  const [activeTab, setActiveTab] = useState<TabValue>('all');
  const [posts, setPosts] = useState<ForumPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchForumPosts();
      setPosts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleStatus = async (id: string, status: string) => {
    setActionLoading((prev) => new Set(prev).add(id));
    try {
      await updatePostStatus(id, status);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to update post');
    } finally {
      setActionLoading((prev) => { const s = new Set(prev); s.delete(id); return s; });
    }
  };

  const filtered = posts.filter((p) => {
    if (activeTab === 'all') return true;
    return p.status === activeTab;
  });

  const activePosts = posts.filter((p) => p.status === 'active').length;
  const flaggedPosts = posts.filter((p) => p.status === 'flagged').length;
  const removedPosts = posts.filter((p) => p.status === 'removed').length;

  return (
    <div className="flex flex-1 flex-col p-4 md:p-8 overflow-x-hidden gap-6">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap gap-2 text-sm text-slate-500">
        <Link href="/dashboard/moderator" className="hover:text-primary transition-colors font-medium">Home</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Forum Moderation</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">Forum Moderation</h1>
        <p className="text-slate-500 text-sm">Review posts, handle flags, and maintain forum quality.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-3.5 h-3.5 text-green-500" />
            <p className="text-xs text-slate-500">Active Posts</p>
          </div>
          <p className="text-2xl font-black text-green-600">{loading ? '—' : activePosts}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-1">
            <Flag className="w-3.5 h-3.5 text-yellow-500" />
            <p className="text-xs text-slate-500">Flagged Posts</p>
          </div>
          <p className="text-2xl font-black text-yellow-600">{loading ? '—' : flaggedPosts}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-1">
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
            <p className="text-xs text-slate-500">Removed Posts</p>
          </div>
          <p className="text-2xl font-black text-red-600">{loading ? '—' : removedPosts}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-slate-400 shrink-0" />
        <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`relative px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.value
                  ? 'bg-white shadow-sm text-slate-900'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
              {tab.value === 'flagged' && flaggedPosts > 0 && (
                <span className="ml-1 bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                  {flaggedPosts}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-slate-500 py-16 justify-center">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading posts…
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center py-16 text-slate-400 gap-3">
          <MessageSquare className="w-10 h-10 opacity-30" />
          <p className="text-sm">No posts in this category.</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="flex flex-col gap-4">
          {filtered.map((post) => {
            const busy = actionLoading.has(post.id);
            return (
              <div key={post.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${
                        post.status === 'active' ? 'bg-green-100 text-green-700' :
                        post.status === 'flagged' ? 'bg-yellow-100 text-yellow-700' :
                        post.status === 'removed' ? 'bg-red-100 text-red-600' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {post.status}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        {post.category.name}
                      </span>
                      <span className="text-xs text-slate-400">{timeAgo(post.createdAt)}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1">{post.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-2">{post.content}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                      <span>by <strong className="text-slate-600">{post.author.fullName}</strong></span>
                      <span>{post._count.comments} comments</span>
                      <span>{post._count.votes} votes</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2 sm:self-start shrink-0">
                    {post.status !== 'removed' && (
                      <button
                        type="button"
                        onClick={() => handleStatus(post.id, 'removed')}
                        disabled={busy}
                        className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-medium hover:bg-red-100 transition disabled:opacity-60"
                      >
                        {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        Remove
                      </button>
                    )}
                    {post.status === 'removed' && (
                      <button
                        type="button"
                        onClick={() => handleStatus(post.id, 'active')}
                        disabled={busy}
                        className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-medium hover:bg-green-100 transition disabled:opacity-60"
                      >
                        {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                        Restore
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
