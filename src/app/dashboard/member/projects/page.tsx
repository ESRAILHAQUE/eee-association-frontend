'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Loader2, AlertTriangle, Plus, X, Github, FileText, Heart,
  Cpu, Trash2, FolderGit2, ExternalLink,
} from 'lucide-react';
import {
  fetchProjects, submitProject, likeProject, deleteProject,
  getStoredUser, type ProjectItem,
} from '@/lib/api';

const CATEGORIES = [
  { value: 'iot', label: 'IoT' },
  { value: 'matlab', label: 'MATLAB' },
  { value: 'power', label: 'Power Systems' },
  { value: 'embedded', label: 'Embedded' },
  { value: 'software', label: 'Software' },
  { value: 'research', label: 'Research' },
  { value: 'other', label: 'Other' },
];

const CAT_COLORS: Record<string, string> = {
  iot: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  matlab: 'bg-orange-50 text-orange-700 border-orange-200',
  power: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  embedded: 'bg-purple-50 text-purple-700 border-purple-200',
  software: 'bg-blue-50 text-blue-700 border-blue-200',
  research: 'bg-green-50 text-green-700 border-green-200',
  other: 'bg-slate-100 text-slate-600',
};

export default function MemberProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<Set<string>>(new Set());

  const currentUser = getStoredUser();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProjects(selectedCategory ? { category: selectedCategory } : undefined);
      setProjects(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => { load(); }, [load]);

  const handleLike = async (id: string) => {
    setActionLoading((prev) => new Set(prev).add(id));
    try {
      await likeProject(id);
      setProjects((prev) => prev.map((p) => p.id === id ? { ...p, likes: p.likes + 1 } : p));
    } catch {/* silent */} finally {
      setActionLoading((prev) => { const s = new Set(prev); s.delete(id); return s; });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    setActionLoading((prev) => new Set(prev).add(id));
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to delete');
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
        <span className="text-slate-900 font-semibold">Projects</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">Project Showcase</h1>
          <p className="text-slate-500 text-sm">Explore and share EEE projects from your community.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition shrink-0"
        >
          <Plus className="w-4 h-4" /> Submit Project
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          type="button"
          onClick={() => setSelectedCategory(undefined)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
            selectedCategory === undefined ? 'bg-primary text-white border-transparent' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
              selectedCategory === cat.value ? 'bg-primary text-white border-transparent' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-slate-500 py-16 justify-center">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading projects…
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm mb-6">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="flex flex-col items-center py-20 text-slate-400 gap-3">
          <FolderGit2 className="w-10 h-10 opacity-30" />
          <p className="text-sm">No projects yet. Be the first to submit!</p>
        </div>
      )}

      {!loading && !error && projects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => {
            const isOwn = currentUser?.id === project.user.id;
            const busy = actionLoading.has(project.id);
            return (
              <div key={project.id} className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="p-5 flex-1">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shrink-0">
                      <Cpu className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium capitalize ${CAT_COLORS[project.category] ?? 'bg-slate-100 text-slate-600'}`}>
                        {CATEGORIES.find((c) => c.value === project.category)?.label ?? project.category}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1.5">{project.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-3 mb-3">{project.abstract}</p>
                  {project.batch && (
                    <span className="text-xs text-slate-400">Batch: <strong>{project.batch}</strong></span>
                  )}
                </div>

                <div className="px-5 py-3 border-t border-slate-50 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                      {project.user.fullName.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-xs text-slate-500 truncate max-w-[100px]">{project.user.fullName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg hover:bg-slate-100 transition text-slate-500">
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {project.docUrl && (
                      <a href={project.docUrl} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg hover:bg-slate-100 transition text-slate-500">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => handleLike(project.id)}
                      disabled={busy}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-500 transition text-xs disabled:opacity-50"
                    >
                      {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Heart className="w-3.5 h-3.5" />}
                      {project.likes}
                    </button>
                    {isOwn && (
                      <button
                        type="button"
                        onClick={() => handleDelete(project.id)}
                        disabled={busy}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <SubmitProjectModal
          onClose={() => setShowModal(false)}
          onCreated={() => { setShowModal(false); load(); }}
        />
      )}
    </div>
  );
}

function SubmitProjectModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({
    title: '', abstract: '', category: 'other', githubUrl: '', docUrl: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErr(null);
    try {
      await submitProject({
        title: form.title,
        abstract: form.abstract,
        category: form.category,
        ...(form.githubUrl ? { githubUrl: form.githubUrl } : {}),
        ...(form.docUrl ? { docUrl: form.docUrl } : {}),
      });
      onCreated();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Failed to submit project');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Submit Project</h2>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 overflow-y-auto">
          {err && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {err}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Project Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary transition"
              placeholder="e.g. Smart Grid Monitoring System"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Abstract</label>
            <textarea
              required
              rows={4}
              value={form.abstract}
              onChange={(e) => setForm({ ...form, abstract: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
              placeholder="Briefly describe your project…"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary transition bg-white"
            >
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              <span className="flex items-center gap-1.5"><Github className="w-3.5 h-3.5" /> GitHub URL <span className="text-slate-400 font-normal">(optional)</span></span>
            </label>
            <input
              type="url"
              value={form.githubUrl}
              onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary transition"
              placeholder="https://github.com/…"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Documentation URL <span className="text-slate-400 font-normal">(optional)</span></span>
            </label>
            <input
              type="url"
              value={form.docUrl}
              onChange={(e) => setForm({ ...form, docUrl: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg ring-1 ring-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary transition"
              placeholder="https://docs.google.com/…"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition">Cancel</button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
