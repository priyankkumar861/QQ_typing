import React from 'react';
import { Clock, ShieldAlert, Monitor, User, ArrowLeft, Lock, Unlock } from 'lucide-react';

export default function TcsExamHeader({ 
  candidateInfo, 
  passageTitle, 
  timeLeftFormatted, 
  isTimerRunning, 
  totalKeystrokes,
  backspaceCount,
  backspaceAllowed,
  toggleBackspace,
  onFinishTest,
  onExitTest
}) {
  const isNTPC = candidateInfo?.examType === 'RRB_NTPC' || candidateInfo?.examType?.startsWith('RRB_NTPC') || candidateInfo?.examType?.includes('NTPC');
  const isCGL = candidateInfo?.examType === 'SSC_CGL' || candidateInfo?.examType?.startsWith('SSC_CGL');

  return (
    <div className="bg-[#2b3a4a] text-white border-b-2 border-[#1a2530] shadow-sm select-none">
      
      {/* Top TCS iON / Equity Lab Status Bar */}
      <div className="bg-[#1c2833] px-4 py-2 border-b border-slate-700/60 flex flex-wrap items-center justify-between text-xs">
        <div className="flex items-center space-x-3">
          {onExitTest && (
            <button
              onClick={onExitTest}
              className="flex items-center space-x-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold border border-slate-700 transition mr-1"
              title="Return to Mock Catalog"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Exit Mock</span>
            </button>
          )}

          <span className="font-bold text-amber-400 tracking-wide text-xs sm:text-sm flex items-center gap-1.5">
            <Monitor className="w-4 h-4 text-cyan-400" />
            {isNTPC 
              ? 'RAILWAY RECRUITMENT BOARDS (RRB) • TYPING SKILL TEST' 
              : 'STAFF SELECTION COMMISSION (SSC) • DATA ENTRY SKILL TEST (DEST)'}
          </span>

          <span className="bg-blue-950 text-cyan-300 px-2 py-0.5 rounded text-[11px] font-mono border border-blue-700/60 font-semibold hidden md:inline-block">
            {isNTPC ? 'CBT LAB: RRB-01 | NODE: C-072' : 'CBT LAB: TCS-03 | NODE: C-042'}
          </span>
        </div>

        <div className="flex items-center space-x-4 mt-1 sm:mt-0 text-xs">
          <span className="text-slate-300">
            Paper: <strong className="text-white">{isNTPC ? 'RRB NTPC Typing Test' : (isCGL ? 'SSC CGL Tier-II DEST' : 'SSC CHSL Typing Test')}</strong>
          </span>
          <span className="text-slate-300">
            Category: <strong className="text-amber-300">{candidateInfo.category}</strong>
          </span>
        </div>
      </div>

      {/* Main Candidate & Official Countdown Timer Bar */}
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 bg-[#243342]">
        
        {/* Candidate Photo & Credentials */}
        <div className="flex items-center space-x-3">
          <div className="w-11 h-13 bg-slate-100 border-2 border-slate-400 rounded flex flex-col items-center justify-center text-slate-700 shadow-inner">
            <User className="w-6 h-6 text-slate-400" />
            <span className="text-[8px] font-bold text-slate-500 mt-0.5">PHOTO</span>
          </div>

          <div className="text-xs space-y-0.5">
            <div>
              <span className="text-slate-400 font-medium">Candidate Name:</span>{' '}
              <span className="font-bold text-white text-sm uppercase">{candidateInfo.name}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Roll No:</span>{' '}
              <span className="font-mono font-bold text-amber-300">{candidateInfo.rollNo}</span>
            </div>
            <div className="text-[11px] text-slate-300 truncate max-w-xs sm:max-w-md">
              <span className="text-slate-400 font-medium">Subject:</span> {passageTitle}
            </div>
          </div>
        </div>

        {/* Live Keystroke stats & Backspace State Indicator */}
        <div className="flex items-center space-x-3 bg-[#18232e] px-3.5 py-1.5 rounded-lg border border-slate-700 text-xs font-mono">
          <div>
            <div className="text-[9px] text-slate-400 font-semibold uppercase font-sans">Keystrokes</div>
            <div className="text-base font-bold text-emerald-400">{totalKeystrokes}</div>
          </div>

          <div className="h-6 w-px bg-slate-700 mx-1" />

          <div>
            <div className="text-[9px] text-slate-400 font-semibold uppercase font-sans">Backspaces</div>
            <div className="text-base font-bold text-amber-300">{backspaceCount}</div>
          </div>

          <div className="h-6 w-px bg-slate-700 mx-1" />

          <div>
            <div className="text-[9px] text-slate-400 font-semibold uppercase font-sans mb-0.5">Backspace Key</div>
            {isNTPC ? (
              <span className="inline-flex items-center gap-1 text-[10px] bg-red-950 text-red-300 border border-red-800/80 px-2 py-0.5 rounded font-bold">
                <Lock className="w-3 h-3" />
                LOCKED (NTPC)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded font-bold">
                <Unlock className="w-3 h-3" />
                ALLOWED (SSC)
              </span>
            )}
          </div>
        </div>

        {/* Official Remaining Time Box (Red Digital Clock) */}
        <div className="flex items-center space-x-3">
          <div className="bg-[#0f171e] border-2 border-red-500 rounded-lg px-4 py-1.5 shadow-md flex items-center space-x-2.5">
            <Clock className="w-5 h-5 text-red-500 animate-pulse" />
            <div>
              <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold font-sans">
                Time Remaining
              </div>
              <div className="text-xl font-mono font-black text-red-500 tracking-wider">
                {timeLeftFormatted}
              </div>
            </div>
          </div>

          <button
            onClick={onFinishTest}
            className="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs uppercase px-4 py-2.5 rounded-lg shadow-md transition flex items-center space-x-1.5"
          >
            <span>Submit Test</span>
          </button>
        </div>

      </div>
    </div>
  );
}
