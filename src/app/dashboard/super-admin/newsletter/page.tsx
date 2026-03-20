'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Mail,
  Send,
  Users,
  Clock,
  CheckCircle,
  BarChart2,
  RefreshCw,
} from 'lucide-react';
import {
  fetchNewsletters,
  sendNewsletter,
  type NewsletterItem,
} from '@/lib/api';

export default function NewsletterPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [sendSuccess, setSendSuccess] = useState('');

  const [newsletters, setNewsletters] = useState<NewsletterItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState('');

  useEffect(() => {
    fetchNewsletters()
      .then(setNewsletters)
      .catch((err: Error) => setHistoryError(err.message))
      .finally(() => setLoadingHistory(false));
  }, []);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      setSendError('Subject and message are required.');
      return;
    }
    setSending(true);
    setSendError('');
    setSendSuccess('');
    try {
      await sendNewsletter({ subject: title.trim(), body: message.trim() });
      setSendSuccess('Newsletter sent and saved successfully!');
      setTitle('');
      setMessage('');
      const updated = await fetchNewsletters();
      setNewsletters(updated);
    } catch (err: unknown) {
      setSendError((err as Error).message);
    } finally {
      setSending(false);
    }
  }

  const totalSent = newsletters.length;

  return (
    <div className="w-full max-w-[1280px] flex flex-col gap-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/dashboard/super-admin" className="hover:text-primary font-medium transition-colors">
          Home
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-900 font-semibold">Newsletter</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-50 rounded-xl">
            <Mail className="w-6 h-6 text-purple-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Newsletter Management
          </h1>
        </div>
        <p className="text-slate-500 max-w-2xl">
          Compose and broadcast newsletters and notifications to association members.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="p-2.5 bg-purple-50 rounded-xl">
            <Send className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{totalSent}</p>
            <p className="text-xs text-slate-500 mt-0.5">Total Sent</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="p-2.5 bg-blue-50 rounded-xl">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">All</p>
            <p className="text-xs text-slate-500 mt-0.5">Recipients Coverage</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="p-2.5 bg-emerald-50 rounded-xl">
            <BarChart2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">72%</p>
            <p className="text-xs text-slate-500 mt-0.5">Est. Open Rate</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Compose Form */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Compose Newsletter</h2>
            <p className="text-sm text-slate-500 mt-0.5">Write and send a notification to members</p>
          </div>
          <form onSubmit={handleSend} className="p-6 flex flex-col gap-5">
            {sendError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {sendError}
              </div>
            )}
            {sendSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-emerald-700 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {sendSuccess}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Subject / Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Monthly Update — March 2026"
                className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Message Body *</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your newsletter content here..."
                rows={8}
                className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-y text-slate-900 leading-relaxed"
              />
              {message && (
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Preview</p>
                  <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">{message}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Target Audience</label>
              <div className="flex gap-3">
                <div className="flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold border bg-primary text-white border-primary shadow-sm text-center">
                  All Members
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-3 bg-primary hover:bg-blue-700 rounded-lg text-sm font-bold text-white transition-colors shadow-md shadow-primary/20 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {sending ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /> Sending...</>
              ) : (
                <><Send className="w-4 h-4" /> Send Newsletter</>
              )}
            </button>
          </form>
        </div>

        {/* Previously Sent */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Previously Sent</h2>
              <p className="text-sm text-slate-500 mt-0.5">{totalSent} notifications</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {loadingHistory ? (
              <div className="flex items-center justify-center h-32">
                <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : historyError ? (
              <div className="p-6 text-sm text-red-600">{historyError}</div>
            ) : newsletters.length === 0 ? (
              <div className="p-8 text-center">
                <Mail className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-sm text-slate-400">No newsletters sent yet</p>
              </div>
            ) : (
              newsletters.map((n) => (
                <div key={n.id} className="px-5 py-4 hover:bg-slate-50 transition-colors">
                  <p className="text-sm font-semibold text-slate-900 line-clamp-1">{n.title}</p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{n.content}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />
                    {new Date(n.createdAt).toLocaleString()}
                    <span className="text-slate-300 mx-1">·</span>
                    {n.createdBy.fullName}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
