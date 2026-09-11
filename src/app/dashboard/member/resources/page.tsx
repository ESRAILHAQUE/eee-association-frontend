'use client';

import { useEffect, useState } from 'react';
import { BookOpen, FileText, Link as LinkIcon, Download, Upload, X, AlertCircle, Loader2 } from 'lucide-react';
import { fetchResources, uploadResource, getStoredUser } from '@/lib/api';
import type { ResourceItem, AuthUser } from '@/lib/api';

function ResourceCard({ res }: { res: ResourceItem }) {
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
        </div>
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

export default function MemberResourcesPage() {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: '', subject: '', fileUrl: '', fileType: 'pdf', semester: '', description: '', batch: '' });
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
    fetchResources()
      .then(setResources)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.subject || !form.fileUrl) return;
    setSubmitting(true);
    try {
      const created = await uploadResource({
        title: form.title,
        subject: form.subject,
        fileUrl: form.fileUrl,
        fileType: form.fileType,
        description: form.description || undefined,
        semester: form.semester ? parseInt(form.semester, 10) : undefined,
        batch: form.batch || undefined,
      });
      setResources((prev) => [created, ...prev]);
      setShowForm(false);
      setForm({ title: '', subject: '', fileUrl: '', fileType: 'pdf', semester: '', description: '', batch: '' });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to upload resource');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">Resources</h1>
          <p className="text-slate-500 max-w-2xl">
            Curated study materials, question banks, important links and official documents shared by the association.
          </p>
        </div>
        {(user?.currentRole === 'admin' || user?.currentRole === 'super_admin' || user?.currentRole === 'cr') && (
          <button
            onClick={() => setShowForm((v) => !v)}
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Submit Resource
          </button>
        )}
      </header>

      {/* Upload Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-primary/20 bg-blue-50/50 p-5 space-y-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-semibold text-slate-800">Submit a Resource</h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-700"><X className="w-4 h-4" /></button>
          </div>
          <p className="text-xs text-slate-500">Your submission will be reviewed by a moderator before appearing publicly.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input required placeholder="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white" />
            <input required placeholder="Subject *" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white" />
            <input required placeholder="File URL or Link *" value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white col-span-full" />
            <select value={form.fileType} onChange={(e) => setForm({ ...form, fileType: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white">
              <option value="pdf">PDF</option>
              <option value="link">External Link</option>
              <option value="doc">Word Document</option>
              <option value="image">Image</option>
              <option value="other">Other</option>
            </select>
            <input type="number" min="1" max="8" placeholder="Semester (1–8)" value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white" />
            <input type="text" placeholder="Target Batch (e.g. 2020-21) - Optional" value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white" />
            <textarea placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white resize-none col-span-full" />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60 transition-colors">
              {submitting && <Loader2 className="w-3 h-3 animate-spin" />}
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">Cancel</button>
          </div>
        </form>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Loading resources…
        </div>
      )}

      {/* Empty */}
      {!loading && !error && resources.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
          <BookOpen className="w-10 h-10" />
          <p className="text-sm">No approved resources yet. Be the first to submit one!</p>
        </div>
      )}

      {/* Resources grid */}
      {!loading && resources.length > 0 && (
        <section className="grid gap-4 md:grid-cols-2">
          {resources.map((res) => <ResourceCard key={res.id} res={res} />)}
        </section>
      )}
    </div>
  );
}

