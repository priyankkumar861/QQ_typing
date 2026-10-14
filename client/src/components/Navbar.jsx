import React from 'react';
import { 
  Keyboard, 
  BookOpen, 
  History, 
  HelpCircle, 
  Menu,
  Flame,
  Grid,
  Landmark,
  Train,
  Send,
  LogIn,
  LogOut,
  ExternalLink
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  candidateInfo, 
  setCandidateModalOpen,
  sidebarOpen,
  setSidebarOpen,
  currentUser,
  onLogout
}) {
  return (
    <header className="bg-white border-b border-gray-200 text-gray-900 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-16 py-1 gap-2">
          
          {/* Sidebar Toggle & Brand */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition shrink-0"
              title="Toggle Side Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 cursor-pointer shrink-0 select-none" onClick={() => setActiveTab('catalog')}>
              <div className="bg-blue-600 p-2 rounded-xl text-white shadow-xs shrink-0">
                <Keyboard className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <span className="font-extrabold text-sm sm:text-base md:text-lg tracking-tight text-gray-900 whitespace-nowrap">
                    SSC & RRB <span className="text-blue-600">Typing Portal</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200 shrink-0 whitespace-nowrap">
                    CBT DEST
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 hidden md:block truncate max-w-[280px] lg:max-w-[340px]">
                  TCS iON Pattern Exam Simulation • CGL Tier-II • NTPC
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1.5">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'catalog' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>Mock Catalog</span>
            </button>

            <button
              onClick={() => setActiveTab('touch-typing')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'touch-typing' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-500" />
              <span>10-Finger Tutor</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'history' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <History className="w-4 h-4" />
              <span>My Attempts</span>
            </button>

            <button
              onClick={() => setActiveTab('rules')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'rules' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Official Rules</span>
            </button>
          </nav>

          {/* Right Action Bar: Telegram Channel & Candidate Profile */}
          <div className="flex items-center space-x-2.5">
            
            {/* Telegram Community Quick Link */}
            <a
              href="https://t.me/quizlauncherssc"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-[#0088cc]/10 hover:bg-[#0088cc]/20 text-[#0088cc] border border-[#0088cc]/30 transition"
              title="Join Telegram Community @quizlauncherssc"
            >
              <Send className="w-3.5 h-3.5 -rotate-12" />
              <span className="hidden sm:inline">Join @quizlauncherssc</span>
              <span className="sm:hidden">Telegram</span>
              <ExternalLink className="w-3 h-3 opacity-70 hidden sm:inline" />
            </a>

            {/* Candidate Pill / Auth State */}
            {currentUser ? (
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setCandidateModalOpen(true)}
                  className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 text-gray-800 text-xs py-1.5 px-3 rounded-xl border border-gray-200 transition"
                  title="Candidate Profile & Category Settings"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                    {candidateInfo?.name?.charAt(0) || 'C'}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="font-bold text-gray-900 leading-tight truncate max-w-[110px]">{candidateInfo?.name}</div>
                    <div className="text-[10px] text-blue-700 font-semibold">{candidateInfo?.category} • {candidateInfo?.examType?.replace('_', ' ')}</div>
                  </div>
                </button>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 border border-gray-200 transition text-xs font-semibold"
                  title="Sign Out / Switch Account"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('login')}
                className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1.5 px-3.5 rounded-xl shadow-xs transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
