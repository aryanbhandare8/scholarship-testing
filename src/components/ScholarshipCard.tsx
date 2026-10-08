import React from 'react';
import {
  CheckCircle2,
  Bookmark,
  Calendar,
  Building2,
  MapPin,
  GraduationCap,
  ExternalLink,
  Tag,
  Clock,
} from 'lucide-react';
import { Scholarship } from '../types';

interface ScholarshipCardProps {
  scholarship: Scholarship;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onSelect: (scholarship: Scholarship) => void;
  isApplied?: boolean;
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({
  scholarship,
  isSaved,
  onToggleSave,
  onSelect,
  isApplied = false,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col justify-between overflow-hidden p-6 group">
      <div>
        {/* Top Badges & Bookmark */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100/80">
              {scholarship.category}
            </span>
            {scholarship.educationLevel[0] && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                {scholarship.educationLevel[0]}
              </span>
            )}
            {scholarship.verified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60">
                <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Verified</span>
              </span>
            )}
          </div>

          <button
            onClick={() => onToggleSave(scholarship.id)}
            className="p-1.5 rounded-xl border border-slate-100 hover:border-slate-200 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer shrink-0"
            title={isSaved ? 'Remove from saved' : 'Save scholarship'}
          >
            <Bookmark
              className={`w-4 h-4 ${
                isSaved ? 'fill-blue-600 text-blue-600' : 'stroke-[2]'
              }`}
            />
          </button>
        </div>

        {/* Title */}
        <h3
          onClick={() => onSelect(scholarship)}
          className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer leading-snug line-clamp-2 mb-2"
        >
          {scholarship.title}
        </h3>

        {/* Provider */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-3">
          <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center text-xs">
            {scholarship.providerLogo || '🏛️'}
          </div>
          <span className="truncate">{scholarship.providerName}</span>
        </div>

        {/* Eligibility summary */}
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4">
          {scholarship.description}
        </p>

        {/* Meta badges: State & Course */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mb-5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/60">
            <MapPin className="w-3 h-3 text-slate-400" />
            {scholarship.states[0] || 'All India'}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/60">
            <GraduationCap className="w-3 h-3 text-slate-400" />
            {scholarship.courses[0] || 'All Streams'}
          </span>
        </div>
      </div>

      {/* Card Footer: Amount, Deadline, View Details */}
      <div className="pt-4 border-t border-slate-100">
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              AWARD
            </div>
            <div className="text-sm font-extrabold text-blue-600 mt-0.5">
              {scholarship.amountFormatted}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              DEADLINE
            </div>
            <div className="text-sm font-bold text-slate-800 mt-0.5">
              {scholarship.deadlineDisplay}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              DAYS LEFT
            </div>
            <div
              className={`text-sm font-bold mt-0.5 ${
                scholarship.isClosed ? 'text-red-500' : 'text-emerald-600'
              }`}
            >
              {scholarship.daysLeftText}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelect(scholarship)}
            className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs hover:shadow transition-all cursor-pointer text-center"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};
