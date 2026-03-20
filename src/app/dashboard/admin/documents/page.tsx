'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Loader2, AlertTriangle, FileText, Plus, X, Download,
  Trash2, ChevronDown, FolderOpen,
} from 'lucide-react';
import {
  fetchDocuments,
  uploadDocument,
  deleteDocument,
  type DocumentItem,
} from '@/lib/api';

const CATEGORIES = [
  { value: 'meeting-minutes', label: 'Meeting Minutes' },
  { value: 'report', label: 'Report' },
  { value: 'form', label: 'Form' },
  { value: 'policy', label: 'Policy' },
  { value: 'other', label: 'Other' },
];

const ACCESS_LEVELS = [
  { value: 'all', label: 'All Students' },
  { value: 'admin', label: 'Admin Only' },
  { value: 'super_admin', label: 'Super Admin Only' },
];

const FILE_TYPES = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'other'];

const CATEGORY_LABELS: Record<string, string> = {
  'meeting-minutes': 'Meeting Minutes',
  report: 'Report',
  form: 'Form',
  policy: 'Policy',
  other: 'Other',
};

const CATEGORY_COLORS: Record<string, string> = {
  'meeting-minutes': 'bg-purple-50 border-purple-200 text-purple-700',
  report: 'bg-blue-50 border-blue-200 text-blue-700',
  form: 'bg-amber-50 border-amber-200 text-amber-700',
  policy: 'bg-red-50 border-red-200 text-red-700',
  other: 'bg-slate-50 border-slate-200 text-slate-700',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    fileUrl: '',
    fileType: 'pdf',
    category: 'meeting-minutes',
    accessLevel: 'all',
  });
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDocuments();
      setDocuments(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.fileUrl.trim()) {
      setFormError('Title and file URL are required');
      return;
    }
    setUploading(true);
    setFormError(null);
    try {
      await uploadDocument({
        title: form.title,
        fileUrl: form.fileUrl,
        fileType: form.fileType,
        category: form.category,
        description: form.description || undefined,
        accessLevel: form.accessLevel,
      });
      setForm({ title: '', description: '', fileUrl: '', fileType: 'pdf', category: 'meeting-minutes', accessLevel: 'all' });
      setShowForm(false);
      await load();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this document?')) return;
    try {
      await deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  // Group documents by category
  const grouped = documents.reduce<Record<string, DocumentItem[]>>((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = [];
    acc[doc.category].push(doc);
    return acc;
  }, {});

  const categoryOrder = ['meeting-minutes', 'report', 'form', 'policy', 'other'];

  return (
    <div className="flex flex-1 flex-col p-4 md:p-8 overflow-x-hidden">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap gap-2 text-sm text-slate-500 mb-4">
        <Link href="/dashboard/admin" className="hover:text-primary transition-colors font-medium">
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Documents</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">Document Repository</h1>
          <p className="text-slate-500 text-sm">Manage and share official association documents.</p>
        </div>
        <button
          type="button"
          onClick={() => { setShowForm(true); setFormError(null); }}
          className="flex items-center gap-2 bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-primary/20 transition-all shrink-0"
        >
          <Plus className="w-5 h-5" /> Upload Document
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-slate-500 py-16 justify-center">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading documents…</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm mb-6">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {!loading && !error && documents.length === 0 && (
        <div className="flex flex-col items-center py-20 text-slate-400 gap-3">
          <FolderOpen className="w-12 h-12 opacity-30" />
          <p className="text-sm">No documents uploaded yet.</p>
        </div>
      )}

      {!loading && !error && documents.length > 0 && (
        <div className="flex flex-col gap-8">
          {categoryOrder.map((cat) => {
            const docs = grouped[cat];
            if (!docs || docs.length === 0) return null;
            return (
              <section key={cat}>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${CATEGORY_COLORS[cat] ?? 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                    <FolderOpen className="w-3.5 h-3.5 mr-1.5" />
                    {CATEGORY_LABELS[cat] ?? cat}
                  </span>
                  <span className="text-xs text-slate-400">{docs.length} document(s)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {docs.map((doc) => (
                    <div key={doc.id} className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-4 flex flex-col gap-2.5">
                      <div className="flex items-start gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                          <FileText className="w-4.5 h-4.5 text-slate-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 text-sm truncate">{doc.title}</h3>
                          {doc.description && (
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{doc.description}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDelete(doc.id)}
                          className="shrink-0 text-slate-300 hover:text-red-500 transition-colors p-0.5 rounded"
                          title="Delete document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5 text-xs">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium uppercase">{doc.fileType}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-500">{doc.accessLevel}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400 mt-auto">
                        <span>{doc.uploadedBy.fullName} · {formatDate(doc.createdAt)}</span>
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:text-blue-700 font-semibold transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Upload Document Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-slate-900">Upload Document</h2>
              </div>
              <button
                type="button"
                onClick={() => { setShowForm(false); setFormError(null); }}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form id="upload-doc-form" onSubmit={handleUpload} className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
              {formError && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {formError}
                </p>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Document title…"
                  className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description <span className="text-slate-400 font-normal">(optional)</span></label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Brief description…"
                  className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">File URL</label>
                <input
                  type="url"
                  value={form.fileUrl}
                  onChange={(e) => setForm((f) => ({ ...f, fileUrl: e.target.value }))}
                  placeholder="https://…"
                  className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                <p className="text-xs text-slate-400 mt-1">Paste the direct URL to the file.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">File Type</label>
                  <div className="relative">
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <select
                      value={form.fileType}
                      onChange={(e) => setForm((f) => ({ ...f, fileType: e.target.value }))}
                      className="w-full appearance-none px-3 py-2.5 rounded-lg ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white"
                    >
                      {FILE_TYPES.map((t) => (
                        <option key={t} value={t}>{t.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <div className="relative">
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <select
                      value={form.category}
                      onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                      className="w-full appearance-none px-3 py-2.5 rounded-lg ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Access Level</label>
                <div className="relative">
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <select
                    value={form.accessLevel}
                    onChange={(e) => setForm((f) => ({ ...f, accessLevel: e.target.value }))}
                    className="w-full appearance-none px-3 py-2.5 rounded-lg ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white"
                  >
                    {ACCESS_LEVELS.map((a) => (
                      <option key={a.value} value={a.value}>{a.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </form>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 shrink-0">
              <button
                type="button"
                onClick={() => { setShowForm(false); setFormError(null); }}
                className="px-4 py-2 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 text-sm font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="upload-doc-form"
                disabled={uploading}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-blue-700 transition disabled:opacity-60"
              >
                {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
                {uploading ? 'Uploading…' : 'Upload Document'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
