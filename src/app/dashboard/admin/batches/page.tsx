"use client";

import React, { useState, useEffect } from "react";
import { fetchBatches, createBatch, deleteBatch, addBatchCR, removeBatchCR, BatchItem, fetchUsers, UserListItem, bulkAddStudents } from "@/lib/api";
import Papa from "papaparse";

import { Plus, Trash2, Users, Download, Upload, X } from "lucide-react";

export default function AdminBatchesPage() {
  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false);
  const [newBatchName, setNewBatchName] = useState("");

  const [selectedBatch, setSelectedBatch] = useState<BatchItem | null>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  const [batchUsers, setBatchUsers] = useState<UserListItem[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [uploadingCsv, setUploadingCsv] = useState(false);

  const loadBatches = async () => {
    setLoading(true);
    try {
      const data = await fetchBatches();
      setBatches(data);
    } catch (err: any) {
      alert(err.message || "Failed to load batches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBatches();
  }, []);

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatchName.trim()) return;
    try {
      await createBatch(newBatchName.trim());
      alert("Batch created successfully");
      setNewBatchName("");
      setIsAddBatchOpen(false);
      loadBatches();
    } catch (err: any) {
      alert(err.message || "Failed to create batch");
    }
  };

  const handleDeleteBatch = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this batch? This action cannot be undone.")) return;
    try {
      await deleteBatch(id);
      alert("Batch deleted successfully");
      loadBatches();
    } catch (err: any) {
      alert(err.message || "Failed to delete batch");
    }
  };

  const openManageModal = async (batch: BatchItem) => {
    setSelectedBatch(batch);
    setIsManageModalOpen(true);
    await loadBatchUsers(batch.name);
  };

  const loadBatchUsers = async (batchName: string) => {
    setLoadingUsers(true);
    try {
      const users = await fetchUsers({ batch: batchName });
      setBatchUsers(users);
    } catch (err: any) {
      alert("Failed to load students for this batch");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleDownloadSample = () => {
    const csvContent = "fullName,registrationNumber,institutionalEmail,phoneNumber\nJohn Doe,2021331001,john@sec.ac.bd,01700000000";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "student_import_sample.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedBatch) return;

    setUploadingCsv(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const students = results.data.map((row: any) => ({
            fullName: row.fullName,
            registrationNumber: row.registrationNumber,
            institutionalEmail: row.institutionalEmail,
            phoneNumber: row.phoneNumber,
            batch: selectedBatch.name
          }));

          if (!students.length) throw new Error("CSV file is empty or invalid format");

          await bulkAddStudents(students);
          alert(`Successfully imported ${students.length} students`);
          loadBatchUsers(selectedBatch.name);
        } catch (err: any) {
          alert(err.message || "Failed to import students");
        } finally {
          setUploadingCsv(false);
          e.target.value = ""; // Reset file input
        }
      },
      error: (error: any) => {
        alert("Failed to parse CSV file: " + error.message);
        setUploadingCsv(false);
        e.target.value = "";
      }
    });
  };

  const handleAddCR = async (userId: string) => {
    if (!selectedBatch) return;
    try {
      await addBatchCR(selectedBatch.id, userId);
      alert("CR assigned successfully");
      loadBatches();
      // Update local state to reflect new CR immediately to avoid another API call
      setSelectedBatch(prev => prev ? {
        ...prev,
        crs: [...(prev.crs || []), batchUsers.find(u => u.id === userId)! as any]
      } : null);
    } catch (err: any) {
      alert(err.message || "Failed to assign CR");
    }
  };

  const handleRemoveCR = async (crId: string) => {
    if (!selectedBatch) return;
    try {
      await removeBatchCR(selectedBatch.id, crId);
      alert("CR removed successfully");
      loadBatches();
      setSelectedBatch(prev => prev ? {
        ...prev,
        crs: prev.crs.filter(cr => cr.id !== crId)
      } : null);
    } catch (err: any) {
      alert(err.message || "Failed to remove CR");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Batch Management</h1>
        <button
          onClick={() => setIsAddBatchOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Plus size={18} /> Add Batch
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-slate-900"></div></div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {batches.map((batch) => (
            <div key={batch.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-slate-800">{batch.name}</h3>
                <button onClick={() => handleDeleteBatch(batch.id)} className="text-red-500 hover:text-red-700 p-1">
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div className="mb-6 flex-grow">
                <p className="text-sm font-semibold text-slate-500 mb-2">Total Students: {batch.studentCount || 0}</p>
                <p className="text-sm font-semibold text-slate-500 mb-2">Class Representatives ({batch.crs?.length || 0})</p>
                {batch.crs && batch.crs.length > 0 ? (
                  <div className="space-y-2">
                    {batch.crs.map(cr => (
                      <div key={cr.id} className="text-sm text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">
                        {cr.fullName} ({cr.registrationNumber})
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">No CRs assigned</p>
                )}
              </div>

              <button
                onClick={() => openManageModal(batch)}
                className="w-full flex justify-center items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Users size={18} /> Manage Students & CRs
              </button>
            </div>
          ))}
          {batches.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500">
              No batches found. Create one to get started.
            </div>
          )}
        </div>
      )}

      {/* Create Batch Modal */}
      {isAddBatchOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Batch</h2>
              <button onClick={() => setIsAddBatchOpen(false)} className="text-slate-500 hover:text-slate-700"><X size={24} /></button>
            </div>
            <form onSubmit={handleCreateBatch}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Batch Name</label>
                <input
                  type="text"
                  required
                  value={newBatchName}
                  onChange={e => setNewBatchName(e.target.value)}
                  placeholder="e.g. Batch 2021"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddBatchOpen(false)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Batch Modal */}
      {isManageModalOpen && selectedBatch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Manage {selectedBatch.name}</h2>
              <button onClick={() => setIsManageModalOpen(false)} className="text-slate-500 hover:text-slate-700"><X size={24} /></button>
            </div>

            <div className="grid md:grid-cols-3 gap-6 overflow-y-auto pr-2 pb-4">
              {/* Left Column: Import */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Import Students</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Upload a CSV file to bulk import students into this batch. New students will automatically receive a default password (SEC123456).
                </p>
                <div className="space-y-3">
                  <button onClick={handleDownloadSample} className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors text-sm">
                    <Download size={18} /> Download Sample CSV
                  </button>
                  
                  <div className="relative">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      disabled={uploadingCsv}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <button disabled={uploadingCsv} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm disabled:opacity-50">
                      {uploadingCsv ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <Upload size={18} />}
                      {uploadingCsv ? 'Uploading...' : 'Upload CSV'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Columns: Manage CRs & Students */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3">Current Class Representatives</h3>
                  {selectedBatch.crs && selectedBatch.crs.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {selectedBatch.crs.map(cr => (
                        <div key={cr.id} className="flex justify-between items-center bg-blue-50 border border-blue-100 p-3 rounded-lg">
                          <div>
                            <p className="font-semibold text-blue-900 text-sm">{cr.fullName}</p>
                            <p className="text-xs text-blue-700">{cr.registrationNumber}</p>
                          </div>
                          <button onClick={() => handleRemoveCR(cr.id)} className="text-red-500 hover:text-red-700 text-xs px-2 py-1 bg-white rounded border border-red-100">
                            Demote
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic bg-slate-50 p-3 rounded border border-slate-100">No CRs currently assigned.</p>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3">All Students in Batch ({batchUsers.length})</h3>
                  <div className="bg-white border border-slate-200 rounded-lg overflow-hidden max-h-[300px] overflow-y-auto">
                    {loadingUsers ? (
                      <div className="p-8 text-center text-slate-500">Loading students...</div>
                    ) : batchUsers.length > 0 ? (
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-600 sticky top-0 border-b border-slate-200">
                          <tr>
                            <th className="px-4 py-3 font-medium">Name</th>
                            <th className="px-4 py-3 font-medium">Reg. No.</th>
                            <th className="px-4 py-3 font-medium text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {batchUsers.map(user => {
                            const isAlreadyCR = selectedBatch.crs && selectedBatch.crs.some(cr => cr.id === user.id);
                            return (
                              <tr key={user.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3 font-medium text-slate-800">{user.fullName}</td>
                                <td className="px-4 py-3 text-slate-600">{user.registrationNumber}</td>
                                <td className="px-4 py-3 text-right">
                                  {!isAlreadyCR && (
                                    <button 
                                      onClick={() => handleAddCR(user.id)}
                                      className="text-xs font-medium text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-300 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                                    >
                                      Make CR
                                    </button>
                                  )}
                                  {isAlreadyCR && <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded">Is CR</span>}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <div className="p-8 text-center text-slate-500">No students found. Import some using the CSV uploader.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
