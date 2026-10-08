import React from 'react';
import {
  Filter,
  X,
  RotateCcw,
  IndianRupee,
  Calendar,
  GraduationCap,
  Building2,
  Users,
  Award,
  Layers,
} from 'lucide-react';
import { ScholarshipFilters } from '../types';

interface FilterSidebarProps {
  filters: ScholarshipFilters;
  onChange: (filters: ScholarshipFilters) => void;
  onReset: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onChange,
  onReset,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const updateFilter = (key: keyof ScholarshipFilters, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      {/* 1. Category / Funding Type */}
      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => updateFilter('category', e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="All">All Categories</option>
          <option value="Government">Government Schemes</option>
          <option value="CSR">CSR Initiatives</option>
          <option value="Private">Private Corporate</option>
          <option value="NGO">NGO & Charitable Trusts</option>
          <option value="Merit Based">Merit-Based</option>
          <option value="Need Based">Need-Based</option>
          <option value="Research">Research & Fellowship</option>
          <option value="International">International</option>
        </select>
      </div>

      {/* 2. Education Level */}
      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Education Level
        </label>
        <select
          value={filters.educationLevel}
          onChange={(e) => updateFilter('educationLevel', e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="All">All Education Levels</option>
          <option value="Class 11-12">Class 11 - 12 (Higher Secondary)</option>
          <option value="Undergraduate">Undergraduate Degree (UG)</option>
          <option value="Postgraduate">Postgraduate Degree (PG)</option>
          <option value="Diploma">Diploma / Polytechnic</option>
          <option value="PhD">Ph.D. / Research</option>
        </select>
      </div>

      {/* 3. Course / Stream */}
      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Course / Discipline
        </label>
        <select
          value={filters.course}
          onChange={(e) => updateFilter('course', e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="All">All Courses</option>
          <option value="Computer Science">Computer Science & IT</option>
          <option value="Engineering">Engineering (Core & Tech)</option>
          <option value="Medicine">Medicine, MBBS, BDS & Nursing</option>
          <option value="Commerce">Commerce, Finance, B.Com, MBA</option>
          <option value="Arts">Arts, Humanities & Law</option>
          <option value="Pure Sciences">Pure & Applied Sciences</option>
          <option value="Pharmacy">Pharmacy & Biotech</option>
        </select>
      </div>

      {/* 4. State of Residence */}
      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          State / Domicile
        </label>
        <select
          value={filters.state}
          onChange={(e) => updateFilter('state', e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="All">All India</option>
          <option value="Maharashtra">Maharashtra</option>
          <option value="Karnataka">Karnataka</option>
          <option value="Delhi">Delhi NCR</option>
          <option value="Tamil Nadu">Tamil Nadu</option>
          <option value="Uttar Pradesh">Uttar Pradesh</option>
          <option value="Telangana">Telangana</option>
          <option value="West Bengal">West Bengal</option>
          <option value="Andhra Pradesh">Andhra Pradesh</option>
          <option value="Gujarat">Gujarat</option>
        </select>
      </div>

      {/* 5. Gender */}
      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Gender Eligibility
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {['All', 'Female', 'Male'].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => updateFilter('gender', g)}
              className={`py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                filters.gender === g
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {g === 'All' ? 'Any' : g}
            </button>
          ))}
        </div>
      </div>

      {/* 6. Maximum Award Amount Slider */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-bold text-slate-800 uppercase tracking-wider">Award Ceiling</span>
          <span className="font-extrabold text-blue-600">
            Up to ₹{filters.maxAmount.toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min="10000"
          max="250000"
          step="10000"
          value={filters.maxAmount}
          onChange={(e) => updateFilter('maxAmount', Number(e.target.value))}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      {/* 7. Minimum Academic Score Slider */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-bold text-slate-800 uppercase tracking-wider">Your Score Cutoff</span>
          <span className="font-extrabold text-blue-600">
            {filters.minAcademicScore > 0 ? `${filters.minAcademicScore}%` : 'Any %'}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="90"
          step="5"
          value={filters.minAcademicScore}
          onChange={(e) => updateFilter('minAcademicScore', Number(e.target.value))}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
          <span>No min</span>
          <span>60%</span>
          <span>75%</span>
          <span>90%</span>
        </div>
      </div>

      {/* 8. Application Status / Deadline */}
      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Application Deadline
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: 'all', label: 'All' },
            { id: 'open', label: 'Open' },
            { id: 'closed', label: 'Closed' },
          ].map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => updateFilter('deadlineFilter', d.id)}
              className={`py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                filters.deadlineFilter === d.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* 9. Provider */}
      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Provider
        </label>
        <select
          value={filters.provider}
          onChange={(e) => updateFilter('provider', e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="All">All Providers</option>
          <option value="Google India">Google India</option>
          <option value="Reliance Foundation">Reliance Foundation</option>
          <option value="Ministry of Minority Affairs">Ministry of Minority Affairs</option>
          <option value="HDFC Bank Parivartan">HDFC Bank Parivartan</option>
          <option value="AICTE">AICTE (Govt of India)</option>
          <option value="Tata Trusts">Tata Trusts</option>
          <option value="Wipro Cares">Wipro Cares & Santoor</option>
          <option value="ONGC Foundation">ONGC Foundation</option>
          <option value="L’Oréal India">L’Oréal India</option>
          <option value="Colgate-Palmolive India">Colgate-Palmolive India</option>
        </select>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs sticky top-28">
          {content}
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-slate-900 text-lg">Filter Scholarships</span>
                <button
                  onClick={onCloseMobile}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {content}
            </div>

            <div className="pt-4 border-t border-slate-200 mt-6">
              <button
                onClick={onCloseMobile}
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
