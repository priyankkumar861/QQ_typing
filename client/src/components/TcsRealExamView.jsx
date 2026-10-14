import React, { useState } from 'react';
import { Info, X, ShieldAlert, CheckCircle, Volume2, VolumeX, Maximize2, Minimize2, AlertTriangle } from 'lucide-react';

export default function TcsRealExamView({
  passage,
  candidateInfo,
  typedText,
  timeLeftFormatted,
  timeLeftSeconds,
  isTestStarted,
  isTestFinished,
  fontSizeLevel,
  increaseFontSize,
  decreaseFontSize,
  getFontSizeClass,
  soundEnabled,
  setSoundEnabled,
  isFullscreen,
  toggleFullscreen,
  inputRef,
  passageBoxRef,
  handleInputChange,
  handleKeyDown,
  onExitTest,
  onSubmitTest,
  isNTPC,
  totalKeystrokes,
  backspaceCount
}) {
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Fallback candidate name matching screenshot 'sak' if name is empty
  const displayName = candidateInfo?.name || 'sak';
  const displayTitle = passage?.title || (isNTPC ? 'RRB NTPC Mock Test 798' : 'SSC DEST Mock Test');

  return (
    <div className="w-full min-h-screen bg-white text-gray-900 flex flex-col font-sans select-none overflow-x-hidden">
      
      {/* ============================================================== */}
      {/* 1. TOP CHARCOAL HEADER BAR (#2b3035)                            */}
      {/* ============================================================== */}
      <header className="bg-[#2b3035] text-white px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-[#1f2327] shrink-0">
        
        {/* Left: Back Button & Mock Test Title */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCancelConfirm(true)}
            className="bg-[#495057] hover:bg-[#5a6268] text-white text-xs font-semibold px-3 py-1 rounded border border-[#6c757d]/50 transition flex items-center space-x-1"
            title="Return to Mock Catalog"
          >
            <span>&larr; Back</span>
          </button>
          <span className="text-white font-bold text-xs sm:text-sm tracking-wide truncate max-w-[280px] sm:max-w-md md:max-w-lg">
            {displayTitle}
          </span>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs flex-wrap">
          
          {/* A- Button */}
          <button
            onClick={decreaseFontSize}
            className="bg-[#6c757d] hover:bg-[#5a6268] active:scale-95 text-white font-bold px-2.5 py-1 rounded transition text-xs"
            title="Decrease Font Size"
          >
            A-
          </button>

          {/* A+ Button */}
          <button
            onClick={increaseFontSize}
            className="bg-[#6c757d] hover:bg-[#5a6268] active:scale-95 text-white font-bold px-2.5 py-1 rounded transition text-xs"
            title="Increase Font Size"
          >
            A+
          </button>

          {/* Sound Toggle (Red when OFF, Green when ON) */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`font-semibold px-3 py-1 rounded transition text-xs ${
              soundEnabled 
                ? 'bg-[#28a745] hover:bg-[#218838] text-white' 
                : 'bg-[#d9534f] hover:bg-[#c9302c] text-white'
            }`}
            title="Toggle Typing Keystroke Sound"
          >
            Sound: {soundEnabled ? 'ON' : 'OFF'}
          </button>

          {/* Settings Button (Teal) */}
          <button
            onClick={() => setShowSettingsModal(true)}
            className="bg-[#17a2b8] hover:bg-[#138496] active:scale-95 text-white font-semibold px-3 py-1 rounded transition text-xs"
          >
            Settings
          </button>

          {/* Full Screen Button (Teal) */}
          <button
            onClick={toggleFullscreen}
            className="bg-[#17a2b8] hover:bg-[#138496] active:scale-95 text-white font-semibold px-3 py-1 rounded transition text-xs"
          >
            {isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
          </button>

          {/* Instructions Button (Blue with info icon) */}
          <button
            onClick={() => setShowInstructionsModal(true)}
            className="bg-[#007bff] hover:bg-[#0069d9] active:scale-95 text-white font-semibold px-3 py-1 rounded transition text-xs flex items-center space-x-1"
          >
            <Info className="w-3.5 h-3.5 fill-white/20" />
            <span>Instructions</span>
          </button>

        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. GROUP A BLUE RIBBON (#337ab7)                                */}
      {/* ============================================================== */}
      <div className="bg-[#337ab7] text-white px-4 py-1.5 font-bold text-xs sm:text-sm tracking-wide shrink-0">
        Group A
      </div>

      {/* ============================================================== */}
      {/* 3. SECTION SUB-HEADER & TIMER & CANDIDATE PROFILE ROW           */}
      {/* ============================================================== */}
      <div className="bg-white border-b border-gray-300 flex items-stretch justify-between shrink-0">
        
        {/* Left Section Header & Big Countdown Timer */}
        <div className="flex-1 flex items-center justify-between px-4 py-2 min-w-0">
          
          {/* Angled Section A Tab */}
          <div 
            className="bg-[#337ab7] text-white font-bold text-xs sm:text-sm py-1.5 px-6 select-none"
            style={{ clipPath: 'polygon(0 0, 82% 0, 100% 100%, 0% 100%)' }}
          >
            Section A
          </div>

          {/* Big Bold Digital Countdown Clock */}
          <div className="text-xl sm:text-2xl font-bold font-sans text-gray-900 tracking-tight flex items-center space-x-1">
            <span>Time Left:</span>
            <span className={`font-mono ${timeLeftSeconds < 120 ? 'text-red-600 animate-pulse' : 'text-gray-900'}`}>
              {timeLeftFormatted}
            </span>
          </div>

        </div>

        {/* Right Column Top: Candidate Profile Box */}
        <div className="w-56 sm:w-64 border-l border-gray-300 px-3 py-2 flex items-center space-x-3 bg-white shrink-0">
          
          {/* Authentic Metallic Candidate Silhouette Avatar Box */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 border border-gray-400 bg-gradient-to-b from-gray-200 to-gray-300 rounded-xs flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
            <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-14 sm:h-14">
              <defs>
                <linearGradient id="metallicHead" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4a6572" />
                  <stop offset="40%" stopColor="#9fb3bd" />
                  <stop offset="100%" stopColor="#2c3e50" />
                </linearGradient>
                <linearGradient id="metallicBody" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#37474f" />
                  <stop offset="50%" stopColor="#78909c" />
                  <stop offset="100%" stopColor="#263238" />
                </linearGradient>
              </defs>
              {/* Head */}
              <ellipse cx="50" cy="30" rx="17" ry="21" fill="url(#metallicHead)" />
              {/* Hair outline */}
              <path d="M33 28 C33 14, 67 14, 67 28 C62 20, 38 20, 33 28 Z" fill="#1e293b" />
              {/* Torso / Coat */}
              <path d="M12 92 C12 62, 30 56, 40 54 L44 68 L56 68 L60 54 C70 56, 88 62, 88 92 Z" fill="url(#metallicBody)" />
              {/* Shirt Collar */}
              <polygon points="40,54 46,68 50,60 44,54" fill="#ffffff" />
              <polygon points="60,54 54,68 50,60 56,54" fill="#e2e8f0" />
              {/* Tie */}
              <polygon points="48,62 52,62 54,88 50,94 46,88" fill="#0f172a" />
            </svg>
          </div>

          {/* Candidate Name */}
          <div className="min-w-0">
            <div className="text-sm sm:text-base font-bold text-gray-900 truncate">
              {displayName}
            </div>
            <div className="text-[11px] text-gray-500 font-mono">
              Roll: {candidateInfo?.rollNo || '2401058392'}
            </div>
          </div>

        </div>

      </div>

      {/* ============================================================== */}
      {/* 4. KEYBOARD LAYOUT BLUE RIBBON                                  */}
      {/* ============================================================== */}
      <div className="flex items-stretch border-b border-gray-300 shrink-0">
        <div className="flex-1 bg-[#337ab7] text-white px-4 py-1.5 font-bold text-xs sm:text-sm">
          Keyboard Layout: QWERTY
        </div>
        <div className="w-56 sm:w-64 border-l border-gray-300 bg-white" />
      </div>

      {/* ============================================================== */}
      {/* 5. MAIN 2-BOX TYPING ARENA + SIDEBAR COLUMN                     */}
      {/* ============================================================== */}
      <div className="flex-1 flex flex-col md:flex-row items-stretch bg-white">
        
        {/* Left Column (~78%): Dual Scrolling Boxes */}
        <div className="flex-1 p-3 sm:p-5 flex flex-col justify-between space-y-4 min-w-0">
          
          <div className="space-y-4">
            {/* UPPER BOX: Master Reference Text Passage */}
            <div 
              ref={passageBoxRef}
              className={`w-full bg-white border border-gray-400 rounded-xs p-4 sm:p-5 text-gray-900 text-justify max-h-60 sm:max-h-68 md:max-h-72 overflow-y-scroll custom-scrollbar select-none ${getFontSizeClass()} font-sans`}
              style={{
                letterSpacing: '0.01em',
                lineHeight: '1.75'
              }}
              onCopy={(e) => e.preventDefault()}
              onContextMenu={(e) => e.preventDefault()}
            >
              {passage?.text}
            </div>

            {/* LOWER BOX: Candidate Typing Response Area */}
            <textarea
              ref={inputRef}
              value={typedText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onPaste={(e) => {
                e.preventDefault();
                alert('Exam Hall Rule: Copy-Paste is strictly prohibited!');
              }}
              onCopy={(e) => e.preventDefault()}
              onCut={(e) => e.preventDefault()}
              onContextMenu={(e) => e.preventDefault()}
              placeholder="Start typing here..."
              disabled={isTestFinished}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              className={`w-full bg-white border border-gray-400 rounded-xs p-4 sm:p-5 text-gray-900 resize-none h-48 sm:h-56 md:h-60 overflow-y-scroll custom-scrollbar focus:outline-hidden ${getFontSizeClass()} font-sans`}
              style={{
                letterSpacing: '0.01em',
                lineHeight: '1.75'
              }}
            />
          </div>

          {/* Bottom Action Row: Cancel Button on Left */}
          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="bg-[#d9534f] hover:bg-[#c9302c] active:scale-95 text-white font-bold text-xs sm:text-sm px-6 sm:px-8 py-2 rounded-xs shadow-xs transition"
            >
              Cancel
            </button>

            {/* Small Keystroke Counter & NTPC Backspace Lock Alert */}
            <div className="text-xs text-gray-500 font-mono hidden sm:flex items-center space-x-3">
              <span>Keystrokes: <strong className="text-gray-900">{totalKeystrokes}</strong></span>
              {isNTPC && (
                <span className="text-red-600 font-bold bg-red-50 border border-red-200 px-2 py-0.5 rounded text-[11px]">
                  Backspace: Strictly Locked (NTPC)
                </span>
              )}
            </div>
          </div>

        </div>

        {/* Right Column (~22%): Vertical Divider & Bottom Submit Button */}
        <div className="w-full md:w-56 lg:w-64 border-t md:border-t-0 md:border-l border-gray-300 p-4 sm:p-5 flex flex-col justify-between shrink-0 bg-white">
          
          {/* Middle Candidate Exam Status Info */}
          <div className="space-y-3 pt-2 text-xs text-gray-600">
            <div className="p-3 bg-gray-50 border border-gray-200 rounded text-xs space-y-1.5">
              <div className="font-bold text-gray-800 uppercase tracking-wider text-[10px]">Exam Details</div>
              <div>Paper: <strong className="text-gray-900">{isNTPC ? 'RRB NTPC Typing' : 'SSC DEST'}</strong></div>
              <div>Category: <strong className="text-gray-900">{candidateInfo?.category || 'UR'}</strong></div>
              <div>Language: <strong className="text-gray-900">{passage?.language || 'English'}</strong></div>
            </div>

            {isNTPC && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-800 rounded text-[11px] leading-relaxed">
                <strong>Rule 5% Ignored:</strong> Up to 5% calculation error allowance provided for UR/OBC. Backspace is locked.
              </div>
            )}
          </div>

          {/* Bottom Right: Teal Submit Button (Matches Screenshot Exactly!) */}
          <div className="pt-6 flex justify-end">
            <button
              onClick={onSubmitTest}
              className="bg-[#17a2b8] hover:bg-[#138496] active:scale-95 text-white font-bold text-xs sm:text-sm px-7 sm:px-9 py-2.5 rounded-xs shadow-xs transition"
            >
              Submit
            </button>
          </div>

        </div>

      </div>

      {/* ============================================================== */}
      {/* INSTRUCTIONS MODAL                                             */}
      {/* ============================================================== */}
      {showInstructionsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full border border-gray-300 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-[#2b3035] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2 font-bold text-sm">
                <Info className="w-4 h-4 text-cyan-400" />
                <span>Candidate Exam Instructions</span>
              </div>
              <button 
                onClick={() => setShowInstructionsModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 text-xs text-gray-700 space-y-3 leading-relaxed max-h-[70vh] overflow-y-auto">
              <p className="font-bold text-gray-900 text-sm">General Instructions for CBT Typing Skill Test:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Candidates are required to type the exact text provided in the Master text passage (Upper Box) into the typing response box (Lower Box).</li>
                <li><strong>Duration:</strong> {isNTPC ? '10 Minutes' : '15 Minutes'}. The test will automatically auto-submit once the countdown timer hits 00:00.</li>
                {isNTPC ? (
                  <li className="text-red-700 font-semibold">
                    <strong>RRB NTPC Rule:</strong> Backspace key is strictly DISABLED/LOCKED as per Railway Recruitment Board guidelines.
                  </li>
                ) : (
                  <li className="text-emerald-700 font-semibold">
                    <strong>SSC DEST Rule:</strong> Backspace key is allowed to correct typing errors.
                  </li>
                )}
                <li>Copy, paste, cut, and text selection key combinations are strictly prohibited.</li>
                <li>Minimum Qualifying Speed: <strong>30 WPM in English / 25 WPM in Hindi</strong> for RRB NTPC.</li>
                <li>Use `A-` and `A+` in the top bar to adjust text font sizes according to your comfort.</li>
              </ul>
            </div>

            <div className="bg-gray-100 px-4 py-3 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowInstructionsModal(false)}
                className="px-5 py-2 bg-[#007bff] hover:bg-[#0069d9] text-white font-bold text-xs rounded transition"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SETTINGS MODAL                                                 */}
      {/* ============================================================== */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full border border-gray-300 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-[#2b3035] text-white px-4 py-3 flex items-center justify-between">
              <span className="font-bold text-sm">Display & Sound Settings</span>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 text-xs text-gray-700 space-y-4">
              <div>
                <label className="font-bold text-gray-900 block mb-2">Font Size (A- / A+):</label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={decreaseFontSize}
                    className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded font-bold"
                  >
                    A- Smaller
                  </button>
                  <span className="font-mono font-bold text-sm px-3">Level {fontSizeLevel}</span>
                  <button
                    onClick={increaseFontSize}
                    className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded font-bold"
                  >
                    A+ Larger
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-900">Typing Sound</div>
                  <div className="text-[11px] text-gray-500">Audio feedback on keystroke</div>
                </div>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`px-3 py-1.5 rounded text-xs font-bold ${
                    soundEnabled ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                  }`}
                >
                  {soundEnabled ? 'Sound: ON' : 'Sound: OFF'}
                </button>
              </div>
            </div>

            <div className="bg-gray-100 px-4 py-3 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-1.5 bg-[#17a2b8] hover:bg-[#138496] text-white font-bold text-xs rounded transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* CANCEL CONFIRMATION MODAL                                      */}
      {/* ============================================================== */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full p-5 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Exit Mock Assessment?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Your current test progress will not be submitted. Are you sure you want to return to the catalog?
              </p>
            </div>
            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs rounded"
              >
                Continue Test
              </button>
              <button
                onClick={onExitTest}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded"
              >
                Exit Assessment
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
