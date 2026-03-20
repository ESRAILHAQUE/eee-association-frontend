'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Loader2, AlertTriangle, Users, UserPlus, UserMinus, ShieldCheck,
} from 'lucide-react';
import {
  fetchClubs, fetchMyClubs, joinClub, leaveClub,
  type ClubItem,
} from '@/lib/api';

export default function MemberClubsPage() {
  const [allClubs, setAllClubs] = useState<ClubItem[]>([]);
  const [myClubs, setMyClubs] = useState<ClubItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [all, mine] = await Promise.all([fetchClubs(), fetchMyClubs()]);
      setAllClubs(all);
      setMyClubs(mine);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load clubs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const myClubIds = new Set(myClubs.map((c) => c.id));
  const exploreClubs = allClubs.filter((c) => !myClubIds.has(c.id));

  const handleJoin = async (id: string) => {
    // Optimistic update
    const club = allClubs.find((c) => c.id === id);
    if (!club) return;
    setMyClubs((prev) => [...prev, { ...club, _count: { members: club._count.members + 1 } }]);
    setActionLoading((prev) => new Set(prev).add(id));
    try {
      await joinClub(id);
      await load();
    } catch (e) {
      // Revert
      setMyClubs((prev) => prev.filter((c) => c.id !== id));
      alert(e instanceof Error ? e.message : 'Failed to join club');
    } finally {
      setActionLoading((prev) => { const s = new Set(prev); s.delete(id); return s; });
    }
  };

  const handleLeave = async (id: string) => {
    // Optimistic update
    setMyClubs((prev) => prev.filter((c) => c.id !== id));
    setActionLoading((prev) => new Set(prev).add(id));
    try {
      await leaveClub(id);
      await load();
    } catch (e) {
      // Revert
      await load();
      alert(e instanceof Error ? e.message : 'Failed to leave club');
    } finally {
      setActionLoading((prev) => { const s = new Set(prev); s.delete(id); return s; });
    }
  };

  return (
    <div className="flex flex-1 flex-col p-4 md:p-8 overflow-x-hidden">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap gap-2 text-sm text-slate-500 mb-4">
        <Link href="/dashboard/member" className="hover:text-primary transition-colors font-medium">Home</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Clubs</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">Student Clubs</h1>
        <p className="text-slate-500 text-sm">Join clubs, collaborate with peers, and grow your skills.</p>
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-slate-500 py-16 justify-center">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading clubs…
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm mb-6">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* My Clubs */}
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <h2 className="text-base font-bold text-slate-900">My Clubs</h2>
              <span className="ml-auto text-xs text-slate-400">{myClubs.length} joined</span>
            </div>
            {myClubs.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-slate-400 gap-3 bg-white rounded-xl border border-slate-100">
                <Users className="w-8 h-8 opacity-30" />
                <p className="text-sm">You haven&apos;t joined any clubs yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myClubs.map((club) => (
                  <ClubCard
                    key={club.id}
                    club={club}
                    isMember
                    busy={actionLoading.has(club.id)}
                    onAction={() => handleLeave(club.id)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Explore Clubs */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-slate-500" />
              <h2 className="text-base font-bold text-slate-900">Explore Clubs</h2>
              <span className="ml-auto text-xs text-slate-400">{exploreClubs.length} available</span>
            </div>
            {exploreClubs.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-slate-400 gap-3 bg-white rounded-xl border border-slate-100">
                <Users className="w-8 h-8 opacity-30" />
                <p className="text-sm">You&apos;re a member of all available clubs!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {exploreClubs.map((club) => (
                  <ClubCard
                    key={club.id}
                    club={club}
                    isMember={false}
                    busy={actionLoading.has(club.id)}
                    onAction={() => handleJoin(club.id)}
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

function ClubCard({
  club, isMember, busy, onAction,
}: {
  club: ClubItem;
  isMember: boolean;
  busy: boolean;
  onAction: () => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
          <Users className="w-5 h-5 text-primary" />
        </div>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${club.isActive ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
          {club.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-slate-900 mb-1">{club.name}</h3>
        <p className="text-sm text-slate-500 line-clamp-2">{club.description}</p>
      </div>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          <Users className="w-3.5 h-3.5" /> {club._count.members} members
        </span>
        <button
          type="button"
          onClick={onAction}
          disabled={busy}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition disabled:opacity-60 ${
            isMember
              ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
              : 'bg-primary text-white hover:opacity-90'
          }`}
        >
          {busy ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : isMember ? (
            <><UserMinus className="w-3.5 h-3.5" /> Leave</>
          ) : (
            <><UserPlus className="w-3.5 h-3.5" /> Join</>
          )}
        </button>
      </div>
    </div>
  );
}
