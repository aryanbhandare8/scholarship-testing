import React, { useState } from 'react';
import {
  FileCheck,
  Edit3,
  ExternalLink,
  Calendar,
  Building2,
  Clock,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { Application, ApplicationStatus, Scholarship } from '../types';
import { ApplicationTrackerModal } from '../components/ApplicationTrackerModal';

interface MyApplicationsPageProps {
  applications: Application[];
  onSelectScholarship: (scholarship: Scholarship) => void;
  onUpdateStatus: (scholarshipId: string, status: ApplicationStatus, notes: string) => void;
  onExplore: () => void;
}

export const MyApplicationsPage: React.FC<MyApplicationsPageProps> = ({
  applications,
  onSelectScholarship,
  onUpdateStatus,
  onExplore,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedApp, setSelectedApp] = useState<Scholarship | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const filtered = applications.filter((app) => {
    return statusFilter === 'All' || app.status === statusFilter;
  });

  const handleEdit = (app: Application) => {
    if (app.scholarship) {
      setSelectedApp(app.scholarship);
      setEditModalOpen(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-2">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Submission Pipeline</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Applications ({applications.length})
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time status updates and notes across your ongoing scholarship submissions.
          </p>
        </div>

        <button
          onClick={onExplore}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all self-start sm:self-auto cursor-pointer"
        >
          + Apply for Another Scheme
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
        {[
          'All',
          'Planning to Apply',
          'Application Started',
          'Applied',
          'Under Review',
          'Selected',
          'Not Selected',
        ].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === st
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {st} {st === 'All' ? `(${applications.length})` : ''}
          </button>
        ))}
      </div>

      {/* Applications Table / Cards */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                    {app.scholarship?.category || 'Category'}
                  </span>
                  <span className="text-xs text-slate-400">
                    Updated: {new Date(app.updatedAt || app.appliedAt).toLocaleDateString()}
                  </span>
                </div>

                <h3
                  onClick={() => app.scholarship && onSelectScholarship(app.scholarship)}
                  className="text-base sm:text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  {app.scholarship?.title}
                </h3>

                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <span>{app.scholarship?.providerName}</span>
                  <span>•</span>
                  <strong className="text-blue-600 font-extrabold text-sm">
                    {app.scholarship?.amountFormatted}
                  </strong>
                  <span>•</span>
                  <span>Due by {app.scholarship?.deadlineDisplay}</span>
                </div>

                {app.notes && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 mt-2">
                    <span className="font-bold text-slate-500 block mb-0.5 uppercase text-[10px]">
                      Your Notes:
                    </span>
                    {app.notes}
                  </div>
                )}
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                <div className="text-right">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Current Milestone
                  </div>
                  <span
                    className={`inline-block text-xs font-extrabold px-3 py-1.5 rounded-full ${
                      app.status === 'Selected'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : app.status === 'Under Review'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                <button
                  onClick={() => handleEdit(app)}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  title="Update status or notes"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                {app.scholarship && (
                  <a
                    href={app.scholarship.applicationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
                    title="Open official portal"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
            <FileCheck className="w-7 h-7 stroke-[1.8]" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No applications matching filter</h3>
          <p className="text-xs text-slate-500">
            Apply to verified scholarships and maintain your submission milestones right here.
          </p>
          <button
            onClick={onExplore}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Explore Scholarships
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {selectedApp && (
        <ApplicationTrackerModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedApp(null);
          }}
          scholarship={selectedApp}
          currentStatus={
            applications.find((a) => a.scholarshipId === selectedApp.id)?.status || 'Applied'
          }
          currentNotes={
            applications.find((a) => a.scholarshipId === selectedApp.id)?.notes || ''
          }
          onSave={onUpdateStatus}
        />
      )}
    </div>
  );
};
