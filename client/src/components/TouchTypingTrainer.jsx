import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, 
  ChevronRight, 
  ChevronLeft,
  RotateCcw, 
  Volume2, 
  VolumeX, 
  CheckCircle, 
  Lock, 
  Star, 
  Sparkles, 
  Zap, 
  ArrowRight,
  Flame,
  HelpCircle,
  BookOpen,
  X,
  Layers
} from 'lucide-react';
import { TOUCH_TYPING_LESSONS } from '../data/touchTypingData';
import VirtualKeyboard from './VirtualKeyboard';

export default function TouchTypingTrainer() {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [typedIndex, setTypedIndex] = useState(0);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastPressedKey, setLastPressedKey] = useState('');
  const [isMistake, setIsMistake] = useState(false);
  const [showCurriculumDrawer, setShowCurriculumDrawer] = useState(false);

  // Lesson Progress (Saved in LocalStorage)
  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      const saved = localStorage.getItem('touch_typing_completed');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { 1: { stars: 3, wpm: 20 } }; // Step 1 unlocked by default
  });

  const lesson = TOUCH_TYPING_LESSONS[currentLessonIndex] || TOUCH_TYPING_LESSONS[0];
  const targetText = lesson.text;
  const containerRef = useRef(null);

  // Play audio synthesizers
  const playSound = (isError = false) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (isError) {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        gain.gain.setValueAtTime(0.09, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440 + Math.random() * 80, ctx.currentTime);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      }
    } catch (e) {}
  };

  // Reset Lesson
  const resetLesson = (idx = currentLessonIndex) => {
    setCurrentLessonIndex(idx);
    setTypedIndex(0);
    setMistakeCount(0);
    setIsStarted(false);
    setIsCompleted(false);
    setStartTime(null);
    setLastPressedKey('');
    setIsMistake(false);
    setShowCurriculumDrawer(false);
    setTimeout(() => {
      if (containerRef.current) containerRef.current.focus();
    }, 50);
  };

  // Key Down Listener
  const handleKeyDown = (e) => {
    // Ignore meta keys
    if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'CapsLock' || e.key === 'Tab') {
      return;
    }

    if (isCompleted) return;

    e.preventDefault();
    setLastPressedKey(e.key);

    if (!isStarted) {
      setIsStarted(true);
      setStartTime(Date.now());
    }

    const expectedChar = targetText[typedIndex];

    if (e.key === expectedChar) {
      // Correct Key
      playSound(false);
      setIsMistake(false);
      const nextIndex = typedIndex + 1;
      setTypedIndex(nextIndex);

      // Check if finished
      if (nextIndex >= targetText.length) {
        finishLesson();
      }
    } else {
      // Mistake Key
      playSound(true);
      setIsMistake(true);
      setMistakeCount(prev => prev + 1);
    }
  };

  // Finish Lesson
  const finishLesson = () => {
    setIsCompleted(true);
    const durationMin = Math.max((Date.now() - (startTime || Date.now())) / 60000, 0.05);
    const wpm = Math.round((targetText.length / 5) / durationMin);
    const totalPresses = targetText.length + mistakeCount;
    const accuracy = Math.round((targetText.length / totalPresses) * 100);

    let stars = 1;
    if (accuracy >= lesson.targetAccuracy && wpm >= lesson.targetWPM) stars = 3;
    else if (accuracy >= 90) stars = 2;

    const updated = {
      ...completedLessons,
      [lesson.id]: { stars, wpm, accuracy }
    };
    setCompletedLessons(updated);
    try {
      localStorage.setItem('touch_typing_completed', JSON.stringify(updated));
    } catch (e) {}

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  // Calculate live speed and accuracy
  const elapsedMinutes = startTime ? Math.max((Date.now() - startTime) / 60000, 0.02) : 0.02;
  const liveWPM = isStarted ? Math.round((typedIndex / 5) / elapsedMinutes) : 0;
  const totalStrokes = typedIndex + mistakeCount;
  const liveAccuracy = totalStrokes > 0 ? Math.round((typedIndex / totalStrokes) * 100) : 100;

  const nextChar = isCompleted ? '' : targetText[typedIndex] || '';

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-3 sm:py-4 space-y-3 sm:space-y-4">
      
      {/* Top Header Banner & Quick Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-lg text-white space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Lesson Title & Level */}
          <div className="flex-1 min-w-[260px]">
            <div className="flex items-center space-x-2">
              <span className="bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                {lesson.level}
              </span>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-white truncate">
                {lesson.title}
              </h2>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1 line-clamp-1">
              {lesson.subtitle || lesson.description}
            </p>
          </div>

          {/* Live Metrics Bar */}
          <div className="flex items-center space-x-3 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/80 shrink-0">
            <div className="text-center">
              <div className="text-[9px] text-slate-400 font-semibold uppercase">Speed</div>
              <div className="text-base sm:text-lg font-mono font-black text-emerald-400 leading-tight">
                {liveWPM} <span className="text-[10px] font-normal text-slate-400">WPM</span>
              </div>
            </div>
            <div className="h-6 w-px bg-slate-700" />
            <div className="text-center">
              <div className="text-[9px] text-slate-400 font-semibold uppercase">Accuracy</div>
              <div className={`text-base sm:text-lg font-mono font-black leading-tight ${liveAccuracy >= 95 ? 'text-blue-400' : 'text-amber-400'}`}>
                {liveAccuracy}%
              </div>
            </div>
            <div className="h-6 w-px bg-slate-700" />
            <div className="text-center">
              <div className="text-[9px] text-slate-400 font-semibold uppercase">Goal</div>
              <div className="text-xs font-mono font-bold text-slate-300 mt-0.5">{lesson.targetWPM}+ WPM</div>
            </div>

            <div className="pl-1.5 border-l border-slate-700">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                title="Toggle Key Sounds"
                className={`p-1.5 rounded-lg border text-xs transition ${
                  soundEnabled 
                    ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300' 
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Step Navigation Bar: Prev, Dropdown Selector, Next, and Curriculum Drawer Button */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          
          {/* Quick Prev / Next / Select */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => resetLesson(currentLessonIndex - 1)}
              disabled={currentLessonIndex === 0}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-300 transition"
              title="Previous Step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Quick Step Selector Dropdown */}
            <select
              value={currentLessonIndex}
              onChange={(e) => resetLesson(Number(e.target.value))}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 text-xs font-semibold focus:outline-hidden focus:border-blue-500 max-w-[200px] sm:max-w-[280px] truncate"
            >
              {TOUCH_TYPING_LESSONS.map((l, idx) => {
                const prog = completedLessons[l.id];
                return (
                  <option key={l.id} value={idx}>
                    {l.level}: {l.title} {prog ? `(${'★'.repeat(prog.stars)})` : ''}
                  </option>
                );
              })}
            </select>

            <button
              onClick={() => resetLesson(currentLessonIndex + 1)}
              disabled={currentLessonIndex === TOUCH_TYPING_LESSONS.length - 1}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-300 transition"
              title="Next Step"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Curriculum Drawer Toggle Button */}
          <button
            onClick={() => setShowCurriculumDrawer(true)}
            className="flex items-center space-x-1.5 px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded-lg font-semibold transition"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>10-Finger Curriculum ({Object.keys(completedLessons).length}/{TOUCH_TYPING_LESSONS.length} Done)</span>
          </button>
        </div>
      </div>

      {/* Main Active Typing Workspace */}
      <div className="space-y-3 sm:space-y-4">
        
        {/* Typing Queue Display Box */}
        <div 
          ref={containerRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className={`
            relative bg-white rounded-2xl border-2 p-4 sm:p-6 shadow-xs cursor-text focus:outline-hidden transition-all min-h-[140px] sm:min-h-[160px] flex flex-col justify-center
            ${isMistake ? 'border-red-400 bg-red-50/20 animate-shake' : 'border-blue-400 focus:ring-4 focus:ring-blue-500/10'}
          `}
        >
          {/* Instruction Callout on top */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 border-b border-slate-100 pb-1.5">
            <span className="font-semibold text-slate-700">
              Type the characters exactly as highlighted:
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {typedIndex} / {targetText.length} Keystrokes
            </span>
          </div>

          {/* Character Stream */}
          <div className="font-mono text-xl sm:text-2xl md:text-3xl tracking-wide leading-relaxed select-none overflow-x-hidden whitespace-pre-wrap py-2">
            {/* Already Typed Characters */}
            <span className="text-emerald-600 font-bold bg-emerald-50/80 rounded px-0.5">
              {targetText.slice(0, typedIndex)}
            </span>

            {/* Current Active Character with Cursor */}
            {!isCompleted && (
              <span className="relative inline-block bg-blue-600 text-white px-1 rounded shadow-md ring-2 ring-blue-400 animate-pulse font-black">
                {targetText[typedIndex] === ' ' ? '␣' : targetText[typedIndex]}
              </span>
            )}

            {/* Remaining Upcoming Characters */}
            <span className="text-slate-400 font-normal">
              {targetText.slice(typedIndex + (!isCompleted ? 1 : 0))}
            </span>
          </div>

          {/* Status / Focus Helper */}
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span className="truncate mr-2">Click box or press any key to type. Focus: <strong className="text-slate-700">{lesson.fingerFocus}</strong></span>
            <button
              onClick={() => resetLesson()}
              className="flex items-center space-x-1 text-slate-500 hover:text-slate-800 font-semibold shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart</span>
            </button>
          </div>
        </div>

        {/* Interactive Virtual Keyboard with Hands Guide (100% Fluid Scaling) */}
        <VirtualKeyboard
          nextChar={nextChar}
          lastPressedKey={lastPressedKey}
          isMistake={isMistake}
        />

      </div>

      {/* Slide-over 10-Finger Curriculum Drawer */}
      {showCurriculumDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col p-5 border-l border-slate-200">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">10-Finger Curriculum</h3>
                  <p className="text-[11px] text-slate-500">
                    {Object.keys(completedLessons).length} of {TOUCH_TYPING_LESSONS.length} Steps Completed
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCurriculumDrawer(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lessons List in Drawer */}
            <div className="space-y-2 overflow-y-auto custom-scrollbar flex-1 py-3 pr-1">
              {TOUCH_TYPING_LESSONS.map((l, idx) => {
                const isCurrent = idx === currentLessonIndex;
                const progress = completedLessons[l.id];
                const isUnlocked = idx === 0 || completedLessons[TOUCH_TYPING_LESSONS[idx - 1]?.id];

                return (
                  <button
                    key={l.id}
                    onClick={() => resetLesson(idx)}
                    className={`w-full text-left p-3 rounded-xl text-xs transition border flex items-center justify-between group ${
                      isCurrent 
                        ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-md shadow-blue-500/20' 
                        : isUnlocked 
                        ? 'bg-slate-50 border-slate-200 hover:bg-blue-50 hover:border-blue-300 text-slate-800' 
                        : 'bg-slate-50/50 border-slate-200/60 text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <div className="truncate mr-3">
                      <div className="flex items-center space-x-1.5">
                        <span className={`text-[10px] font-bold uppercase ${isCurrent ? 'text-blue-200' : 'text-blue-600'}`}>
                          {l.level}
                        </span>
                        {progress && (
                          <span className="flex text-amber-400 text-xs">
                            {'★'.repeat(progress.stars)}
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold mt-0.5 truncate">
                        {l.title}
                      </div>
                      <div className={`text-[11px] mt-0.5 line-clamp-1 ${isCurrent ? 'text-blue-100' : 'text-slate-500'}`}>
                        {l.fingerFocus}
                      </div>
                    </div>

                    <div className="shrink-0">
                      {progress ? (
                        <CheckCircle className={`w-4 h-4 ${isCurrent ? 'text-white' : 'text-emerald-500'}`} />
                      ) : isUnlocked ? (
                        <ChevronRight className={`w-4 h-4 ${isCurrent ? 'text-white' : 'text-slate-400'}`} />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-slate-300" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Drawer Footer */}
            <div className="pt-3 border-t border-slate-100 text-center">
              <button
                onClick={() => setShowCurriculumDrawer(false)}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
              >
                Close Curriculum
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Completion Modal */}
      {isCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl p-6 text-white text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40">
              <Award className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold">
              {lesson.level} Completed!
            </h3>

            <div className="flex justify-center space-x-1 text-2xl text-amber-400">
              {[1, 2, 3].map((star) => (
                <span key={star}>★</span>
              ))}
            </div>

            <p className="text-xs text-slate-300">
              Outstanding job! Your muscle memory is growing stronger. Keep progressing toward official SSC / Railway speeds.
            </p>

            <div className="grid grid-cols-2 gap-3 bg-slate-800 p-3 rounded-xl border border-slate-700 text-xs">
              <div>
                <span className="text-slate-400">Speed:</span>{' '}
                <strong className="text-emerald-400 font-mono text-sm">{liveWPM} WPM</strong>
              </div>
              <div>
                <span className="text-slate-400">Accuracy:</span>{' '}
                <strong className="text-blue-400 font-mono text-sm">{liveAccuracy}%</strong>
              </div>
            </div>

            <div className="flex justify-center space-x-3 pt-2">
              <button
                onClick={() => resetLesson()}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition"
              >
                Repeat Step
              </button>
              {currentLessonIndex < TOUCH_TYPING_LESSONS.length - 1 && (
                <button
                  onClick={() => resetLesson(currentLessonIndex + 1)}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-lg shadow-md transition flex items-center space-x-1.5"
                >
                  <span>Next Step ({TOUCH_TYPING_LESSONS[currentLessonIndex + 1]?.level})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
