import React, { useState } from 'react';
import { X, CheckCircle2, Shield, Plus, Trash2 } from 'lucide-react';
import { Scholarship, ScholarshipCategory } from '../types';

interface AdminScholarshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  scholarshipToEdit?: Scholarship | null;
  onSave: (data: Partial<Scholarship>) => void;
}

export const AdminScholarshipModal: React.FC<AdminScholarshipModalProps> = ({
  isOpen,
  onClose,
  scholarshipToEdit,
  onSave,
}) => {
  const isEditing = !!scholarshipToEdit;

  const [title, setTitle] = useState(scholarshipToEdit?.title || '');
  const [providerName, setProviderName] = useState(scholarshipToEdit?.providerName || '');
  const [description, setDescription] = useState(scholarshipToEdit?.description || '');
  const [amount, setAmount] = useState<number>(scholarshipToEdit?.amount || 50000);
  const [category, setCategory] = useState<ScholarshipCategory>(scholarshipToEdit?.category || 'Government');
  const [deadline, setDeadline] = useState(scholarshipToEdit?.deadline || '2026-11-30');
  const [deadlineDisplay, setDeadlineDisplay] = useState(scholarshipToEdit?.deadlineDisplay || '30 Nov');
  const [applicationUrl, setApplicationUrl] = useState(scholarshipToEdit?.applicationUrl || 'https://scholarships.gov.in');
  const [eligibility, setEligibility] = useState(scholarshipToEdit?.eligibility || '');
  const [minimumScore, setMinimumScore] = useState<number>(scholarshipToEdit?.minimumScore || 60);
  const [maximumIncome, setMaximumIncome] = useState<number>(scholarshipToEdit?.maximumIncome || 600000);
  const [eligibleGender, setEligibleGender] = useState<'All' | 'Female' | 'Male'>(scholarshipToEdit?.eligibleGender || 'All');
  const [educationLevel, setEducationLevel] = useState<string>(scholarshipToEdit?.educationLevel?.join(', ') || 'Undergraduate');
  const [courses, setCourses] = useState<string>(scholarshipToEdit?.courses?.join(', ') || 'Computer Science, Engineering');
  const [verified, setVerified] = useState<boolean>(scholarshipToEdit?.verified ?? true);
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>(scholarshipToEdit?.status || 'published');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(scholarshipToEdit || {}),
      title,
      providerName,
      description,
      amount: Number(amount),
      amountFormatted: `₹${Number(amount).toLocaleString('en-IN')}`,
      category,
      deadline,
      deadlineDisplay,
      daysLeftText: 'Open',
      isClosed: false,
      applicationUrl,
      eligibility,
      minimumScore: Number(minimumScore),
      maximumIncome: Number(maximumIncome),
      eligibleGender,
      educationLevel: educationLevel.split(',').map((s) => s.trim()).filter(Boolean),
      courses: courses.split(',').map((s) => s.trim()).filter(Boolean),
      verified,
      status,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-2xl w-full p-6 sm:p-8 my-auto max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {isEditing ? 'Edit Scholarship Listing' : 'Add New Verified Scholarship'}
            </h3>
            <p className="text-xs text-slate-500">Admin management console for official scholarship catalog.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Scholarship Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. National Merit Scholarship Scheme"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Provider / Organization *
              </label>
              <input
                type="text"
                value={providerName}
                onChange={(e) => setProviderName(e.target.value)}
                placeholder="e.g. Ministry of Education"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="Government">Government</option>
                <option value="CSR">CSR</option>
                <option value="Private">Private</option>
                <option value="NGO">NGO</option>
                <option value="Merit Based">Merit Based</option>
                <option value="Need Based">Need Based</option>
                <option value="Research">Research</option>
                <option value="International">International</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Award Amount (₹) *
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Deadline Date *
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Display Text
              </label>
              <input
                type="text"
                value={deadlineDisplay}
                onChange={(e) => setDeadlineDisplay(e.target.value)}
                placeholder="e.g. 30 Nov"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Official Application URL *
            </label>
            <input
              type="url"
              value={applicationUrl}
              onChange={(e) => setApplicationUrl(e.target.value)}
              placeholder="https://scholarships.gov.in"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Short Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Eligibility Details
            </label>
            <textarea
              value={eligibility}
              onChange={(e) => setEligibility(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Education Levels (comma separated)
              </label>
              <input
                type="text"
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                placeholder="Undergraduate, Postgraduate"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Courses (comma separated)
              </label>
              <input
                type="text"
                value={courses}
                onChange={(e) => setCourses(e.target.value)}
                placeholder="Engineering, Computer Science"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="verifiedCheck"
                checked={verified}
                onChange={(e) => setVerified(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label htmlFor="verifiedCheck" className="text-xs font-bold text-slate-800 cursor-pointer">
                Mark as Verified Official Scheme
              </label>
            </div>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-200 rounded-lg"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              {isEditing ? 'Save Changes' : 'Create Scholarship'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
