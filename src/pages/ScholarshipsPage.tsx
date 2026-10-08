import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  RotateCcw,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { Scholarship, ScholarshipFilters } from '../types';
import { FilterSidebar } from '../components/FilterSidebar';
import { ScholarshipCard } from '../components/ScholarshipCard';

interface ScholarshipsPageProps {
  onSelectScholarship: (scholarship: Scholarship) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

const initialFilters: ScholarshipFilters = {
  search: '',
  educationLevel: 'All',
  course: 'All',
  state: 'All',
  category: 'All',
  annualIncomeLimit: 0,
  minAcademicScore: 0,
  gender: 'All',
  maxAmount: 250000,
  deadlineFilter: 'all',
  provider: 'All',
  sortBy: 'recommended',
};

export const ScholarshipsPage: React.FC<ScholarshipsPageProps> = ({
  onSelectScholarship,
  savedIds,
  onToggleSave,
}) => {
  const [filters, setFilters] = useState<ScholarshipFilters>(initialFilters);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch scholarships from real backend REST API
  const fetchScholarships = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.set('search', filters.search);
      if (filters.educationLevel !== 'All') queryParams.set('educationLevel', filters.educationLevel);
      if (filters.course !== 'All') queryParams.set('course', filters.course);
      if (filters.state !== 'All') queryParams.set('state', filters.state);
      if (filters.category !== 'All') queryParams.set('category', filters.category);
      if (filters.gender !== 'All') queryParams.set('gender', filters.gender);
      if (filters.annualIncomeLimit > 0) queryParams.set('annualIncomeLimit', String(filters.annualIncomeLimit));
      if (filters.minAcademicScore > 0) queryParams.set('minAcademicScore', String(filters.minAcademicScore));
      if (filters.maxAmount < 250000) queryParams.set('maxAmount', String(filters.maxAmount));
      if (filters.provider !== 'All') queryParams.set('provider', filters.provider);
      if (filters.deadlineFilter !== 'all') queryParams.set('deadlineFilter', filters.deadlineFilter);
      queryParams.set('sortBy', filters.sortBy);
      queryParams.set('page', String(currentPage));
      queryParams.set('limit', '9');

      const res = await fetch(`/api/scholarships?${queryParams.toString()}`);
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          if (data.scholarships) {
            setScholarships(data.scholarships);
            setTotalCount(data.total);
            setTotalPages(data.totalPages || 1);
          }
        }
      }
    } catch (e) {
      console.error('Error fetching scholarships:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, [filters, currentPage]);

  const handleReset = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
  };

  // Active filter count
  const activeFiltersCount =
    (filters.search ? 1 : 0) +
    (filters.educationLevel !== 'All' ? 1 : 0) +
    (filters.course !== 'All' ? 1 : 0) +
    (filters.state !== 'All' ? 1 : 0) +
    (filters.category !== 'All' ? 1 : 0) +
    (filters.gender !== 'All' ? 1 : 0) +
    (filters.maxAmount < 250000 ? 1 : 0) +
    (filters.minAcademicScore > 0 ? 1 : 0) +
    (filters.deadlineFilter !== 'all' ? 1 : 0) +
    (filters.provider !== 'All' ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Search Header Banner */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Find Scholarships in India
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-1.5 font-normal">
          Explore {totalCount}+ verified opportunities from Central Government, CSR Foundations, and NGOs.
        </p>

        {/* Global Search Bar */}
        <div className="mt-6 relative max-w-3xl">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => {
              setFilters((prev) => ({ ...prev, search: e.target.value }));
              setCurrentPage(1);
            }}
            placeholder="Search scholarships by name, course, state or provider…"
            className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all"
          />
          {filters.search && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Results Grid */}
      <div className="flex items-start gap-8">
        {/* Desktop Sidebar & Mobile Drawer */}
        <FilterSidebar
          filters={filters}
          onChange={(newFilters) => {
            setFilters(newFilters);
            setCurrentPage(1);
          }}
          onReset={handleReset}
          isMobileOpen={mobileFilterOpen}
          onCloseMobile={() => setMobileFilterOpen(false)}
        />

        {/* Results Area */}
        <div className="flex-1 min-w-0">
          {/* Controls Bar: Results Count, Mobile Filter Trigger, Sort */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
              </button>

              <span className="text-xs sm:text-sm font-semibold text-slate-600">
                Showing <strong className="text-slate-900">{scholarships.length}</strong> of{' '}
                <strong className="text-slate-900">{totalCount}</strong> scholarships
              </span>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 hidden sm:inline uppercase">
                Sort:
              </span>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))
                }
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              >
                <option value="recommended">Recommended</option>
                <option value="deadline">Upcoming Deadline</option>
                <option value="highest-amount">Highest Amount (₹)</option>
                <option value="recently-added">Recently Added</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Active:
              </span>
              {filters.category !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  Category: {filters.category}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setFilters((p) => ({ ...p, category: 'All' }))}
                  />
                </span>
              )}
              {filters.educationLevel !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  Level: {filters.educationLevel}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setFilters((p) => ({ ...p, educationLevel: 'All' }))}
                  />
                </span>
              )}
              {filters.state !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  State: {filters.state}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setFilters((p) => ({ ...p, state: 'All' }))}
                  />
                </span>
              )}
              {filters.gender !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  Gender: {filters.gender}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setFilters((p) => ({ ...p, gender: 'All' }))}
                  />
                </span>
              )}
              <button
                onClick={handleReset}
                className="text-xs font-bold text-red-600 hover:underline cursor-pointer ml-1"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Cards Grid */}
          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
              <p className="text-xs font-semibold text-slate-500">Querying database catalog...</p>
            </div>
          ) : scholarships.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {scholarships.map((sch) => (
                <ScholarshipCard
                  key={sch.id}
                  scholarship={sch}
                  isSaved={savedIds.includes(sch.id)}
                  onToggleSave={onToggleSave}
                  onSelect={onSelectScholarship}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                No matching scholarships found
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                Try widening your income ceiling or relaxing course/state restrictions.
              </p>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
