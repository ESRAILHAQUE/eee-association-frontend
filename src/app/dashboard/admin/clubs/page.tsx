'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Loader2, AlertTriangle, Users, Plus, X, Trash2,
  Shield,
} from 'lucide-react';
import {
  fetchClubs,
  createClub,
  type ClubItem,
} from '@/lib/api';

export default function AdminClubsPage() {
  const [clubs, setClubs] = useState<ClubItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchClubs();
      setClubs(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load clubs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      setFormError('Name and description are required');
      return;
    }
    setCreating(true);
    setFormError(null);
    try {
      await createClub({ name, description });
      setName('');
      setDescription('');
      setShowForm(false);
      await load();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Failed to create club');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = (id: string, clubName: string) => {
    if (!confirm(`Delete club "${clubName}"? This action cannot be undone.`)) return;
    // UI-only: remove from local state
    setClubs((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="flex flex-1 flex-col p-4 md:p-8 overflow-x-hidden">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap gap-2 text-sm text-slate-500 mb-4">
        <Link href="/dashboard/admin" className="hover:text-primary transition-colors font-medium">
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Clubs</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">Club Management</h1>
          <p className="text-slate-500 text-sm">Create and manage student clubs.</p>
        </div>
        <button
          type="button"
          onClick={() => { setShowForm(true); setFormError(null); }}
          className="flex items-center gap-2 bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-primary/20 transition-all shrink-0"
        >
          <Plus className="w-5 h-5" /> Create Club
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-slate-500 py-16 justify-center">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading clubs…</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm mb-6">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {!loading && !error && clubs.length === 0 && (
        <div className="flex flex-col items-center py-20 text-slate-400 gap-3">
          <Shield className="w-12 h-12 opacity-30" />
          <p className="text-sm">No clubs yet. Create the first one!</p>
        </div>
      )}

      {!loading && !error && clubs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clubs.map((club) => (
            <div key={club.id} className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm shrink-0">
                      {club.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 truncate">{club.name}</h3>
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${club.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {club.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(club.id, club.name)}
                  className="shrink-0 text-slate-300 hover:text-red-500 transition-colors p-1 rounded"
                  title="Delete club"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm text-slate-600 line-clamp-3">{club.description}</p>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-auto pt-2 border-t border-slate-50">
                <Users className="w-3.5 h-3.5" />
                {club._count.members} member(s)
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Club Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-slate-900">Create New Club</h2>
              </div>
              <button
                type="button"
                onClick={() => { setShowForm(false); setFormError(null); }}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 flex flex-col gap-4">
              {formError && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {formError}
                </p>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Club Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Robotics Club"
                  className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the club's purpose and activities…"
                  className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setFormError(null); }}
                  className="px-4 py-2 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-blue-700 transition disabled:opacity-60"
                >
                  {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                  {creating ? 'Creating…' : 'Create Club'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
