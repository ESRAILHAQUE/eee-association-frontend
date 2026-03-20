'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Database,
  Download,
  Upload,
  CheckCircle,
  Clock,
  Server,
  HardDrive,
  ExternalLink,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

const BACKUP_KEY = 'eee_last_backup_ts';

interface SystemInfo {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
}

const SYSTEM_INFO: SystemInfo[] = [
  { label: 'Database', value: 'PostgreSQL / Neon', icon: Database, color: 'text-blue-600' },
  { label: 'Backend', value: 'Express / TypeScript', icon: Server, color: 'text-green-600' },
  { label: 'Frontend', value: 'Next.js 15', icon: HardDrive, color: 'text-purple-600' },
  { label: 'Total Tables', value: '15+', icon: Database, color: 'text-orange-600' },
];

type BackupStatus = 'idle' | 'preparing' | 'exporting' | 'compressing' | 'done';

const STATUS_STEPS: { key: BackupStatus; label: string }[] = [
  { key: 'preparing', label: 'Preparing backup...' },
  { key: 'exporting', label: 'Exporting database tables...' },
  { key: 'compressing', label: 'Compressing data...' },
  { key: 'done', label: 'Backup complete!' },
];

export default function BackupPage() {
  const [lastBackup, setLastBackup] = useState<string | null>(null);
  const [backupStatus, setBackupStatus] = useState<BackupStatus>('idle');
  const [restoreTimestamp, setRestoreTimestamp] = useState('');
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem(BACKUP_KEY);
    if (stored) setLastBackup(stored);
  }, []);

  function startBackup() {
    setBackupStatus('preparing');
    setStepIndex(0);

    const delays = [800, 1600, 1200];
    const keys: BackupStatus[] = ['preparing', 'exporting', 'compressing', 'done'];
    function runStep(i: number) {
      setBackupStatus(keys[i]);
      setStepIndex(i);
      if (i < keys.length - 1) {
        setTimeout(() => runStep(i + 1), delays[i] ?? 1000);
      } else {
        const ts = new Date().toISOString();
        localStorage.setItem(BACKUP_KEY, ts);
        setLastBackup(ts);
      }
    }

    runStep(0);
  }

  function resetBackup() {
    setBackupStatus('idle');
    setStepIndex(0);
  }

  const isRunning = backupStatus !== 'idle' && backupStatus !== 'done';

  return (
    <div className="w-full max-w-[1280px] flex flex-col gap-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/dashboard/super-admin" className="hover:text-primary font-medium transition-colors">
          Home
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-900 font-semibold">Backup & Restore</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-100 rounded-xl">
            <HardDrive className="w-6 h-6 text-slate-700" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            System Backup
          </h1>
        </div>
        <p className="text-slate-500 max-w-2xl">
          Create and manage system backups. Actual backup and restore operations are performed
          via the database provider dashboard (Neon).
        </p>
      </div>

      {/* Notice */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <span className="font-semibold">Note:</span> Actual backup and restore operations are
          performed via the{' '}
          <a
            href="https://console.neon.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-semibold hover:text-amber-900"
          >
            Neon Database Console
          </a>
          . The controls below provide UI tracking only.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Backup Card */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Create Backup</h2>
            <p className="text-sm text-slate-500 mt-0.5">Initiate a system backup snapshot</p>
          </div>
          <div className="p-6 flex flex-col gap-6">
            {/* Last Backup Status */}
            <div className={`rounded-xl p-4 border flex items-center gap-4 ${lastBackup ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
              <div className={`p-2.5 rounded-xl ${lastBackup ? 'bg-emerald-100' : 'bg-slate-200'}`}>
                <Clock className={`w-5 h-5 ${lastBackup ? 'text-emerald-700' : 'text-slate-500'}`} />
              </div>
              <div>
                <p className={`text-sm font-semibold ${lastBackup ? 'text-emerald-800' : 'text-slate-700'}`}>
                  {lastBackup ? 'Last Backup Completed' : 'Last Backup: Never'}
                </p>
                {lastBackup && (
                  <p className="text-xs text-emerald-600 mt-0.5">
                    {new Date(lastBackup).toLocaleString()}
                  </p>
                )}
              </div>
              {lastBackup && <CheckCircle className="w-5 h-5 text-emerald-500 ml-auto" />}
            </div>

            {/* Progress Steps */}
            {(isRunning || backupStatus === 'done') && (
              <div className="flex flex-col gap-2">
                {STATUS_STEPS.map((step, i) => {
                  const isActive = i === stepIndex;
                  const isDone = i < stepIndex || backupStatus === 'done';
                  return (
                    <div key={step.key} className={`flex items-center gap-3 p-3 rounded-lg transition-all ${isActive && backupStatus !== 'done' ? 'bg-blue-50 border border-blue-200' : isDone ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                      {isDone ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : isActive ? (
                        <RefreshCw className="w-4 h-4 text-primary animate-spin shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
                      )}
                      <span className={`text-sm font-medium ${isDone ? 'text-emerald-700' : isActive ? 'text-primary' : 'text-slate-400'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {backupStatus === 'idle' && (
                <button
                  type="button"
                  onClick={startBackup}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary hover:bg-blue-700 rounded-xl text-sm font-bold text-white transition-colors shadow-md shadow-primary/20"
                >
                  <Download className="w-4 h-4" />
                  Create Backup
                </button>
              )}
              {backupStatus === 'done' && (
                <button
                  type="button"
                  onClick={resetBackup}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-sm font-bold text-white transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Backup Complete — Reset
                </button>
              )}
              {isRunning && (
                <div className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 rounded-xl text-sm font-bold text-slate-500 cursor-not-allowed">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Backing up...
                </div>
              )}
            </div>

            <a
              href="https://console.neon.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open Neon Console
            </a>
          </div>
        </div>

        {/* Restore Card */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Restore from Backup</h2>
            <p className="text-sm text-slate-500 mt-0.5">Restore system to a previous state</p>
          </div>
          <div className="p-6 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Backup Timestamp</label>
              <input
                type="datetime-local"
                value={restoreTimestamp}
                onChange={(e) => setRestoreTimestamp(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900"
              />
              <p className="text-xs text-slate-400">
                Enter the timestamp of the backup you want to restore
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Or Upload Backup File</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center gap-2 text-center hover:border-primary/40 hover:bg-blue-50/30 transition-all cursor-pointer">
                <Upload className="w-8 h-8 text-slate-300" />
                <p className="text-sm text-slate-500">Drop backup file here or click to browse</p>
                <p className="text-xs text-slate-400">.sql, .dump, .gz accepted</p>
                <input type="file" className="hidden" accept=".sql,.dump,.gz" />
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-800">Caution</p>
                <p className="text-xs text-red-700 mt-0.5">
                  Restoring will overwrite all current data. This action cannot be undone.
                  Perform restore via Neon console for safety.
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled
              className="flex items-center justify-center gap-2 py-3 bg-slate-100 rounded-xl text-sm font-bold text-slate-400 cursor-not-allowed"
            >
              <Upload className="w-4 h-4" />
              Restore (use Neon Console)
            </button>

            <a
              href="https://console.neon.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open Neon Console for Restore
            </a>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">System Information</h2>
          <p className="text-sm text-slate-500 mt-0.5">Current technology stack details</p>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SYSTEM_INFO.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="flex flex-col gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2">
                <Icon className={`w-5 h-5 ${color}`} />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
              </div>
              <p className="text-sm font-bold text-slate-900">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
