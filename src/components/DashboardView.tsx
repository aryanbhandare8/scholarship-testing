import React, { useState } from 'react';
import {
  LayoutGrid,
  CheckCircle2,
  Clock,
  Bookmark,
  FileText,
  IndianRupee,
  Award,
  AlertTriangle,
  Upload,
  Calendar,
  ExternalLink,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import { Scholarship, SCHOLARSHIPS_DATA } from '../data/scholarships';

interface DashboardViewProps {
  user: { name: string; email: string } | null;
  savedIds: string[];
  appliedScholarships: {
    scholarship: Scholarship;
    appliedDate: string;
    status: 'Submitted' | 'Under Review' | 'Interview Scheduled' | 'Awarded';
  }[];
  onToggleSave: (id: string) => void;
  onSelectScholarship: (scholarship: Scholarship) => void;
  onUpdateStatus: (
    id: string,
    newStatus: 'Submitted' | 'Under Review' | 'Interview Scheduled' | 'Awarded'
  ) => void;
  onOpenBrowse: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  savedIds,
  appliedScholarships,
  onToggleSave,
  onSelectScholarship,
  onUpdateStatus,
  onOpenBrowse,
}) => {
  const [activeTab, setActiveTab] = useState<'applied' | 'saved' | 'documents'>('applied');

  const savedScholarships = SCHOLARSHIPS_DATA.filter((s) => savedIds.includes(s.id));

  // Documents state for student locker
  const [documents, setDocuments] = useState([
    { id: '1', name: 'Aadhaar Card (UIDAI Linked)', status: 'Verified', date: 'Uploaded 12 Aug' },
    { id: '2', name: 'Class 12th Board Marksheet', status: 'Verified', date: 'Uploaded 14 Aug' },
    { id: '3', name: 'Annual Income Certificate (Tehsildar)', status: 'Pending Review', date: 'Uploaded 02 Sept' },
    { id: '4', name: 'College Admission Bonafide & Fee Receipt', status: 'Verified', date: 'Uploaded 20 Sept' },
    { id: '5', name: 'Bank Account Passbook (DBT Enabled)', status: 'Verified', date: 'Uploaded 22 Sept' },
  ]);

  const totalFundingTracked = [
    ...appliedScholarships.map((a: any) => a.scholarship?.awardAmount || a.scholarship?.amount || 0),
    ...savedScholarships.map((s: any) => s.awardAmount || s.amount || 0),
  ].reduce((acc, curr) => (acc || 0) + (curr || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Student Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Student Dashboard</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user?.name || 'Sujan Bhosale'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track your active scholarship submissions, saved deadlines, and application documents.
          </p>
        </div>

        <button
          onClick={onOpenBrowse}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-xs transition-all self-start sm:self-auto cursor-pointer"
        >
          + Explore More Scholarships
        </button>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Potential Grants
          </div>
          <div className="text-2xl font-extrabold text-blue-600 mt-1">
            ₹{totalFundingTracked.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Across {appliedScholarships.length + savedScholarships.length} tracked schemes
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Active Submissions
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {appliedScholarships.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {appliedScholarships.filter((a) => a.status === 'Awarded').length} awarded
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Saved For Later
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {savedScholarships.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Quick-access bookmarks
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Verified Documents
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">
            {documents.filter((d) => d.status === 'Verified').length} / {documents.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Ready for 1-click apply</div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-200 mb-6 gap-2">
        <button
          onClick={() => setActiveTab('applied')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'applied'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          My Applications ({appliedScholarships.length})
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'saved'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Saved Bookmarks ({savedScholarships.length})
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'documents'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Documents Vault ({documents.length})
        </button>
      </div>

      {/* Tab 1: Applied Scholarships */}
      {activeTab === 'applied' && (
        <div className="space-y-4">
          {appliedScholarships.length > 0 ? (
            appliedScholarships.map(({ scholarship, appliedDate, status }) => (
              <div
                key={scholarship.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {(scholarship as any).providerType || scholarship.category}
                    </span>
                    <span className="text-xs text-slate-400">
                      Applied on {appliedDate}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {scholarship.title}
                  </h3>

                  <div className="text-xs text-slate-500 mt-1">
                    {(scholarship as any).provider || scholarship.providerName} •{' '}
                    <span className="font-bold text-blue-600">
                      {(scholarship as any).awardText || scholarship.amountFormatted}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-left sm:text-right">
                    <div className="text-[11px] text-slate-400 font-semibold uppercase">
                      Current Status
                    </div>
                    <select
                      value={status}
                      onChange={(e) =>
                        onUpdateStatus(scholarship.id, e.target.value as any)
                      }
                      className="mt-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 focus:outline-none cursor-pointer"
                    >
                      <option value="Submitted">Submitted</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Interview Scheduled">Interview Scheduled</option>
                      <option value="Awarded">Awarded 🏆</option>
                    </select>
                  </div>

                  <button
                    onClick={() => onSelectScholarship(scholarship)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    title="View details"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                No active applications yet
              </h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mb-5">
                Explore the verified scholarship directory and click "Apply on Official Portal" to start tracking submissions.
              </p>
              <button
                onClick={onOpenBrowse}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-xs cursor-pointer"
              >
                Browse Scholarships
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Saved Scholarships */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          {savedScholarships.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedScholarships.map((scholarship) => (
                <div
                  key={scholarship.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {(scholarship as any).providerType || scholarship.category}
                      </span>
                      <button
                        onClick={() => onToggleSave(scholarship.id)}
                        className="text-red-500 hover:text-red-700 text-xs font-medium cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                      {scholarship.title}
                    </h3>
                    <div className="text-xs text-slate-500 mt-1 mb-4">
                      {(scholarship as any).provider || scholarship.providerName}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">
                        Award
                      </span>
                      <span className="text-sm font-extrabold text-blue-600">
                        {(scholarship as any).awardText || scholarship.amountFormatted}
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectScholarship(scholarship)}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                    >
                      View & Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                No saved scholarships
              </h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mb-5">
                Click the bookmark icon on any scholarship card to save it for quick review.
              </p>
              <button
                onClick={onOpenBrowse}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-xs cursor-pointer"
              >
                Find Scholarships to Bookmark
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Documents Vault */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Verified Document Locker
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Government and CSR portals require these documents during verification. Keep them ready in digital PDF format.
              </p>
            </div>

            <button
              onClick={() => alert('Document upload dialog: file selected successfully.')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload New Document</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="py-4 flex items-center justify-between gap-4 flex-wrap"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 leading-snug">
                      {doc.name}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{doc.date}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      doc.status === 'Verified'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {doc.status === 'Verified' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                    <span>{doc.status}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
