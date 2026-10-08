import React, { useState, useEffect } from 'react';
import {
  Shield,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Edit,
  ExternalLink,
  Users,
  FileCheck,
  Award,
  Clock,
  Layers,
  Building2,
  AlertTriangle,
  RotateCcw,
  Database,
  Download,
  Eye,
  RefreshCw,
  Copy,
  Check,
  Filter,
  X,
  GraduationCap,
  MapPin,
  IndianRupee,
  Calendar,
  Sparkles,
  Phone,
  Mail,
  User,
  SlidersHorizontal,
} from 'lucide-react';
import { Scholarship, Provider } from '../types';
import { AdminScholarshipModal } from '../components/AdminScholarshipModal';
import { useToast } from '../contexts/ToastContext';

interface AdminDashboardPageProps {
  onSelectScholarship: (scholarship: Scholarship) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onSelectScholarship,
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<
    'submissions' | 'scholarships' | 'students' | 'applications' | 'providers'
  >('submissions');

  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [adminStats, setAdminStats] = useState({
    totalScholarships: 12,
    verifiedScholarships: 12,
    totalStudents: 1,
    totalApplications: 3,
    expiringSoon: 9,
    totalFundingOffered: 1053000,
  });
  const [students, setStudents] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [supabaseSubmissions, setSupabaseSubmissions] = useState<any[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // Submissions Filters
  const [submissionSearch, setSubmissionSearch] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Selected Submission Modal for viewing full 18-point details
  const [inspectSubmission, setInspectSubmission] = useState<any | null>(null);

  // Scholarship Catalog Search
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states for scholarship add/edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);

