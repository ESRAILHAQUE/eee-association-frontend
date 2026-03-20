'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Loader2, AlertTriangle, MessageSquare, ThumbsUp, ThumbsDown,
  ChevronDown, ChevronUp, Send, Plus, X, Tag, Hash,
} from 'lucide-react';
import {
  fetchForumCategories, fetchForumPosts, createForumPost,
  fetchPostComments, addComment, votePost,
  type ForumCategory, type ForumPostItem, type ForumCommentItem,
} from '@/lib/api';

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function MemberForumPage() {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [posts, setPosts] = useState<ForumPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [cats, ps] = await Promise.all([
        fetchForumCategories(),
        fetchForumPosts(selectedCategory),
      ]);
      setCategories(cats);
      setPosts(ps);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load forum');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="flex flex-1 flex-col p-4 md:p-8 overflow-x-hidden">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap gap-2 text-sm text-slate-500 mb-4">
        <Link href="/dashboard/member" className="hover:text-primary transition-colors font-medium">Home</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Forum</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">Discussion Forum</h1>
          <p className="text-slate-500 text-sm">Ask questions, share knowledge, discuss EEE topics</p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition shrink-0"
        >
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar: Categories */}
        <aside className="lg:w-56 shrink-0">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Categories</h2>
            <ul className="flex flex-col gap-1">
              <li>
                <button
                  type="button"
                  onClick={() => setSelectedCategory(undefined)}
                  className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    selectedCategory === undefined
                      ? 'bg-primary/10 text-primary'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Hash className="w-3.5 h-3.5" /> All Topics
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                      selectedCategory === cat.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Tag className="w-3.5 h-3.5" /> {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main: Posts */}
        <div className="flex-1 min-w-0">
          {loading && (
            <div className="flex items-center gap-3 text-slate-500 py-16 justify-center">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading posts…
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm mb-6">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="flex flex-col items-center py-20 text-slate-400 gap-3">
              <MessageSquare className="w-10 h-10 opacity-30" />
              <p className="text-sm">No posts yet. Be the first to start a discussion!</p>
            </div>
          )}

          {!loading && !error && posts.length > 0 && (
            <div className="flex flex-col gap-4">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  expanded={expandedPost === post.id}
                  onToggle={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                  onVote={async (vote) => {
                    try {
                      await votePost(post.id, vote);
                      await load();
                    } catch {/* silent */}
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <NewPostModal
          categories={categories}
          onClose={() => setShowModal(false)}
          onCreated={() => { setShowModal(false); load(); }}
        />
      )}
    </div>
  );
}

function PostCard({
  post, expanded, onToggle, onVote,
}: {
  post: ForumPostItem;
  expanded: boolean;
  onToggle: () => void;
  onVote: (vote: 1 | -1) => void;
}) {
  const [comments, setComments] = useState<ForumCommentItem[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!expanded) return;
    setCommentsLoading(true);
    fetchPostComments(post.id)
      .then(setComments)
      .catch(() => {/* silent */})
      .finally(() => setCommentsLoading(false));
  }, [expanded, post.id]);

  const handleComment = async () => {
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const c = await addComment(post.id, commentText.trim());
      setComments((prev) => [...prev, c]);
      setCommentText('');
    } catch {/* silent */} finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Vote */}
          <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
            <button
              type="button"
              onClick={() => onVote(1)}
              className="p-1 rounded hover:bg-green-50 text-slate-400 hover:text-green-600 transition"
            >
              <ThumbsUp className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-700">{post._count.votes}</span>
            <button
              type="button"
              onClick={() => onVote(-1)}
              className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition"
            >
              <ThumbsDown className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                {post.category.name}
              </span>
              <span className="text-xs text-slate-400">{timeAgo(post.createdAt)} · {post.author.fullName}</span>
            </div>
            <h3 className="font-bold text-slate-900 mb-1 cursor-pointer hover:text-primary transition" onClick={onToggle}>
              {post.title}
            </h3>
            <p className={`text-sm text-slate-600 ${expanded ? '' : 'line-clamp-2'}`}>{post.content}</p>

            <div className="flex items-center gap-4 mt-3">
              <button
                type="button"
                onClick={onToggle}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-primary transition"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                {post._count.comments} comments
                {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Expanded Comments */}
        {expanded && (
          <div className="mt-4 ml-10 border-t border-slate-100 pt-4">
            {commentsLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-sm py-4">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading comments…
              </div>
            )}
            {!commentsLoading && comments.length === 0 && (
              <p className="text-sm text-slate-400 py-2">No comments yet. Be the first to reply!</p>
            )}
            {!commentsLoading && comments.map((c) => (
              <div key={c.id} className="flex gap-3 mb-3">
                <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold shrink-0">
                  {c.author.fullName.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-700">{c.author.fullName}
                    <span className="ml-2 font-normal text-slate-400">{timeAgo(c.createdAt)}</span>
                  </p>
                  <p className="text-sm text-slate-600 mt-0.5">{c.content}</p>
                </div>
              </div>
            ))}

            {/* Comment Form */}
            <div className="flex gap-2 mt-3">
              <input
                type="text"
                placeholder="Write a comment…"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleComment(); }}
                className="flex-1 px-3 py-2 rounded-lg bg-slate-50 ring-1 ring-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
              <button
                type="button"
                onClick={handleComment}
                disabled={submitting || !commentText.trim()}
                className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function NewPostModal({
  categories, onClose, onCreated,
}: {
  categories: ForumCategory[];
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState({ title: '', content: '', categoryId: '' });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoryId) { setErr('Please select a category'); return; }
    setSubmitting(true);
    setErr(null);
    try {
      await createForumPost(form);
      onCreated();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">New Post</h2>
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
              placeholder="What's your question or topic?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select
              required
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary transition bg-white"
            >
              <option value="">Select a category…</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
            <textarea
              required
              rows={5}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
              placeholder="Describe your question or topic in detail…"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition">Cancel</button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
