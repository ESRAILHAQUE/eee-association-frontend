'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Loader2, AlertTriangle, Bell, Send, Megaphone, Clock, Users,
} from 'lucide-react';
import { sendNotification, fetchMyNotifications, type AppNotification } from '@/lib/api';

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function ModeratorNotificationsPage() {
  const [form, setForm] = useState({ title: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sendErr, setSendErr] = useState<string | null>(null);
  const [sendSuccess, setSendSuccess] = useState(false);

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    setSending(true);
    setSendErr(null);
    setSendSuccess(false);
    try {
      await sendNotification({
        title: form.title,
        message: form.message,
        targetType: 'all',
      });
      setSendSuccess(true);
      setForm({ title: '', message: '' });
      await load();
    } catch (e) {
      setSendErr(e instanceof Error ? e.message : 'Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col p-4 md:p-8 overflow-x-hidden gap-6">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap gap-2 text-sm text-slate-500">
        <Link href="/dashboard/moderator" className="hover:text-primary transition-colors font-medium">Home</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Notifications</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">Send Announcement</h1>
        <p className="text-slate-500 text-sm">Broadcast notifications to all students in the association.</p>
      </div>

      {/* Compose Form */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 max-w-2xl">
        <div className="flex items-center gap-2 mb-5">
          <Megaphone className="w-5 h-5 text-primary" />
          <h2 className="text-base font-bold text-slate-900">New Announcement</h2>
          <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            All Students
          </span>
        </div>

        <form onSubmit={handleSend} className="flex flex-col gap-4">
          {sendErr && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {sendErr}
            </div>
          )}
          {sendSuccess && (
            <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2.5 text-sm">
              <Bell className="w-4 h-4 shrink-0" /> Announcement sent successfully to all students!
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
              placeholder="Announcement title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
              placeholder="Write your announcement message here…"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Target</label>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg ring-1 ring-slate-200 bg-slate-50">
              <Users className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-600">All Students</span>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={sending}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Send Announcement
            </button>
          </div>
        </form>
      </div>

      {/* Sent Notifications List */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-4">Sent Notifications</h2>

        {loading && (
          <div className="flex items-center gap-3 text-slate-500 py-12 justify-center">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading…
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {!loading && !error && notifications.length === 0 && (
          <div className="flex flex-col items-center py-16 text-slate-400 gap-3">
            <Bell className="w-10 h-10 opacity-30" />
            <p className="text-sm">No notifications sent yet.</p>
          </div>
        )}

        {!loading && !error && notifications.length > 0 && (
          <div className="flex flex-col gap-3">
            {notifications.map((n) => (
              <div key={n.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Bell className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 mb-0.5">{n.title}</h3>
                      <p className="text-sm text-slate-500 line-clamp-2">{n.message}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400 shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    {timeAgo(n.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
