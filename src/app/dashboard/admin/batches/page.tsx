'use client';

import { useEffect, useState } from 'react';
import { fetchBatches, createBatch, assignBatchCR, fetchUsers, type BatchItem, type UserListItem } from '@/lib/api';
import { Loader2, Plus, Users, ShieldCheck, Search } from 'lucide-react';

export default function AdminBatchesPage() {
  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBatchName, setNewBatchName] = useState('');
  const [creating, setCreating] = useState(false);

  // For assigning CR modal
  const [selectedBatch, setSelectedBatch] = useState<BatchItem | null>(null);
  const [students, setStudents] = useState<UserListItem[]>([]);
  const [search, setSearch] = useState('');
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    try {
      const data = await fetchBatches();
      setBatches(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBatch = async () => {
    if (!newBatchName.trim()) return;
    setCreating(true);
    try {
      await createBatch(newBatchName);
      setNewBatchName('');
      loadBatches();
    } catch (e) {
      console.error(e);
      alert('Failed to create batch');
    } finally {
      setCreating(false);
    }
  };

  const handleOpenAssignModal = async (batch: BatchItem) => {
    setSelectedBatch(batch);
    setLoadingStudents(true);
    try {
      // Fetch all students in this batch
      const data = await fetchUsers({ batch: batch.name });
      setStudents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleAssignCR = async (userId: string | null) => {
    if (!selectedBatch) return;
    try {
      await assignBatchCR(selectedBatch.id, userId);
      setSelectedBatch(null);
      loadBatches();
    } catch (e) {
      console.error(e);
      alert('Failed to assign CR');
    }
  };

  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(search.toLowerCase()) || 
    s.registrationNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Batch Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage batches and assign Class Representatives</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-end gap-4 max-w-xl">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">New Batch Name</label>
          <input 
            type="text" 
            placeholder="e.g. 2020-21" 
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={newBatchName}
            onChange={(e) => setNewBatchName(e.target.value)}
          />
        </div>
        <button 
          onClick={handleCreateBatch}
          disabled={creating || !newBatchName.trim()}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Create Batch
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Batch Name</th>
              <th className="px-6 py-4">Current CR</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  Loading...
                </td>
              </tr>
            ) : batches.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                  No batches found.
                </td>
              </tr>
            ) : (
              batches.map(batch => (
                <tr key={batch.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{batch.name}</td>
                  <td className="px-6 py-4">
                    {batch.cr ? (
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        <div>
                          <div className="text-slate-900 font-medium">{batch.cr.fullName}</div>
                          <div className="text-slate-500 text-xs">{batch.cr.registrationNumber}</div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">None assigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleOpenAssignModal(batch)}
                      className="text-primary font-medium hover:underline text-sm"
                    >
                      {batch.cr ? 'Change CR' : 'Assign CR'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-900">Assign CR for {selectedBatch.name}</h3>
              <button onClick={() => setSelectedBatch(null)} className="text-slate-400 hover:text-slate-600">×</button>
            </div>
            
            <div className="p-4 border-b border-slate-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search students..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            <div className="p-4 overflow-y-auto flex-1 bg-slate-50">
              {loadingStudents ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="text-center text-slate-500 py-8">No students found in this batch.</div>
              ) : (
                <div className="space-y-2">
                  {selectedBatch.cr && (
                    <button 
                      onClick={() => handleAssignCR(null)}
                      className="w-full text-left p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 font-medium hover:bg-red-100 transition-colors"
                    >
                      Remove Current CR
                    </button>
                  )}
                  {filteredStudents.map(student => (
                    <div key={student.id} className={`flex items-center justify-between p-3 rounded-lg border ${student.id === selectedBatch.cr?.id ? 'border-primary bg-blue-50' : 'border-slate-200 bg-white hover:border-primary/30'} transition-colors`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{student.fullName}</div>
                          <div className="text-xs text-slate-500">{student.registrationNumber}</div>
                        </div>
                      </div>
                      {student.id !== selectedBatch.cr?.id && (
                        <button 
                          onClick={() => handleAssignCR(student.id)}
                          className="px-3 py-1.5 text-xs font-medium text-primary bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          Make CR
                        </button>
                      )}
                      {student.id === selectedBatch.cr?.id && (
                        <span className="px-3 py-1.5 text-xs font-bold text-white bg-primary rounded-lg">Current CR</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-slate-200 flex justify-end">
              <button 
                onClick={() => setSelectedBatch(null)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
