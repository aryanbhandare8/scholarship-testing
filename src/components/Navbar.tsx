import React, { useState } from 'react';
import {
  GraduationCap,
  Search,
  Sparkles,
  LayoutGrid,
  Bookmark,
  FileCheck,
  User as UserIcon,
  Shield,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Info,
  SlidersHorizontal,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  savedCount,
}) => {
  const { user, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNav = (view: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNav('home')}
          className="flex items-center gap-3.5 text-left focus:outline-none group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-all">
            <GraduationCap className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900 tracking-tight leading-none">
              Scholarship Finder
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1 leading-none">
              One Place. Every Opportunity.
            </div>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <button
            onClick={() => handleNav('home')}
            className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              currentView === 'home'
                ? 'text-blue-600 bg-blue-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => handleNav('scholarships')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              currentView === 'scholarships'
                ? 'text-blue-600 bg-blue-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Scholarships</span>
          </button>

          <button
            onClick={() => handleNav('ai-match')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              currentView === 'ai-match'
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>AI Match</span>
          </button>

          <button
            onClick={() => handleNav('about')}
            className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              currentView === 'about'
                ? 'text-blue-600 bg-blue-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            About
          </button>
        </nav>

        {/* User Session Area */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-3 rounded-2xl hover:bg-slate-100/80 border border-slate-200 transition-colors cursor-pointer"
              >
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-800 leading-none">
                    {role === 'admin' ? 'Administrator' : user.name}
                  </div>
                  <div className="text-[11px] text-slate-400 leading-none mt-1">
                    {role === 'admin' ? 'Admin Access' : 'Student Account'}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  {role === 'admin' ? 'A' : user.name.charAt(0).toUpperCase()}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50">
                  {role === 'student' ? (
                    <>
                      <button
                        onClick={() => handleNav('dashboard')}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 text-left transition-colors cursor-pointer"
                      >
                        <LayoutGrid className="w-4 h-4 text-blue-600" />
                        <span>Student Dashboard</span>
                      </button>

                      <button
                        onClick={() => handleNav('saved')}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 text-left transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <Bookmark className="w-4 h-4 text-blue-600" />
                          <span>Saved Scholarships</span>
                        </div>
                        {savedCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                            {savedCount}
                          </span>
                        )}
                      </button>

                      <button
                        onClick={() => handleNav('applications')}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 text-left transition-colors cursor-pointer"
                      >
                        <FileCheck className="w-4 h-4 text-blue-600" />
                        <span>My Applications</span>
                      </button>

                      <button
                        onClick={() => handleNav('profile')}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 text-left transition-colors cursor-pointer"
                      >
                        <UserIcon className="w-4 h-4 text-blue-600" />
                        <span>Profile & Eligibility</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleNav('admin')}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 text-left transition-colors cursor-pointer"
                      >
                        <Shield className="w-4 h-4 text-blue-600" />
                        <span>Admin Console</span>
                      </button>
                      <button
                        onClick={() => handleNav('scholarships')}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 text-left transition-colors cursor-pointer"
                      >
                        <Search className="w-4 h-4 text-blue-600" />
                        <span>Manage Scholarships</span>
                      </button>
                    </>
                  )}

                  <div className="my-1 border-t border-slate-100"></div>

                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 text-left transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNav('login')}
                className="text-sm font-semibold text-slate-700 hover:text-blue-600 px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={() => handleNav('signup')}
                className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-2xl">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => handleNav('home')}
              className={`p-2.5 text-center text-xs font-bold rounded-xl ${
                currentView === 'home' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('scholarships')}
              className={`p-2.5 text-center text-xs font-bold rounded-xl ${
                currentView === 'scholarships' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Scholarships
            </button>
            <button
              onClick={() => handleNav('ai-match')}
              className={`p-2.5 text-center text-xs font-bold rounded-xl ${
                currentView === 'ai-match' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700'
              }`}
            >
              ✨ AI Match
            </button>
            <button
              onClick={() => handleNav('dashboard')}
              className={`p-2.5 text-center text-xs font-bold rounded-xl ${
                currentView === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              Dashboard
            </button>
          </div>

          <div className="space-y-1 pt-2 border-t border-slate-100">
            {role === 'student' && user && (
              <>
                <button
                  onClick={() => handleNav('saved')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <span className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-blue-600" />
                    Saved Scholarships
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                    {savedCount}
                  </span>
                </button>
                <button
                  onClick={() => handleNav('applications')}
                  className="w-full flex items-center gap-2 p-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <FileCheck className="w-4 h-4 text-blue-600" />
                  My Applications
                </button>
                <button
                  onClick={() => handleNav('profile')}
                  className="w-full flex items-center gap-2 p-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <UserIcon className="w-4 h-4 text-blue-600" />
                  Profile & Eligibility
                </button>
              </>
            )}

            <button
              onClick={() => handleNav('about')}
              className="w-full flex items-center gap-2 p-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Info className="w-4 h-4 text-slate-400" />
              About Scholarship Finder
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => handleNav('login')}
                className="w-full py-2.5 rounded-xl text-center text-xs font-bold bg-blue-600 text-white"
              >
                Login / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
