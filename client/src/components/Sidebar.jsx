import React from 'react';
import { 
  Keyboard, 
  BookOpen, 
  History, 
  HelpCircle, 
  Flame, 
  Sparkles, 
  Award, 
  Train, 
  Landmark, 
  TrendingUp, 
  UserCheck, 
  ChevronLeft, 
  ChevronRight,
  Layers,
  Zap,
  Grid,
  Send,
  ExternalLink,
  LogIn,
  X
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  candidateInfo, 
  setCandidateModalOpen,
  history,
  isOpen,
  setIsOpen,
  onSelectExamFilter,
  currentUser
}) {
  const totalTests = history?.length || 0;
  const avgWPM = totalTests > 0 
    ? Math.round(history.reduce((a, b) => a + (b.netWPM || 0), 0) / totalTests) 
    : 0;

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  const handleExamClick = (examType) => {
    onSelectExamFilter(examType);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  const handleCandidateClick = () => {
    setCandidateModalOpen(true);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay (Closes drawer on outside click) */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      <aside 
        className={`
          bg-white border-r border-gray-200 text-gray-800 flex flex-col h-full transition-all duration-300 z-50 shrink-0
          fixed lg:static inset-y-0 left-0
          ${isOpen 
            ? 'w-72 sm:w-64 translate-x-0 shadow-2xl lg:shadow-none' 
            : '-translate-x-full lg:translate-x-0 w-0 lg:w-16 overflow-hidden lg:overflow-visible'
          }
        `}
      >
        <div className="shrink-0">
        {/* Sidebar Header & Toggle */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {isOpen ? (
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="bg-blue-600 p-2 rounded-xl text-white shadow-xs shrink-0">
                <Keyboard className="w-5 h-5" />
              </div>
              <div className="truncate">
                <h1 className="font-bold text-sm text-gray-900 tracking-tight leading-none">
                  Typing Portal
                </h1>
                <span className="text-[10px] text-blue-600 font-bold tracking-wider uppercase">
                  SSC • NTPC DEST
                </span>
              </div>
            </div>
          ) : (
            <div className="mx-auto bg-blue-600 p-2 rounded-xl text-white shadow-xs">
              <Keyboard className="w-5 h-5" />
            </div>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
            title={isOpen ? "Close Sidebar" : "Expand Sidebar"}
          >
            <X className="w-5 h-5 lg:hidden text-gray-600" />
            <span className="hidden lg:inline">
              {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </span>
          </button>
        </div>

        {/* Candidate Profile Widget */}
        <div className="p-3 border-b border-gray-100">
          <button
            onClick={handleCandidateClick}
            className={`w-full text-left p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 transition flex items-center ${isOpen ? 'space-x-3' : 'justify-center'}`}
            title="Edit Candidate & Exam Category"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center uppercase shrink-0 shadow-xs">
              {candidateInfo.name.charAt(0) || 'C'}
            </div>
            {isOpen && (
              <div className="truncate text-xs">
                <div className="font-bold text-gray-900 truncate">{candidateInfo.name}</div>
                <div className="text-[10px] text-blue-700 font-semibold truncate">
                  {candidateInfo.examType.replace('_', ' ')} • {candidateInfo.category}
                </div>
              </div>
            )}
          </button>
        </div>

        {/* Top Pinned: Performance Snapshot & Telegram Community (Visible without scrolling) */}
        {isOpen ? (
          <div className="px-3 pt-2.5 pb-2 space-y-2 border-b border-gray-100">
            {/* Performance Stats */}
            <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs">
              <div className="flex items-center justify-between text-gray-600">
                <span className="flex items-center gap-1 font-semibold text-[11px] text-gray-700">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Avg Speed</span>
                </span>
                <span className="font-mono font-bold text-emerald-600 text-xs">
                  {avgWPM} WPM
                </span>
              </div>
              <div className="flex items-center justify-between text-gray-500 text-[10px] mt-1">
                <span>Attempts:</span>
                <span className="font-mono font-bold text-gray-900">{totalTests}</span>
              </div>
            </div>

            {/* Official Telegram Community */}
            <div className="p-2.5 bg-gradient-to-br from-[#0088cc]/10 to-sky-500/10 border border-[#0088cc]/30 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-[#0088cc] font-bold text-xs">
                  <Send className="w-3.5 h-3.5 -rotate-12" />
                  <span>Telegram Community</span>
                </div>
              </div>
              <div className="text-xs font-black text-gray-900 mt-0.5">@quizlauncherssc</div>
              <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">
                Daily Typing PDFs, Quizzes & Exam DEST updates
              </p>
              <a
                href="https://t.me/quizlauncherssc"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 w-full flex items-center justify-center space-x-1.5 py-1.5 px-2 bg-[#0088cc] hover:bg-[#0077b5] text-white text-[11px] font-bold rounded-xl transition shadow-xs"
              >
                <Send className="w-3 h-3 -rotate-12" />
                <span>Join Telegram</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </a>
            </div>
          </div>
        ) : (
          <div className="py-2 border-b border-gray-100 flex flex-col items-center space-y-2">
            <span className="text-[10px] font-mono font-bold text-emerald-600" title={`Avg Speed: ${avgWPM} WPM`}>
              {avgWPM}w
            </span>
            <a
              href="https://t.me/quizlauncherssc"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-[#0088cc] hover:bg-blue-50 rounded-lg transition"
              title="Join Official Telegram @quizlauncherssc"
            >
              <Send className="w-4 h-4 -rotate-12" />
            </a>
          </div>
        )}
      </div>

      {/* Navigation Sections */}
      <nav className="p-3 space-y-1 text-xs flex-1 overflow-y-auto">
          
          {isOpen && (
            <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Exam Mocks & Tests
            </div>
          )}

          {/* All Mocks Catalog */}
          <button
            onClick={() => handleNavClick('catalog')}
            className={`w-full flex items-center p-2.5 rounded-xl font-medium transition ${
              isOpen ? 'space-x-3' : 'justify-center'
            } ${
              activeTab === 'catalog'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            title="Mock Test Catalog"
          >
            <Grid className={`w-5 h-5 shrink-0 ${activeTab === 'catalog' ? 'text-white' : 'text-blue-600'}`} />
            {isOpen && (
              <div className="text-left flex-1">
                <div className="font-bold leading-tight">Mock Test Catalog</div>
                <div className={`text-[10px] ${activeTab === 'catalog' ? 'text-blue-100' : 'text-gray-500'}`}>SSC & RRB Tests</div>
              </div>
            )}
          </button>

          {/* SSC CGL Mode */}
          <button
            onClick={() => handleExamClick('SSC_CGL')}
            className={`w-full flex items-center p-2.5 rounded-xl font-medium transition ${
              isOpen ? 'space-x-3' : 'justify-center'
            } ${
              activeTab === 'catalog' && candidateInfo.examType === 'SSC_CGL'
                ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            title="SSC CGL DEST Mock Tests"
          >
            <Landmark className="w-5 h-5 shrink-0 text-blue-600" />
            {isOpen && (
              <div className="text-left flex-1">
                <div className="font-semibold leading-tight">SSC CGL DEST</div>
                <div className="text-[10px] text-gray-500">15 Min • 2000 Keystrokes</div>
              </div>
            )}
          </button>

          {/* Railway NTPC Graduate Mode */}
          <button
            onClick={() => handleExamClick('RRB_NTPC_GRAD')}
            className={`w-full flex items-center p-2.5 rounded-xl font-medium transition ${
              isOpen ? 'space-x-3' : 'justify-center'
            } ${
              activeTab === 'catalog' && candidateInfo.examType === 'RRB_NTPC_GRAD'
                ? 'bg-amber-50 text-amber-900 font-bold border border-amber-300'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            title="Railway RRB NTPC Graduate (Level 5) Tests"
          >
            <Train className="w-5 h-5 shrink-0 text-amber-600" />
            {isOpen && (
              <div className="text-left flex-1">
                <div className="font-semibold leading-tight">NTPC Graduate</div>
                <div className="text-[10px] text-gray-500">Level 5 (Sr Clerk/JAA) • 30 WPM</div>
              </div>
            )}
          </button>

          {/* Railway NTPC UG Mode */}
          <button
            onClick={() => handleExamClick('RRB_NTPC_UG')}
            className={`w-full flex items-center p-2.5 rounded-xl font-medium transition ${
              isOpen ? 'space-x-3' : 'justify-center'
            } ${
              activeTab === 'catalog' && candidateInfo.examType === 'RRB_NTPC_UG'
                ? 'bg-orange-50 text-orange-900 font-bold border border-orange-300'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            title="Railway RRB NTPC Under Graduate (Level 2) Tests"
          >
            <Train className="w-5 h-5 shrink-0 text-orange-600" />
            {isOpen && (
              <div className="text-left flex-1">
                <div className="font-semibold leading-tight">NTPC Under Graduate</div>
                <div className="text-[10px] text-gray-500">Level 2 (Jr Clerk) • 30 WPM</div>
              </div>
            )}
          </button>

          {isOpen && (
            <div className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              10-Finger Typing Tutor
            </div>
          )}

          {/* 10-Finger Touch Typing (Step 1 to Pro) */}
          <button
            onClick={() => handleNavClick('touch-typing')}
            className={`w-full flex items-center p-2.5 rounded-xl font-medium transition ${
              isOpen ? 'space-x-3' : 'justify-center'
            } ${
              activeTab === 'touch-typing'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
            title="10-Finger Touch Typing Course (Step 1 to Pro)"
          >
            <Flame className={`w-5 h-5 shrink-0 ${activeTab === 'touch-typing' ? 'text-amber-300' : 'text-emerald-600'}`} />
            {isOpen && (
              <div className="text-left flex-1">
                <div className="font-bold leading-tight">10-Finger Practice</div>
                <div className={`text-[10px] ${activeTab === 'touch-typing' ? 'text-emerald-100' : 'text-gray-500'}`}>Step 1 to Pro Mastery</div>
              </div>
            )}
          </button>

          {isOpen && (
            <div className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Performance & Rules
            </div>
          )}

          {/* Attempts History */}
          <button
            onClick={() => handleNavClick('history')}
            className={`w-full flex items-center p-2.5 rounded-xl font-medium transition ${
              isOpen ? 'space-x-3' : 'justify-center'
            } ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white font-bold'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            title="Past Attempts & Progress"
          >
            <History className="w-5 h-5 shrink-0 text-purple-600" />
            {isOpen && (
              <div className="text-left flex-1 flex items-center justify-between">
                <span>My Test Attempts</span>
                {totalTests > 0 && (
                  <span className="bg-gray-100 text-gray-700 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
                    {totalTests}
                  </span>
                )}
              </div>
            )}
          </button>

          {/* Rules & Guidelines */}
          <button
            onClick={() => handleNavClick('rules')}
            className={`w-full flex items-center p-2.5 rounded-xl font-medium transition ${
              isOpen ? 'space-x-3' : 'justify-center'
            } ${
              activeTab === 'rules'
                ? 'bg-blue-600 text-white font-bold'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            title="Official SSC / Railway Rules"
          >
            <HelpCircle className="w-5 h-5 shrink-0 text-rose-500" />
            {isOpen && <span>Official Exam Rules</span>}
          </button>

          {/* Login / Switch Account Button */}
          <button
            onClick={() => handleNavClick('login')}
            className={`w-full flex items-center p-2.5 rounded-xl font-medium transition ${
              isOpen ? 'space-x-3' : 'justify-center'
            } ${
              activeTab === 'login'
                ? 'bg-blue-600 text-white font-bold'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            title="Sign In / Switch Candidate"
          >
            <LogIn className="w-5 h-5 shrink-0 text-blue-600" />
            {isOpen && <span>{currentUser ? 'Switch / Logout' : 'Sign In with Gmail'}</span>}
          </button>

        </nav>
      </aside>
    </>
  );
}
