'use client';

import { Calendar, Flag, Upload, Filter, Plus, User, Check, X } from 'lucide-react';

const statCards = [
  {
    label: 'Pending Proposals',
    value: '5',
    sub: '+2 new today',
    icon: Calendar,
    iconBg: 'bg-blue-50 text-primary',
  },
  {
    label: 'Flagged Posts',
    value: '12',
    sub: 'High priority',
    icon: Flag,
    iconBg: 'bg-rose-50 text-rose-500',
  },
  {
    label: 'Resource Uploads',
    value: '3',
    sub: 'Awaiting check',
    icon: Upload,
    iconBg: 'bg-purple-50 text-purple-600',
  },
];

const tabs = [
  { label: 'Event Proposals', count: 5, active: true },
  { label: 'Resource Moderation', count: 3, active: false },
  { label: 'Forum Reports', count: 12, active: false },
];

const eventProposals = [
  {
    title: 'IEEE Workshop on IoT & Embedded Systems',
    by: 'John Doe (Year 3)',
    time: '2 hours ago',
    excerpt:
      'Proposal for a 2-day hands-on workshop covering Arduino basics and ESP8266 integration. Requesting usage of Lab 304 and budget for refreshments.',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400',
  },
  {
    title: 'Career Talk: The Future of Renewable Energy',
    by: 'Sarah Chen (Year 4)',
    time: '5 hours ago',
    excerpt:
      'Guest lecture featuring Dr. Reynolds from Tesla Energy. Scheduled for next Friday afternoon. Needs main auditorium booking confirmation.',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400',
  },
];

const resourceItem = {
  title: 'Advanced Circuit Theory Notes - Module 4',
  meta: 'Uploaded by Mike Ross • PDF (2.4 MB) • 1 day ago',
};

export default function ModeratorDashboardPage() {
  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Moderator Dashboard</h2>
          <p className="text-slate-500">
            Welcome back. You have <span className="text-primary font-semibold">20 pending items</span> requiring
            your attention today.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-all"
          >
            <Filter className="w-5 h-5" />
            Filter
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium shadow-sm hover:bg-blue-700 transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Announcement
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-start justify-between"
          >
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">{card.label}</p>
              <h3 className="text-3xl font-bold text-slate-900">{card.value}</h3>
              <div className="flex items-center gap-1 mt-2 text-sm font-medium">
                {card.label === 'Pending Proposals' && (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <span>↗</span> {card.sub}
                  </span>
                )}
                {card.label === 'Flagged Posts' && (
                  <span className="text-rose-500 flex items-center gap-1">{card.sub}</span>
                )}
                {card.label === 'Resource Uploads' && <span className="text-slate-500">{card.sub}</span>}
              </div>
            </div>
            <div className={`p-3 rounded-lg ${card.iconBg}`}>
              <card.icon className="w-8 h-8" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm min-h-[600px] flex flex-col">
        <div className="border-b border-slate-200 px-6 pt-2">
          <div className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                type="button"
                className={`relative pb-4 pt-4 text-sm font-medium border-b-[3px] transition-colors ${
                  tab.active
                    ? 'text-primary border-primary'
                    : 'text-slate-500 border-transparent hover:text-slate-800'
                }`}
              >
                {tab.label}
                <span
                  className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                    tab.active
                      ? 'bg-blue-100 text-primary'
                      : tab.label === 'Forum Reports'
                        ? 'bg-rose-100 text-rose-600'
                        : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 flex flex-col gap-4">
          {eventProposals.map((proposal) => (
            <div
              key={proposal.title}
              className="flex flex-col md:flex-row gap-6 p-4 rounded-lg border border-slate-200 bg-white hover:shadow-md transition-shadow"
            >
              <div
                className="w-full md:w-48 h-32 md:h-auto rounded-lg bg-cover bg-center shrink-0"
                style={{ backgroundImage: `url(${proposal.image})` }}
              />
              <div className="flex flex-col justify-between flex-1 gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 mb-2">
                    Awaiting Review
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">
                    {proposal.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                    <User className="w-4 h-4" />
                    <span>Submitted by: {proposal.by}</span>
                    <span className="text-slate-300">•</span>
                    <span>{proposal.time}</span>
                  </div>
                  <p className="mt-3 text-slate-600 text-sm line-clamp-2">
                    {proposal.excerpt}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                  <button type="button" className="text-primary text-sm font-medium hover:underline">
                    View Full Proposal
                  </button>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-lg border border-slate-200 bg-slate-50">
            <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-purple-100 text-purple-600 shrink-0">
              <Upload className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-slate-900 truncate">
                {resourceItem.title}
              </h3>
              <p className="text-sm text-slate-500 mt-1">{resourceItem.meta}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                className="p-2 rounded-lg hover:bg-slate-200 text-slate-600"
                title="Preview"
              >
                👁
              </button>
              <button
                type="button"
                className="p-2 rounded-lg hover:bg-emerald-100 text-emerald-600"
                title="Approve"
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="p-2 rounded-lg hover:bg-rose-100 text-rose-600"
                title="Reject"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-auto p-4 border-t border-slate-200 flex justify-center">
          <button
            type="button"
            className="text-sm text-slate-500 hover:text-primary font-medium flex items-center gap-1"
          >
            Load more tasks <span>▼</span>
          </button>
        </div>
      </div>
    </div>
  );
}
