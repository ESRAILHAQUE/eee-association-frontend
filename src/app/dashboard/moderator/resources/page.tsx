'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Loader2, AlertTriangle, Check, Ban, FileText, Download,
  Filter, BookOpen,
} from 'lucide-react';
import {
  fetchPendingResources, fetchResources, updateResourceStatus,
  type ResourceItem,
} from '@/lib/api';

type TabValue = 'pending' | 'approved' | 'rejected';

const TABS: { label: string; value: TabValue }[] = [
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

export default function ModeratorResourcesPage() {
  const [activeTab, setActiveTab] = useState<TabValue>('pending');
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data: ResourceItem[];
      if (activeTab === 'pending') {
        data = await fetchPendingResources();
      } else {
        const all = await fetchResources();
        data = all.filter((r) => r.status === activeTab);
      }
      setResources(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load resources');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => { load(); }, [load]);

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    setActionLoading((prev) => new Set(prev).add(id));
    try {
      await updateResourceStatus(id, status);
      setResources((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to update status');
    } finally {
      setActionLoading((prev) => { const s = new Set(prev); s.delete(id); return s; });
    }
  };

  const pendingCount = resources.filter((r) => r.status === 'pending').length;

  return (
    <div className="flex flex-1 flex-col p-4 md:p-8 overflow-x-hidden gap-6">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap gap-2 text-sm text-slate-500">
        <Link href="/dashboard/moderator" className="hover:text-primary transition-colors font-medium">Home</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Resources</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">Resource Moderation</h1>
        <p className="text-slate-500 text-sm">Review and approve study resources uploaded by students.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-slate-400 shrink-0" />
        <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`relative px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.value
                  ? 'bg-white shadow-sm text-slate-900'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
              {tab.value === 'pending' && pendingCount > 0 && (
                <span className="ml-1 bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="flex items-center gap-3 text-slate-500 py-16 justify-center">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading resources…
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {!loading && !error && resources.length === 0 && (
        <div className="flex flex-col items-center py-20 text-slate-400 gap-3">
          <BookOpen className="w-10 h-10 opacity-30" />
          <p className="text-sm">No {activeTab} resources.</p>
        </div>
      )}

      {!loading && !error && resources.length > 0 && (
        <div className="flex flex-col gap-4">
          {resources.map((resource) => {
            const busy = actionLoading.has(resource.id);
            return (
              <div key={resource.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${
                        resource.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        resource.status === 'approved' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {resource.status}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                        {resource.fileType}
                      </span>
                      {resource.semester && (
                        <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          Semester {resource.semester}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1">{resource.title}</h3>
                    {resource.description && (
                      <p className="text-sm text-slate-500 mb-2 line-clamp-2">{resource.description}</p>
                    )}
                    <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" /> Subject: <strong className="text-slate-700">{resource.subject}</strong>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Download className="w-3.5 h-3.5" /> {resource.downloads} downloads
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      Uploaded by <span className="font-medium text-slate-600">{resource.uploadedBy.fullName}</span>
                    </p>
                  </div>

                  {activeTab === 'pending' && (
                    <div className="flex sm:flex-col gap-2 sm:self-start">
                      <button
                        type="button"
                        onClick={() => handleAction(resource.id, 'approved')}
                        disabled={busy}
                        className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium hover:bg-green-100 transition disabled:opacity-60"
                      >
                        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAction(resource.id, 'rejected')}
                        disabled={busy}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition disabled:opacity-60"
                      >
                        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
