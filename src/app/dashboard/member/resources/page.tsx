'use client';

import { BookOpen, FileText, Link as LinkIcon, Download } from 'lucide-react';

const resources = [
  {
    title: 'Power Systems — Question Bank',
    type: 'PDF',
    size: '2.4 MB',
    tag: 'Exam prep',
  },
  {
    title: 'Digital Electronics Lab Manual',
    type: 'PDF',
    size: '1.1 MB',
    tag: 'Lab',
  },
  {
    title: 'IEEE Paper Writing Guide',
    type: 'Link',
    size: 'External',
    tag: 'Research',
  },
  {
    title: 'Semester Routine (Spring 2024)',
    type: 'PDF',
    size: '650 KB',
    tag: 'Routine',
  },
];

export default function MemberResourcesPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
          Resources
        </h1>
        <p className="text-slate-500 max-w-2xl">
          Curated study materials, question banks, important links and official documents shared by the association.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {resources.map((res) => (
          <article
            key={res.title}
            className="rounded-xl border border-slate-200 bg-surface p-4 flex flex-col gap-3 hover:border-primary/60 hover:shadow-sm transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-lg bg-blue-50 text-primary p-2">
                {res.type === 'Link' ? (
                  <LinkIcon className="w-4 h-4" />
                ) : res.tag === 'Lab' ? (
                  <BookOpen className="w-4 h-4" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
              </div>
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-slate-900">{res.title}</h2>
                <p className="text-xs text-slate-500">
                  {res.type} · {res.size}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                {res.tag}
              </span>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <Download className="w-3 h-3" />
                <span>{res.type === 'Link' ? 'Open link' : 'Download'}</span>
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

