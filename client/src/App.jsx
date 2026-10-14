import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MockTestCatalog from './components/MockTestCatalog';
import TypingTest from './components/TypingTest';
import CandidateModal from './components/CandidateModal';
import ScorecardModal from './components/ScorecardModal';
import HistoryView from './components/HistoryView';
import ExamRulesView from './components/ExamRulesView';
import TouchTypingTrainer from './components/TouchTypingTrainer';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  // Auth User State (Gmail & Password Session)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ssc_auth_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  const [activeTab, setActiveTab] = useState(() => {
    // Hidden Secret Admin Panel (Accessible only to owner via ?admin=quizlauncher)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('admin') === 'quizlauncher') {
        return 'admin';
      }
    } catch (e) {}

    // If not logged in, prompt login screen initially
    const savedUser = localStorage.getItem('ssc_auth_user');
    return savedUser ? 'catalog' : 'login';
  });

  const [examFilter, setExamFilter] = useState('ALL'); // 'ALL' | 'SSC_CGL' | 'SSC_CHSL' | 'RRB_NTPC'
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return false;
  });
  
  const [passages, setPassages] = useState([]);
  const [currentPassage, setCurrentPassage] = useState(null);
  const [history, setHistory] = useState([]);
  
  // Modals
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [activeResult, setActiveResult] = useState(null);

  // Candidate Profile (saved in LocalStorage)
  const [candidateInfo, setCandidateInfo] = useState(() => {
    try {
      const savedAuth = localStorage.getItem('ssc_auth_user');
      if (savedAuth) {
        const u = JSON.parse(savedAuth);
        return {
          name: u.name,
          email: u.email,
          rollNo: u.rollNo,
          examType: u.examType || 'SSC_CGL',
          category: u.category || 'UR'
        };
      }
      const saved = localStorage.getItem('ssc_candidate_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      name: 'Ashish Kumar',
      email: 'ashish.cgl@gmail.com',
      rollNo: '2401058392',
      examType: 'SSC_CGL',
      category: 'UR'
    };
  });

  // Save Candidate Profile
  const handleUpdateCandidateInfo = (info) => {
    setCandidateInfo(info);
    try {
      localStorage.setItem('ssc_candidate_profile', JSON.stringify(info));
    } catch (e) {}
  };

  const [testSessionConfig, setTestSessionConfig] = useState({
    mode: 'practice', // 'practice' | 'exam'
    pattern: 'ediquity' // 'ediquity' | 'tcs'
  });

  // Launch a Mock Test on Click (Supports Practice Mode with Guidance or Real Exam Mode with Ediquity/TCS Pattern)
  const handleStartMock = (mockPassage, mode = 'practice', pattern = 'ediquity') => {
    let targetExam = 'SSC_CGL';
    if (mockPassage.category === 'RRB NTPC Graduate') targetExam = 'RRB_NTPC_GRAD';
    else if (mockPassage.category === 'RRB NTPC UG') targetExam = 'RRB_NTPC_UG';
    else if (mockPassage.category.startsWith('RRB NTPC')) targetExam = 'RRB_NTPC';
    else if (mockPassage.category === 'SSC CHSL') targetExam = 'SSC_CHSL';

    const isNTPCExam = targetExam.startsWith('RRB_NTPC');
    const finalPattern = isNTPCExam ? 'tcs' : pattern;

    handleUpdateCandidateInfo({ ...candidateInfo, examType: targetExam });
    setCurrentPassage(mockPassage);
    setTestSessionConfig({ mode, pattern: finalPattern });
    setActiveTab('test');
  };

  // Filter selection from Sidebar
  const handleSidebarFilter = (examType) => {
    setExamFilter(examType);
    setActiveTab('catalog');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'touch-typing') {
      setSidebarOpen(false);
    }
  };

  // Fetch Passages from Backend
  const fetchPassages = async () => {
    try {
      const res = await fetch('/api/passages');
      const data = await res.json();
      if (data.success && data.passages.length > 0) {
        setPassages(data.passages);
        if (!currentPassage) {
          setCurrentPassage(data.passages[0]);
        }
      }
    } catch (err) {
      console.warn('Backend loading passages:', err);
    }
  };

  // Fetch History for Logged-In User from Backend
  const fetchHistory = async (emailOverride) => {
    try {
      const userEmail = emailOverride !== undefined ? emailOverride : (currentUser?.email || candidateInfo?.email || '');
      const url = userEmail ? `/api/history?email=${encodeURIComponent(userEmail)}` : '/api/history';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setHistory(data.history);
      }
    } catch (err) {
      console.warn('Could not load history:', err);
    }
  };

  useEffect(() => {
    fetchPassages();
    fetchHistory();
  }, []);

  // Handle Login Success
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('ssc_auth_user', JSON.stringify(user));
    } catch (e) {}

    const updatedProfile = {
      name: user.name,
      email: user.email,
      rollNo: user.rollNo,
      examType: user.examType || 'SSC_CGL',
      category: user.category || 'UR'
    };

    setCandidateInfo(updatedProfile);
    try {
      localStorage.setItem('ssc_candidate_profile', JSON.stringify(updatedProfile));
    } catch (e) {}

    fetchHistory(user.email);
    setActiveTab('catalog');
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('ssc_auth_user');
    } catch (e) {}
    setHistory([]);
    setActiveTab('login');
  };

  // Handle Continue as Guest
  const handleContinueAsGuest = () => {
    setActiveTab('catalog');
  };

  // Handle Test Completion
  const handleTestComplete = (resultData) => {
    setActiveResult(resultData);
    fetchHistory();
  };

  // Handle Clear History
  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to delete past test records for this account?')) return;
    try {
      const email = currentUser?.email || candidateInfo?.email;
      const url = email ? `/api/history?email=${encodeURIComponent(email)}` : '/api/history';
      await fetch(url, { method: 'DELETE' });
      setHistory([]);
    } catch (err) {
      console.error(err);
    }
  };

  // Dedicated Full-Screen Login Page
  if (activeTab === 'login') {
    return (
      <LoginPage 
        onLoginSuccess={handleLoginSuccess}
        onContinueAsGuest={handleContinueAsGuest}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      
      {/* Top Navbar with Telegram and Auth Controls */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        candidateInfo={candidateInfo}
        setCandidateModalOpen={setIsCandidateModalOpen}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side Dashboard (Clean White / Light Gray) */}
        {activeTab !== 'test' && (
          <Sidebar
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            candidateInfo={candidateInfo}
            setCandidateModalOpen={setIsCandidateModalOpen}
            history={history}
            isOpen={sidebarOpen}
            setIsOpen={setSidebarOpen}
            onSelectExamFilter={handleSidebarFilter}
            currentUser={currentUser}
          />
        )}

        {/* Center / Right Content Panel */}
        <main className="flex-1 overflow-y-auto">
          
          {/* Default Clean White View: Mock Test Selection Catalog */}
          {activeTab === 'catalog' && (
            <MockTestCatalog
              passages={passages}
              onStartMock={handleStartMock}
              candidateInfo={candidateInfo}
              setCandidateModalOpen={setIsCandidateModalOpen}
              activeFilter={examFilter}
              setActiveFilter={setExamFilter}
            />
          )}

          {/* Authentic Examination Screen: Practice Mode (with Help/Sidebar) or Real Exam Mode (Distraction-Free Ediquity/TCS Pattern) */}
          {activeTab === 'test' && currentPassage && (
            <TypingTest
              passage={currentPassage}
              candidateInfo={candidateInfo}
              initialMode={testSessionConfig.mode}
              initialPattern={testSessionConfig.pattern}
              onTestComplete={handleTestComplete}
              allPassages={passages}
              onSelectPassage={(p) => setCurrentPassage(p)}
              onExitTest={() => setActiveTab('catalog')}
            />
          )}

          {/* 10-Finger Touch Typing Course */}
          {activeTab === 'touch-typing' && (
            <TouchTypingTrainer />
          )}

          {/* Past Attempts History (User-specific) */}
          {activeTab === 'history' && (
            <HistoryView
              history={history}
              onClearHistory={handleClearHistory}
              onInspectAttempt={(record) => setActiveResult(record)}
              candidateInfo={candidateInfo}
            />
          )}

          {/* Official SSC & Railway Rules */}
          {activeTab === 'rules' && (
            <ExamRulesView />
          )}

          {/* Hidden Admin Analytics Dashboard */}
          {activeTab === 'admin' && (
            <AdminDashboard onInspectAttempt={(record) => setActiveResult(record)} />
          )}

        </main>
      </div>

      {/* Legal Fair-Use Disclaimer Footer */}
      {activeTab !== 'test' && (
        <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-8 px-4 sm:px-6 lg:px-8 mt-12 select-none">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-600 px-2 py-1 rounded-lg text-white font-black text-xs tracking-wider">
                  QQ
                </div>
                <span className="font-extrabold text-white text-sm">
                  QQ_typing • SSC & Railway DEST Portal
                </span>
              </div>
              <div className="flex items-center space-x-4 text-xs font-semibold">
                <a 
                  href="https://t.me/quizlauncherssc" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1"
                >
                  <span>Telegram: @quizlauncherssc</span>
                </a>
                <span className="text-slate-600">•</span>
                <button onClick={() => setActiveTab('rules')} className="hover:text-white transition">
                  Exam Rules
                </button>
              </div>
            </div>

            {/* Legal Fair Use Disclaimer */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400 text-[11px] leading-relaxed space-y-2">
              <p className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                Legal Disclaimer & Educational Fair Dealing Notice:
              </p>
              <p>
                <strong>QQ_typing</strong> is an independent educational practice simulator designed solely for candidate learning, keyboard fluency, and competitive examination preparation. This platform is <strong>not affiliated with, associated with, authorized by, endorsed by, or in any way officially connected</strong> with the Staff Selection Commission (SSC), Railway Recruitment Boards (RRB), Tata Consultancy Services (TCS), Ediquity Technologies, or any government department.
              </p>
              <p>
                All exam names (SSC CGL, SSC CHSL, RRB NTPC, DEST) and interface styles on this portal are referenced strictly under the <strong>Nominative Fair Use</strong> and <strong>Educational Fair Dealing doctrine (Section 52 of the Indian Copyright Act, 1957)</strong> for descriptive and academic preparation purposes only. All respective trademarks and registered marks belong exclusively to their respective institutional holders.
              </p>
            </div>

            <div className="text-center text-[10px] text-slate-600 pt-1">
              © {new Date().getFullYear()} QQ_typing Educational Bench. Built for Indian Government Exam Aspirants.
            </div>
          </div>
        </footer>
      )}

      {/* Candidate Profile / Exam Target Config Modal */}
      <CandidateModal
        isOpen={isCandidateModalOpen}
        onClose={() => setIsCandidateModalOpen(false)}
        candidateInfo={candidateInfo}
        onSave={handleUpdateCandidateInfo}
      />

      {/* Official Scorecard Modal (DEST Diagnostic & Pass/Fail Analysis) */}
      {activeResult && (
        <ScorecardModal
          result={activeResult}
          candidateInfo={candidateInfo}
          onClose={() => {
            if (document.fullscreenElement && document.exitFullscreen) {
              document.exitFullscreen().catch(() => {});
            }
            setActiveResult(null);
            setActiveTab('catalog');
          }}
          onRetake={() => {
            if (document.fullscreenElement && document.exitFullscreen) {
              document.exitFullscreen().catch(() => {});
            }
            setActiveResult(null);
            setActiveTab('catalog');
          }}
        />
      )}

    </div>
  );
}