  // Fetch admin data
  const loadAdminData = async () => {
    setLoadingSubmissions(true);
    try {
      const [statsRes, schRes, studRes, appRes, provRes, subRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/scholarships?limit=100'),
        fetch('/api/admin/students'),
        fetch('/api/admin/applications'),
        fetch('/api/providers'),
        fetch('/api/student-submissions'),
      ]);

      const statsData = await statsRes.json();
      const schData = await schRes.json();
      const studData = await studRes.json();
      const appData = await appRes.json();
      const provData = await provRes.json();
      const subData = await subRes.json();

      setAdminStats(statsData);
      if (schData.scholarships) setScholarships(schData.scholarships);
      if (studData.students) setStudents(studData.students);
      if (appData.applications) setApplications(appData.applications);
      if (provData.providers) setProviders(provData.providers);
      if (subData.submissions) setSupabaseSubmissions(subData.submissions);
    } catch (e) {
      console.error('Error fetching admin data:', e);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleSaveScholarship = async (data: Partial<Scholarship>) => {
    try {
      if (data.id && scholarships.some((s) => s.id === data.id)) {
        const res = await fetch(`/api/scholarships/${data.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const resData = await res.json();
        if (resData.success) {
          toast({
            title: 'Scholarship Updated',
            message: `${data.title} has been successfully updated in database.`,
            type: 'success',
          });
        }
      } else {
        const res = await fetch('/api/scholarships', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const resData = await res.json();
        if (resData.success) {
          toast({
            title: 'Scholarship Created',
            message: `${data.title} published to student catalog.`,
            type: 'success',
          });
        }
      }
      loadAdminData();
    } catch (e) {
      toast({
        title: 'Error Saving Record',
        message: 'Could not write to database.',
        type: 'error',
      });
    }
  };

  const handleDeleteScholarship = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/scholarships/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast({
          title: 'Scholarship Deleted',
          message: `${title} has been removed.`,
          type: 'info',
        });
        loadAdminData();
      }
    } catch (e) {
      toast({
        title: 'Error deleting scholarship',
        message: 'Database error occurred.',
        type: 'error',
      });
    }
  };

  const handleDeleteSubmission = async (id: string, name: string) => {
    if (!confirm(`Delete form submission for ${name}?`)) return;

    try {
      await fetch(`/api/student-submissions/${id}`, { method: 'DELETE' });
      setSupabaseSubmissions((prev) => prev.filter((s) => s.id !== id));
      toast({
        title: 'Submission Deleted',
        message: `Record for ${name} removed from admin panel.`,
        type: 'info',
      });
    } catch (e) {
      toast({
        title: 'Error deleting submission',
        message: 'Could not delete record.',
        type: 'error',
      });
    }
  };

  const handleAddSampleSubmission = async () => {
    const sampleNames = ['Rohan Kulkarni', 'Sneha Patil', 'Vikas Gupta', 'Aishwarya Nair'];
    const sampleColleges = ['VJTI Mumbai', 'IIT Bombay', 'Anna University', 'Manipal Institute of Technology'];
    const sampleCourses = ['B.Tech Computer Science', 'B.E. Electronics', 'M.Sc Biotechnology', 'B.Tech AI & ML'];
    const sampleStates = ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi'];
    const idx = Math.floor(Math.random() * sampleNames.length);

    const payload = {
      name: sampleNames[idx],
      email: `${sampleNames[idx].toLowerCase().replace(' ', '.')}@example.com`,
      phone: `+91 9${Math.floor(100000000 + Math.random() * 900000000)}`,
      age: 19 + Math.floor(Math.random() * 4),
      state: sampleStates[idx],
      city: sampleStates[idx] === 'Maharashtra' ? 'Mumbai' : 'Bengaluru',
      educationLevel: 'Undergraduate',
      institution: sampleColleges[idx],
      course: sampleCourses[idx],
      year: '2nd Year',
      academicScore: Math.floor(75 + Math.random() * 23),
      annualIncome: 150000 + Math.floor(Math.random() * 300000),
      category: ['General', 'OBC', 'EWS', 'SC'][Math.floor(Math.random() * 4)],
      gender: ['Male', 'Female'][Math.floor(Math.random() * 2)],
      disabilityStatus: false,
      preferences: { preferredCategory: 'CSR', preferredState: sampleStates[idx] },
      matchedCount: 6,
    };

    try {
      const res = await fetch('/api/student-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: 'Test Submission Added!',
          message: `Generated record for ${payload.name} and synced with Supabase.`,
          type: 'success',
        });
        loadAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Export submissions as CSV
  const handleExportCSV = () => {
    if (filteredSubmissions.length === 0) {
      toast({
        title: 'No Data to Export',
        message: 'No submissions match current filters.',
        type: 'error',
      });
      return;
    }

    const headers = [
      'ID',
      'Name',
      'Email',
      'Phone',
      'Age',
      'State',
      'City',
      'Education Level',
      'Institution',
      'Course',
      'Year',
      'Academic Score (%)',
      'Annual Income (INR)',
      'Category',
      'Gender',
      'Disability Status',
      'Matched Scholarships Count',
      'Submitted At',
    ];

    const rows = filteredSubmissions.map((s) => [
      `"${s.id || ''}"`,
      `"${s.name || ''}"`,
      `"${s.email || ''}"`,
      `"${s.phone || ''}"`,
      s.age || '',
      `"${s.state || ''}"`,
      `"${s.city || ''}"`,
      `"${s.education_level || s.educationLevel || ''}"`,
      `"${(s.institution || '').replace(/"/g, '""')}"`,
      `"${(s.course || '').replace(/"/g, '""')}"`,
      `"${s.year || ''}"`,
      s.academic_score || s.academicScore || '',
      s.annual_income || s.annualIncome || '',
      `"${s.category || ''}"`,
      `"${s.gender || ''}"`,
      s.disability_status || s.disabilityStatus ? 'Yes' : 'No',
      s.matched_scholarships_count || s.matchedCount || 0,
      `"${new Date(s.created_at || Date.now()).toLocaleString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `student_form_submissions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'CSV Exported Successfully!',
      message: `Downloaded ${filteredSubmissions.length} student submission records.`,
      type: 'success',
    });
  };

