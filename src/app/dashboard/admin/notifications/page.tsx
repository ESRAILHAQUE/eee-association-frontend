'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Loader2, AlertTriangle, Bell, Send, ChevronDown, Clock,
} from 'lucide-react';
import {
  sendNotification,
  fetchMyNotifications,
  type AppNotification,
} from '@/lib/api';

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const BATCH_OPTIONS = ['2021', '2022', '2023', '2024', '2025'];

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetType, setTargetType] = useState<'all' | 'batch'>('all');
  const [batch, setBatch] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMyNotifications();
      setNotifications(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      setSendError('Title and message are required');
      return;
    }
    if (targetType === 'batch' && !batch) {
      setSendError('Please select a batch');
      return;
    }
    setSending(true);
    setSendError(null);
    setSuccessMsg(null);
    try {
      await sendNotification({
        title,
        message,
        targetType,
        batch: targetType === 'batch' ? batch : undefined,
      });
      setTitle('');
      setMessage('');
      setTargetType('all');
      setBatch('');
      setSuccessMsg('Notification sent successfully!');
      await load();
    } catch (e) {
      setSendError(e instanceof Error ? e.message : 'Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col p-4 md:p-8 overflow-x-hidden">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap gap-2 text-sm text-slate-500 mb-4">
        <Link href="/dashboard/admin" className="hover:text-primary transition-colors font-medium">
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Notifications</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">Send Notifications</h1>
        <p className="text-slate-500 text-sm">Send announcements to all students or a specific batch.</p>
      </div>

      <div className="flex flex-col gap-8 max-w-2xl">
        {/* Compose form */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <Send className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-slate-900">Compose Notification</h2>
          </div>

          <form onSubmit={handleSend} className="flex flex-col gap-4">
            {sendError && (
              <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {sendError}
              </p>
            )}
            {successMsg && (
              <p className="text-green-700 text-sm bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                {successMsg}
              </p>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Notification title…"
                className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message…"
                className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Target</label>
              <div className="relative">
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <select
                  value={targetType}
                  onChange={(e) => { setTargetType(e.target.value as 'all' | 'batch'); setBatch(''); }}
                  className="w-full appearance-none px-3 py-2.5 rounded-lg ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white"
                >
                  <option value="all">All Students</option>
                  <option value="batch">Specific Batch</option>
                </select>
              </div>
            </div>

            {targetType === 'batch' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Batch</label>
                <div className="relative">
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <select
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    className="w-full appearance-none px-3 py-2.5 rounded-lg ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white"
                  >
                    <option value="">Select batch…</option>
                    {BATCH_OPTIONS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={sending}
                className="flex items-center gap-2 bg-primary hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-60"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {sending ? 'Sending…' : 'Send Notification'}
              </button>
            </div>
          </form>
        </section>

        {/* Recent notifications */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-slate-900">Recent Sent Notifications</h2>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-slate-500 py-8 justify-center">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading…</span>
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-slate-400 gap-2">
              <Bell className="w-8 h-8 opacity-30" />
              <p className="text-sm">No notifications sent yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {notifications.map((n) => (
                <div key={n.id} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Bell className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{n.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
