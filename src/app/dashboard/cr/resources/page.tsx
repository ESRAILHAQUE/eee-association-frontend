'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Loader2, AlertTriangle, BookOpen, Check, X, User,
  FileText, Download,
} from 'lucide-react';
import {
  fetchPendingResources,
  fetchResources,
  updateResourceStatus,
  type ResourceItem,
} from '@/lib/api';

type Tab = 'pending' | 'approved' | 'rejected';

const FILE_TYPE_STYLES: Record<string, string> = {
  pdf: 'bg-red-100 text-red-700 border-red-200',
  doc: 'bg-blue-100 text-blue-700 border-blue-200',
  docx: 'bg-blue-100 text-blue-700 border-blue-200',
  ppt: 'bg-orange-100 text-orange-700 border-orange-200',
  pptx: 'bg-orange-100 text-orange-700 border-orange-200',
  xls: 'bg-green-100 text-green-700 border-green-200',
  xlsx: 'bg-green-100 text-green-700 border-green-200',
};

export default function CRResourcesPage() {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('pending');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [updateErrors, setUpdateErrors] = useState<Record<string, string>>({});

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

  const handleUpdate = async (id: string, status: 'approved' | 'rejected') => {
    setUpdatingId(id);
    setUpdateErrors((prev) => ({ ...prev, [id]: '' }));
    try {
      await updateResourceStatus(id, status);
      await load();
    } catch (e) {
      setUpdateErrors((prev) => ({
        ...prev,
        [id]: e instanceof Error ? e.message : 'Update failed',
      }));
    } finally {
      setUpdatingId(null);
    }
  };

  const tabs: Tab[] = ['pending', 'approved', 'rejected'];

  return (
    <div className="flex flex-1 flex-col p-4 md:p-8 overflow-x-hidden">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap gap-2 text-sm text-slate-500 mb-4">
        <Link href="/dashboard/cr" className="hover:text-primary transition-colors font-medium">
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Resources</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">Resource Management</h1>
        <p className="text-slate-500 text-sm">Approve or reject study resources uploaded by your batch students.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-semibold capitalize transition-all ${
              activeTab === tab
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab === 'pending' ? 'Pending Approval' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-slate-500 py-16 justify-center">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading resources…</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm mb-6">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {!loading && !error && resources.length === 0 && (
        <div className="flex flex-col items-center py-20 text-slate-400 gap-3">
          <BookOpen className="w-12 h-12 opacity-30" />
          <p className="text-sm">No {activeTab} resources.</p>
        </div>
      )}

      {!loading && !error && resources.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((res) => (
            <div key={res.id} className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border uppercase ${FILE_TYPE_STYLES[res.fileType.toLowerCase()] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      {res.fileType}
                    </span>
                    {res.semester && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                        Sem {res.semester}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 truncate">{res.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{res.subject}</p>
                </div>
                <FileText className="w-5 h-5 text-slate-300 shrink-0" />
              </div>

              {res.description && (
                <p className="text-xs text-slate-600 line-clamp-2">{res.description}</p>
              )}

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <User className="w-3.5 h-3.5" />
                {res.uploadedBy.fullName}
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                <a
                  href={res.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  View
                </a>

                {updateErrors[res.id] && (
                  <p className="text-red-600 text-xs ml-auto">{updateErrors[res.id]}</p>
                )}

                {activeTab === 'pending' && (
                  <div className="flex items-center gap-1.5 ml-auto">
                    <button
                      type="button"
                      onClick={() => handleUpdate(res.id, 'approved')}
                      disabled={updatingId === res.id}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-bold transition disabled:opacity-60"
                    >
                      {updatingId === res.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdate(res.id, 'rejected')}
                      disabled={updatingId === res.id}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold transition disabled:opacity-60"
                    >
                      <X className="w-3 h-3" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
