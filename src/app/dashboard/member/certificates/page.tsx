'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Loader2, AlertTriangle, Award, Download, Calendar, User,
} from 'lucide-react';
import { fetchMyCertificates, type CertificateItem } from '@/lib/api';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function MemberCertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMyCertificates();
      setCertificates(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load certificates');
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
        <span className="text-slate-900 font-semibold">Certificates</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">My Certificates</h1>
        <p className="text-slate-500 text-sm">Certificates earned from events and workshops.</p>
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-slate-500 py-16 justify-center">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading certificates…
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm mb-6">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {!loading && !error && certificates.length === 0 && (
        <div className="flex flex-col items-center py-20 text-slate-400 gap-4">
          <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center">
            <Award className="w-10 h-10 text-amber-300" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-slate-600 mb-1">No certificates yet</p>
            <p className="text-sm">Participate in events to earn certificates!</p>
          </div>
        </div>
      )}

      {!loading && !error && certificates.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <CertificateCard key={cert.id} cert={cert} />
          ))}
        </div>
      )}
    </div>
  );
}

function CertificateCard({ cert }: { cert: CertificateItem }) {
  return (
    <div className="relative bg-white rounded-2xl shadow-md overflow-hidden border border-amber-100 hover:shadow-lg transition-shadow">
      {/* Gold header strip */}
      <div className="h-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500" />

      {/* Top decoration */}
      <div className="absolute top-2 left-0 right-0 flex justify-center">
        <div className="w-12 h-12 rounded-full bg-amber-50 border-4 border-white shadow flex items-center justify-center mt-2">
          <Award className="w-6 h-6 text-amber-500" />
        </div>
      </div>

      <div className="pt-16 px-6 pb-6 flex flex-col gap-3 text-center">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-1">Certificate of Participation</p>
          <h3 className="font-black text-slate-900 text-base leading-snug">{cert.event.title}</h3>
        </div>

        {/* Decorative divider */}
        <div className="flex items-center gap-2 my-1">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-200" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-200" />
        </div>

        <div className="flex flex-col gap-2 text-sm text-slate-600">
          <div className="flex items-center justify-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs">Issued: <strong>{formatDate(cert.issuedAt)}</strong></span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <User className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs">By: <strong>{cert.issuedBy.fullName}</strong></span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => alert('Download feature coming soon!')}
          className="mt-2 flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition shadow-sm"
        >
          <Download className="w-4 h-4" />
          Download Certificate
        </button>
      </div>
    </div>
  );
}
