'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Mail, Download, UserPlus, Phone, Eye, Pencil } from 'lucide-react';

const filterChips = [{ label: "Batch: '21", removable: true }];

const students = [
  { name: 'John Doe', reg: '2019-EEE-045', id: '1902045', batch: "Batch '19", year: '4th Year', phone: '+880 1700-000000', email: 'john.doe@uni.edu' },
  { name: 'Jane Smith', reg: '2020-EEE-012', id: '2002012', batch: "Batch '20", year: '3rd Year', phone: '+880 1711-111111', email: 'jane.smith@uni.edu' },
  { name: 'Alex Johnson', reg: '2021-EEE-033', id: '2102033', batch: "Batch '21", year: '2nd Year', phone: '+880 1722-222222', email: 'alex.j@uni.edu' },
];

export default function CRStudentsPage() {
  const [searchName, setSearchName] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  return (
    <div className="flex flex-col w-full max-w-[1280px] gap-6">
      <nav className="flex items-center text-sm font-medium text-slate-500">
        <Link href="/dashboard/cr" className="hover:text-primary transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900">Student Directory</span>
      </nav>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="flex flex-col gap-2 max-w-2xl">
          <h1 className="text-slate-900 text-3xl md:text-4xl font-black leading-tight tracking-tight">Student Directory</h1>
          <p className="text-slate-500 text-base">Manage and view all registered students in the EEE department. Search by ID, filter by batch, or export records.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button type="button" className="flex-1 md:flex-none h-10 px-4 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"><Download className="w-5 h-5" />Export</button>
          <button type="button" className="flex-1 md:flex-none h-10 px-4 rounded-lg bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30 flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"><UserPlus className="w-5 h-5" />Add Student</button>
        </div>
      </div>
      <div className="flex flex-col xl:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Search by Name or Student ID" value={searchName} onChange={(e) => setSearchName(e.target.value)} className="w-full h-11 pl-10 pr-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
          </div>
          <div className="relative flex-1 md:max-w-xs">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Search by Email" value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)} className="w-full h-11 pl-10 pr-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
          </div>
        </div>
        <div className="hidden xl:block w-px bg-slate-200 my-1" />
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:block">Filter by:</span>
          <button type="button" className="flex h-9 items-center gap-2 rounded-lg bg-slate-100 px-3 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors">Batch <span>▼</span></button>
          <button type="button" className="flex h-9 items-center gap-2 rounded-lg bg-slate-100 px-3 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors">Year <span>▼</span></button>
        </div>
      </div>
      {filterChips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filterChips.map((chip) => (
            <span key={chip.label} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
              {chip.label}<button type="button" className="hover:bg-primary/20 rounded-full p-0.5">×</button>
            </span>
          ))}
          <button type="button" className="text-xs text-slate-500 hover:text-primary underline px-2">Clear all</button>
        </div>
      )}
      <div className="w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4 w-[60px]"><input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary/50 bg-transparent" /></th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">ID No.</th>
                <th className="px-6 py-4">Batch/Year</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student) => (
                <tr key={student.reg} className="group hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4"><input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary/50 bg-transparent" /></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-slate-200 shrink-0" />
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{student.name}</p>
                        <p className="text-xs text-slate-500">Reg: {student.reg}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{student.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="inline-flex w-fit items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">{student.batch}</span>
                      <span className="text-xs text-slate-500">{student.year}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="flex items-center gap-2 text-slate-600"><Phone className="w-4 h-4 text-slate-400" />{student.phone}</div>
                      <a href={`mailto:${student.email}`} className="flex items-center gap-2 text-primary hover:underline"><Mail className="w-4 h-4 text-primary/70" />{student.email}</a>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button type="button" className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors" title="View Profile"><Eye className="w-5 h-5" /></button>
                      <button type="button" className="p-2 rounded-lg text-slate-400 hover:text-green-600 hover:bg-green-50 transition-colors" title="Edit"><Pencil className="w-5 h-5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
