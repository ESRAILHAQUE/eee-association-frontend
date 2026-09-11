'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  BookOpen, FileText, Link as LinkIcon, Download,
  X, AlertCircle, Loader2, Trash2, Globe, Users, Plus, CheckCircle
} from 'lucide-react';
import {
  fetchResources, uploadResource,
  fetchBatches, type ResourceItem, type BatchItem
} from '@/lib/api';

function ResourceCard({ res, onDelete }: { res: ResourceItem; onDelete: (id: string) => void }) {
  const icon =
    res.fileType === 'link' ? <LinkIcon className="w-4 h-4" /> :
    res.fileType === 'lab' ? <BookOpen className="w-4 h-4" /> :
    <FileText className="w-4 h-4" />;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col gap-3 hover:border-primary/60 hover:shadow-sm transition-all">
      <div className="flex items-start gap-3">
        <div className="mt-1 rounded-lg bg-blue-50 text-primary p-2">{icon}</div>
        <div className="space-y-1 flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-slate-900 truncate">{res.title}</h2>
          <p className="text-xs text-slate-500">
            {res.fileType.toUpperCase()} · Semester {res.semester ?? '—'} · {res.downloads} downloads
          </p>
          {res.description && <p className="text-xs text-slate-400 line-clamp-2">{res.description}</p>}
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${res.batch ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>
            {res.batch ? <><Users className="w-3 h-3" />Batch {res.batch}</> : <><Globe className="w-3 h-3" />All Students</>}
          </span>
        </div>
        <button
          onClick={() => onDelete(res.id)}
          className="shrink-0 text-slate-400 hover:text-red-500 transition-colors p-1 rounded"
          title="Delete resource"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 truncate max-w-[140px]">
          {res.subject}
        </span>
        <a
          href={res.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Download className="w-3 h-3" />
          <span>{res.fileType === 'link' ? 'Open link' : 'Download'}</span>
        </a>
      </div>
    </article>
  );
}

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    title: '', subject: '', fileUrl: '', fileType: 'pdf',
    semester: '', description: '', shareTarget: 'all', batch: ''
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [data, batchData] = await Promise.all([fetchResources(), fetchBatches()]);
      setResources(data);
      setBatches(batchData);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load resources');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.subject || !form.fileUrl) return;
    if (form.shareTarget === 'batch' && !form.batch) {
      setError('Please select a batch to share with.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const created = await uploadResource({
        title: form.title,
        subject: form.subject,
        fileUrl: form.fileUrl,
        fileType: form.fileType,
        description: form.description || undefined,
        semester: form.semester ? parseInt(form.semester, 10) : undefined,
        batch: form.shareTarget === 'batch' ? form.batch : undefined,
      });
      setResources((prev) => [created, ...prev]);
      setSuccess('Resource shared successfully!');
      setShowForm(false);
      setForm({ title: '', subject: '', fileUrl: '', fileType: 'pdf', semester: '', description: '', shareTarget: 'all', batch: '' });
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to upload resource');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    setResources((prev) => prev.filter((r) => r.id !== id));
  }

  const allResources = resources.filter((r) => !r.batch);
  const batchResources = resources.filter((r) => r.batch);

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">Resources</h1>
          <p className="text-slate-500 max-w-2xl">
            Share study materials and documents with all students or a specific batch.
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Share Resource
        </button>
      </header>

      {success && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          <CheckCircle className="w-4 h-4 shrink-0" />
          {success}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-primary/20 bg-blue-50/50 p-5 space-y-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-semibold text-slate-800">Share a Resource</h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-700"><X className="w-4 h-4" /></button>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, shareTarget: 'all', batch: '' })}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-all ${form.shareTarget === 'all' ? 'border-primary bg-primary text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-primary/50'}`}
            >
              <Globe className="w-4 h-4" />
              All Students
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, shareTarget: 'batch' })}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-all ${form.shareTarget === 'batch' ? 'border-primary bg-primary text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-primary/50'}`}
            >
              <Users className="w-4 h-4" />
              Specific Batch
            </button>
          </div>

          {form.shareTarget === 'batch' && (
            <select
              required
              value={form.batch}
              onChange={(e) => setForm({ ...form, batch: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white"
            >
              <option value="">-- Select Batch --</option>
              {batches.map((b) => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input required placeholder="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white" />
            <input required placeholder="Subject *" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white" />
            <input required placeholder="File URL or Link *" value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white col-span-full" />
            <select value={form.fileType} onChange={(e) => setForm({ ...form, fileType: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white">
              <option value="pdf">PDF</option>
              <option value="link">External Link</option>
              <option value="doc">Word Document</option>
              <option value="image">Image</option>
              <option value="lab">Lab Manual</option>
              <option value="other">Other</option>
            </select>
            <input type="number" min="1" max="8" placeholder="Semester (1–8)" value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white" />
            <textarea placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white resize-none col-span-full" />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60 transition-colors">
              {submitting && <Loader2 className="w-3 h-3 animate-spin" />}
              {submitting ? 'Sharing…' : 'Share Resource'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">Cancel</button>
          </div>
        </form>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Loading resources…
        </div>
      )}

      {!loading && !error && resources.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
          <BookOpen className="w-10 h-10" />
          <p className="text-sm">No resources shared yet. Click "Share Resource" to get started!</p>
        </div>
      )}

      {!loading && allResources.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-green-600" />
            <h2 className="text-sm font-semibold text-slate-700">Shared with All Students ({allResources.length})</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {allResources.map((res) => <ResourceCard key={res.id} res={res} onDelete={handleDelete} />)}
          </div>
        </section>
      )}

      {!loading && batchResources.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-semibold text-slate-700">Shared with Specific Batches ({batchResources.length})</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {batchResources.map((res) => <ResourceCard key={res.id} res={res} onDelete={handleDelete} />)}
          </div>
        </section>
      )}
    </div>
  );
}
