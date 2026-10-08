import React, { useState } from 'react';
import {
  LayoutGrid,
  Bookmark,
  FileCheck,
  Calendar,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowRight,
  ExternalLink,
  Edit3,
  Award,
  ChevronRight,
} from 'lucide-react';
import { Scholarship, Application, ApplicationStatus } from '../types';
import { ApplicationTrackerModal } from '../components/ApplicationTrackerModal';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

interface StudentDashboardPageProps {
  onNavigate: (view: string) => void;
  savedScholarships: Scholarship[];
  applications: Application[];
  recommendedScholarships: Scholarship[];
  allScholarships: Scholarship[];
  onSelectScholarship: (scholarship: Scholarship) => void;
  onUpdateApplicationStatus: (scholarshipId: string, status: ApplicationStatus, notes: string) => void;
}

export const StudentDashboardPage: React.FC<StudentDashboardPageProps> = ({
  onNavigate,
  savedScholarships,
  applications,
  recommendedScholarships,
  allScholarships,
  onSelectScholarship,
  onUpdateApplicationStatus,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [trackerModalOpen, setTrackerModalOpen] = useState(false);
  const [selectedAppScholarship, setSelectedAppScholarship] = useState<Scholarship | null>(null);

  // Filter deadlines ordered by upcoming
  const upcomingDeadlines = [...allScholarships]
    .filter((s) => !s.isClosed)
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .slice(0, 4);

  const totalTrackedFunding = [
    ...applications.map((a) => a.scholarship?.amount || 0),
    ...savedScholarships.map((s) => s.amount),
  ].reduce((acc, curr) => acc + curr, 0);

  const handleEditStatus = (app: Application) => {
    if (app.scholarship) {
      setSelectedAppScholarship(app.scholarship);
      setTrackerModalOpen(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-2">
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Student Dashboard</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Hello, {user?.name || 'Sujan Bhosale'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your ongoing applications, manage bookmarked scholarships, and monitor submission cutoffs.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={() => onNavigate('ai-match')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Recalculate AI Match</span>
          </button>

          <button
            onClick={() => onNavigate('scholarships')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <span>+ Find New Grants</span>
          </button>
        </div>
      </div>

      {/* Overview Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            <span>Potential Aid Tracked</span>
            <Award className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-blue-600">
            ₹{totalTrackedFunding.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1">Across saved & submitted schemes</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            <span>Active Applications</span>
            <FileCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {applications.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {applications.filter((a) => a.status === 'Selected').length} Selected / Awarded
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            <span>Saved Bookmarks</span>
            <Bookmark className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {savedScholarships.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Ready for application review</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            <span>Upcoming Cutoffs</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600">
            {upcomingDeadlines.length} Open
          </div>
          <div className="text-xs text-slate-500 mt-1">Next due: {upcomingDeadlines[0]?.deadlineDisplay || 'N/A'}</div>
        </div>
      </div>

      {/* Main Grid: Application Tracker & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Application Tracker */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                <span>Application Tracker</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your submission pipeline and update milestones.
              </p>
            </div>

            <button
              onClick={() => onNavigate('applications')}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Full Applications View
            </button>
          </div>

          {applications.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                        {app.scholarship?.category || 'Scheme'}
                      </span>
                      <span className="text-xs text-slate-400">
                        Submitted: {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3
                      onClick={() => app.scholarship && onSelectScholarship(app.scholarship)}
                      className="text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer"
                    >
                      {app.scholarship?.title || 'Scholarship Scheme'}
                    </h3>

                    <div className="text-xs text-slate-500">
                      {app.scholarship?.providerName} •{' '}
                      <strong className="text-blue-600 font-bold">
                        {app.scholarship?.amountFormatted}
                      </strong>
                    </div>

                    {app.notes && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg mt-1 italic">
                        "{app.notes}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        app.status === 'Selected'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : app.status === 'Under Review'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {app.status}
                    </span>

                    <button
                      onClick={() => handleEditStatus(app)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
                      title="Update stage & notes"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl">
              <p className="text-xs text-slate-500 mb-3">No active applications in tracker.</p>
              <button
                onClick={() => onNavigate('scholarships')}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
              >
                Find Scholarships to Apply
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Upcoming Deadlines */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Upcoming Deadlines</span>
            </h2>
            <button
              onClick={() => onNavigate('scholarships')}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              View all
            </button>
          </div>

          <div className="space-y-3">
            {upcomingDeadlines.map((sch) => (
              <div
                key={sch.id}
                onClick={() => onSelectScholarship(sch)}
                className="p-3.5 bg-slate-50 hover:bg-blue-50/60 rounded-2xl border border-slate-200/80 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-extrabold text-blue-600">{sch.amountFormatted}</span>
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                    {sch.daysLeftText}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{sch.title}</h4>
                <div className="text-[11px] text-slate-400 mt-1">Due by {sch.deadlineDisplay}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Scholarships for You */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Personalized Recommendations</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Based on your Pune Engineering profile and general eligibility cutoffs.
            </p>
          </div>

          <button
            onClick={() => onNavigate('scholarships')}
            className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
          >
            Explore all matching schemes →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recommendedScholarships.slice(0, 3).map((sch) => (
            <div
              key={sch.id}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-blue-600 px-2 py-0.5 bg-blue-50 rounded-md">
                    {sch.category}
                  </span>
                  <span className="font-extrabold text-slate-900">{sch.amountFormatted}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 line-clamp-2 mb-1">{sch.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2">{sch.description}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Due: {sch.deadlineDisplay}</span>
                <button
                  onClick={() => onSelectScholarship(sch)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  View Scheme
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tracker Status Updater Modal */}
      {selectedAppScholarship && (
        <ApplicationTrackerModal
          isOpen={trackerModalOpen}
          onClose={() => {
            setTrackerModalOpen(false);
            setSelectedAppScholarship(null);
          }}
          scholarship={selectedAppScholarship}
          currentStatus={
            applications.find((a) => a.scholarshipId === selectedAppScholarship.id)?.status ||
            'Applied'
          }
          currentNotes={
            applications.find((a) => a.scholarshipId === selectedAppScholarship.id)?.notes || ''
          }
          onSave={onUpdateApplicationStatus}
        />
      )}
    </div>
  );
};
