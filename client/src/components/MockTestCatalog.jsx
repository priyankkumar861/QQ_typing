import React, { useState } from 'react';
import { 
  Play, 
  Clock, 
  Target, 
  ShieldAlert, 
  Landmark, 
  Train, 
  BookOpen, 
  Sparkles, 
  Filter,
  CheckCircle2,
  FileText,
  Activity,
  Monitor,
  Layout,
  X,
  Sliders,
  Check,
  ChevronRight
} from 'lucide-react';

export default function MockTestCatalog({ 
  passages, 
  onStartMock, 
  candidateInfo, 
  setCandidateModalOpen,
  activeFilter,
  setActiveFilter
}) {
  const [selectedLanguage, setSelectedLanguage] = useState('ALL');
  
  // Launch Modal State
  const [selectedMockForLaunch, setSelectedMockForLaunch] = useState(null);
  const [selectedMode, setSelectedMode] = useState('practice'); // 'practice' | 'exam'
  const [selectedPattern, setSelectedPattern] = useState('ediquity'); // 'ediquity' | 'tcs'

  const filteredPassages = passages.filter((p) => {
    let matchCategory = true;
    if (activeFilter === 'SSC_CGL') matchCategory = p.category === 'SSC CGL';
    else if (activeFilter === 'SSC_CHSL') matchCategory = p.category === 'SSC CHSL';
    else if (activeFilter === 'RRB_NTPC_GRAD') matchCategory = p.category === 'RRB NTPC Graduate';
    else if (activeFilter === 'RRB_NTPC_UG') matchCategory = p.category === 'RRB NTPC UG';
    else if (activeFilter === 'RRB_NTPC') matchCategory = p.category.startsWith('RRB NTPC');

    let matchLang = true;
    if (selectedLanguage !== 'ALL') {
      matchLang = p.language.toLowerCase() === selectedLanguage.toLowerCase();
    }

    return matchCategory && matchLang;
  });

  const handleOpenLaunchModal = (mock) => {
    const isNTPC = mock?.category?.startsWith('RRB NTPC') || candidateInfo?.examType?.startsWith('RRB_NTPC');
    setSelectedMockForLaunch(mock);
    setSelectedMode('practice');
    setSelectedPattern(isNTPC ? 'tcs' : 'ediquity');
  };

  const handleConfirmLaunch = () => {
    if (!selectedMockForLaunch) return;
    
    const isNTPC = selectedMockForLaunch?.category?.startsWith('RRB NTPC') || candidateInfo?.examType?.startsWith('RRB_NTPC');
    const finalPattern = isNTPC ? 'tcs' : selectedPattern;

    // Automatically trigger fullscreen if user selected Real Exam Mode
    if (selectedMode === 'exam') {
      try {
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      } catch (e) {}
    }

    onStartMock(selectedMockForLaunch, selectedMode, finalPattern);
    setSelectedMockForLaunch(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Distinctive Executive Header Banner (Customized Heading Style) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 text-white font-black text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded uppercase tracking-wider shadow-2xs">
              CBT DEST Standard 2026
            </span>
            <span className="text-xs text-slate-500 font-semibold tracking-wide">
              SSC CGL Tier-II • CHSL • RRB NTPC
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1.5 flex items-center gap-2">
            <span>DEST Typing Mock Test Bench</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Select any test below to configure <strong>Practice Mode (with live guidance & sidebar)</strong> or <strong>Real Exam Mode (Ediquity / TCS iON)</strong>. Commission evaluation rules are calculated with 100% precision.
          </p>
        </div>

        {/* Candidate Profile Card */}
        <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm uppercase shadow-xs">
            {candidateInfo.name.charAt(0) || 'C'}
          </div>
          <div className="text-xs">
            <div className="font-bold text-gray-900">{candidateInfo.name}</div>
            <div className="text-gray-500">
              Roll: <span className="font-mono text-gray-700 font-semibold">{candidateInfo.rollNo}</span> ({candidateInfo.category})
            </div>
            <button
              onClick={() => setCandidateModalOpen(true)}
              className="text-[11px] text-blue-600 font-semibold hover:underline mt-0.5"
            >
              Change Category / Profile
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs (SSC CGL, SSC CHSL, RRB NTPC, Hindi) */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeFilter === 'ALL'
                ? 'bg-gray-900 text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Mocks ({passages.length})
          </button>

          <button
            onClick={() => setActiveFilter('SSC_CGL')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeFilter === 'SSC_CGL'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>SSC CGL DEST (15 Min / 2000 KDPH)</span>
          </button>

          <button
            onClick={() => setActiveFilter('SSC_CHSL')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeFilter === 'SSC_CHSL'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>SSC CHSL (10 Min / 35 WPM)</span>
          </button>

          <button
            onClick={() => setActiveFilter('RRB_NTPC_GRAD')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeFilter === 'RRB_NTPC_GRAD'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Train className="w-3.5 h-3.5" />
            <span>NTPC Graduate (Level 5 / Senior Clerk)</span>
          </button>

          <button
            onClick={() => setActiveFilter('RRB_NTPC_UG')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeFilter === 'RRB_NTPC_UG'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-orange-50 text-orange-800 hover:bg-orange-100'
            }`}
          >
            <Train className="w-3.5 h-3.5" />
            <span>NTPC Under Graduate (Level 2 / Jr Clerk)</span>
          </button>
        </div>

        {/* Language dropdown */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-gray-500 font-medium">Language:</span>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-gray-100 border border-gray-200 text-gray-800 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Languages</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi (हिंदी)</option>
          </select>
        </div>
      </div>

      {/* Mock Tests Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPassages.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-2xl border border-gray-200">
            <FileText className="w-10 h-10 mx-auto text-gray-300 mb-2" />
            <p className="text-sm font-semibold">No mock tests found in this category.</p>
          </div>
        ) : (
          filteredPassages.map((mock, idx) => {
            const isCGL = mock.category === 'SSC CGL';
            const isCHSL = mock.category === 'SSC CHSL';
            const isNTPCGrad = mock.category === 'RRB NTPC Graduate';
            const isNTPCUg = mock.category === 'RRB NTPC UG';
            const isNTPC = isNTPCGrad || isNTPCUg || mock.category === 'RRB NTPC';
            const wordCount = mock.text.split(/\s+/).length;
            const targetKDPH = mock.targetKeystrokes || (isCGL ? 2000 : (isCHSL ? 1750 : 1500));
            const duration = mock.durationMinutes || (isCGL ? 15 : 10);

            return (
              <div
                key={mock.id}
                className="bg-white border-2 border-gray-200 hover:border-blue-500 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        isNTPCGrad
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : isNTPCUg
                          ? 'bg-orange-100 text-orange-900 border border-orange-300'
                          : isCGL 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {mock.category}
                      </span>
                      <span className="text-[10px] font-bold text-gray-500 uppercase">
                        {mock.language}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1 text-xs font-mono font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
                      <Clock className="w-3.5 h-3.5 text-gray-500" />
                      <span>{duration} Mins</span>
                    </div>
                  </div>

                  {/* Distinctive Card Heading (Set badge + Topic name) */}
                  <div className="mt-1">
                    <div className="flex items-center space-x-2 text-xs font-bold text-blue-700 mb-1">
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 text-[10px] font-mono font-bold uppercase">
                        SET #{String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500 font-medium text-[11px]">{mock.category}</span>
                    </div>
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {mock.title.includes(':') ? mock.title.split(':')[1].trim() : mock.title}
                    </h3>
                  </div>

                  {/* Passage Preview Snippet */}
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                    {mock.text}
                  </p>

                  {/* Criteria Strip */}
                  <div className="mt-3 p-2.5 bg-gray-50 rounded-xl border border-gray-100 grid grid-cols-2 gap-2 text-[11px] text-gray-600 font-mono">
                    <div>
                      Target: <strong className="text-gray-900">{targetKDPH} Keystrokes</strong>
                    </div>
                    <div>
                      Length: <strong className="text-gray-900">~{wordCount} Words</strong>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="text-[11px] text-gray-500">
                    {isNTPC ? (
                      <span className="text-amber-700 font-semibold">• Backspace Locked • 5% Margin</span>
                    ) : isCGL ? (
                      <span className="text-blue-700 font-semibold">• 8,000 KDPH • 5% UR Cutoff</span>
                    ) : (
                      <span className="text-indigo-700 font-semibold">• 35 WPM • 7% UR Cutoff</span>
                    )}
                  </div>

                  <button
                    onClick={() => handleOpenLaunchModal(mock)}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-sm transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Test</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* INTERACTIVE LAUNCH MODAL: PRACTICE MODE VS EXAM MODE & EDIQUITY VS TCS */}
      {selectedMockForLaunch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-600 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded tracking-wider">
                    Session Setup
                  </span>
                  <span className="text-slate-400 text-xs">Choose Mode & Interface</span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1">
                  Configure Assessment Session
                </h2>
              </div>
              <button
                onClick={() => setSelectedMockForLaunch(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-5 overflow-y-auto max-h-[78vh]">
              
              {/* Selected Mock Summary Card */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="text-[11px] text-blue-700 font-bold uppercase tracking-wider">
                  Selected Assessment Paper:
                </div>
                <div className="font-bold text-sm text-slate-900">
                  {selectedMockForLaunch.title}
                </div>
                <div className="text-xs text-slate-600 flex items-center gap-3 pt-1 font-mono">
                  <span>Category: <strong className="text-slate-900">{selectedMockForLaunch.category}</strong></span>
                  <span>Duration: <strong className="text-blue-700">{selectedMockForLaunch.durationMinutes || 15} Mins</strong></span>
                  <span>Target: <strong className="text-slate-900">{selectedMockForLaunch.targetKeystrokes || 2000} Keystrokes</strong></span>
                </div>
              </div>

              {/* 1. CHOOSE MODE: PRACTICE MODE VS REAL EXAM MODE */}
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                  1. Select Assessment Mode (मोड चुनें):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Practice Mode Card */}
                  <div
                    onClick={() => setSelectedMode('practice')}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${
                      selectedMode === 'practice'
                        ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                          <Activity className="w-4 h-4" />
                        </div>
                        {selectedMode === 'practice' && (
                          <span className="bg-blue-600 text-white rounded-full p-0.5">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-sm text-slate-900">Practice Mode</div>
                      <div className="text-[10px] font-semibold text-blue-600 mb-1">प्रैक्टिस मोड (Guided)</div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Side dashboard active with <strong>live Gross & Net WPM</strong>, pace progress bar, mistake counter, and coaching tips.
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] font-semibold text-blue-700">
                      ✓ Best for learning & speed improvement
                    </div>
                  </div>

                  {/* Real Exam Mode Card */}
                  <div
                    onClick={() => setSelectedMode('exam')}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${
                      selectedMode === 'exam'
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
                          <ShieldAlert className="w-4 h-4" />
                        </div>
                        {selectedMode === 'exam' && (
                          <span className="bg-indigo-600 text-white rounded-full p-0.5">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-sm text-slate-900">Real Exam Mode</div>
                      <div className="text-[10px] font-semibold text-indigo-600 mb-1">परीक्षा मोड (Strict CBT)</div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Authentic <strong>distraction-free CBT screen</strong> without sidebars. Official countdown timer & strict exam rules.
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] font-semibold text-indigo-700">
                      ✓ Exact exam hall experience
                    </div>
                  </div>

                </div>
              </div>

              {/* 2. CHOOSE INTERFACE PATTERN */}
              {selectedMockForLaunch?.category?.startsWith('RRB NTPC') || candidateInfo?.examType?.startsWith('RRB_NTPC') ? (
                <div>
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                    2. Interface Pattern (इंटरफ़ेस पैटर्न):
                  </label>
                  <div className="p-4 rounded-xl border-2 border-slate-700 bg-slate-50 flex items-center justify-between shadow-xs">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 rounded-xl bg-slate-800 text-white shadow-xs">
                        <Layout className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                          <span>TCS iON CBT Pattern</span>
                          <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded font-black uppercase">
                            Mandatory for RRB NTPC
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                          Official Railway Recruitment Board exam strictly conducts on TCS iON software. Ediquity pattern is not applicable for NTPC.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                    2. Select Interface Pattern (इंटरफ़ेस पैटर्न चुनें):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Ediquity Pattern Card */}
                    <div
                      onClick={() => setSelectedPattern('ediquity')}
                      className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${
                        selectedPattern === 'ediquity'
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                            <Monitor className="w-4 h-4" />
                          </div>
                          {selectedPattern === 'ediquity' && (
                            <span className="bg-emerald-600 text-white rounded-full p-0.5">
                              <Check className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                        <div className="font-bold text-sm text-slate-900">Ediquity Pattern</div>
                        <div className="text-[10px] font-semibold text-emerald-700 mb-1">New Official Pattern</div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Deep navy header, upper white master box, <strong>light-green input box (`#e4f8d6`)</strong>, and centered submit button.
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] font-semibold text-emerald-700">
                        ✓ Matches latest CBT vendor layout
                      </div>
                    </div>

                    {/* TCS iON Pattern Card */}
                    <div
                      onClick={() => setSelectedPattern('tcs')}
                      className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${
                        selectedPattern === 'tcs'
                          ? 'border-slate-700 bg-slate-100 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="p-2 rounded-lg bg-slate-200 text-slate-800">
                            <Layout className="w-4 h-4" />
                          </div>
                          {selectedPattern === 'tcs' && (
                            <span className="bg-slate-800 text-white rounded-full p-0.5">
                              <Check className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                        <div className="font-bold text-sm text-slate-900">TCS iON Pattern</div>
                        <div className="text-[10px] font-semibold text-slate-700 mb-1">Classic Exam Interface</div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Candidate photo & roll credentials bar, <strong>red digital countdown clock</strong>, and dual scrolling pane.
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] font-semibold text-slate-700">
                        ✓ Standard TCS iON test lab format
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setSelectedMockForLaunch(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmLaunch}
                className="flex items-center space-x-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition active:scale-95"
              >
                <span>Launch Assessment Now</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
