import { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';

interface EditStudentModalProps {
  student: any;
  onClose: () => void;
  onSave: (updatedData: any) => Promise<void>;
}

export default function EditStudentModal({ student, onClose, onSave }: EditStudentModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: student.fullName || '',
    institutionalEmail: student.institutionalEmail || '',
    registrationNumber: student.registrationNumber || '',
    batch: student.profile?.batch || '',
    phoneNumber: student.profile?.phoneNumber || '',
    department: student.profile?.department || 'EEE',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        user: {
          fullName: formData.fullName,
          institutionalEmail: formData.institutionalEmail,
          registrationNumber: formData.registrationNumber,
        },
        profile: {
          batch: formData.batch,
          phoneNumber: formData.phoneNumber,
          department: formData.department,
        }
      };
      await onSave(payload);
    } catch (err: any) {
      setError(err.message || 'Failed to update student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Edit Student</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-5">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <form id="edit-student-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Full Name</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-slate-900 bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Registration Number</label>
              <input
                type="text"
                required
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-slate-900 bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Institutional Email</label>
              <input
                type="email"
                required
                value={formData.institutionalEmail}
                onChange={(e) => setFormData({ ...formData, institutionalEmail: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-slate-900 bg-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Batch</label>
                <input
                  type="text"
                  placeholder="e.g. 2020-21"
                  value={formData.batch}
                  onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-slate-900 bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-slate-900 bg-white"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Phone Number</label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-slate-900 bg-white"
              />
            </div>
          </form>
        </div>

        <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            form="edit-student-form"
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg flex items-center gap-2 transition disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
