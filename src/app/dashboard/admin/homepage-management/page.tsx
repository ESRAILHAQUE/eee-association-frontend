'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { fetchHomepageSettings, updateHomepageSettings } from '@/lib/api';
import { Loader2, Save, LayoutTemplate } from 'lucide-react';

export default function HomepageManagementPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [heroJson, setHeroJson] = useState('');
  const [achievementsJson, setAchievementsJson] = useState('');
  const [clubsJson, setClubsJson] = useState('');
  const [eventsJson, setEventsJson] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHomepageSettings();
      setHeroJson(JSON.stringify(data.hero || [], null, 2));
      setAchievementsJson(JSON.stringify(data.achievements || [], null, 2));
      setClubsJson(JSON.stringify(data.clubs || [], null, 2));
      setEventsJson(JSON.stringify(data.events || [], null, 2));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        hero: JSON.parse(heroJson),
        achievements: JSON.parse(achievementsJson),
        clubs: JSON.parse(clubsJson),
        events: JSON.parse(eventsJson),
      };
      await updateHomepageSettings(payload);
      setSuccess('Homepage settings updated successfully');
    } catch (e) {
      if (e instanceof SyntaxError) {
        setError('Invalid JSON format in one of the fields');
      } else {
        setError(e instanceof Error ? e.message : 'Failed to save settings');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-x-hidden">
      <nav className="flex flex-wrap gap-2 text-sm text-slate-500 mb-4">
        <Link href="/dashboard/admin" className="hover:text-primary transition-colors font-medium">
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Homepage Management</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-slate-900 text-xl md:text-2xl font-bold flex items-center gap-2">
            <LayoutTemplate className="w-6 h-6 text-primary" />
            Homepage Management
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Manage the content for the landing page sections (Hero, Achievements, Clubs, Events).
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-lg text-sm border border-green-200">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Hero Slides (JSON)</h2>
          <textarea
            value={heroJson}
            onChange={(e) => setHeroJson(e.target.value)}
            rows={10}
            className="w-full font-mono text-sm p-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            placeholder="[{ title: '...', subtitle: '...', description: '...', image: '...', badge: '...' }]"
          />
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Achievements (JSON)</h2>
          <textarea
            value={achievementsJson}
            onChange={(e) => setAchievementsJson(e.target.value)}
            rows={10}
            className="w-full font-mono text-sm p-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            placeholder="[{ title: '...', description: '...', year: '...', category: '...', image: '...' }]"
          />
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Clubs (JSON)</h2>
          <textarea
            value={clubsJson}
            onChange={(e) => setClubsJson(e.target.value)}
            rows={10}
            className="w-full font-mono text-sm p-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            placeholder="[{ name: '...', members: 0, description: '...', activities: ['...'], established: '...', image: '...' }]"
          />
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Events (JSON)</h2>
          <textarea
            value={eventsJson}
            onChange={(e) => setEventsJson(e.target.value)}
            rows={10}
            className="w-full font-mono text-sm p-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            placeholder="[{ title: '...', date: '...', time: '...', location: '...', attendees: 0, status: '...', image: '...', category: '...' }]"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 bg-primary hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold transition disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
