'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Loader2, AlertTriangle, Users, BookOpen, Calendar, Star,
  X, Clock, UserCog,
} from 'lucide-react';
import {
  fetchMentors, fetchMySessions, requestMentorSession, registerAsMentor,
  type MentorProfileItem, type MentorSessionItem,
} from '@/lib/api';

type Tab = 'find' | 'sessions';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  confirmed: 'bg-green-50 text-green-700 border-green-200',
  completed: 'bg-blue-50 text-blue-700 border-blue-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function MemberMentorshipPage() {
  const [tab, setTab] = useState<Tab>('find');
  const [mentors, setMentors] = useState<MentorProfileItem[]>([]);
  const [sessions, setSessions] = useState<MentorSessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestModal, setRequestModal] = useState<MentorProfileItem | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ms, ss] = await Promise.all([fetchMentors(), fetchMySessions()]);
      setMentors(ms);
      setSessions(ss);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load mentorship data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="flex flex-1 flex-col p-4 md:p-8 overflow-x-hidden">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap gap-2 text-sm text-slate-500 mb-4">
        <Link href="/dashboard/member" className="hover:text-primary transition-colors font-medium">Home</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Mentorship</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">Mentorship Program</h1>
        <p className="text-slate-500 text-sm">Connect with experienced seniors and grow your expertise.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-lg w-fit mb-6">
        {([
          { value: 'find', label: 'Find a Mentor', icon: Users },
          { value: 'sessions', label: 'My Sessions', icon: Calendar },
        ] as const).map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              tab === value ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-slate-500 py-16 justify-center">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading…
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm mb-6">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {!loading && !error && tab === 'find' && (
        <>
          {mentors.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-slate-400 gap-3">
              <Users className="w-10 h-10 opacity-30" />
              <p className="text-sm">No mentors available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {mentors.map((mentor) => (
                <div key={mentor.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-sm font-black text-primary">
                      {mentor.user.fullName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{mentor.user.fullName}</h3>
                      <div className="flex items-center gap-1 text-xs text-amber-500">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-slate-500">Mentor</span>
                      </div>
                    </div>
                  </div>

                  {mentor.bio && (
                    <p className="text-sm text-slate-500 line-clamp-2">{mentor.bio}</p>
                  )}

                  {mentor.expertise.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {mentor.expertise.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-primary/5 text-primary border border-primary/20 font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setRequestModal(mentor)}
                    className="mt-auto flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition"
                  >
                    <BookOpen className="w-4 h-4" /> Request Session
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {!loading && !error && tab === 'sessions' && (
        <>
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-slate-400 gap-3">
              <Calendar className="w-10 h-10 opacity-30" />
              <p className="text-sm">No sessions yet. Find a mentor to get started!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {sessions.map((session) => (
                <div key={session.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-semibold capitalize ${STATUS_STYLES[session.status] ?? 'bg-slate-100 text-slate-600'}`}>
                      {session.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">{session.topic}</h3>
                  <div className="flex flex-wrap gap-4 text-xs text-slate-500 mt-2">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      Mentor: <strong className="text-slate-700">{session.mentor.user.fullName}</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDateTime(session.scheduledAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Become a Mentor Section */}
      {!loading && !error && (
        <BecomeMentorSection onRegistered={load} />
      )}

      {requestModal && (
        <RequestSessionModal
          mentor={requestModal}
          onClose={() => setRequestModal(null)}
          onCreated={() => { setRequestModal(null); load(); }}
        />
      )}
    </div>
  );
}

function BecomeMentorSection({ onRegistered }: { onRegistered: () => void }) {
  const [expertise, setExpertise] = useState('');
  const [bio, setBio] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const tags = expertise.split(',').map((t) => t.trim()).filter(Boolean);
    if (tags.length === 0) { setErr('Please add at least one area of expertise'); return; }
    setSubmitting(true);
    setErr(null);
    try {
      await registerAsMentor({ expertise: tags, bio });
      setSuccess(true);
      onRegistered();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Failed to register');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-10 bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <UserCog className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-bold text-slate-900">Become a Mentor</h2>
          <p className="text-sm text-slate-500">Share your knowledge and guide fellow students.</p>
        </div>
      </div>
      {success ? (
        <div className="text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm">
          Successfully registered as a mentor!
        </div>
      ) : (
        <form onSubmit={handleRegister} className="flex flex-col gap-4 max-w-xl">
          {err && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {err}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Areas of Expertise</label>
            <input
              type="text"
              value={expertise}
              onChange={(e) => setExpertise(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary transition"
              placeholder="e.g. Power Systems, MATLAB, IoT (comma-separated)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
              placeholder="Tell mentees about yourself and your experience…"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Register as Mentor
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function RequestSessionModal({
  mentor, onClose, onCreated,
}: {
  mentor: MentorProfileItem;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [topic, setTopic] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErr(null);
    try {
      await requestMentorSession({ mentorId: mentor.id, topic, scheduledAt });
      onCreated();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Failed to request session');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Request Session</h2>
            <p className="text-sm text-slate-500">with {mentor.user.fullName}</p>
          </div>
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Topic</label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary transition"
              placeholder="What do you want to discuss?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Date & Time</label>
            <input
              type="datetime-local"
              required
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary transition"
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
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