  // Submissions Filtering logic
  const filteredSubmissions = supabaseSubmissions.filter((sub) => {
    const q = submissionSearch.toLowerCase();
    const matchesSearch =
      !q ||
      (sub.name && sub.name.toLowerCase().includes(q)) ||
      (sub.email && sub.email.toLowerCase().includes(q)) ||
      (sub.phone && sub.phone.includes(q)) ||
      (sub.institution && sub.institution.toLowerCase().includes(q)) ||
      (sub.course && sub.course.toLowerCase().includes(q)) ||
      (sub.city && sub.city.toLowerCase().includes(q)) ||
      (sub.state && sub.state.toLowerCase().includes(q));

    const matchesState = selectedState === 'All' || sub.state === selectedState;
    const levelVal = sub.education_level || sub.educationLevel || '';
    const matchesLevel = selectedLevel === 'All' || levelVal.toLowerCase().includes(selectedLevel.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || sub.category === selectedCategory;

    return matchesSearch && matchesState && matchesLevel && matchesCategory;
  });

  // Calculate Metrics from Submissions
  const avgScore =
    supabaseSubmissions.length > 0
      ? (
          supabaseSubmissions.reduce((acc, curr) => acc + Number(curr.academic_score || curr.academicScore || 0), 0) /
          supabaseSubmissions.length
        ).toFixed(1)
      : '0.0';

  const avgIncome =
    supabaseSubmissions.length > 0
      ? Math.round(
          supabaseSubmissions.reduce((acc, curr) => acc + Number(curr.annual_income || curr.annualIncome || 0), 0) /
            supabaseSubmissions.length
        )
      : 0;

  const filteredScholarships = scholarships.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner: Master Admin Title & Credentials Highlight */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
              <Shield className="w-3.5 h-3.5 text-amber-600" />
              <span>Dedicated Admin Panel</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Supabase DB: <code className="font-mono text-[11px]">veomsjrzqxwcugwyjwym</code></span>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Admin Control Center & Form Data
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Access student form submissions, analyze eligibility inputs, export spreadsheets, and manage official scholarships.
          </p>
        </div>

        {/* Action Header Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setEditingScholarship(null);
              setModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Scholarship</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Form Submissions
          </div>
          <div className="text-2xl font-extrabold text-blue-600">
            {supabaseSubmissions.length}
          </div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1">Live in Supabase DB</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Avg Academic Score
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {avgScore}%
          </div>
          <div className="text-[10px] text-slate-400 font-medium mt-1">Across all applicants</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Avg Family Income
          </div>
          <div className="text-2xl font-extrabold text-purple-600">
            ₹{avgIncome > 0 ? (avgIncome / 1000).toFixed(0) + 'k' : '0'}
          </div>
          <div className="text-[10px] text-slate-400 font-medium mt-1">Annual household</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Verified Scholarships
          </div>
          <div className="text-2xl font-extrabold text-emerald-600">
            {adminStats.verifiedScholarships}
          </div>
          <div className="text-[10px] text-slate-400 font-medium mt-1">NSP, CSR & Private</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs col-span-2 lg:col-span-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Total Fund Pools
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            ₹{(adminStats.totalFundingOffered / 100000).toFixed(1)}L
          </div>
          <div className="text-[10px] text-slate-400 font-medium mt-1">Tracked in directory</div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-1 overflow-x-auto">
        {[
          { id: 'submissions', label: `📋 Student Form Submissions (${supabaseSubmissions.length})` },
          { id: 'scholarships', label: `Scholarship Catalog (${scholarships.length})` },
          { id: 'students', label: `Registered Students (${students.length})` },
          { id: 'applications', label: `Applications Pipeline (${applications.length})` },
          { id: 'providers', label: `Verified Providers (${providers.length})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`pb-3.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === t.id
                ? 'border-blue-600 text-blue-600 bg-blue-50/30'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ALL DATA OF FILLING FORM (PRIMARY REQUEST) */}
      {/* ========================================================================= */}
      {activeTab === 'submissions' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
          {/* Top Control Bar with Search, Filters, Export & Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Student Form Submissions</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                  {filteredSubmissions.length} of {supabaseSubmissions.length} Records
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every detail submitted through the AI match assessment and student profile forms.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleAddSampleSubmission}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                title="Add a sample test entry to verify database storage"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Simulate Test Submission</span>
              </button>

              <button
                onClick={loadAdminData}
                disabled={loadingSubmissions}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                title="Refresh latest data from Supabase"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingSubmissions ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                title="Download data as CSV Spreadsheet"
              >
                <Download className="w-4 h-4" />
                <span>Export to CSV</span>
              </button>
            </div>
          </div>

          {/* Filter Toolbar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={submissionSearch}
                onChange={(e) => setSubmissionSearch(e.target.value)}
                placeholder="Search by student, college, email..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              {submissionSearch && (
                <button
                  onClick={() => setSubmissionSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* State Filter */}
            <div>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
              >
                <option value="All">All Domicile States</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Delhi">Delhi</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Gujarat">Gujarat</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Telangana">Telangana</option>
              </select>
            </div>

            {/* Level Filter */}
            <div>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
              >
                <option value="All">All Education Levels</option>
                <option value="Undergraduate">Undergraduate (B.E / B.Tech / B.Sc)</option>
                <option value="Postgraduate">Postgraduate (M.Tech / M.Sc / MBA)</option>
                <option value="Diploma">Diploma / Polytechnic</option>
                <option value="Class 11-12">Class 11-12 (Higher Secondary)</option>
                <option value="PhD">Doctoral / Research (PhD)</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
              >
                <option value="All">All Social Categories</option>
                <option value="General">General / Open</option>
                <option value="OBC">OBC (Other Backward Class)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="EWS">EWS (Economically Weaker Section)</option>
                <option value="Minority">Religious Minority</option>
              </select>
            </div>
          </div>

          {/* Submissions Data Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            {filteredSubmissions.length > 0 ? (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Student & Contact</th>
                    <th className="py-3 px-4">Education & College</th>
                    <th className="py-3 px-4">Domicile</th>
                    <th className="py-3 px-4">Marks</th>
                    <th className="py-3 px-4">Annual Income</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Matches</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredSubmissions.map((sub) => {
                    const score = Number(sub.academic_score || sub.academicScore || 0);
                    const income = Number(sub.annual_income || sub.annualIncome || 0);
                    const level = sub.education_level || sub.educationLevel || 'Undergraduate';

                    return (
                      <tr key={sub.id} className="hover:bg-blue-50/40 transition-colors">
                        {/* Student Name & Contact */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{sub.name}</span>
                            {sub.age && (
                              <span className="text-[10px] px-1 py-0.2 rounded bg-slate-100 text-slate-600 font-normal">
                                {sub.age} yrs
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-normal mt-0.5">{sub.email || 'No email'}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{sub.phone || 'Phone pending'}</div>
                        </td>

                        {/* Education & College */}
                        <td className="py-3.5 px-4 max-w-[200px]">
                          <div className="font-semibold text-slate-800 line-clamp-1">{sub.course || 'Degree'}</div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">{sub.institution || 'Institution'}</div>
                          <div className="text-[10px] text-blue-600 font-semibold">{level} • {sub.year || 'Current'}</div>
                        </td>

                        {/* Domicile */}
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-800">{sub.state}</div>
                          <div className="text-[11px] text-slate-400">{sub.city}</div>
                        </td>

                        {/* Academic Score */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded font-extrabold text-[11px] ${
                              score >= 85
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : score >= 70
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {score}%
                          </span>
                        </td>

                        {/* Income */}
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          ₹{income.toLocaleString('en-IN')}
                        </td>

                        {/* Category & Gender */}
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px] font-semibold">
                            {sub.category}
                          </span>
                          <div className="text-[10px] text-slate-400 mt-0.5">{sub.gender || 'All'}</div>
                        </td>

                        {/* Matched Count */}
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-bold">
                            {sub.matched_scholarships_count || sub.matchedCount || 5} Schemes
                          </span>
                        </td>

                        {/* Submitted Date */}
                        <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                          {new Date(sub.created_at || Date.now()).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                          <button
                            onClick={() => setInspectSubmission(sub)}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1"
                            title="View Full Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect</span>
                          </button>

                          <button
                            onClick={() => handleDeleteSubmission(sub.id, sub.name)}
                            className="p-1 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer inline-flex items-center"
                            title="Delete Submission"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="py-12 text-center text-slate-500 text-xs">
                <Database className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="font-semibold text-slate-700">No student form submissions matched the selected filters.</p>
                <p className="text-[11px] text-slate-400 mt-1">Try resetting filters or click "+ Simulate Test Submission" above.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SCHOLARSHIPS MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'scholarships' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search catalog by title, provider, or category..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
              />
            </div>

            <button
              onClick={() => {
                setEditingScholarship(null);
                setModalOpen(true);
              }}
              className="px-3.5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Record</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Scholarship Title</th>
                  <th className="py-3 px-4">Provider</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Deadline</th>
                  <th className="py-3 px-4">Verified</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredScholarships.map((sch) => (
                  <tr key={sch.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 leading-snug line-clamp-1">
                        {sch.title}
                      </div>
                      <div className="text-[10px] text-slate-400">ID: {sch.id}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{sch.providerName}</td>
                    <td className="py-3.5 px-4 font-bold text-blue-600">{sch.amountFormatted}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
                        {sch.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{sch.deadlineDisplay}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${sch.verified ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {sch.verified ? 'Verified ✓' : 'Unverified'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingScholarship(sch);
                          setModalOpen(true);
                        }}
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                        title="Edit Record"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteScholarship(sch.id, sch.title)}
                        className="p-1.5 hover:bg-red-50 rounded text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: REGISTERED STUDENTS */}
      {/* ========================================================================= */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6">
          <h2 className="text-base font-bold text-slate-900 mb-4">Registered Student Accounts</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Institution</th>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">State</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Applications</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{student.name}</td>
                    <td className="py-3.5 px-4 text-slate-600">{student.email}</td>
                    <td className="py-3.5 px-4 text-slate-800">{student.institution}</td>
                    <td className="py-3.5 px-4 text-slate-600">{student.course}</td>
                    <td className="py-3.5 px-4 text-slate-600">{student.state}</td>
                    <td className="py-3.5 px-4 font-bold text-blue-600">{student.academicScore}%</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[11px]">
                        {student.applicationsCount} Tracked
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: APPLICATIONS LOG */}
      {/* ========================================================================= */}
      {activeTab === 'applications' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6">
          <h2 className="text-base font-bold text-slate-900 mb-4">Live Student Application Milestones</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Scholarship Scheme</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Applied Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {app.studentName}
                      <span className="block text-[10px] text-slate-400 font-normal">{app.studentEmail}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 font-medium">{app.scholarshipTitle}</td>
                    <td className="py-3.5 px-4 font-bold text-blue-600">₹{app.amount.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700">
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{new Date(app.appliedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: PARTNER PROVIDERS */}
      {/* ========================================================================= */}
      {activeTab === 'providers' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6">
          <h2 className="text-base font-bold text-slate-900 mb-4">Partner Organizations & Providers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {providers.map((p) => (
              <div key={p.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xl shrink-0">
                  {p.logo}
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">{p.name}</h3>
                    {p.verified && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{p.description}</p>
                  <a
                    href={p.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-blue-600 font-bold hover:underline pt-1"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: FULL STUDENT FORM DOSSIER INSPECTOR */}
      {/* ========================================================================= */}
      {inspectSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center shadow-sm">
                  {inspectSubmission.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">{inspectSubmission.name}</h3>
                  <p className="text-xs text-slate-500">
                    ID: {inspectSubmission.id} • Submitted: {new Date(inspectSubmission.created_at || Date.now()).toLocaleString()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setInspectSubmission(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dossier Grid */}
            <div className="space-y-4 text-xs">
              {/* Card 1: Contact & Personal */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>Step 1: Personal & Domicile</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Email Address</span>
                    <span className="font-semibold text-slate-900">{inspectSubmission.email || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Phone Number</span>
                    <span className="font-semibold text-slate-900">{inspectSubmission.phone || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Age</span>
                    <span className="font-semibold text-slate-900">{inspectSubmission.age ? `${inspectSubmission.age} years` : 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">State Domicile</span>
                    <span className="font-semibold text-slate-900">{inspectSubmission.state || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">City / District</span>
                    <span className="font-semibold text-slate-900">{inspectSubmission.city || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Gender</span>
                    <span className="font-semibold text-slate-900">{inspectSubmission.gender || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Academic Background */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                  <span>Step 2: Educational Enrollment</span>
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Education Level</span>
                    <span className="font-semibold text-slate-900">{inspectSubmission.education_level || inspectSubmission.educationLevel || 'Undergraduate'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Academic Year / Sem</span>
                    <span className="font-semibold text-slate-900">{inspectSubmission.year || '2nd Year'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[10px]">School / College / University</span>
                    <span className="font-semibold text-slate-900">{inspectSubmission.institution || 'N/A'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[10px]">Degree & Course Stream</span>
                    <span className="font-semibold text-slate-900">{inspectSubmission.course || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Eligibility & Marks */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-blue-600" />
                  <span>Step 3: Academic Score & Socio-Economic Quota</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Percentage / CGPA</span>
                    <span className="font-extrabold text-blue-600 text-sm">{inspectSubmission.academic_score || inspectSubmission.academicScore}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Annual Family Income</span>
                    <span className="font-extrabold text-slate-900 text-sm">₹{Number(inspectSubmission.annual_income || inspectSubmission.annualIncome || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Reservation Category</span>
                    <span className="font-bold text-slate-800">{inspectSubmission.category || 'General'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Person with Disability</span>
                    <span className="font-bold text-slate-800">{inspectSubmission.disability_status || inspectSubmission.disabilityStatus ? 'Yes (PwD)' : 'No'}</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Match Summary */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-indigo-950 flex items-center justify-between">
                <div>
                  <div className="font-bold">Recommendation Matches Computed</div>
                  <div className="text-[11px] text-indigo-800 mt-0.5">
                    This profile matched with {inspectSubmission.matched_scholarships_count || inspectSubmission.matchedCount || 5} active government and CSR scholarship schemes.
                  </div>
                </div>
                <span className="text-xl font-extrabold text-indigo-700 bg-white px-3 py-1.5 rounded-xl border border-indigo-200">
                  {inspectSubmission.matched_scholarships_count || inspectSubmission.matchedCount || 5}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  if (inspectSubmission.email) {
                    navigator.clipboard.writeText(inspectSubmission.email);
                    toast({
                      title: 'Copied Student Email',
                      message: `${inspectSubmission.email} copied to clipboard.`,
                      type: 'info',
                    });
                  }
                }}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Copy Email</span>
              </button>

              <button
                onClick={() => setInspectSubmission(null)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scholarship Add/Edit Modal */}
      {modalOpen && (
        <AdminScholarshipModal
          scholarshipToEdit={editingScholarship}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveScholarship}
        />
      )}
    </div>
  );
};
