import React from 'react';
import { 
  Clock, 
  User, 
  FileText, 
  ArrowLeft, 
  Maximize2, 
  Minimize2, 
  Lock, 
  Unlock,
  ChevronRight,
  ChevronLeft,
  Activity,
  Layers
} from 'lucide-react';

export default function EdiquityExamHeader({
  candidateInfo,
  passageTitle,
  timeLeftFormatted,
  timeLeftSeconds,
  totalKeystrokes,
  backspaceCount,
  backspaceAllowed,
  onFinishTest,
  onExitTest,
  isFullscreen,
  toggleFullscreen,
  telemetryCollapsed,
  setTelemetryCollapsed,
  examInterfacePattern,
  setExamInterfacePattern
}) {
  const isNTPC = candidateInfo?.examType === 'RRB_NTPC';
  const isCGL = candidateInfo?.examType === 'SSC_CGL';

  // Ediquity timer urgency color
  let timerColorClass = 'text-emerald-700 bg-emerald-50 border-emerald-300';
  if (timeLeftSeconds < 120) {
    timerColorClass = 'text-red-700 bg-red-50 border-red-400 animate-pulse';
  } else if (timeLeftSeconds < 300) {
    timerColorClass = 'text-amber-700 bg-amber-50 border-amber-300';
  }

  return (
    <div className="bg-white border-b-2 border-slate-300 shadow-xs select-none">
      
      {/* Top Bar: Center Code, Lab Node & Interface Switcher */}
      <div className="bg-slate-100 px-4 py-1.5 border-b border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-700">
        <div className="flex items-center space-x-2">
          {onExitTest && (
            <button
              onClick={onExitTest}
              className="flex items-center space-x-1 px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold border border-slate-300 transition mr-2"
              title="Return to Mock Catalog"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Exit Mock</span>
            </button>
          )}

          <span className="font-extrabold text-blue-900 text-xs sm:text-sm tracking-tight">
            {isNTPC ? 'EDIQUITY CBT LAB • RAILWAY TYPING TEST' : 'EDIQUITY CBT LAB • SSC DEST EXAMINATION'}
          </span>

          <span className="bg-white text-slate-700 px-2 py-0.5 rounded text-[11px] font-mono border border-slate-300 font-semibold hidden md:inline-block">
            {isNTPC ? 'CENTER: 8402 | NODE: EQ-114' : 'CENTER: 2201 | NODE: EQ-042'}
          </span>
        </div>

        {/* Pattern Switcher & Controls */}
        <div className="flex items-center space-x-2 mt-1 sm:mt-0">
          
          {/* Pattern Toggle (Ediquity vs TCS iON) */}
          <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-300 text-[11px]">
            <button
              onClick={() => setExamInterfacePattern('ediquity')}
              className={`px-2.5 py-0.5 rounded font-bold transition ${
                examInterfacePattern === 'ediquity'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ediquity Pattern
            </button>
            <button
              onClick={() => setExamInterfacePattern('tcs')}
              className={`px-2.5 py-0.5 rounded font-bold transition ${
                examInterfacePattern === 'tcs'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              TCS iON Pattern
            </button>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="flex items-center space-x-1 px-2.5 py-1 bg-white hover:bg-slate-200 border border-slate-300 rounded text-slate-700 text-xs font-semibold transition"
            title="Toggle Fullscreen Exam Mode"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Exit Full' : 'Fullscreen'}</span>
          </button>

          {/* Toggle Telemetry Panel */}
          <button
            onClick={() => setTelemetryCollapsed(!telemetryCollapsed)}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-semibold border transition ${
              telemetryCollapsed 
                ? 'bg-blue-50 text-blue-700 border-blue-300' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-200'
            }`}
            title={telemetryCollapsed ? "Expand Telemetry Panel" : "Collapse Telemetry Panel"}
          >
            <Activity className="w-3.5 h-3.5 text-blue-600" />
            <span>{telemetryCollapsed ? 'Show Telemetry' : 'Hide Telemetry'}</span>
          </button>
        </div>
      </div>

      {/* Main Candidate Credentials Strip (Ediquity Pattern with Photo & Signature) */}
      <div className="px-4 py-2 flex flex-wrap items-center justify-between gap-3 bg-white">
        
        {/* Candidate Photo + Signature Dual Box (Ediquity hallmark) */}
        <div className="flex items-center space-x-3">
          
          <div className="flex space-x-1.5">
            {/* Photo Box */}
            <div className="w-12 h-14 bg-slate-100 border border-slate-300 rounded flex flex-col items-center justify-center text-slate-500 shadow-2xs">
              <User className="w-6 h-6 text-slate-400" />
              <span className="text-[8px] font-bold text-slate-600 mt-0.5">PHOTO</span>
            </div>

            {/* Signature Box (Ediquity specific) */}
            <div className="w-14 h-14 bg-slate-100 border border-slate-300 rounded flex flex-col items-center justify-center text-slate-500 shadow-2xs hidden sm:flex">
              <FileText className="w-5 h-5 text-slate-400" />
              <span className="text-[7px] font-bold text-slate-500 mt-0.5 uppercase">SIGNATURE</span>
            </div>
          </div>

          <div className="text-xs space-y-0.5">
            <div>
              <span className="text-slate-500">Candidate Name:</span>{' '}
              <strong className="text-slate-900 uppercase font-black">{candidateInfo.name}</strong>
            </div>
            <div>
              <span className="text-slate-500">Roll No:</span>{' '}
              <strong className="font-mono text-blue-700 font-bold">{candidateInfo.rollNo}</strong>{' '}
              <span className="text-slate-400">({candidateInfo.category})</span>
            </div>
            <div className="text-[11px] text-slate-600 truncate max-w-xs sm:max-w-md">
              <span className="text-slate-500 font-medium">Test:</span> {passageTitle}
            </div>
          </div>
        </div>

        {/* Real-Time Keystroke & Backspace Badges */}
        <div className="flex items-center space-x-3 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-mono">
          <div>
            <div className="text-[9px] text-slate-500 uppercase font-bold font-sans">Keystrokes</div>
            <div className="text-base font-black text-blue-700">{totalKeystrokes}</div>
          </div>

          <div className="h-6 w-px bg-slate-300 mx-1" />

          <div>
            <div className="text-[9px] text-slate-500 uppercase font-bold font-sans">Backspaces</div>
            <div className={`text-base font-black ${isNTPC ? 'text-red-600' : 'text-amber-600'}`}>
              {backspaceCount}
            </div>
          </div>

          <div className="h-6 w-px bg-slate-300 mx-1" />

          <div>
            <div className="text-[9px] text-slate-500 uppercase font-bold font-sans mb-0.5">Rule</div>
            {isNTPC ? (
              <span className="inline-flex items-center gap-1 text-[10px] bg-red-100 text-red-800 border border-red-300 px-2 py-0.5 rounded font-bold">
                <Lock className="w-3 h-3" />
                LOCKED (NTPC)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded font-bold">
                <Unlock className="w-3 h-3" />
                ACTIVE (SSC)
              </span>
            )}
          </div>
        </div>

        {/* Ediquity Digital Countdown Timer */}
        <div className="flex items-center space-x-3">
          <div className={`border-2 rounded-xl px-4 py-1.5 shadow-2xs flex items-center space-x-2.5 ${timerColorClass}`}>
            <Clock className="w-5 h-5 animate-pulse" />
            <div>
              <div className="text-[9px] uppercase tracking-wider font-bold font-sans opacity-80">
                Time Remaining
              </div>
              <div className="text-xl font-mono font-black tracking-wider">
                {timeLeftFormatted}
              </div>
            </div>
          </div>

          <button
            onClick={onFinishTest}
            className="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs uppercase px-5 py-2.5 rounded-xl shadow-xs transition flex items-center space-x-1.5"
          >
            <span>Submit Test</span>
          </button>
        </div>

      </div>

    </div>
  );
}
