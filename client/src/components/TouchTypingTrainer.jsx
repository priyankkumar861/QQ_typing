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
  ArrowRight, 
  ArrowLeft, 
  Flame, 
  LayoutGrid, 
  Play, 
  Trophy, 
  Zap, 
  Target, 
  Hand, 
  BookOpen 
} from 'lucide-react';
import { TOUCH_TYPING_STAGES, TOUCH_TYPING_LESSONS } from '../data/touchTypingData';
import VirtualKeyboard from './VirtualKeyboard';
import FingerPlacementTutorial from './FingerPlacementTutorial';
import LessonFingerDemoModal from './LessonFingerDemoModal';

export default function TouchTypingTrainer() {
  // Navigation Mode: 'roadmap' (Level Grid Map like EdClub) | 'practice' (Active Lesson Player)
  const [viewMode, setViewMode] = useState('roadmap');
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showDemoModal, setShowDemoModal] = useState(false);

  // Active Practice State
  const [typedIndex, setTypedIndex] = useState(0);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastPressedKey, setLastPressedKey] = useState('');
  const [isMistake, setIsMistake] = useState(false);

  // Lesson Progress (Saved in LocalStorage)
  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      const saved = localStorage.getItem('touch_typing_completed_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { 1: { stars: 3, wpm: 20, accuracy: 98 } }; // Lesson 1 unlocked by default
  });

  const lesson = TOUCH_TYPING_LESSONS[currentLessonIndex] || TOUCH_TYPING_LESSONS[0];
  const targetText = lesson.text;
  const containerRef = useRef(null);

  // Sound Synthesizer
  const playSound = (isError = false) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (isError) {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(460 + Math.random() * 60, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      }
    } catch (e) {}
  };

  // Launch a specific lesson
  const startLesson = (index, showDemo = true) => {
    setCurrentLessonIndex(index);
    setTypedIndex(0);
    setMistakeCount(0);
    setIsStarted(false);
    setIsCompleted(false);
    setStartTime(null);
    setLastPressedKey('');
    setIsMistake(false);
    setViewMode('practice');
    if (showDemo) {
      setShowDemoModal(true);
    } else {
      setTimeout(() => {
        if (containerRef.current) containerRef.current.focus();
      }, 60);
    }
  };

  // Reset current lesson
  const resetLesson = () => {
    setTypedIndex(0);
    setMistakeCount(0);
    setIsStarted(false);
    setIsCompleted(false);
    setStartTime(null);
    setLastPressedKey('');
    setIsMistake(false);
    setTimeout(() => {
      if (containerRef.current) containerRef.current.focus();
    }, 50);
  };

  // Key Down Listener in Practice Mode
  const handleKeyDown = (e) => {
    // Ignore meta / modifier keys
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

    // Calculate 1 to 5 Stars (TypingClub style)
    let stars = 1;
    if (accuracy >= 98 && wpm >= lesson.targetWPM + 5) stars = 5;
    else if (accuracy >= 96 && wpm >= lesson.targetWPM) stars = 4;
    else if (accuracy >= 94) stars = 3;
    else if (accuracy >= 90) stars = 2;

    const updated = {
      ...completedLessons,
      [lesson.id]: { stars, wpm, accuracy }
    };
    setCompletedLessons(updated);
    try {
      localStorage.setItem('touch_typing_completed_v2', JSON.stringify(updated));
    } catch (e) {}

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Progress metrics
  const totalStars = Object.values(completedLessons).reduce((a, b) => a + (b.stars || 0), 0);
  const maxPossibleStars = TOUCH_TYPING_LESSONS.length * 5;
  const progressPercent = Math.round((Object.keys(completedLessons).length / TOUCH_TYPING_LESSONS.length) * 100);

  // Live metrics during typing
  const elapsedMinutes = startTime ? Math.max((Date.now() - startTime) / 60000, 0.02) : 0.02;
  const liveWPM = isStarted ? Math.round((typedIndex / 5) / elapsedMinutes) : 0;
  const totalStrokes = typedIndex + mistakeCount;
  const liveAccuracy = totalStrokes > 0 ? Math.round((typedIndex / totalStrokes) * 100) : 100;
  const nextChar = isCompleted ? '' : targetText[typedIndex] || '';

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      
      {/* ========================================================= */}
      {/* VIEW 1: TYPINGCLUB-STYLE COURSE MAP / LEVEL GRID          */}
      {/* ========================================================= */}
      {viewMode === 'roadmap' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Top Banner & Progress Header */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>TypingClub Inspired Learning Program</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                10-Finger Touch Typing Course
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 max-w-2xl">
                Master complete blind touch-typing step-by-step. Build steady muscle memory from home row to 35+ WPM exam speed!
              </p>
            </div>

            {/* Total Stars & Resume Button */}
            <div className="flex items-center space-x-4">
              <div className="bg-amber-50 border border-amber-200 px-4 py-2.5 rounded-2xl text-center shadow-2xs">
                <div className="text-[10px] uppercase font-bold text-amber-700 flex items-center justify-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>Stars Earned</span>
                </div>
                <div className="text-xl font-black font-mono text-amber-800 mt-0.5">
                  {totalStars} <span className="text-xs font-normal text-amber-600">/ {maxPossibleStars}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  // Find next incomplete lesson
                  const nextIdx = TOUCH_TYPING_LESSONS.findIndex(l => !completedLessons[l.id]);
                  startLesson(nextIdx !== -1 ? nextIdx : 0);
                }}
                className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md shadow-blue-500/20 transition flex items-center space-x-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Resume Lesson</span>
              </button>
            </div>
          </div>

          {/* Overall Course Progress Bar */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs flex items-center space-x-4">
            <div className="flex-1">
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-gray-700">Course Completion</span>
                <span className="text-blue-600">{progressPercent}% ({Object.keys(completedLessons).length} of {TOUCH_TYPING_LESSONS.length} Lessons)</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* FEATURED: LESSON 0 INTERACTIVE 10-FINGER TUTORIAL */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-7 text-white shadow-xl flex flex-wrap items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-2 max-w-2xl relative z-10">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <Hand className="w-3.5 h-3.5" />
                <span>Beginner Milestone • Lesson 0</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                How to Place 10 Fingers on Keyboard (हाथ और 10 उँगलियाँ कैसे रखें)
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/85 leading-relaxed">
                Learn the secret Home Row anchors (<strong>ASDF - JKL;</strong>), why <strong>F & J</strong> keys have tactile bumps, proper wrist posture, and test your placement with a <strong>Live 10-Finger Calibration</strong>.
              </p>
            </div>

            <div className="relative z-10">
              <button
                onClick={() => setViewMode('tutorial')}
                className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/30 transition-all flex items-center space-x-2 active:scale-95"
              >
                <Hand className="w-4 h-4 fill-current" />
                <span>Start Finger Placement Tutorial →</span>
              </button>
            </div>
          </div>

          {/* STAGES & LESSONS GRID (EdClub Style) */}
          <div className="space-y-8">
            {TOUCH_TYPING_STAGES.map((stage) => {
              const stageLessons = TOUCH_TYPING_LESSONS.filter(l => l.stageId === stage.id);

              return (
                <div key={stage.id} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
                  
                  {/* Stage Title Header */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{stage.icon}</span>
                      <div>
                        <h2 className="text-base sm:text-lg font-bold text-gray-900">{stage.title}</h2>
                        <p className="text-xs text-gray-500">{stage.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Lesson Level Badges Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 pt-1">
                    {stageLessons.map((l) => {
                      const idx = TOUCH_TYPING_LESSONS.findIndex(item => item.id === l.id);
                      const isUnlocked = idx === 0 || completedLessons[TOUCH_TYPING_LESSONS[idx - 1]?.id];
                      const progress = completedLessons[l.id];

                      return (
                        <button
                          key={l.id}
                          disabled={!isUnlocked}
                          onClick={() => startLesson(idx)}
                          className={`
                            relative p-4 rounded-2xl border text-center transition flex flex-col items-center justify-between group min-h-[145px]
                            ${progress 
                              ? 'bg-blue-50/50 border-blue-200 hover:border-blue-400 hover:shadow-md' 
                              : isUnlocked 
                              ? 'bg-white border-gray-200 hover:border-blue-500 hover:shadow-md' 
                              : 'bg-gray-50/70 border-gray-200/80 opacity-60 cursor-not-allowed'}
                          `}
                        >
                          {/* Circular Lesson Number Badge */}
                          <div className={`
                            w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm transition-all shadow-xs mb-1
                            ${progress 
                              ? 'bg-blue-600 text-white shadow-blue-500/20' 
                              : isUnlocked 
                              ? 'bg-gray-100 text-gray-800 group-hover:bg-blue-600 group-hover:text-white' 
                              : 'bg-gray-200 text-gray-400'}
                          `}>
                            {isUnlocked ? l.id : <Lock className="w-4 h-4 text-gray-400" />}
                          </div>

                          {/* Focus Key Badge */}
                          <div className="font-extrabold text-xs text-gray-900 group-hover:text-blue-600 transition truncate w-full">
                            {l.badge}
                          </div>

                          <div className="text-[10px] text-gray-500 truncate w-full">
                            {l.level}
                          </div>

                          {/* 5-Star Rating Row */}
                          <div className="flex items-center justify-center space-x-0.5 pt-1">
                            {[1, 2, 3, 4, 5].map((starIdx) => (
                              <Star
                                key={starIdx}
                                className={`w-3 h-3 ${
                                  progress && starIdx <= progress.stars
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-gray-200 fill-gray-100'
                                }`}
                              />
                            ))}
                          </div>

                          {/* Speed Metric */}
                          {progress && (
                            <div className="mt-1 text-[10px] font-mono font-bold text-emerald-600">
                              {progress.wpm} WPM
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 2: TYPINGCLUB INTERACTIVE LESSON PLAYER              */}
      {/* ========================================================= */}
      {viewMode === 'practice' && (
        <div className="space-y-4 animate-in fade-in">
          
          {/* Top Player Navigation & Metrics Bar */}
          <div className="bg-white border border-gray-200 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
            
            {/* Back to Course Map Button */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setViewMode('roadmap')}
                className="flex items-center space-x-1.5 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl text-xs font-bold transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>All Lessons</span>
              </button>

              <button
                onClick={() => setViewMode('tutorial')}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition"
                title="View 10-Finger Hand Placement Guide"
              >
                <Hand className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hand Guide</span>
              </button>

              <button
                onClick={() => setShowDemoModal(true)}
                className="flex items-center space-x-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition shadow-xs"
                title="Watch 2-3s Animated Finger Demo for this lesson"
              >
                <Play className="w-3.5 h-3.5 fill-indigo-600 text-indigo-600" />
                <span>Finger Demo</span>
              </button>

              <div>
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-50 text-blue-700 text-xs font-black px-2.5 py-0.5 rounded-full border border-blue-200">
                    {lesson.level}
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">
                    {lesson.title}
                  </h2>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {lesson.description}
                </p>
              </div>
            </div>

            {/* Live Speed & Accuracy Dashboard */}
            <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-200">
              <div className="text-center">
                <div className="text-[10px] text-gray-400 font-semibold uppercase">Speed</div>
                <div className="text-lg font-mono font-black text-emerald-600">
                  {liveWPM} <span className="text-xs font-normal text-gray-500">WPM</span>
                </div>
              </div>
              <div className="h-7 w-px bg-gray-200" />
              <div className="text-center">
                <div className="text-[10px] text-gray-400 font-semibold uppercase">Accuracy</div>
                <div className={`text-lg font-mono font-black ${liveAccuracy >= 95 ? 'text-blue-600' : 'text-amber-600'}`}>
                  {liveAccuracy}%
                </div>
              </div>
              <div className="h-7 w-px bg-gray-200" />
              <div className="text-center">
                <div className="text-[10px] text-gray-400 font-semibold uppercase">Target</div>
                <div className="text-xs font-mono font-bold text-gray-700 mt-1">{lesson.targetWPM}+ WPM</div>
              </div>

              <div className="pl-2 border-l border-gray-200">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  title="Toggle Sound Effects"
                  className={`p-2 rounded-xl border text-xs transition ${
                    soundEnabled 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                      : 'bg-gray-100 border-gray-200 text-gray-400'
                  }`}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>
            </div>

          </div>

          {/* Big Typing Line Card (TypingClub Style) */}
          <div
            ref={containerRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className={`
              relative bg-white rounded-3xl border-2 p-6 sm:p-10 shadow-xs cursor-text focus:outline-hidden transition-all min-h-[170px] flex flex-col justify-center text-center
              ${isMistake ? 'border-red-400 bg-red-50/20 animate-shake' : 'border-blue-400 focus:ring-4 focus:ring-blue-500/10'}
            `}
          >
            {/* Top Instruction & Keystrokes Progress */}
            <div className="flex items-center justify-between text-xs text-gray-400 mb-4 border-b border-gray-100 pb-2">
              <span className="font-semibold text-gray-600">
                Finger Focus: <strong className="text-blue-600">{lesson.fingerFocus}</strong>
              </span>
              <span className="font-mono text-gray-500">
                {typedIndex} / {targetText.length} Keystrokes
              </span>
            </div>

            {/* Character Stream (Large, Crisp, Centered) */}
            <div className="font-mono text-2xl sm:text-3xl md:text-4xl tracking-wider leading-relaxed select-none overflow-x-hidden whitespace-pre-wrap py-3">
              {/* Already Typed */}
              <span className="text-emerald-600 font-bold bg-emerald-50 rounded px-1">
                {targetText.slice(0, typedIndex)}
              </span>

              {/* Current Active Character Cursor */}
              {!isCompleted && (
                <span className="relative inline-block bg-blue-600 text-white px-1.5 rounded-md shadow-md ring-4 ring-blue-200 animate-pulse font-black mx-0.5">
                  {targetText[typedIndex] === ' ' ? '␣' : targetText[typedIndex]}
                </span>
              )}

              {/* Upcoming Remaining Characters */}
              <span className="text-gray-300 font-normal">
                {targetText.slice(typedIndex + (!isCompleted ? 1 : 0))}
              </span>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
              <span>Click box or press key to type. Look at the on-screen hands, not your keyboard!</span>
              <button
                onClick={resetLesson}
                className="flex items-center space-x-1.5 px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-lg border border-gray-200 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart Lesson</span>
              </button>
            </div>
          </div>

          {/* Interactive Virtual Keyboard with Animated Hands */}
          <VirtualKeyboard
            nextChar={nextChar}
            lastPressedKey={lastPressedKey}
            isMistake={isMistake}
          />

        </div>
      )}

      {/* ========================================================= */}
      {/* LESSON COMPLETION CELEBRATION MODAL (TYPINGCLUB STYLE)    */}
      {/* ========================================================= */}
      {isCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white border border-gray-200 w-full max-w-md rounded-3xl shadow-2xl p-6 sm:p-8 text-gray-900 text-center space-y-5">
            
            {/* Trophy Badge */}
            <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Trophy className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-gray-900">
                {lesson.level} Completed!
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {lesson.title}
              </p>
            </div>

            {/* 5-Star Celebration Rating */}
            <div className="flex justify-center space-x-1.5 py-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const earnedStars = completedLessons[lesson.id]?.stars || 3;
                return (
                  <Star 
                    key={star} 
                    className={`w-8 h-8 transition-all ${
                      star <= earnedStars 
                        ? 'fill-amber-400 text-amber-400 scale-110 drop-shadow-md' 
                        : 'text-gray-200 fill-gray-100'
                    }`} 
                  />
                );
              })}
            </div>

            {/* Metric Summary */}
            <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs">
              <div>
                <div className="text-gray-500 font-medium">Speed</div>
                <div className="text-xl font-black font-mono text-emerald-600 mt-0.5">{liveWPM} WPM</div>
              </div>
              <div>
                <div className="text-gray-500 font-medium">Accuracy</div>
                <div className="text-xl font-black font-mono text-blue-600 mt-0.5">{liveAccuracy}%</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-3 pt-2">
              <button
                onClick={resetLesson}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition"
              >
                Repeat Lesson
              </button>

              {currentLessonIndex < TOUCH_TYPING_LESSONS.length - 1 ? (
                <button
                  onClick={() => startLesson(currentLessonIndex + 1)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition flex items-center space-x-1.5"
                >
                  <span>Next Lesson ({TOUCH_TYPING_LESSONS[currentLessonIndex + 1]?.badge})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setViewMode('roadmap')}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition"
                >
                  Back to Course Map
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 3: INTERACTIVE 10-FINGER PLACEMENT TUTORIAL          */}
      {/* ========================================================= */}
      {viewMode === 'tutorial' && (
        <FingerPlacementTutorial
          onStartLessons={() => {
            setViewMode('practice');
            startLesson(0);
          }}
          onBack={() => setViewMode('roadmap')}
        />
      )}

      {/* ========================================================= */}
      {/* VIEW 4: PRE-LESSON REALISTIC FINGER MOTION DEMO MODAL     */}
      {/* ========================================================= */}
      <LessonFingerDemoModal
        lesson={lesson}
        isOpen={showDemoModal}
        onClose={() => {
          setShowDemoModal(false);
          setTimeout(() => containerRef.current?.focus(), 60);
        }}
        onStartPractice={() => {
          setShowDemoModal(false);
          setTimeout(() => containerRef.current?.focus(), 60);
        }}
      />

    </div>
  );
}
