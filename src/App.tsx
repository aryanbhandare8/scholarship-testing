import React, { useState, useEffect } from 'react';
import { Scholarship, Application, ApplicationStatus } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// 15 Pages
import { HomePage } from './pages/HomePage';
import { ScholarshipsPage } from './pages/ScholarshipsPage';
import { ScholarshipDetailPage } from './pages/ScholarshipDetailPage';
import { AIMatchPage } from './pages/AIMatchPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { SavedScholarshipsPage } from './pages/SavedScholarshipsPage';
import { MyApplicationsPage } from './pages/MyApplicationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsDisclaimerPage } from './pages/TermsDisclaimerPage';
import { VerifyOtpPage } from './pages/VerifyOtpPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { ProtectedPage } from './pages/ProtectedPage';
import { SCHOLARSHIPS_DATA } from './data/scholarships';
import { OTPPurpose } from './types';

function AppContent() {
  const { user, role } = useAuth();
  const { toast } = useToast();

  // Current view route
  const [currentView, setCurrentView] = useState<string>('home');

  // Auth flow parameters
  const [authFlowEmail, setAuthFlowEmail] = useState<string>('');
  const [authFlowPurpose, setAuthFlowPurpose] = useState<OTPPurpose>('email_verification');

  // Selected scholarship for detailed page view
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);

  // Global cache of scholarships (preloaded with verified catalog, updated live from API)
  const [allScholarships, setAllScholarships] = useState<Scholarship[]>(SCHOLARSHIPS_DATA);

  // Saved IDs & full list
  const [savedIds, setSavedIds] = useState<string[]>(['sch-google-wtm', 'sch-reliance-foundation']);
  const [savedScholarships, setSavedScholarships] = useState<Scholarship[]>(() =>
    SCHOLARSHIPS_DATA.filter((s) => ['sch-google-wtm', 'sch-reliance-foundation'].includes(s.id))
  );

  // Applications list
  const [applications, setApplications] = useState<Application[]>([]);

  // Scroll to top on navigation change
  const navigateTo = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load scholarships & initial data from API
  const loadInitialData = async () => {
    try {
      // 1. All scholarships
      const schRes = await fetch('/api/scholarships?limit=50');
      if (schRes.ok) {
        const contentType = schRes.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const schData = await schRes.json();
          if (schData.scholarships && schData.scholarships.length > 0) {
            setAllScholarships(schData.scholarships);
          }
        }
      }

      // 2. User saved
      const savedRes = await fetch(`/api/user/saved?userId=${user?.id || 'usr-student-1'}`);
      if (savedRes.ok) {
        const contentType = savedRes.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const savedData = await savedRes.json();
          if (savedData.savedScholarships) {
            setSavedScholarships(savedData.savedScholarships);
            setSavedIds(savedData.savedScholarships.map((s: Scholarship) => s.id));
          }
        }
      }

      // 3. User applications
      const appRes = await fetch(`/api/user/applications?userId=${user?.id || 'usr-student-1'}`);
      if (appRes.ok) {
        const contentType = appRes.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const appData = await appRes.json();
          if (appData.applications) {
            setApplications(appData.applications);
          }
        }
      }
    } catch (e) {
      console.error('Error loading initial data:', e);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [user]);

  // Toggle Save/Bookmark
  const handleToggleSave = async (scholarshipId: string) => {
    const isCurrentlySaved = savedIds.includes(scholarshipId);
    const targetScholarship = allScholarships.find((s) => s.id === scholarshipId);

    if (isCurrentlySaved) {
      // Unsave
      setSavedIds((prev) => prev.filter((id) => id !== scholarshipId));
      setSavedScholarships((prev) => prev.filter((s) => s.id !== scholarshipId));
      try {
        await fetch(`/api/scholarships/${scholarshipId}/save`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user?.id }),
        });
        toast({
          title: 'Bookmark Removed',
          message: targetScholarship ? `${targetScholarship.title} removed from saved.` : undefined,
          type: 'info',
        });
      } catch (e) {
        console.error(e);
      }
    } else {
      // Save
      setSavedIds((prev) => [...prev, scholarshipId]);
      if (targetScholarship) {
        setSavedScholarships((prev) => [targetScholarship, ...prev]);
      }
      try {
        await fetch(`/api/scholarships/${scholarshipId}/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user?.id }),
        });
        toast({
          title: 'Scholarship Bookmarked!',
          message: 'Saved to your dashboard for quick reference.',
          type: 'success',
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Handle Apply button
  const handleApply = async (scholarship: Scholarship) => {
    // 1. Check if application already tracked
    const existing = applications.find((a) => a.scholarshipId === scholarship.id);
    if (!existing) {
      try {
        const res = await fetch('/api/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?.id,
            scholarshipId: scholarship.id,
            status: 'Applied',
            notes: 'Applied via official scholarship portal link.',
          }),
        });
        const data = await res.json();
        if (data.application) {
          setApplications((prev) => [data.application, ...prev]);
          toast({
            title: 'Application Tracked!',
            message: 'Added to your Student Dashboard tracker pipeline.',
            type: 'success',
          });
        }
      } catch (e) {
        console.error(e);
      }
    }

    // 2. Open official portal in new tab
    window.open(scholarship.applicationUrl, '_blank', 'noopener,noreferrer');
  };

  // Update Application status
  const handleUpdateApplicationStatus = async (
    scholarshipId: string,
    status: ApplicationStatus,
    notes: string
  ) => {
    const app = applications.find((a) => a.scholarshipId === scholarshipId);
    if (app) {
      try {
        const res = await fetch(`/api/applications/${app.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?.id,
            status,
            notes,
          }),
        });
        const data = await res.json();
        if (data.application) {
          setApplications((prev) =>
            prev.map((item) => (item.id === app.id ? data.application : item))
          );
          toast({
            title: 'Milestone Updated',
            message: `Status marked as "${status}".`,
            type: 'success',
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Select scholarship to view detail page
  const handleSelectScholarship = (scholarship: Scholarship) => {
    setSelectedScholarship(scholarship);
    navigateTo('details');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fbff] text-slate-900 selection:bg-blue-100 selection:text-blue-900 font-sans">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={navigateTo}
        savedCount={savedIds.length}
      />

      {/* Main Content Router across 15 Pages */}
      <main className="flex-1">
        {/* 1. Home Page */}
        {currentView === 'home' && (
          <HomePage
            onNavigate={navigateTo}
            featuredScholarships={allScholarships}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
            onSelectScholarship={handleSelectScholarship}
          />
        )}

        {/* 2. Scholarships Page (Search & Filters) */}
        {currentView === 'scholarships' && (
          <ScholarshipsPage
            onSelectScholarship={handleSelectScholarship}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
          />
        )}

        {/* 3. Scholarship Details Page */}
        {currentView === 'details' && selectedScholarship && (
          <ScholarshipDetailPage
            scholarship={selectedScholarship}
            onBack={() => navigateTo('scholarships')}
            isSaved={savedIds.includes(selectedScholarship.id)}
            onToggleSave={handleToggleSave}
            onApply={handleApply}
            isApplied={applications.some((a) => a.scholarshipId === selectedScholarship.id)}
          />
        )}

        {/* 4. AI Scholarship Match Page */}
        {currentView === 'ai-match' && (
          <AIMatchPage
            onSelectScholarship={handleSelectScholarship}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
          />
        )}

        {/* 5. Login Page */}
        {currentView === 'login' && (
          <LoginPage
            onNavigate={navigateTo}
            onRequireVerification={(email) => {
              setAuthFlowEmail(email);
              setAuthFlowPurpose('email_verification');
              navigateTo('verify-otp');
            }}
          />
        )}

        {/* 6. Sign Up Page */}
        {currentView === 'signup' && (
          <SignUpPage
            onNavigate={navigateTo}
            onRegistered={(email) => {
              setAuthFlowEmail(email);
              setAuthFlowPurpose('email_verification');
              navigateTo('verify-otp');
            }}
          />
        )}

        {/* 6.1. Verify OTP Page */}
        {currentView === 'verify-otp' && (
          <VerifyOtpPage
            onNavigate={navigateTo}
            email={authFlowEmail}
            purpose={authFlowPurpose}
            onSuccess={() => {
              if (authFlowPurpose === 'password_reset') {
                navigateTo('reset-password');
              } else {
                navigateTo('dashboard');
              }
            }}
          />
        )}

        {/* 6.2. Forgot Password Page */}
        {currentView === 'forgot-password' && (
          <ForgotPasswordPage
            onNavigate={navigateTo}
            onCodeSent={(email) => {
              setAuthFlowEmail(email);
              setAuthFlowPurpose('password_reset');
              navigateTo('verify-otp');
            }}
          />
        )}

        {/* 6.3. Reset Password Page */}
        {currentView === 'reset-password' && (
          <ResetPasswordPage
            onNavigate={navigateTo}
            initialEmail={authFlowEmail}
          />
        )}

        {/* 7. Student Dashboard (Protected) */}
        {currentView === 'dashboard' && (
          !user || !user.emailVerified ? (
            <ProtectedPage onNavigate={navigateTo} targetViewName="Student Dashboard" requiredRole="student" />
          ) : (
            <StudentDashboardPage
              onNavigate={navigateTo}
              savedScholarships={savedScholarships}
              applications={applications}
              recommendedScholarships={allScholarships}
              allScholarships={allScholarships}
              onSelectScholarship={handleSelectScholarship}
              onUpdateApplicationStatus={handleUpdateApplicationStatus}
            />
          )
        )}

        {/* 8. Saved Scholarships Page (Protected) */}
        {currentView === 'saved' && (
          !user || !user.emailVerified ? (
            <ProtectedPage onNavigate={navigateTo} targetViewName="Saved Scholarships" requiredRole="student" />
          ) : (
            <SavedScholarshipsPage
              savedScholarships={savedScholarships}
              onToggleSave={handleToggleSave}
              onSelectScholarship={handleSelectScholarship}
              onExplore={() => navigateTo('scholarships')}
            />
          )
        )}

        {/* 9. My Applications Page (Protected) */}
        {currentView === 'applications' && (
          !user || !user.emailVerified ? (
            <ProtectedPage onNavigate={navigateTo} targetViewName="My Applications" requiredRole="student" />
          ) : (
            <MyApplicationsPage
              applications={applications}
              onSelectScholarship={handleSelectScholarship}
              onUpdateStatus={handleUpdateApplicationStatus}
              onExplore={() => navigateTo('scholarships')}
            />
          )
        )}

        {/* 10. Student Profile Page (Protected) */}
        {currentView === 'profile' && (
          !user || !user.emailVerified ? (
            <ProtectedPage onNavigate={navigateTo} targetViewName="Student Profile" requiredRole="student" />
          ) : (
            <ProfilePage onNavigate={navigateTo} />
          )
        )}

        {/* 11. Admin Dashboard Page (Protected) */}
        {currentView === 'admin' && (
          !user || !user.emailVerified || user.role !== 'admin' ? (
            <ProtectedPage onNavigate={navigateTo} targetViewName="Admin Console" requiredRole="admin" />
          ) : (
            <AdminDashboardPage onSelectScholarship={handleSelectScholarship} />
          )
        )}

        {/* 12. About Page */}
        {currentView === 'about' && <AboutPage onNavigate={navigateTo} />}

        {/* 13. Privacy Policy Page */}
        {currentView === 'privacy' && <PrivacyPolicyPage />}

        {/* 14. Terms and Disclaimer Page */}
        {currentView === 'terms' && <TermsDisclaimerPage />}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}
