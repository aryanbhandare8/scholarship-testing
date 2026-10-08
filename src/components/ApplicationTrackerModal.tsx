import React, { useState } from 'react';
import { X, CheckCircle2, FileCheck, Calendar, Clock, AlertCircle } from 'lucide-react';
import { Application, ApplicationStatus, Scholarship } from '../types';

interface ApplicationTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  scholarship: Scholarship;
  currentStatus?: ApplicationStatus;
  currentNotes?: string;
  onSave: (scholarshipId: string, status: ApplicationStatus, notes: string) => void;
}

export const ApplicationTrackerModal: React.FC<ApplicationTrackerModalProps> = ({
  isOpen,
  onClose,
  scholarship,
  currentStatus = 'Applied',
  currentNotes = '',
  onSave,
}) => {
  const [status, setStatus] = useState<ApplicationStatus>(currentStatus);
  const [notes, setNotes] = useState<string>(currentNotes);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(scholarship.id, status, notes);
    onClose();
  };

  const statuses: ApplicationStatus[] = [
    'Saved',
    'Planning to Apply',
    'Application Started',
    'Applied',
    'Under Review',
    'Selected',
    'Not Selected',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-snug">
              Update Application Status
            </h3>
            <p className="text-xs text-slate-500 truncate max-w-xs">{scholarship.title}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Progress Stage
            </label>
            <div className="grid grid-cols-2 gap-2">
              {statuses.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`p-2 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between cursor-pointer ${
                    status === s
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{s}</span>
                  {status === s && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Personal Application Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Completed online test on 20 Sept. Sent Bonafide via speed post. Contacted nodal officer."
              rows={3}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              Save Application Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
