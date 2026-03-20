'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  FileText,
  Upload,
  Trash2,
  X,
  FolderOpen,
  Search,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import {
  fetchDocuments,
  uploadDocument,
  deleteDocument,
  type DocumentItem,
} from '@/lib/api';

const CATEGORIES = ['general', 'academic', 'financial', 'policy', 'meeting', 'other'];
const ACCESS_LEVELS = ['public', 'members', 'admin'];

const CATEGORY_COLORS: Record<string, string> = {
  general: 'bg-slate-100 text-slate-700',
  academic: 'bg-blue-100 text-blue-700',
  financial: 'bg-green-100 text-green-700',
  policy: 'bg-purple-100 text-purple-700',
  meeting: 'bg-orange-100 text-orange-700',
  other: 'bg-pink-100 text-pink-700',
};

interface UploadForm {
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
  category: string;
  accessLevel: string;
}

const defaultForm: UploadForm = {
  title: '',
  description: '',
  fileUrl: '',
  fileType: 'pdf',
  category: 'general',
  accessLevel: 'members',
};

export default function SuperAdminDocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<UploadForm>(defaultForm);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadDocuments = useCallback(() => {
    setLoading(true);
    fetchDocuments(categoryFilter || undefined)
      .then(setDocuments)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [categoryFilter]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const filtered = documents.filter((d) => {
    const matchSearch =
      !search ||
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      (d.description || '').toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  // Group by category
  const grouped = filtered.reduce<Record<string, DocumentItem[]>>((acc, doc) => {
    const cat = doc.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(doc);
    return acc;
  }, {});

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.fileUrl) {
      setUploadError('Title and File URL are required.');
      return;
    }
    setUploading(true);
    setUploadError('');
    try {
      const doc = await uploadDocument({
        title: form.title,
        fileUrl: form.fileUrl,
        fileType: form.fileType,
        category: form.category,
        description: form.description || undefined,
        accessLevel: form.accessLevel,
      });
      setDocuments((prev) => [doc, ...prev]);
      setShowModal(false);
      setForm(defaultForm);
    } catch (err: unknown) {
      setUploadError((err as Error).message);
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this document?')) return;
    setDeletingId(id);
    try {
      await deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch (err: unknown) {
      alert((err as Error).message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="w-full max-w-[1280px] flex flex-col gap-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/dashboard/super-admin" className="hover:text-primary font-medium transition-colors">
          Home
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-900 font-semibold">Documents</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 rounded-xl">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Document Repository
            </h1>
          </div>
          <p className="text-slate-500 max-w-2xl">
            Manage all association documents. Upload, organize, and control access to files.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadDocuments}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => { setShowModal(true); setUploadError(''); }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary rounded-lg text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-md shadow-primary/20"
          >
            <Upload className="w-4 h-4" />
            Upload Document
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2.5 shadow-sm">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 text-slate-900"
          />
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 shadow-sm">
          <FolderOpen className="w-4 h-4 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-transparent text-sm outline-none text-slate-700 py-2.5 pr-2 cursor-pointer"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents grouped by category */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-7 h-7 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No documents found</p>
          <p className="text-sm text-slate-400 mt-1">Upload a document to get started</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {Object.entries(grouped).map(([category, docs]) => (
            <div key={category} className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${CATEGORY_COLORS[category] ?? 'bg-slate-100 text-slate-600'}`}>
                  {category}
                </span>
                <span className="text-xs text-slate-400">{docs.length} file{docs.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {docs.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="p-2.5 bg-blue-50 rounded-lg shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 truncate">{doc.title}</p>
                      {doc.description && (
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{doc.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className="text-xs text-slate-400 uppercase font-mono">{doc.fileType}</span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-400">{doc.accessLevel}</span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-400">
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">By {doc.uploadedBy?.fullName}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-blue-50 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDelete(doc.id)}
                        disabled={deletingId === doc.id}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {deletingId === doc.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Upload Document</h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpload} className="p-6 flex flex-col gap-4">
              {uploadError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  {uploadError}
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Document title"
                  className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Brief description of the document"
                  rows={2}
                  className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none text-slate-900"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">File URL *</label>
                <input
                  type="url"
                  value={form.fileUrl}
                  onChange={(e) => setForm((f) => ({ ...f, fileUrl: e.target.value }))}
                  placeholder="https://..."
                  className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700">File Type</label>
                  <select
                    value={form.fileType}
                    onChange={(e) => setForm((f) => ({ ...f, fileType: e.target.value }))}
                    className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900"
                  >
                    {['pdf', 'docx', 'xlsx', 'pptx', 'image', 'other'].map((t) => (
                      <option key={t} value={t}>{t.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700">Access</label>
                  <select
                    value={form.accessLevel}
                    onChange={(e) => setForm((f) => ({ ...f, accessLevel: e.target.value }))}
                    className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900"
                  >
                    {ACCESS_LEVELS.map((a) => (
                      <option key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-2.5 bg-primary rounded-lg text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" /> Uploading...</>
                  ) : (
                    <><Upload className="w-4 h-4" /> Upload</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
