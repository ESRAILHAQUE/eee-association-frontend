'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Loader2, AlertTriangle, Plus, X, Users, ToggleLeft, ToggleRight,
} from 'lucide-react';
import { fetchClubs, createClub, type ClubItem } from '@/lib/api';

export default function ModeratorClubsPage() {
  const [clubs, setClubs] = useState<ClubItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeStates, setActiveStates] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchClubs();
      setClubs(data);
      const states: Record<string, boolean> = {};
      data.forEach((c) => { states[c.id] = c.isActive; });
      setActiveStates(states);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load clubs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleActive = (id: string) => {
    setActiveStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-1 flex-col p-4 md:p-8 overflow-x-hidden gap-6">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap gap-2 text-sm text-slate-500">
        <Link href="/dashboard/moderator" className="hover:text-primary transition-colors font-medium">Home</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Clubs</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">Club Management</h1>
          <p className="text-slate-500 text-sm">Manage all student clubs and their membership.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Club
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
          <p className="text-xs text-slate-500 mb-1">Total Clubs</p>
          <p className="text-2xl font-black text-slate-900">{loading ? '—' : clubs.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
          <p className="text-xs text-slate-500 mb-1">Active Clubs</p>
          <p className="text-2xl font-black text-green-600">{loading ? '—' : Object.values(activeStates).filter(Boolean).length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
          <p className="text-xs text-slate-500 mb-1">Total Members</p>
          <p className="text-2xl font-black text-primary">{loading ? '—' : clubs.reduce((a, c) => a + c._count.members, 0)}</p>
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-slate-500 py-16 justify-center">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading clubs…
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {!loading && !error && clubs.length === 0 && (
        <div className="flex flex-col items-center py-20 text-slate-400 gap-3">
          <Users className="w-10 h-10 opacity-30" />
          <p className="text-sm">No clubs yet. Create the first one!</p>
        </div>
      )}

      {!loading && !error && clubs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {clubs.map((club) => {
            const isActive = activeStates[club.id] ?? club.isActive;
            return (
              <div key={club.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleActive(club.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition ${
                      isActive
                        ? 'bg-green-50 text-green-700 hover:bg-green-100'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                    title={isActive ? 'Click to deactivate' : 'Click to activate'}
                  >
                    {isActive
                      ? <ToggleRight className="w-4 h-4" />
                      : <ToggleLeft className="w-4 h-4" />}
                    {isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 mb-1">{club.name}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2">{club.description}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Users className="w-3.5 h-3.5" /> <strong>{club._count.members}</strong> members
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <CreateClubModal
          onClose={() => setShowModal(false)}
          onCreated={() => { setShowModal(false); load(); }}
        />
      )}
    </div>
  );
}

function CreateClubModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErr(null);
    try {
      await createClub(form);
      onCreated();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Failed to create club');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Create Club</h2>
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Club Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary transition"
              placeholder="e.g. Robotics Club"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
              placeholder="What is this club about?"
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
              Create Club
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
