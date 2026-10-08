import React, { useState } from 'react';
import { Bookmark, Search, Trash2, ExternalLink, ArrowRight, Filter } from 'lucide-react';
import { Scholarship } from '../types';
import { ScholarshipCard } from '../components/ScholarshipCard';

interface SavedScholarshipsPageProps {
  savedScholarships: Scholarship[];
  onToggleSave: (id: string) => void;
  onSelectScholarship: (scholarship: Scholarship) => void;
  onExplore: () => void;
}

export const SavedScholarshipsPage: React.FC<SavedScholarshipsPageProps> = ({
  savedScholarships,
  onToggleSave,
  onSelectScholarship,
  onExplore,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filtered = savedScholarships.filter((s) => {
    const matchesSearch =
      searchTerm === '' ||
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.providerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || s.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-2">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Bookmarked Collection</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Saved Scholarships ({savedScholarships.length})
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review and organize your shortlisted schemes before official portal submission.
          </p>
        </div>

        <button
          onClick={onExplore}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all self-start sm:self-auto cursor-pointer"
        >
          + Discover More Schemes
        </button>
      </div>

      {/* Search & Filter Bar */}
      {savedScholarships.length > 0 && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search saved scholarships..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Government">Government</option>
              <option value="CSR">CSR</option>
              <option value="Private">Private</option>
              <option value="NGO">NGO</option>
              <option value="Merit Based">Merit Based</option>
            </select>
          </div>
        </div>
      )}

      {/* Grid of Saved Scholarships */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((sch) => (
            <ScholarshipCard
              key={sch.id}
              scholarship={sch}
              isSaved={true}
              onToggleSave={onToggleSave}
              onSelect={onSelectScholarship}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
            <Bookmark className="w-7 h-7 stroke-[1.8]" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            {savedScholarships.length === 0
              ? 'No saved scholarships yet'
              : 'No matching saved scholarships'}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {savedScholarships.length === 0
              ? 'Bookmark interesting schemes while browsing to compare requirements and deadlines here.'
              : 'Try clearing your search term or category filter.'}
          </p>
          <button
            onClick={onExplore}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5 mt-2"
          >
            <span>Explore Scholarships</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
