import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  X,
  Building2,
  CheckCircle2,
  Bookmark,
  Calendar,
  IndianRupee,
  Clock,
  ArrowUpDown,
  ExternalLink,
} from 'lucide-react';
import { Scholarship } from '../data/scholarships';

interface BrowseViewProps {
  scholarships: Scholarship[];
  onSelectScholarship: (scholarship: Scholarship) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

export const BrowseView: React.FC<BrowseViewProps> = ({
  scholarships,
  onSelectScholarship,
  savedIds,
  onToggleSave,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProviderType, setSelectedProviderType] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [sortBy, setSortBy] = useState('deadline');
  const [maxAwardAmount, setMaxAwardAmount] = useState<number>(250000);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedProviderType('All');
    setSelectedTag('All');
    setSortBy('deadline');
    setMaxAwardAmount(250000);
  };

  const isFiltered =
    searchTerm !== '' ||
    selectedProviderType !== 'All' ||
    selectedTag !== 'All' ||
    sortBy !== 'deadline' ||
    maxAwardAmount < 250000;

  // Filter & sort logic
  const filteredScholarships = useMemo(() => {
    return scholarships
      .filter((s: any) => {
        const providerName = s.provider || s.providerName || '';
        const tags = s.tags || s.courses || [];
        const providerType = s.providerType || s.category || '';
        const amount = s.awardAmount || s.amount || 0;

        // Search term check
        const matchesSearch =
          searchTerm === '' ||
          s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tags.some((t: string) => t.toLowerCase().includes(searchTerm.toLowerCase()));

        // Provider type
        const matchesProvider =
          selectedProviderType === 'All' || providerType === selectedProviderType;

        // Tag / eligibility
        const matchesTag =
          selectedTag === 'All' || tags.includes(selectedTag);

        // Award amount slider
        const matchesAward = amount <= maxAwardAmount;

        return matchesSearch && matchesProvider && matchesTag && matchesAward;
      })
      .sort((a: any, b: any) => {
        const aDeadline = a.deadlineDate || a.deadline || '';
        const bDeadline = b.deadlineDate || b.deadline || '';
        const aAmount = a.awardAmount || a.amount || 0;
        const bAmount = b.awardAmount || b.amount || 0;

        if (sortBy === 'deadline') {
          return aDeadline.localeCompare(bDeadline);
        } else if (sortBy === 'award-high') {
          return bAmount - aAmount;
        } else if (sortBy === 'award-low') {
          return aAmount - bAmount;
        } else if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [scholarships, searchTerm, selectedProviderType, selectedTag, sortBy, maxAwardAmount]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title & Subtitle matching Screenshot 1 */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Browse Scholarships
        </h1>
        <p className="text-slate-600 text-base sm:text-lg mt-2 font-normal">
          Verified opportunities from Government, CSR, NGOs and private foundations.
        </p>
      </div>

      {/* Filter Box matching Screenshot 1 */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 mb-8">
        {/* Row 1: Search + 3 Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 mb-5">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by scholarship or provider..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Dropdown (Provider Type) */}
          <div className="md:col-span-2">
            <select
              value={selectedProviderType}
              onChange={(e) => setSelectedProviderType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Government">Government</option>
              <option value="CSR">CSR</option>
              <option value="Private">Private</option>
              <option value="NGO">NGO</option>
            </select>
          </div>

          {/* Eligibility / Beneficiary Dropdown */}
          <div className="md:col-span-2">
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
            >
              <option value="All">All Beneficiaries</option>
              <option value="Girl Child">Girl Child</option>
              <option value="Minority">Minority</option>
              <option value="Merit-based">Merit-based</option>
              <option value="Need-based">Need-based</option>
              <option value="STEM">STEM</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
            >
              <option value="deadline">Sort: Deadline</option>
              <option value="award-high">Sort: Award (High to Low)</option>
              <option value="award-low">Sort: Award (Low to High)</option>
              <option value="title">Sort: Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Row 2: Award Amount Range Slider & Reset Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="flex-1 max-w-md">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                Award amount
              </span>
              <span className="font-semibold text-slate-800 text-sm">
                ₹0 — ₹{maxAwardAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="relative flex items-center">
              <input
                type="range"
                min="10000"
                max="250000"
                step="5000"
                value={maxAwardAmount}
                onChange={(e) => setMaxAwardAmount(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>

          {/* Reset Filters Button */}
          {isFiltered && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors cursor-pointer self-start sm:self-center"
            >
              <X className="w-4 h-4" />
              <span>Reset filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Count matching Screenshot 1 */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-slate-600 font-medium">
          Showing <span className="font-bold text-slate-900">{filteredScholarships.length}</span> scholarships
        </div>
      </div>

      {/* Scholarships Grid matching Screenshot 1 */}
      {filteredScholarships.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScholarships.map((scholarship) => {
            const isSaved = savedIds.includes(scholarship.id);

            return (
              <div
                key={scholarship.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden p-6"
              >
                <div>
                  {/* Top Tags & Bookmark */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {((scholarship as any).tags || scholarship.courses || []).map((tag: string) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100/90 text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => onToggleSave(scholarship.id)}
                      className="text-slate-400 hover:text-blue-600 p-1 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
                      title={isSaved ? 'Remove from saved' : 'Save scholarship'}
                    >
                      <Bookmark
                        className={`w-5 h-5 ${
                          isSaved ? 'fill-blue-600 text-blue-600' : 'stroke-[1.8]'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Verified Badge */}
                  {scholarship.verified && (
                    <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mb-2">
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Verified</span>
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 leading-snug line-clamp-2 mb-1.5 hover:text-blue-600 transition-colors">
                    {scholarship.title}
                  </h3>

                  {/* Provider */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-3">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{(scholarship as any).provider || scholarship.providerName}</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-6">
                    {scholarship.description}
                  </p>
                </div>

                {/* Bottom Section */}
                <div>
                  {/* Stats Row: Award, Deadline, Days Left */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-t border-slate-100 mb-4">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        AWARD
                      </div>
                      <div className="text-sm font-extrabold text-blue-600 mt-0.5">
                        {(scholarship as any).awardText || scholarship.amountFormatted}
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

                  {/* View Details Button */}
                  <button
                    onClick={() => onSelectScholarship(scholarship)}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-xs hover:shadow transition-all cursor-pointer"
                  >
                    View details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-4">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No scholarships found</h3>
          <p className="text-sm text-slate-500 mb-5">
            Try adjusting your search terms, award threshold, or removing selected filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-xs transition-all cursor-pointer"
          >
            Reset all filters
          </button>
        </div>
      )}
    </div>
  );
};
