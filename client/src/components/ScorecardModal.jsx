import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Zap, 
  Printer, 
  RotateCcw, 
  Award,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  FileText,
  Sparkles,
  Target,
  ArrowLeft,
  Volume2,
  VolumeX,
  Keyboard,
  Check,
  Flame,
  HelpCircle,
  X
} from 'lucide-react';

export default function ScorecardModal({ result, onClose, onRetake }) {
  if (!result) return null;

  // Weak Words Practice Drill Mode State
  const [isDrillActive, setIsDrillActive] = useState(false);
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [drillInput, setDrillInput] = useState('');
  const [wordRepetitions, setWordRepetitions] = useState(0);
  const [masteredWords, setMasteredWords] = useState([]);
  const [drillSound, setDrillSound] = useState(true);
  const drillInputRef = useRef(null);

  const targetReps = 3; // Type each weak word 3 times correctly to master it

  const isNTPC = result.examType === 'RRB_NTPC' || result.examType?.startsWith('RRB_NTPC') || result.examType?.includes('NTPC') || result.examType?.includes('RAILWAY');
  const isCGL = result.examType === 'SSC_CGL' || result.examType?.startsWith('SSC_CGL');
  const isCHSL = !isNTPC && !isCGL;

  const examLabel = result.examDisplayName || (isNTPC 
    ? 'RRB NTPC CBTST' 
    : (isCGL ? 'SSC CGL Tier-II DEST' : 'SSC CHSL Tier-II Typing'));

  const weakWordsList = result.weakWords || [];
  const currentWeakWord = weakWordsList[currentWordIdx];

  useEffect(() => {
    if (result.isQualified) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [result.isQualified]);

  // Audio click synthesizer for drill
  const playDrillSound = (isCorrect) => {
    if (!drillSound) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      if (isCorrect) {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, ctx.currentTime);
        gain.gain.setValueAtTime(0.09, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      }
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {}
  };

  // Focus drill input on start
  useEffect(() => {
    if (isDrillActive && drillInputRef.current) {
      drillInputRef.current.focus();
    }
  }, [isDrillActive, currentWordIdx]);

  // Handle Drill Typing
  const handleDrillChange = (e) => {
    const val = e.target.value;
    if (!currentWeakWord) return;

    const targetWord = currentWeakWord.word;
    setDrillInput(val);

    // If candidate successfully typed the complete word
    if (val === targetWord) {
      playDrillSound(true);
      const nextRep = wordRepetitions + 1;
      setWordRepetitions(nextRep);
      setDrillInput('');

      if (nextRep >= targetReps) {
        // Word Mastered!
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
        if (!masteredWords.includes(targetWord)) {
          setMasteredWords(prev => [...prev, targetWord]);
        }
        setWordRepetitions(0);
        if (currentWordIdx + 1 < weakWordsList.length) {
          setCurrentWordIdx(prev => prev + 1);
        }
      }
    } else if (val.length > 0 && !targetWord.startsWith(val)) {
      playDrillSound(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        
        {/* ============================================================== */}
        {/* VIEW 1: INTERACTIVE WEAK WORDS PRACTICE DRILL ARENA            */}
        {/* ============================================================== */}
        {isDrillActive ? (
          <div className="p-6 space-y-6 text-white flex flex-col">
            
            {/* Drill Top Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsDrillActive(false)}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition border border-slate-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Scorecard</span>
                </button>
                <div className="flex items-center space-x-2">
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                    Weak Words Drill
                  </span>
                  <span className="text-sm font-bold text-slate-200">
                    Word {currentWordIdx + 1} of {weakWordsList.length}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-xs">
                <span className="text-emerald-400 font-mono font-bold">
                  Mastered: {masteredWords.length}/{weakWordsList.length}
                </span>
                <button
                  onClick={() => setDrillSound(!drillSound)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
                  title="Toggle Audio Feedback"
                >
                  {drillSound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Drill Main Content */}
            {currentWeakWord ? (
              <div className="max-w-xl mx-auto w-full space-y-5 text-center py-4">
                
                {/* Diagnostic Reason & Advice */}
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 text-left space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-amber-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Mistake Reason: {currentWeakWord.reason}</span>
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      Penalty: -{currentWeakWord.penalty}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    {currentWeakWord.advice}
                  </p>
                  <div className="text-[11px] text-slate-400 pt-1 font-mono">
                    During test you typed: <strong className="text-rose-400 line-through">{currentWeakWord.typed}</strong> → Target: <strong className="text-emerald-400">{currentWeakWord.word}</strong>
                  </div>
                </div>

                {/* Big Target Word Display with Letter Highlighting */}
                <div className="bg-slate-950 p-6 rounded-2xl border-2 border-slate-800 shadow-inner">
                  <div className="text-xs uppercase font-bold text-slate-500 tracking-widest mb-2">
                    Target Word to Master
                  </div>
                  <div className="text-3xl sm:text-4xl font-mono font-black tracking-wide text-white flex justify-center items-center flex-wrap gap-1">
                    {currentWeakWord.word.split('').map((char, i) => {
                      let colorClass = 'text-slate-500';
                      if (i < drillInput.length) {
                        colorClass = drillInput[i] === char ? 'text-emerald-400' : 'text-rose-500 underline';
                      } else if (i === drillInput.length) {
                        colorClass = 'text-cyan-300 bg-cyan-950/60 px-0.5 rounded animate-pulse';
                      }
                      return (
                        <span key={i} className={colorClass}>
                          {char}
                        </span>
                      );
                    })}
                  </div>

                  {/* Progress Stars for this word */}
                  <div className="flex justify-center items-center space-x-2 mt-4">
                    <span className="text-xs text-slate-400">Mastery Progress:</span>
                    {[1, 2, 3].map((rep) => (
                      <span
                        key={rep}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono transition ${
                          rep <= wordRepetitions 
                            ? 'bg-emerald-500 text-slate-950 shadow-xs' 
                            : 'bg-slate-800 text-slate-500 border border-slate-700'
                        }`}
                      >
                        {rep <= wordRepetitions ? '✓' : rep}
                      </span>
                    ))}
                    <span className="text-[11px] text-slate-400 ml-1">
                      ({wordRepetitions}/{targetReps} correct repetitions)
                    </span>
                  </div>
                </div>

                {/* Candidate Interactive Drill Input */}
                <div className="space-y-2">
                  <input
                    ref={drillInputRef}
                    type="text"
                    value={drillInput}
                    onChange={handleDrillChange}
                    placeholder="Type the word here exactly...."
                    className="w-full text-center text-xl sm:text-2xl font-mono p-3.5 bg-slate-800 text-white rounded-xl border-2 border-blue-500 focus:outline-hidden focus:ring-4 focus:ring-blue-500/20 shadow-md tracking-wider"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                  />
                  <p className="text-[11px] text-slate-400">
                    Type correctly <strong>{targetReps} times</strong> to permanently master this word and eliminate this mistake!
                  </p>
                </div>

                {/* Word Navigation Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    disabled={currentWordIdx === 0}
                    onClick={() => {
                      setCurrentWordIdx(prev => prev - 1);
                      setWordRepetitions(0);
                      setDrillInput('');
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-bold rounded-lg transition"
                  >
                    ← Previous Word
                  </button>

                  <button
                    disabled={currentWordIdx + 1 >= weakWordsList.length}
                    onClick={() => {
                      setCurrentWordIdx(prev => prev + 1);
                      setWordRepetitions(0);
                      setDrillInput('');
                    }}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg shadow transition"
                  >
                    Next Word →
                  </button>
                </div>

              </div>
            ) : (
              <div className="text-center py-12 space-y-3">
                <div className="p-3 bg-emerald-500/20 text-emerald-300 w-12 h-12 rounded-full mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">No Weak Words Detected!</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  You typed every word with exceptional accuracy. No specific weak root words were flagged in this mock test.
                </p>
                <button
                  onClick={() => setIsDrillActive(false)}
                  className="px-5 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg"
                >
                  Return to Scorecard
                </button>
              </div>
            )}

          </div>
        ) : (
          /* ============================================================== */
          /* VIEW 2: STANDARD COMPREHENSIVE SCORECARD MODAL                 */
          /* ============================================================== */
          <>
            {/* Top Header Result Banner (Category-Specific Pass/Fail Verdict) */}
            <div className={`relative p-6 text-white text-center border-b ${
              result.isQualified 
                ? 'bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 border-emerald-600' 
                : 'bg-gradient-to-r from-rose-700 via-red-700 to-rose-800 border-rose-600'
            }`}>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition z-10"
                title="Close and return to Home / Catalog"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/10 backdrop-blur-md mb-2 shadow-inner">
                {result.isQualified ? (
                  <CheckCircle2 className="w-12 h-12 text-emerald-200" />
                ) : (
                  <XCircle className="w-12 h-12 text-rose-200" />
                )}
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                {isNTPC ? (
                  result.isQualified 
                    ? `QUALIFIED FOR RAILWAY RRB NTPC CBTST` 
                    : `DID NOT QUALIFY FOR RAILWAY RRB NTPC CBTST`
                ) : isCGL ? (
                  result.isQualified 
                    ? `QUALIFIED UNDER ${result.category} (SSC CGL DEST)` 
                    : `DID NOT QUALIFY UNDER ${result.category} (SSC CGL DEST)`
                ) : (
                  result.isQualified 
                    ? `QUALIFIED UNDER ${result.category} (SSC CHSL TYPING)` 
                    : `DID NOT QUALIFY UNDER ${result.category} (SSC CHSL TYPING)`
                )}
              </h2>

              <p className="text-sm font-semibold text-white/95 mt-1">
                Examination: <span className="underline font-bold">{examLabel}</span> • Candidate Category: <span className="bg-white/20 px-2 py-0.5 rounded font-black">{result.category}</span>
              </p>

              <p className="text-xs text-white/85 mt-1.5 max-w-xl mx-auto leading-relaxed">
                {isNTPC ? (
                  result.isQualified 
                    ? `Congratulations! As per official Railway RRB NTPC criteria (Net Speed ≥ ${result.requiredWPM} WPM with 5% ignored error buffer & 10x penalty on excess mistakes), your Net Speed of ${result.netWPM} WPM qualifies for final appointment.`
                    : `Official Railway RRB NTPC criteria requires Net Speed ≥ ${result.requiredWPM} WPM (after applying 10 words penalty per excess mistake beyond 5% ignored buffer). Your Net Speed was ${result.netWPM} WPM.`
                ) : isCGL ? (
                  result.isQualified
                    ? `Congratulations! As per official SSC CGL DEST criteria for ${result.category} category (Max Allowed: ${result.maxAllowedError}%, Min Speed: 8,000 KDPH / 27 WPM), your Error Rate of ${result.errorPercentage}% and Speed of ${result.netWPM} WPM qualify for final appointment.`
                    : `Official SSC CGL DEST cutoff for ${result.category} requires max ${result.maxAllowedError}% error and 8,000 KDPH / 27 WPM speed. Your Error Rate was ${result.errorPercentage}% and Net Speed was ${result.netWPM} WPM.`
                ) : (
                  result.isQualified 
                    ? `Congratulations! As per official SSC CHSL cutoff for ${result.category} category (Max Allowed: ${result.maxAllowedError}%, Min Speed: 35 WPM / 10,500 KDPH), your Error Rate of ${result.errorPercentage}% and Net Speed of ${result.netWPM} WPM qualify for final appointment.`
                    : `Official SSC CHSL cutoff for ${result.category} requires max ${result.maxAllowedError}% error and 35 WPM speed. Your Error Rate was ${result.errorPercentage}% and Net Speed was ${result.netWPM} WPM.`
                )}
              </p>
            </div>

            {/* Candidate & Test Info Strip */}
            <div className="bg-slate-800/80 px-6 py-3 border-b border-slate-700/80 flex flex-wrap items-center justify-between text-xs text-slate-300">
              <div>
                <span className="text-slate-400">Candidate:</span> <strong className="text-white uppercase">{result.candidateName}</strong> ({result.rollNo})
              </div>
              <div>
                <span className="text-slate-400">Passage:</span> <strong className="text-blue-300">{result.passageTitle}</strong>
              </div>
              <div>
                <span className="text-slate-400">Duration:</span> <strong className="text-white">{result.timeTakenMinutes} Mins</strong>
              </div>
            </div>

            {/* Primary Metric Score Cards & Audits */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              
              {/* Primary 4 Metric Boxes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                
                {/* Net Speed */}
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Net Speed (WPM)
                  </div>
                  <div className={`text-3xl font-black font-mono ${result.isSpeedQualified ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {result.netWPM}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Req: <span className="text-slate-200 font-bold">
                      {isNTPC ? '30 WPM (English)' : (isCGL ? '27 WPM (8K KDPH)' : '35 WPM (10.5K KDPH)')}
                    </span>
                  </div>
                </div>

                {/* Error Percentage */}
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Error Percentage
                  </div>
                  <div className={`text-3xl font-black font-mono ${result.isAccuracyQualified ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {result.errorPercentage}%
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {isNTPC ? (
                      <span>Ignored Buffer: <strong className="text-slate-200">5% (All Quotas)</strong></span>
                    ) : (
                      <span>{result.category} Cutoff: <strong className="text-slate-200">{result.maxAllowedError}%</strong></span>
                    )}
                  </div>
                </div>

                {/* Gross Speed */}
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Gross Speed
                  </div>
                  <div className="text-3xl font-black font-mono text-blue-400">
                    {result.grossWPM}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Words Per Minute
                  </div>
                </div>

                {/* KDPH */}
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Key Depressions
                  </div>
                  <div className="text-3xl font-black font-mono text-amber-400">
                    {result.grossKDPH}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {isCGL ? 'Target: 8,000 (15 Min)' : (isNTPC ? 'Target: 9,000 KDPH' : 'Target: 10,500 KDPH')}
                  </div>
                </div>

              </div>

              {/* ============================================================== */}
              {/* 1. CATEGORY-WISE CUTOFF MATRIX & COMPARISON                    */}
              {/* ============================================================== */}
              {result.categoryComparison && result.categoryComparison.length > 0 && (
                <div className="bg-slate-800/80 rounded-xl border border-slate-700 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-2.5">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-cyan-400" />
                      <h4 className="font-bold text-white text-xs sm:text-sm uppercase tracking-wider">
                        Category-wise Official Cutoff Breakdown (कैटेगरी वाइज कटऑफ)
                      </h4>
                    </div>
                    <span className="text-xs text-slate-400">
                      Your Category: <strong className="text-amber-300 uppercase">{result.category}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
                    {result.categoryComparison.map((catItem) => {
                      const isCandidate = catItem.isCandidateCategory;
                      return (
                        <div
                          key={catItem.category}
                          className={`p-3 rounded-xl border text-center transition ${
                            isCandidate
                              ? 'bg-blue-950/60 border-blue-500 ring-2 ring-blue-500/30'
                              : 'bg-slate-900/60 border-slate-700/70'
                          }`}
                        >
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <span className="font-bold text-xs text-white uppercase">{catItem.category}</span>
                            {isCandidate && (
                              <span className="bg-blue-600 text-white text-[9px] px-1.5 py-0.2 rounded font-bold uppercase">
                                You
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] text-slate-400 font-mono">
                            Cutoff: <strong className="text-slate-200">{catItem.maxAllowedError}%</strong>
                          </div>

                          <div className="mt-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                              catItem.isQualified 
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' 
                                : 'bg-rose-950 text-rose-300 border border-rose-800'
                            }`}>
                              {catItem.isQualified ? 'PASS' : 'FAIL'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
                    {isNTPC ? (
                      <span>ℹ️ In <strong>Railway RRB NTPC CBTST</strong>, the 5% error buffer applies uniformly across ALL categories (UR, OBC, SC, ST, EWS). Qualification is strictly based on achieving Net Speed ≥ 30 WPM after 10-word deductions per excess mistake.</span>
                    ) : isCGL ? (
                      <span>ℹ️ In <strong>SSC CGL Tier-II DEST</strong>, candidates are evaluated against commission cutoffs (UR: 5%, OBC/EWS: 7%, SC/ST: 10%, Speed ≥ 27 WPM / 8,000 KDPH). Your appointment status is evaluated under <strong className="text-white">{result.category}</strong> quota.</span>
                    ) : (
                      <span>ℹ️ In <strong>SSC CHSL Tier-II Typing</strong>, candidates are evaluated against commission cutoffs (UR: 7%, OBC/EWS/SC/ST: 10%, Speed ≥ 35 WPM / 10,500 KDPH). Your appointment status is evaluated under <strong className="text-white">{result.category}</strong> quota.</span>
                    )}
                  </p>
                </div>
              )}

              {/* ============================================================== */}
              {/* 2. WEAK WORDS ANALYSIS & PRACTICE OPTION                       */}
              {/* ============================================================== */}
              <div className="bg-gradient-to-r from-amber-950/30 via-slate-800/80 to-slate-800/80 rounded-xl border border-amber-600/40 p-5 space-y-4">
                
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/80 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <Flame className="w-5 h-5 text-amber-400" />
                      <h4 className="font-bold text-white text-sm">
                        Weak Words & Diagnostic Analysis (कमज़ोर शब्द विश्लेषण)
                      </h4>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Identified {weakWordsList.length} problematic words where you made typos, omissions, or substitutions.
                    </p>
                  </div>

                  {weakWordsList.length > 0 && (
                    <button
                      onClick={() => {
                        setIsDrillActive(true);
                        setCurrentWordIdx(0);
                        setWordRepetitions(0);
                        setDrillInput('');
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md transition active:scale-95"
                    >
                      <Sparkles className="w-4 h-4 fill-current" />
                      <span>Practice These Weak Words Drill →</span>
                    </button>
                  )}
                </div>

                {weakWordsList.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {weakWordsList.map((ww, i) => (
                      <div 
                        key={i}
                        className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/80 text-xs space-y-1.5 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-sm text-emerald-400">
                              {ww.word}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800/50">
                              -{ww.penalty}
                            </span>
                          </div>
                          
                          <div className="text-[11px] text-slate-400 pt-0.5">
                            Typed: <strong className="text-rose-400 line-through font-mono">{ww.typed}</strong>
                          </div>

                          <div className="text-[10px] text-amber-300 font-semibold pt-0.5">
                            • {ww.reason}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setIsDrillActive(true);
                            setCurrentWordIdx(i);
                            setWordRepetitions(0);
                            setDrillInput('');
                          }}
                          className="w-full text-center py-1 mt-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-bold rounded-lg transition"
                        >
                          Practice Word →
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-xs text-emerald-400 font-semibold">
                    ✓ Clean test! No persistent weak root words were detected in your submission.
                  </div>
                )}

              </div>

              {/* ============================================================== */}
              {/* 3. UNIQUE EXAM-SPECIFIC CRITERIA STRUCTURE & PENALTY AUDIT     */}
              {/* ============================================================== */}
              {isNTPC ? (
                /* RRB NTPC CBTST Audit Banner */
                <div className="bg-amber-950/40 border-2 border-amber-500/60 rounded-xl p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-amber-300 font-bold border-b border-amber-600/40 pb-2">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      Official Railway RRB NTPC CBTST Criteria & Penalty Audit
                    </span>
                    <span className="font-mono bg-amber-900 text-amber-200 px-2 py-0.5 rounded text-[11px]">
                      Formula: Net Words = Typed Words - (Excess × 10)
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center font-mono">
                    <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-700">
                      <div className="text-[10px] text-slate-400">Total Typed Words</div>
                      <div className="text-white font-bold text-sm">{result.totalTypedWords}</div>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-700">
                      <div className="text-[10px] text-emerald-400">5% Ignored Margin</div>
                      <div className="text-emerald-300 font-bold text-sm">{result.ignoredMistakes} words</div>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-700">
                      <div className="text-[10px] text-amber-400">Excess Mistakes</div>
                      <div className="text-amber-300 font-bold text-sm">{result.excessMistakes} words</div>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded-lg border border-red-800/40">
                      <div className="text-[10px] text-rose-400">Deduction (Excess × 10)</div>
                      <div className="text-rose-300 font-bold text-sm">-{result.penaltyWordsDeducted} words</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-amber-200/80 pt-1 leading-relaxed">
                    ⚡ <strong>Railway Rule:</strong> Up to 5% of typed words are forgiven with zero penalty for ALL categories. For each mistake beyond 5%, exactly 10 words are deducted from total words typed. Qualification is strictly Net Speed ≥ 30 WPM (English) / 25 WPM (Hindi). Backspace is disabled.
                  </p>
                </div>
              ) : isCGL ? (
                /* SSC CGL Tier-II DEST Audit Banner */
                <div className="bg-blue-950/40 border-2 border-blue-500/60 rounded-xl p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-blue-300 font-bold border-b border-blue-600/40 pb-2">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-blue-400" />
                      Official SSC CGL Tier-II DEST Criteria & Audit
                    </span>
                    <span className="font-mono bg-blue-900 text-blue-200 px-2 py-0.5 rounded text-[11px]">
                      Target: 2,000 Keystrokes in 15 Min (8,000 KDPH)
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center font-mono">
                    <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-700">
                      <div className="text-[10px] text-slate-400">Total Keystrokes</div>
                      <div className="text-white font-bold text-sm">{result.totalKeystrokes} / 2000</div>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-700">
                      <div className="text-[10px] text-blue-400">KDPH Rate</div>
                      <div className="text-blue-300 font-bold text-sm">{result.grossKDPH} KDPH</div>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-700">
                      <div className="text-[10px] text-amber-400">{result.category} Cutoff</div>
                      <div className="text-amber-300 font-bold text-sm">Max {result.maxAllowedError}% Error</div>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded-lg border border-emerald-800/40">
                      <div className="text-[10px] text-emerald-400">DEST Verdict</div>
                      <div className={`font-bold text-sm ${result.isQualified ? 'text-emerald-300' : 'text-rose-300'}`}>
                        {result.isQualified ? 'QUALIFIED' : 'NOT QUALIFIED'}
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-blue-200/80 pt-1 leading-relaxed">
                    ⚡ <strong>SSC CGL DEST Rule:</strong> 15-minute examination. Commission cutoffs: UR: 5% max error | OBC/EWS: 7% max error | SC/ST/PwD: 10% max error. Candidates must achieve error rate ≤ cutoff and maintain speed benchmark (~27 WPM / 8,000 KDPH). Backspace is permitted.
                  </p>
                </div>
              ) : (
                /* SSC CHSL Tier-II Typing Audit Banner */
                <div className="bg-emerald-950/40 border-2 border-emerald-500/60 rounded-xl p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-emerald-300 font-bold border-b border-emerald-600/40 pb-2">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Official SSC CHSL Tier-II Typing Test Criteria & Audit
                    </span>
                    <span className="font-mono bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded text-[11px]">
                      Benchmark: 35 WPM (10,500 KDPH) in 10 Min
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center font-mono">
                    <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-700">
                      <div className="text-[10px] text-slate-400">Net Speed</div>
                      <div className="text-white font-bold text-sm">{result.netWPM} WPM</div>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-700">
                      <div className="text-[10px] text-emerald-400">Required Speed</div>
                      <div className="text-emerald-300 font-bold text-sm">{result.requiredWPM} WPM</div>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-700">
                      <div className="text-[10px] text-amber-400">{result.category} Cutoff</div>
                      <div className="text-amber-300 font-bold text-sm">Max {result.maxAllowedError}% Error</div>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded-lg border border-emerald-800/40">
                      <div className="text-[10px] text-emerald-400">Typing Verdict</div>
                      <div className={`font-bold text-sm ${result.isQualified ? 'text-emerald-300' : 'text-rose-300'}`}>
                        {result.isQualified ? 'QUALIFIED' : 'NOT QUALIFIED'}
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-emerald-200/80 pt-1 leading-relaxed">
                    ⚡ <strong>SSC CHSL Rule:</strong> 10-minute examination. Benchmark speed: 35 WPM English (10,500 KDPH) / 30 WPM Hindi. Commission error cutoffs: UR: 7% max error | OBC/EWS/SC/ST/PwD: 10% max error. Qualification requires meeting BOTH speed (≥35 WPM) and error thresholds. Backspace is permitted.
                  </p>
                </div>
              )}

              {/* Detailed SSC / Railway Full & Half Mistakes Breakdown */}
              <div className="bg-slate-800/70 rounded-xl border border-slate-700 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                    <h4 className="font-bold text-white text-sm">
                      {isNTPC ? 'Railway NTPC Mistake Classification' : (isCGL ? 'SSC CGL DEST Mistake Classification' : 'SSC CHSL Mistake Classification')}
                    </h4>
                  </div>
                  <span className="text-xs text-slate-400">
                    Total Mistakes: <strong className="text-amber-400 font-mono text-sm">{result.totalMistakes}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Full Mistakes */}
                  <div className="bg-slate-900/60 p-4 rounded-lg border border-red-900/40 space-y-2">
                    <div className="flex justify-between items-center text-xs font-semibold text-red-300">
                      <span>FULL MISTAKES (1.0 Penalty each)</span>
                      <span className="font-mono bg-red-950 text-red-300 px-2 py-0.5 rounded border border-red-800/50">
                        {result.fullMistakes} Words
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Includes omission of words from text, substitution of wrong words, or unnecessary word additions.
                    </p>
                    <div className="text-xs text-red-400 font-mono">
                      Penalty Impact: -{result.fullMistakes} mistakes
                    </div>
                  </div>

                  {/* Half Mistakes */}
                  <div className="bg-slate-900/60 p-4 rounded-lg border border-amber-900/40 space-y-2">
                    <div className="flex justify-between items-center text-xs font-semibold text-amber-300">
                      <span>HALF MISTAKES (0.5 Penalty each)</span>
                      <span className="font-mono bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800/50">
                        {result.halfMistakes} Words
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Includes spelling errors (typos), wrong capitalization of words, or punctuation discrepancies.
                    </p>
                    <div className="text-xs text-amber-400 font-mono">
                      Penalty Impact: -{(result.halfMistakes * 0.5).toFixed(1)} mistakes
                    </div>
                  </div>

                </div>

                {/* Keystrokes & Backspace Analysis */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                  <div className="bg-slate-900/40 p-2.5 rounded-lg border border-slate-700/50">
                    <span className="text-slate-400">Total Keystrokes:</span>{' '}
                    <strong className="text-white font-mono">{result.totalKeystrokes}</strong>
                  </div>
                  <div className="bg-slate-900/40 p-2.5 rounded-lg border border-slate-700/50">
                    <span className="text-slate-400">Total Typed Words:</span>{' '}
                    <strong className="text-white font-mono">{result.totalTypedWords}</strong>
                  </div>
                  <div className="bg-slate-900/40 p-2.5 rounded-lg border border-slate-700/50">
                    <span className="text-slate-400">Backspaces Used:</span>{' '}
                    <strong className="text-amber-300 font-mono">{result.backspaceCount}</strong>
                  </div>
                </div>

              </div>

              {/* Interactive Word-by-Word Mistake Inspector */}
              {result.detailedResults && result.detailedResults.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <span>Word-by-Word Passage Audit (Click/Hover to inspect error)</span>
                    </h4>
                    <div className="flex items-center space-x-3 text-[11px]">
                      <span className="flex items-center space-x-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                        <span className="text-slate-300">Correct</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
                        <span className="text-slate-300">Full Mistake</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                        <span className="text-slate-300">Half Mistake</span>
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-sm leading-relaxed max-h-56 overflow-y-auto custom-scrollbar flex flex-wrap gap-1.5 font-sans">
                    {result.detailedResults.map((item, idx) => {
                      if (item.status === 'correct') {
                        return (
                          <span key={idx} className="text-emerald-400 px-1 py-0.5 rounded hover:bg-emerald-950/40 transition">
                            {item.expected}
                          </span>
                        );
                      }
                      if (item.status === 'half_mistake') {
                        return (
                          <span 
                            key={idx} 
                            title={`${item.reason}: Typed "${item.actual}" instead of "${item.expected}" (-0.5)`}
                            className="bg-amber-950 text-amber-300 border border-amber-600/60 px-1.5 py-0.5 rounded cursor-help font-semibold"
                          >
                            {item.actual || item.expected}
                            <span className="text-[10px] text-amber-400 ml-1">½</span>
                          </span>
                        );
                      }
                      return (
                        <span 
                          key={idx} 
                          title={`${item.reason}: Expected "${item.expected}", got "${item.actual}" (-1.0)`}
                          className="bg-red-950 text-red-300 border border-red-600/60 px-1.5 py-0.5 rounded cursor-help line-through font-semibold"
                        >
                          {item.actual !== '—' ? item.actual : item.expected}
                          <span className="text-[10px] text-red-400 ml-1 no-underline">✗</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer Controls */}
            <div className="bg-slate-800 p-4 border-t border-slate-700 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => window.print()}
                className="flex items-center space-x-1.5 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold rounded-lg transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print Scorecard</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition"
                >
                  Close
                </button>
                <button
                  onClick={onRetake}
                  className="flex items-center space-x-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-md transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Take Another Test</span>
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
