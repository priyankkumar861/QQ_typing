import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Settings, 
  Clock, 
  AlertCircle,
  ShieldAlert,
  CheckCircle,
  Activity,
  Lock,
  Unlock,
  Type,
  FileText,
  Layout,
  Monitor,
  Sidebar as SidebarIcon,
  HelpCircle,
  Sparkles,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import LiveDiagnosticsPanel from './LiveDiagnosticsPanel';
import TcsExamHeader from './TcsExamHeader';
import TcsRealExamView from './TcsRealExamView';
import { 
  playKeyboardClick, 
  startHallAmbientNoise, 
  stopHallAmbientNoise, 
  setHallNoiseVolume 
} from '../utils/audioEngine';

export default function TypingTest({ 
  passage, 
  candidateInfo, 
  initialMode = 'practice',
  initialPattern = 'ediquity',
  onTestComplete,
  onExitTest
}) {
  const [typedText, setTypedText] = useState('');
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isTestFinished, setIsTestFinished] = useState(false);
  
  // Assessment Mode: 'practice' (with live sidebar & guidance) vs 'exam' (strict distraction-free CBT)
  const [mode, setMode] = useState(initialMode);
  
  const isNTPC = candidateInfo?.examType === 'RRB_NTPC' || candidateInfo?.examType?.startsWith('RRB_NTPC') || candidateInfo?.examType?.includes('NTPC') || passage?.category?.startsWith('RRB NTPC');
  const isCGL = candidateInfo?.examType === 'SSC_CGL' || candidateInfo?.examType?.startsWith('SSC_CGL');
  const examDurationMinutes = isCGL ? 15 : 10;

  // Interface Pattern: If NTPC, strictly 'tcs', else initialPattern
  const [pattern, setPattern] = useState(isNTPC ? 'tcs' : initialPattern);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (isNTPC) {
      setPattern('tcs');
    }
  }, [isNTPC, passage]);

  const [testDurationMinutes, setTestDurationMinutes] = useState(examDurationMinutes);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(examDurationMinutes * 60);

  // In RRB NTPC, Backspace is strictly locked by rule. In SSC, Backspace is allowed.
  const [backspaceAllowed, setBackspaceAllowed] = useState(!isNTPC);
  const [backspaceCount, setBackspaceCount] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);

  // Display Customization (Ediquity Pattern)
  const [keyboardSoundEnabled, setKeyboardSoundEnabled] = useState(() => {
    return localStorage.getItem('typing_key_sound') !== 'false';
  });
  const [hallNoiseEnabled, setHallNoiseEnabled] = useState(() => {
    return localStorage.getItem('typing_hall_noise') === 'true';
  });
  const [keyboardVolume, setKeyboardVolume] = useState(() => {
    const saved = localStorage.getItem('typing_key_vol');
    return saved ? parseFloat(saved) : 0.6;
  });
  const [hallVolume, setHallVolume] = useState(() => {
    const saved = localStorage.getItem('typing_hall_vol');
    return saved ? parseFloat(saved) : 0.45;
  });

  // Persist sound preferences in localStorage
  useEffect(() => {
    localStorage.setItem('typing_key_sound', keyboardSoundEnabled);
  }, [keyboardSoundEnabled]);

  useEffect(() => {
    localStorage.setItem('typing_hall_noise', hallNoiseEnabled);
  }, [hallNoiseEnabled]);

  useEffect(() => {
    localStorage.setItem('typing_key_vol', keyboardVolume);
  }, [keyboardVolume]);

  useEffect(() => {
    localStorage.setItem('typing_hall_vol', hallVolume);
    setHallNoiseVolume(hallVolume);
  }, [hallVolume]);

  // Hall Ambient Noise Controller
  useEffect(() => {
    if (hallNoiseEnabled && !isTestFinished) {
      startHallAmbientNoise(hallVolume);
    } else {
      stopHallAmbientNoise();
    }
    return () => {
      stopHallAmbientNoise();
    };
  }, [hallNoiseEnabled, isTestFinished, hallVolume]);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState(2); // 1: small, 2: medium, 3: large, 4: extra large
  const [fontFamily, setFontFamily] = useState('serif'); // 'serif' by default matching Ediquity image
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);

  // Submission loading
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const inputRef = useRef(null);
  const passageBoxRef = useRef(null);
  const timerRef = useRef(null);

  // Automatically trigger fullscreen when in Real Exam Mode
  useEffect(() => {
    if (mode === 'exam') {
      try {
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().then(() => {
            setIsFullscreen(true);
          }).catch(() => {});
        }
      } catch (e) {}
    }
  }, [mode]);

  // Sync test duration & backspace when passage or candidate exam changes
  useEffect(() => {
    const duration = isCGL ? 15 : (passage?.durationMinutes || 10);
    setBackspaceAllowed(!isNTPC);
    resetTest(duration);
  }, [passage, candidateInfo.examType]);

  // Authentic Mechanical Keyboard Click Synthesizer
  const playKeySound = () => {
    if (!keyboardSoundEnabled) return;
    playKeyboardClick(keyboardVolume);
  };

  // Timer Countdown Effect
  useEffect(() => {
    if (isTestStarted && !isTestFinished && timeLeftSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeftSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            finishTest(true); // Auto submit on timer zero
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isTestStarted, isTestFinished, timeLeftSeconds]);

  // Format Time (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Reset Test
  const resetTest = (duration = testDurationMinutes) => {
    clearInterval(timerRef.current);
    setTypedText('');
    setIsTestStarted(false);
    setIsTestFinished(false);
    setTestDurationMinutes(duration);
    setTimeLeftSeconds(duration * 60);
    setBackspaceCount(0);
    setTotalKeystrokes(0);
    setShowConfirmModal(false);
    if (inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Font Size Adjustments
  const increaseFontSize = () => {
    setFontSizeLevel(prev => Math.min(prev + 1, 4));
  };

  const decreaseFontSize = () => {
    setFontSizeLevel(prev => Math.max(prev - 1, 1));
  };

  const getFontSizeClass = () => {
    switch (fontSizeLevel) {
      case 1: return 'text-sm leading-normal';
      case 2: return 'text-base leading-relaxed';
      case 3: return 'text-lg leading-relaxed';
      case 4: return 'text-xl leading-loose';
      default: return 'text-base leading-relaxed';
    }
  };

  // Handle Input Changes
  const handleInputChange = (e) => {
    if (isTestFinished) return;

    if (!isTestStarted) {
      setIsTestStarted(true);
    }

    const val = e.target.value;
    setTypedText(val);
    setTotalKeystrokes(val.length);
    playKeySound();
  };

  // Handle Key Down (Strict Backspace lockout for RRB NTPC + Block Copy/Paste)
  const handleKeyDown = (e) => {
    if (isTestFinished) {
      e.preventDefault();
      return;
    }

    // Disable Copy / Paste / Cut
    if (e.ctrlKey || e.metaKey) {
      if (['c', 'v', 'x', 'a', 'insert'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        return;
      }
    }

    // Backspace handling
    if (e.key === 'Backspace') {
      if (!backspaceAllowed || isNTPC) {
        e.preventDefault(); // Strict Backspace disabled in NTPC exam hall
        return;
      }
      setBackspaceCount(prev => prev + 1);
    }
  };

  // Finish and Submit Test to Backend
  const finishTest = async (isAuto = false) => {
    if (isTestFinished || submitting) return;
    setIsTestFinished(true);
    setSubmitting(true);
    clearInterval(timerRef.current);

    const timeSpentSeconds = (testDurationMinutes * 60) - timeLeftSeconds;
    const finalSeconds = Math.max(timeSpentSeconds, 5);

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalText: passage.text,
          typedText: typedText,
          timeTakenSeconds: finalSeconds,
          testDurationMinutes: testDurationMinutes,
          backspaceCount: backspaceCount,
          examType: candidateInfo.examType,
          category: candidateInfo.category,
          candidateInfo: candidateInfo,
          passageTitle: passage.title
        })
      });

      const data = await response.json();
      if (data.success) {
        onTestComplete(data.result);
      } else {
        alert('Evaluation error: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error submitting test:', err);
      alert('Could not connect to evaluation server.');
    } finally {
      setSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  // Calculations for live telemetry
  const elapsedMinutes = Math.max(((testDurationMinutes * 60) - timeLeftSeconds) / 60, 0.05);
  const liveGrossWPM = Math.round((typedText.length / 5) / elapsedMinutes);

  // Clean title formatter to avoid copied heading text
  const cleanTitle = passage?.title?.includes(':') 
    ? passage.title.split(':')[1].trim() 
    : (passage?.title || 'DEST Assessment Bench');

  const setNumber = (passage?.id || '01').replace(/^[a-z]+-mock-?/i, '') || '01';

  // If TCS iON Pattern is active (always true for RRB NTPC, or selected for SSC):
  if (pattern === 'tcs') {
    return (
      <>
        <TcsRealExamView
          passage={passage}
          candidateInfo={candidateInfo}
          typedText={typedText}
          timeLeftFormatted={formatTime(timeLeftSeconds)}
          timeLeftSeconds={timeLeftSeconds}
          isTestStarted={isTestStarted}
          isTestFinished={isTestFinished}
          fontSizeLevel={fontSizeLevel}
          increaseFontSize={increaseFontSize}
          decreaseFontSize={decreaseFontSize}
          getFontSizeClass={getFontSizeClass}
          keyboardSoundEnabled={keyboardSoundEnabled}
          setKeyboardSoundEnabled={setKeyboardSoundEnabled}
          hallNoiseEnabled={hallNoiseEnabled}
          setHallNoiseEnabled={setHallNoiseEnabled}
          keyboardVolume={keyboardVolume}
          setKeyboardVolume={setKeyboardVolume}
          hallVolume={hallVolume}
          setHallVolume={setHallVolume}
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
          inputRef={inputRef}
          passageBoxRef={passageBoxRef}
          handleInputChange={handleInputChange}
          handleKeyDown={handleKeyDown}
          onExitTest={onExitTest}
          onSubmitTest={() => setShowConfirmModal(true)}
          isNTPC={isNTPC}
          totalKeystrokes={totalKeystrokes}
          backspaceCount={backspaceCount}
        />

        {/* Submit Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white border border-slate-300 w-full max-w-md rounded-2xl shadow-2xl p-6 text-slate-900 space-y-4 animate-in fade-in">
              <div className="flex items-center space-x-3 text-red-600">
                <AlertCircle className="w-6 h-6" />
                <h3 className="text-lg font-bold">Submit Skill Test?</h3>
              </div>
              
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to finish and submit your test now? Your performance will be audited as per official <strong className="text-blue-700">{candidateInfo.examType.replace('_', ' ')}</strong> guidelines.
              </p>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1 font-mono">
                <div>Total Keystrokes: <span className="text-blue-700 font-bold">{totalKeystrokes}</span></div>
                <div>Time Remaining: <span className="text-red-600 font-bold">{formatTime(timeLeftSeconds)}</span></div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                >
                  Continue Typing
                </button>
                <button
                  disabled={submitting}
                  onClick={() => finishTest(false)}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-md transition"
                >
                  {submitting ? 'Auditing...' : 'Yes, Submit Test'}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#f3f4f6] flex flex-col font-sans select-none pb-12">
      
      {/* ============================================================== */}
      {/* 1. TOP HEADER: EDIQUITY PATTERN                                */}
      {/* ============================================================== */}
      {pattern === 'ediquity' ? (
        <header className="bg-[#2c4e72] text-white px-3 sm:px-4 py-2 border-b-2 border-[#1e3852] shadow-sm select-none">
          <div className="max-w-[1500px] mx-auto flex flex-wrap items-center justify-between gap-2">
            
            {/* Left Controls: [<- Back] [+ A+] [- A-] [Sound Toggle] [Settings] [Full Screen] */}
            <div className="flex items-center space-x-1.5 flex-wrap gap-y-1 text-xs">
              
              {/* Back Button */}
              <button
                onClick={onExitTest}
                className="flex items-center space-x-1 px-3 py-1 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded shadow-2xs border border-slate-300 transition"
                title="Return to Mock Catalog"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              {/* Font Size + A+ */}
              <button
                onClick={increaseFontSize}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded shadow-2xs border border-slate-300 transition"
                title="Increase Font Size"
              >
                + A+
              </button>

              {/* Font Size - A- */}
              <button
                onClick={decreaseFontSize}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded shadow-2xs border border-slate-300 transition"
                title="Decrease Font Size"
              >
                - A-
              </button>

              {/* Keyboard Typing Noise Toggle */}
              <button
                onClick={() => setKeyboardSoundEnabled(!keyboardSoundEnabled)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded font-bold transition shadow-2xs ${
                  keyboardSoundEnabled 
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                    : 'bg-[#e53e3e] hover:bg-red-600 text-white'
                }`}
                title="Toggle Mechanical Keyboard Typing Noise"
              >
                <span>⌨️ Key: {keyboardSoundEnabled ? 'ON' : 'OFF'}</span>
              </button>

              {/* Exam Hall Ambient Noise Toggle */}
              <button
                onClick={() => setHallNoiseEnabled(!hallNoiseEnabled)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded font-bold transition shadow-2xs ${
                  hallNoiseEnabled 
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                    : 'bg-[#e53e3e] hover:bg-red-600 text-white'
                }`}
                title="Toggle Examination Hall Ambient Typing Clatter (TCS iON Simulation)"
              >
                <span>🎧 Hall Noise: {hallNoiseEnabled ? 'ON' : 'OFF'}</span>
              </button>

              {/* Settings Button */}
              <button
                onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded font-bold transition shadow-2xs ${
                  showSettingsDrawer
                    ? 'bg-blue-800 text-white border border-blue-400'
                    : 'bg-white hover:bg-slate-100 text-slate-900 border border-slate-300'
                }`}
                title="Open Test Settings & Telemetry Drawer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Settings</span>
              </button>

              {/* Full Screen Button */}
              <button
                onClick={toggleFullscreen}
                className="flex items-center space-x-1 px-3 py-1 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded shadow-2xs border border-slate-300 transition"
                title="Toggle Full Screen Mode"
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                <span>{isFullscreen ? 'Exit Full Screen' : 'Full Screen'}</span>
              </button>

              {/* Mode Switcher Pill */}
              <div className="flex items-center bg-[#1e3852] p-0.5 rounded border border-white/20 ml-1">
                <button
                  onClick={() => setMode('practice')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                    mode === 'practice' 
                      ? 'bg-blue-500 text-white shadow-xs' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                  title="Switch to Practice Mode with live coaching sidebar"
                >
                  Practice
                </button>
                <button
                  onClick={() => setMode('exam')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                    mode === 'exam' 
                      ? 'bg-indigo-600 text-white shadow-xs' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                  title="Switch to Real Exam Mode (distraction-free)"
                >
                  Exam Mode
                </button>
              </div>

              {/* Pattern Switcher Pill */}
              {!isNTPC && (
                <div className="hidden md:flex items-center bg-[#1e3852] p-0.5 rounded border border-white/20">
                  <button
                    onClick={() => setPattern('ediquity')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                      pattern === 'ediquity' 
                        ? 'bg-emerald-600 text-white shadow-xs' 
                        : 'text-slate-300 hover:text-white'
                    }`}
                    title="Ediquity Exam Pattern"
                  >
                    Ediquity
                  </button>
                  <button
                    onClick={() => setPattern('tcs')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                      pattern === 'tcs' 
                        ? 'bg-slate-700 text-white shadow-xs' 
                        : 'text-slate-300 hover:text-white'
                    }`}
                    title="TCS iON Exam Pattern"
                  >
                    TCS iON
                  </button>
                </div>
              )}

            </div>

            {/* Center Heading (Customized Non-Copied Heading Style) */}
            <div className="flex items-center space-x-2 text-center justify-center truncate max-w-xs sm:max-w-md md:max-w-lg px-2">
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase bg-sky-500/20 text-sky-200 border border-sky-400/30">
                {isNTPC ? 'RRB CBT' : (isCGL ? 'SSC CGL DEST' : 'SSC CHSL')}
              </span>
              <span className="font-bold text-xs sm:text-sm text-slate-100 tracking-tight truncate drop-shadow-xs">
                {cleanTitle}
              </span>
              <span className="hidden lg:inline text-[10px] font-mono text-sky-300/80 bg-white/10 px-1.5 py-0.5 rounded">
                SET #{setNumber}
              </span>
            </div>

            {/* Right Timer: "Time Left 15:00" */}
            <div className="font-serif font-black text-sm sm:text-lg text-white tracking-wider flex items-center space-x-1.5 shrink-0">
              <span>Time Left</span>
              <span className={`font-mono px-2 py-0.5 rounded ${timeLeftSeconds < 120 ? 'bg-red-700 animate-pulse text-white' : 'text-white'}`}>
                {formatTime(timeLeftSeconds)}
              </span>
            </div>

          </div>
        </header>
      ) : (
        /* TCS iON HEADER */
        <div className="flex flex-col">
          <TcsExamHeader
            candidateInfo={candidateInfo}
            passageTitle={passage?.title}
            timeLeftFormatted={formatTime(timeLeftSeconds)}
            isTimerRunning={isTestStarted && !isTestFinished}
            totalKeystrokes={totalKeystrokes}
            backspaceCount={backspaceCount}
            backspaceAllowed={backspaceAllowed}
            toggleBackspace={() => {}}
            onFinishTest={() => setShowConfirmModal(true)}
            onExitTest={onExitTest}
          />
          {/* Sub bar for quick mode/pattern toggle in TCS mode */}
          <div className="bg-[#1a2530] px-4 py-1.5 text-xs text-slate-300 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] text-slate-400">Mode:</span>
              <button
                onClick={() => setMode('practice')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${mode === 'practice' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Practice (With Sidebar)
              </button>
              <button
                onClick={() => setMode('exam')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${mode === 'exam' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Real Exam
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[11px] text-slate-400">Interface:</span>
              <button
                onClick={() => setPattern('ediquity')}
                className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-700 text-white hover:bg-emerald-600"
              >
                Switch to Ediquity Pattern
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Device Physical Keyboard Notice */}
      <div className="lg:hidden bg-amber-50 border-b border-amber-200 px-3 py-1.5 text-amber-800 text-[11px] font-medium flex items-center justify-between gap-2">
        <span>⌨️ <strong>Mobile Tip:</strong> Official DEST exams require a physical keyboard. Connect via OTG or use Laptop/PC for exam speed.</span>
      </div>

      {/* 2. Candidate Status Pill */}
      <div className="bg-white border-b border-slate-200 px-4 py-1.5 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2 max-w-[1500px] w-full mx-auto">
        <div className="flex items-center space-x-4">
          <span>Candidate: <strong className="text-slate-900 uppercase">{candidateInfo.name}</strong> ({candidateInfo.rollNo})</span>
          <span>Exam: <strong className="text-blue-700">{candidateInfo.examType.replace('_', ' ')}</strong></span>
          <span>Category: <strong className="text-slate-800">{candidateInfo.category}</strong></span>
          <span className="hidden sm:inline">
            Mode: <strong className={mode === 'practice' ? 'text-blue-600 font-bold' : 'text-indigo-600 font-bold'}>
              {mode === 'practice' ? 'Practice Mode (Guided)' : 'Real Exam Mode (Strict)'}
            </strong>
          </span>
        </div>

        <div className="flex items-center space-x-4 font-mono text-[11px]">
          <span>Keystrokes: <strong className="text-blue-700">{totalKeystrokes}</strong></span>
          <span>Words: <strong className="text-slate-900">{typedText.trim() ? typedText.trim().split(/\s+/).length : 0}</strong></span>
          <span>Backspaces: <strong className={isNTPC ? 'text-red-600 font-bold' : 'text-amber-600'}>{backspaceCount}</strong></span>
          <span>
            Backspace: <strong className={isNTPC ? 'text-red-700 font-bold uppercase' : 'text-emerald-700 font-bold uppercase'}>
              {isNTPC ? 'Locked (NTPC)' : 'Allowed (SSC)'}
            </strong>
          </span>
          {mode === 'practice' && (
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-[10px] font-sans font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <SidebarIcon className="w-3 h-3" />
              <span>{sidebarCollapsed ? 'Show Sidebar' : 'Hide Sidebar'}</span>
            </button>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. MAIN TEST ARENA + PRACTICE SIDEBAR                           */}
      {/* ============================================================== */}
      <main className="max-w-[1500px] w-full mx-auto p-3 sm:p-4 flex-1 flex gap-4">
        
        {/* Left Column: The Test Boxes (Conditionally Rendered for Ediquity vs TCS iON) */}
        <div className="flex-1 flex flex-col space-y-3 min-w-0">
          
          {/* ========================================================== */}
          {/* EDIQUITY PATTERN BODY                                      */}
          {/* ========================================================== */}
          {pattern === 'ediquity' ? (
            <>
              {/* UPPER BOX: Official Master Text Passage */}
              <div className="bg-white rounded-lg border-2 border-[#94a3b8] shadow-2xs overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-100 border-b border-slate-300 text-slate-700 text-xs font-semibold">
                  <span className="flex items-center space-x-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span className="font-bold">Master Examination Passage</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    Language: <strong className="text-slate-800">{passage?.language || 'English'}</strong> • Words: ~<strong className="text-slate-800">{passage?.text ? passage.text.split(/\s+/).length : 0}</strong> • Keystrokes: <strong className="text-slate-800">{passage?.targetKeystrokes || (isCGL ? 2000 : 1750)}</strong>
                  </span>
                </div>

                <div 
                  ref={passageBoxRef}
                  className={`p-4 sm:p-5 text-slate-900 text-justify max-h-64 sm:max-h-72 overflow-y-auto custom-scrollbar select-none bg-white ${getFontSizeClass()} ${fontFamily === 'serif' ? 'font-serif' : (fontFamily === 'mono' ? 'font-mono' : 'font-sans')}`}
                  style={{ 
                    letterSpacing: '0.01em', 
                    wordSpacing: '0.14em',
                    textIndent: '0px'
                  }}
                  onCopy={(e) => e.preventDefault()}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  {passage?.text}
                </div>
              </div>

              {/* LOWER BOX: Candidate Typing Input Box (Exact Light-Green Background & Green Border) */}
              <div className="bg-[#e4f8d6] rounded-lg border-2 border-[#5cb85c] shadow-2xs overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#d4f2c0] border-b border-[#a3df8b] text-[#2c6827] text-xs font-bold">
                  <span className="flex items-center space-x-1.5">
                    <Type className="w-3.5 h-3.5 text-[#2c6827]" />
                    <span>Candidate Typing Response Area</span>
                  </span>
                  <span className="text-[11px] font-mono font-medium text-[#20521c]">
                    {mode === 'practice' ? '• Practice Mode Active (Live Telemetry & Tips)' : '• Official CBT Input Area'}
                  </span>
                </div>

                <textarea
                  ref={inputRef}
                  value={typedText}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onPaste={(e) => {
                    e.preventDefault();
                    alert('Exam Hall Rule: Copy-Paste is prohibited in this exam!');
                  }}
                  onCopy={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  onContextMenu={(e) => e.preventDefault()}
                  placeholder="Start typing here...."
                  className={`w-full p-4 sm:p-5 text-slate-900 bg-[#e4f8d6] resize-none h-44 sm:h-52 focus:outline-hidden ${getFontSizeClass()} ${fontFamily === 'serif' ? 'font-serif' : (fontFamily === 'mono' ? 'font-mono' : 'font-sans')}`}
                  style={{ 
                    letterSpacing: '0.01em', 
                    wordSpacing: '0.14em' 
                  }}
                  disabled={isTestFinished}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
              </div>

              {/* Centered Grey Submit Button at Bottom (Ediquity Style) */}
              <div className="pt-2 flex flex-col items-center justify-center">
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="w-44 py-2 bg-[#d1d5db] hover:bg-[#9ca3af] active:scale-95 text-slate-800 font-bold text-xs uppercase rounded-md shadow-xs border border-slate-400 transition"
                >
                  Submit Test
                </button>
                
                <div className="text-[11px] text-slate-500 mt-2 text-center">
                  {isNTPC ? (
                    <span className="text-amber-800 font-semibold">• RRB NTPC: 10 Min • 30 WPM English / 25 WPM Hindi • Backspace is locked • 5% errors ignored</span>
                  ) : isCGL ? (
                    <span className="text-blue-800 font-semibold">• SSC CGL DEST: 15 Min • 2000 Keystrokes (8000 KDPH ~27 WPM) • Cutoffs: 5% UR, 7% OBC, 10% SC/ST</span>
                  ) : (
                    <span className="text-indigo-800 font-semibold">• SSC CHSL: 10 Min • 1750 Keystrokes (35 WPM / 10500 KDPH) • Backspace allowed</span>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* ========================================================== */
            /* TCS iON PATTERN BODY                                       */
            /* ========================================================== */
            <>
              {/* TCS Upper Question / Master Text Box */}
              <div className="bg-white rounded border-2 border-slate-400 shadow-xs overflow-hidden flex flex-col">
                <div className="bg-[#2b3a4a] text-white px-4 py-2 flex items-center justify-between text-xs font-bold border-b border-slate-600">
                  <div className="flex items-center space-x-2">
                    <span className="bg-amber-400 text-slate-900 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                      Section: DEST
                    </span>
                    <span>Question 1 of 1: Master Text Passage ({passage?.language || 'English'})</span>
                  </div>
                  <div className="font-mono text-cyan-300 text-[11px]">
                    Marks: Qualifying • Negative: Formula
                  </div>
                </div>

                <div 
                  ref={passageBoxRef}
                  className={`p-4 sm:p-5 text-slate-900 text-justify max-h-64 sm:max-h-72 overflow-y-auto custom-scrollbar select-none bg-slate-50/50 ${getFontSizeClass()} font-sans`}
                  style={{ 
                    letterSpacing: '0.01em', 
                    wordSpacing: '0.12em',
                    lineHeight: '1.75'
                  }}
                  onCopy={(e) => e.preventDefault()}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  {passage?.text}
                </div>
              </div>

              {/* TCS Lower Candidate Response Area (Authentic White with Blue Border) */}
              <div className="bg-white rounded border-2 border-blue-600/80 shadow-xs overflow-hidden flex flex-col">
                <div className="bg-[#eef2f6] px-4 py-1.5 border-b border-slate-300 flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Candidate Response Area (Type Master Text in the box below)</span>
                  <span className="font-mono text-[11px] text-blue-700">
                    Characters: {typedText.length} | Words: {typedText.trim() ? typedText.trim().split(/\s+/).length : 0}
                  </span>
                </div>

                <textarea
                  ref={inputRef}
                  value={typedText}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onPaste={(e) => {
                    e.preventDefault();
                    alert('Exam Hall Rule: Copy-Paste is prohibited in this exam!');
                  }}
                  onCopy={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  onContextMenu={(e) => e.preventDefault()}
                  placeholder="Type the passage text here...."
                  className={`w-full p-4 sm:p-5 text-slate-900 bg-white resize-none h-44 sm:h-52 focus:outline-hidden ${getFontSizeClass()} font-sans`}
                  style={{ 
                    letterSpacing: '0.01em', 
                    wordSpacing: '0.12em',
                    lineHeight: '1.75'
                  }}
                  disabled={isTestFinished}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
              </div>

              {/* TCS iON Bottom Action Buttons Strip */}
              <div className="bg-[#e2e8f0] p-3 rounded border border-slate-300 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      if (window.confirm('Clear all typed content?')) setTypedText('');
                    }}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded border border-slate-400 shadow-2xs transition"
                  >
                    Clear Response
                  </button>
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded shadow-2xs transition"
                  >
                    Save & Next
                  </button>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs rounded shadow-md transition active:scale-95"
                  >
                    Submit Examination
                  </button>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Right Column: Practice Mode Guidance & Telemetry Sidebar */}
        {mode === 'practice' && !sidebarCollapsed && (
          <aside className="w-80 shrink-0 hidden lg:flex flex-col space-y-3">
            
            {/* Live Guidance & Coaching Card */}
            <div className="bg-white border-2 border-blue-200 rounded-xl p-4 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between border-b border-blue-100 pb-2">
                <div className="flex items-center space-x-1.5 text-blue-800 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Practice Coach Tips</span>
                </div>
                <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                  Live Guidance
                </span>
              </div>

              <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
                {isNTPC ? (
                  <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-900">
                    <strong className="block text-[11px] font-bold text-amber-800 mb-0.5">⚠️ RRB NTPC Rule:</strong>
                    Backspace is completely locked. Type with 100% steady accuracy rather than sprinting. Every excess mistake beyond 5% deducts 10 words!
                  </div>
                ) : isCGL ? (
                  <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-200 text-blue-900">
                    <strong className="block text-[11px] font-bold text-blue-800 mb-0.5">🎯 SSC CGL Tier-II Goal:</strong>
                    Aim for 8,000 KDPH (~27 WPM). UR cutoff is 5% maximum permissible error. Keep rhythm steady and scan words in chunks.
                  </div>
                ) : (
                  <div className="p-2.5 bg-indigo-50 rounded-lg border border-indigo-200 text-indigo-900">
                    <strong className="block text-[11px] font-bold text-indigo-800 mb-0.5">⚡ SSC CHSL Goal:</strong>
                    Maintain 35 WPM / 10,500 KDPH pace. You can use backspace freely to correct typing errors before pressing space.
                  </div>
                )}

                <div className="text-[11px] text-slate-500 pt-1">
                  💡 <em>Look at the master passage above while typing without looking down at the keyboard.</em>
                </div>
              </div>
            </div>

            {/* Diagnostics Telemetry Panel */}
            <div className="flex-1">
              <LiveDiagnosticsPanel
                examType={candidateInfo?.examType}
                category={candidateInfo?.category}
                liveGrossWPM={liveGrossWPM}
                totalKeystrokes={totalKeystrokes}
                backspaceCount={backspaceCount}
                elapsedMinutes={elapsedMinutes}
                fontSize={fontSizeLevel === 1 ? 'small' : (fontSizeLevel >= 3 ? 'large' : 'medium')}
                setFontSize={(s) => setFontSizeLevel(s === 'small' ? 1 : (s === 'large' ? 3 : 2))}
                fontFamily={fontFamily}
                setFontFamily={setFontFamily}
                keyboardSoundEnabled={keyboardSoundEnabled}
                setKeyboardSoundEnabled={setKeyboardSoundEnabled}
                hallNoiseEnabled={hallNoiseEnabled}
                setHallNoiseEnabled={setHallNoiseEnabled}
                onCollapse={() => setSidebarCollapsed(true)}
              />
            </div>

          </aside>
        )}

      </main>

      {/* 5. COLLAPSIBLE SETTINGS & LIVE TELEMETRY DRAWER */}
      {showSettingsDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-2xs">
          <div className="bg-slate-900 text-white w-full max-w-sm h-full shadow-2xl p-5 overflow-y-auto space-y-4 animate-in slide-in-from-right duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-sm">Exam Settings & Diagnostics</h3>
              </div>
              <button
                onClick={() => setShowSettingsDrawer(false)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Mode & Pattern Selectors inside Drawer */}
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Session Mode
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setMode('practice')}
                  className={`py-1.5 rounded-lg font-bold transition ${mode === 'practice' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}
                >
                  Practice Mode
                </button>
                <button
                  onClick={() => setMode('exam')}
                  className={`py-1.5 rounded-lg font-bold transition ${mode === 'exam' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'}`}
                >
                  Real Exam Mode
                </button>
              </div>

              {!isNTPC && (
                <>
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block pt-2">
                    Interface Pattern
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => setPattern('ediquity')}
                      className={`py-1.5 rounded-lg font-bold transition ${pattern === 'ediquity' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'}`}
                    >
                      Ediquity Pattern
                    </button>
                    <button
                      onClick={() => setPattern('tcs')}
                      className={`py-1.5 rounded-lg font-bold transition ${pattern === 'tcs' ? 'bg-slate-600 text-white' : 'bg-slate-700 text-slate-300'}`}
                    >
                      TCS iON Pattern
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Font Family Selector */}
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Passage Font Family
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {['serif', 'sans', 'mono'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFontFamily(f)}
                    className={`py-1.5 rounded-lg font-bold capitalize transition ${
                      fontFamily === f 
                        ? 'bg-blue-600 text-white shadow' 
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Engine Sliders inside Drawer */}
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-3">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Audio Volume Controls
              </label>

              {/* Keyboard Volume */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>⌨️ Keyboard Volume</span>
                  <span className="font-mono text-cyan-400 font-bold">{Math.round(keyboardVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={keyboardVolume}
                  onChange={(e) => setKeyboardVolume(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Hall Ambient Volume */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>🎧 Exam Hall Volume</span>
                  <span className="font-mono text-cyan-400 font-bold">{Math.round(hallVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={hallVolume}
                  onChange={(e) => setHallVolume(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Embedded Live Telemetry inside drawer */}
            <LiveDiagnosticsPanel
              examType={candidateInfo?.examType}
              category={candidateInfo?.category}
              liveGrossWPM={liveGrossWPM}
              totalKeystrokes={totalKeystrokes}
              backspaceCount={backspaceCount}
              elapsedMinutes={elapsedMinutes}
              fontSize={fontSizeLevel === 1 ? 'small' : (fontSizeLevel >= 3 ? 'large' : 'medium')}
              setFontSize={(s) => setFontSizeLevel(s === 'small' ? 1 : (s === 'large' ? 3 : 2))}
              fontFamily={fontFamily}
              setFontFamily={setFontFamily}
              keyboardSoundEnabled={keyboardSoundEnabled}
              setKeyboardSoundEnabled={setKeyboardSoundEnabled}
              hallNoiseEnabled={hallNoiseEnabled}
              setHallNoiseEnabled={setHallNoiseEnabled}
              onCollapse={() => setShowSettingsDrawer(false)}
            />

          </div>
        </div>
      )}

      {/* 6. Submit Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-300 w-full max-w-md rounded-2xl shadow-2xl p-6 text-slate-900 space-y-4 animate-in fade-in">
            <div className="flex items-center space-x-3 text-red-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold">Submit Skill Test?</h3>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to finish and submit your test now? Your performance will be audited as per official <strong className="text-blue-700">{candidateInfo.examType.replace('_', ' ')}</strong> guidelines.
            </p>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1 font-mono">
              <div>Total Keystrokes: <span className="text-blue-700 font-bold">{totalKeystrokes}</span></div>
              <div>Time Remaining: <span className="text-red-600 font-bold">{formatTime(timeLeftSeconds)}</span></div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
              >
                Continue Typing
              </button>
              <button
                disabled={submitting}
                onClick={() => finishTest(false)}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-md transition"
              >
                {submitting ? 'Auditing...' : 'Yes, Submit Test'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
