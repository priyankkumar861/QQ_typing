import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Hand, 
  Info, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Check, 
  Flame, 
  ShieldCheck, 
  Compass, 
  Keyboard as KeyboardIcon 
} from 'lucide-react';

// Finger Definitions & Color Coding
const FINGER_MAP = {
  'left-pinky': { name: 'Left Pinky (बायाँ कनिष्ठिका)', key: 'a', char: 'A', color: 'rose', bg: 'bg-rose-500', text: 'text-rose-400', border: 'border-rose-500', hex: '#f43f5e' },
  'left-ring': { name: 'Left Ring (बायाँ अनामिका)', key: 's', char: 'S', color: 'orange', bg: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-500', hex: '#f97316' },
  'left-middle': { name: 'Left Middle (बायाँ मध्यमा)', key: 'd', char: 'D', color: 'amber', bg: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500', hex: '#eab308' },
  'left-index': { name: 'Left Index (बायाँ तर्जनी)', key: 'f', char: 'F', bump: true, color: 'emerald', bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500', hex: '#10b981' },
  'left-thumb': { name: 'Left/Right Thumb (अंगूठा)', key: ' ', char: 'Spacebar', color: 'indigo', bg: 'bg-indigo-500', text: 'text-indigo-400', border: 'border-indigo-500', hex: '#6366f1' },
  'right-thumb': { name: 'Left/Right Thumb (अंगूठा)', key: ' ', char: 'Spacebar', color: 'indigo', bg: 'bg-indigo-500', text: 'text-indigo-400', border: 'border-indigo-500', hex: '#6366f1' },
  'right-index': { name: 'Right Index (दायाँ तर्जनी)', key: 'j', char: 'J', bump: true, color: 'cyan', bg: 'bg-cyan-500', text: 'text-cyan-400', border: 'border-cyan-500', hex: '#06b6d4' },
  'right-middle': { name: 'Right Middle (दायाँ मध्यमा)', key: 'k', char: 'K', color: 'blue', bg: 'bg-blue-500', text: 'text-blue-400', border: 'border-blue-500', hex: '#3b82f6' },
  'right-ring': { name: 'Right Ring (दायाँ अनामिका)', key: 'l', char: 'L', color: 'purple', bg: 'bg-purple-500', text: 'text-purple-400', border: 'border-purple-500', hex: '#a855f7' },
  'right-pinky': { name: 'Right Pinky (दायाँ कनिष्ठिका)', key: ';', char: ';', color: 'pink', bg: 'bg-pink-500', text: 'text-pink-400', border: 'border-pink-500', hex: '#ec4899' },
};

// Calibration interactive order
const CALIBRATION_SEQUENCE = [
  { id: 'left-pinky', label: 'Left Pinky', key: 'a', display: 'A' },
  { id: 'left-ring', label: 'Left Ring', key: 's', display: 'S' },
  { id: 'left-middle', label: 'Left Middle', key: 'd', display: 'D' },
  { id: 'left-index', label: 'Left Index (Bump)', key: 'f', display: 'F' },
  { id: 'right-index', label: 'Right Index (Bump)', key: 'j', display: 'J' },
  { id: 'right-middle', label: 'Right Middle', key: 'k', display: 'K' },
  { id: 'right-ring', label: 'Right Ring', key: 'l', display: 'L' },
  { id: 'right-pinky', label: 'Right Pinky', key: ';', display: ';' },
  { id: 'thumbs', label: 'Either Thumb', key: ' ', display: 'Space' }
];

export default function FingerPlacementTutorial({ onStartLessons, onBack }) {
  const [activeStep, setActiveStep] = useState(0);
  const [calibIndex, setCalibIndex] = useState(0);
  const [calibCompleted, setCalibCompleted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeFingerKey, setActiveFingerKey] = useState(null);
  const [lastKeyPressed, setLastKeyPressed] = useState('');
  const [shakeKey, setShakeKey] = useState(false);

  // Sound Synthesizer
  const playAudioTone = (isSuccess = true) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (isSuccess) {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      }
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + (isSuccess ? 0.12 : 0.1));
    } catch (e) {}
  };

  // Keyboard Event Listener for Step 5 (Interactive Calibration)
  useEffect(() => {
    if (activeStep !== 5) return;

    const handleKeyDown = (e) => {
      // Don't intercept refresh or functional commands
      if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) return;

      e.preventDefault();
      const expectedTarget = CALIBRATION_SEQUENCE[calibIndex];
      if (!expectedTarget) return;

      setLastKeyPressed(e.key === ' ' ? 'Space' : e.key);

      const isMatch = e.key.toLowerCase() === expectedTarget.key.toLowerCase();

      if (isMatch) {
        playAudioTone(true);
        setActiveFingerKey(expectedTarget.key);
        setShakeKey(false);

        if (calibIndex + 1 < CALIBRATION_SEQUENCE.length) {
          setCalibIndex(prev => prev + 1);
        } else {
          setCalibCompleted(true);
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
          });
        }
      } else {
        playAudioTone(false);
        setShakeKey(true);
        setTimeout(() => setShakeKey(false), 300);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeStep, calibIndex, soundEnabled]);

  const steps = [
    {
      title: '1. The Home Row Concept (होम रो क्या है?)',
      tag: 'Foundation',
      desc: 'Keyboard ke beech wali line (A, S, D, F, G, H, J, K, L, ;) ko Home Row kehte hain. Yahi aapke 10 fingers ka base station / ghar hai. Koi bhi key press karne ke baad ungli wapas yahin aani chahiye!'
    },
    {
      title: '2. The F & J Secret (उभरा हुआ निशान)',
      tag: 'Tactile Anchors',
      desc: 'Apne keyboard par F aur J key ko chhoo kar dekhein — dono par ek chhota sa ubhra hua nishan (tactile bump) hota hai. Left index finger hamesha F ke bump par aur Right index finger J ke bump par rest karti hai bina dekhe!'
    },
    {
      title: '3. Left Hand Placement (A - S - D - F)',
      tag: 'Left Hand',
      desc: 'Left hand ki chaaron ungliyon ko line se rakhein: Pinky on A, Ring on S, Middle on D, aur Index on F.'
    },
    {
      title: '4. Right Hand Placement (J - K - L - ;)',
      tag: 'Right Hand',
      desc: 'Right hand ki chaaron ungliyon ko line se rakhein: Index on J, Middle on K, Ring on L, aur Pinky on ; (Semicolon).'
    },
    {
      title: '5. Thumbs on Spacebar & Posture (अंगूठे और बैठने का तरीका)',
      tag: 'Ergonomics',
      desc: 'Dono anguthe Spacebar par gently rest karenge. Kohni (elbows) 90-degree par, peeth seedhi, aur kalaai (wrists) hawa mein arched honi chahiye (table par daba kar mat rakhein)!'
    },
    {
      title: '6. Interactive Finger Calibration Test (लाइव प्लेसमेंट टेस्ट)',
      tag: 'Interactive Test',
      desc: 'Ab bina keyboard dekhe screen par diye gaye nirdesh anusar har ungli se wahi key press karein aur check karein ki aapka haath sahi position par hai ya nahi!'
    }
  ];

  const currentCalibItem = CALIBRATION_SEQUENCE[calibIndex];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in select-none">
      
      {/* Top Header Navigation */}
      <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
            title="Return to Roadmap"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-emerald-300">
                Lesson 0 • Master Tutorial
              </span>
              <span className="text-xs text-gray-500 font-semibold hidden sm:inline">
                Step {activeStep + 1} of {steps.length}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mt-0.5">
              10-Finger Hand Placement Guide
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
            title={soundEnabled ? "Mute Audio" : "Enable Audio"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={onStartLessons}
            className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold rounded-xl transition"
          >
            Skip to Lessons →
          </button>
        </div>
      </div>

      {/* Step Progress Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {steps.map((st, idx) => {
          const isActive = activeStep === idx;
          const isPassed = activeStep > idx;

          return (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between text-xs ${
                isActive 
                  ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-md shadow-blue-500/20' 
                  : isPassed
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="truncate">
                <div className={`text-[10px] uppercase font-bold ${isActive ? 'text-blue-200' : 'text-gray-400'}`}>
                  Step {idx + 1}
                </div>
                <div className="truncate font-semibold">{st.tag}</div>
              </div>
              {isPassed ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage Box */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Step Title & Explanation */}
        <div className="max-w-3xl mx-auto text-center space-y-2">
          <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {steps[activeStep].tag}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            {steps[activeStep].title}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto">
            {steps[activeStep].desc}
          </p>
        </div>

        {/* ========================================================= */}
        {/* 1. VISUAL HANDS & FINGER PLACEMENT INTERACTIVE MAP        */}
        {/* ========================================================= */}
        <div className="bg-slate-950 rounded-2xl p-6 sm:p-8 border border-slate-800 text-white shadow-xl space-y-6">
          
          {/* Hands Header / Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 text-xs">
            <div className="flex items-center space-x-2">
              <Hand className="w-4 h-4 text-blue-400" />
              <span className="font-bold text-slate-300">10-Finger Color Coded Matrix</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Home Keys: <strong className="text-emerald-400">A S D F</strong> (Left) • <strong className="text-cyan-400">J K L ;</strong> (Right) • <strong className="text-indigo-400">Space</strong> (Thumb)
            </div>
          </div>

          {/* Graphical Two Hands Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center py-4 max-w-4xl mx-auto">
            
            {/* LEFT HAND (ASDF) */}
            <div className={`p-5 rounded-2xl border transition-all ${
              activeStep === 2 || (activeStep === 5 && currentCalibItem?.id.startsWith('left'))
                ? 'bg-slate-900 border-blue-500 shadow-xl shadow-blue-500/10 ring-2 ring-blue-500/30'
                : 'bg-slate-900/60 border-slate-800'
            }`}>
              <div className="text-center font-bold text-sm text-slate-200 mb-3 flex items-center justify-center gap-2">
                <span>Left Hand (बायाँ हाथ)</span>
                <span className="text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded">
                  A-S-D-F Home
                </span>
              </div>

              {/* 5 Finger Columns */}
              <div className="flex items-end justify-center gap-2 sm:gap-3 h-44 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                {/* Left Pinky */}
                <div className="flex flex-col items-center space-y-1.5">
                  <span className="text-[9px] font-bold text-rose-400 font-mono">A</span>
                  <div 
                    className={`w-6 sm:w-7 h-24 rounded-t-xl transition-all flex items-center justify-center text-[10px] font-bold text-white shadow-md ${
                      (activeStep === 5 && currentCalibItem?.id === 'left-pinky')
                        ? 'bg-rose-500 ring-4 ring-rose-400 animate-pulse scale-105'
                        : activeStep === 2
                        ? 'bg-rose-500'
                        : 'bg-rose-600/60'
                    }`}
                  >
                    Pinky
                  </div>
                  <span className="text-[9px] text-slate-400">A</span>
                </div>

                {/* Left Ring */}
                <div className="flex flex-col items-center space-y-1.5">
                  <span className="text-[9px] font-bold text-orange-400 font-mono">S</span>
                  <div 
                    className={`w-6 sm:w-7 h-30 rounded-t-xl transition-all flex items-center justify-center text-[10px] font-bold text-white shadow-md ${
                      (activeStep === 5 && currentCalibItem?.id === 'left-ring')
                        ? 'bg-orange-500 ring-4 ring-orange-400 animate-pulse scale-105'
                        : activeStep === 2
                        ? 'bg-orange-500'
                        : 'bg-orange-600/60'
                    }`}
                  >
                    Ring
                  </div>
                  <span className="text-[9px] text-slate-400">S</span>
                </div>

                {/* Left Middle */}
                <div className="flex flex-col items-center space-y-1.5">
                  <span className="text-[9px] font-bold text-amber-400 font-mono">D</span>
                  <div 
                    className={`w-6 sm:w-7 h-34 rounded-t-xl transition-all flex items-center justify-center text-[10px] font-bold text-white shadow-md ${
                      (activeStep === 5 && currentCalibItem?.id === 'left-middle')
                        ? 'bg-amber-500 ring-4 ring-amber-400 animate-pulse scale-105'
                        : activeStep === 2
                        ? 'bg-amber-500'
                        : 'bg-amber-600/60'
                    }`}
                  >
                    Mid
                  </div>
                  <span className="text-[9px] text-slate-400">D</span>
                </div>

                {/* Left Index */}
                <div className="flex flex-col items-center space-y-1.5">
                  <span className="text-[9px] font-bold text-emerald-400 font-mono flex items-center gap-0.5">
                    F <span className="text-[8px] bg-emerald-950 text-emerald-300 px-1 rounded">Bump</span>
                  </span>
                  <div 
                    className={`w-6 sm:w-7 h-30 rounded-t-xl transition-all flex flex-col items-center justify-center text-[10px] font-bold text-white shadow-md relative ${
                      (activeStep === 1 || activeStep === 2 || (activeStep === 5 && currentCalibItem?.id === 'left-index'))
                        ? 'bg-emerald-500 ring-4 ring-emerald-400 animate-pulse scale-105'
                        : 'bg-emerald-600/60'
                    }`}
                  >
                    <span>Index</span>
                    <div className="w-3 h-0.5 bg-white rounded-full mt-1"></div>
                  </div>
                  <span className="text-[9px] text-slate-400">F</span>
                </div>

                {/* Left Thumb */}
                <div className="flex flex-col items-center space-y-1.5">
                  <span className="text-[8px] font-bold text-indigo-400 font-mono">Space</span>
                  <div 
                    className={`w-7 sm:w-8 h-18 rounded-t-xl transition-all flex items-center justify-center text-[9px] font-bold text-white shadow-md ${
                      activeStep === 4 || (activeStep === 5 && currentCalibItem?.id === 'thumbs')
                        ? 'bg-indigo-500 ring-4 ring-indigo-400 animate-pulse scale-105'
                        : 'bg-indigo-600/60'
                    }`}
                  >
                    Thumb
                  </div>
                  <span className="text-[9px] text-slate-400">␣</span>
                </div>
              </div>
            </div>

            {/* RIGHT HAND (JKL;) */}
            <div className={`p-5 rounded-2xl border transition-all ${
              activeStep === 3 || (activeStep === 5 && currentCalibItem?.id.startsWith('right'))
                ? 'bg-slate-900 border-blue-500 shadow-xl shadow-blue-500/10 ring-2 ring-blue-500/30'
                : 'bg-slate-900/60 border-slate-800'
            }`}>
              <div className="text-center font-bold text-sm text-slate-200 mb-3 flex items-center justify-center gap-2">
                <span>Right Hand (दायाँ हाथ)</span>
                <span className="text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded">
                  J-K-L-; Home
                </span>
              </div>

              {/* 5 Finger Columns */}
              <div className="flex items-end justify-center gap-2 sm:gap-3 h-44 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                {/* Right Thumb */}
                <div className="flex flex-col items-center space-y-1.5">
                  <span className="text-[8px] font-bold text-indigo-400 font-mono">Space</span>
                  <div 
                    className={`w-7 sm:w-8 h-18 rounded-t-xl transition-all flex items-center justify-center text-[9px] font-bold text-white shadow-md ${
                      activeStep === 4 || (activeStep === 5 && currentCalibItem?.id === 'thumbs')
                        ? 'bg-indigo-500 ring-4 ring-indigo-400 animate-pulse scale-105'
                        : 'bg-indigo-600/60'
                    }`}
                  >
                    Thumb
                  </div>
                  <span className="text-[9px] text-slate-400">␣</span>
                </div>

                {/* Right Index */}
                <div className="flex flex-col items-center space-y-1.5">
                  <span className="text-[9px] font-bold text-cyan-400 font-mono flex items-center gap-0.5">
                    J <span className="text-[8px] bg-cyan-950 text-cyan-300 px-1 rounded">Bump</span>
                  </span>
                  <div 
                    className={`w-6 sm:w-7 h-30 rounded-t-xl transition-all flex flex-col items-center justify-center text-[10px] font-bold text-white shadow-md relative ${
                      (activeStep === 1 || activeStep === 3 || (activeStep === 5 && currentCalibItem?.id === 'right-index'))
                        ? 'bg-cyan-500 ring-4 ring-cyan-400 animate-pulse scale-105'
                        : 'bg-cyan-600/60'
                    }`}
                  >
                    <span>Index</span>
                    <div className="w-3 h-0.5 bg-white rounded-full mt-1"></div>
                  </div>
                  <span className="text-[9px] text-slate-400">J</span>
                </div>

                {/* Right Middle */}
                <div className="flex flex-col items-center space-y-1.5">
                  <span className="text-[9px] font-bold text-blue-400 font-mono">K</span>
                  <div 
                    className={`w-6 sm:w-7 h-34 rounded-t-xl transition-all flex items-center justify-center text-[10px] font-bold text-white shadow-md ${
                      (activeStep === 5 && currentCalibItem?.id === 'right-middle')
                        ? 'bg-blue-500 ring-4 ring-blue-400 animate-pulse scale-105'
                        : activeStep === 3
                        ? 'bg-blue-500'
                        : 'bg-blue-600/60'
                    }`}
                  >
                    Mid
                  </div>
                  <span className="text-[9px] text-slate-400">K</span>
                </div>

                {/* Right Ring */}
                <div className="flex flex-col items-center space-y-1.5">
                  <span className="text-[9px] font-bold text-purple-400 font-mono">L</span>
                  <div 
                    className={`w-6 sm:w-7 h-30 rounded-t-xl transition-all flex items-center justify-center text-[10px] font-bold text-white shadow-md ${
                      (activeStep === 5 && currentCalibItem?.id === 'right-ring')
                        ? 'bg-purple-500 ring-4 ring-purple-400 animate-pulse scale-105'
                        : activeStep === 3
                        ? 'bg-purple-500'
                        : 'bg-purple-600/60'
                    }`}
                  >
                    Ring
                  </div>
                  <span className="text-[9px] text-slate-400">L</span>
                </div>

                {/* Right Pinky */}
                <div className="flex flex-col items-center space-y-1.5">
                  <span className="text-[9px] font-bold text-pink-400 font-mono">;</span>
                  <div 
                    className={`w-6 sm:w-7 h-24 rounded-t-xl transition-all flex items-center justify-center text-[10px] font-bold text-white shadow-md ${
                      (activeStep === 5 && currentCalibItem?.id === 'right-pinky')
                        ? 'bg-pink-500 ring-4 ring-pink-400 animate-pulse scale-105'
                        : activeStep === 3
                        ? 'bg-pink-500'
                        : 'bg-pink-600/60'
                    }`}
                  >
                    Pinky
                  </div>
                  <span className="text-[9px] text-slate-400">;</span>
                </div>
              </div>
            </div>

          </div>

          {/* Interactive Keyboard Home Row Strip */}
          <div className="max-w-xl mx-auto pt-2">
            <div className="text-[11px] text-slate-400 text-center font-medium mb-2">
              Keyboard Home Row Keys (उंगली रखकर देखें):
            </div>
            <div className="flex items-center justify-center gap-1.5 sm:gap-2">
              {[
                { key: 'A', finger: 'left-pinky', color: 'bg-rose-500' },
                { key: 'S', finger: 'left-ring', color: 'bg-orange-500' },
                { key: 'D', finger: 'left-middle', color: 'bg-amber-500' },
                { key: 'F', finger: 'left-index', color: 'bg-emerald-500', bump: true },
                { key: 'G', finger: 'left-index', color: 'bg-slate-700' },
                { key: 'H', finger: 'right-index', color: 'bg-slate-700' },
                { key: 'J', finger: 'right-index', color: 'bg-cyan-500', bump: true },
                { key: 'K', finger: 'right-middle', color: 'bg-blue-500' },
                { key: 'L', finger: 'right-ring', color: 'bg-purple-500' },
                { key: ';', finger: 'right-pinky', color: 'bg-pink-500' }
              ].map((k) => (
                <div
                  key={k.key}
                  className={`w-9 sm:w-11 h-11 sm:h-12 rounded-xl flex flex-col items-center justify-center font-mono font-bold text-sm sm:text-base border transition-all ${
                    k.bump ? 'border-amber-400 shadow-md' : 'border-slate-700'
                  } ${k.color} text-white`}
                >
                  <span>{k.key}</span>
                  {k.bump && (
                    <div className="w-3 h-0.5 bg-white rounded-full mt-0.5"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* 2. SPECIAL LIVE CALIBRATION STEP (Step 6)                  */}
        {/* ========================================================= */}
        {activeStep === 5 && (
          <div className="bg-gradient-to-br from-blue-950/40 to-slate-900 border-2 border-blue-500/60 rounded-2xl p-6 text-center space-y-4">
            {!calibCompleted ? (
              <>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-bold animate-pulse">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Finger Calibration In Progress</span>
                </div>

                <div className="space-y-1">
                  <div className="text-sm text-slate-300">
                    Use your <strong className="text-amber-300">{currentCalibItem?.label}</strong> to press:
                  </div>
                  <div className={`text-5xl font-black font-mono my-2 transition-all ${
                    shakeKey ? 'animate-bounce text-red-400' : 'text-cyan-300'
                  }`}>
                    {currentCalibItem?.display}
                  </div>
                  <p className="text-xs text-slate-400">
                    Finger {calibIndex + 1} of {CALIBRATION_SEQUENCE.length} • Look at the screen only, feel the key!
                  </p>
                </div>

                {/* Progress bar */}
                <div className="max-w-md mx-auto w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-300"
                    style={{ width: `${((calibIndex) / CALIBRATION_SEQUENCE.length) * 100}%` }}
                  />
                </div>
              </>
            ) : (
              <div className="py-4 space-y-3">
                <div className="w-14 h-14 bg-emerald-500/20 text-emerald-300 rounded-full mx-auto flex items-center justify-center border border-emerald-500/40">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Calibration Complete! All 10 Fingers Positioned
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Aapne 10 ungliyon ki sahi Home Row position master kar li hai. Ab aap Lesson 1 (F & J) se blind typing shuru kar sakte hain!
                </p>
                <div className="pt-2">
                  <button
                    onClick={onStartLessons}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm rounded-xl shadow-lg transition active:scale-95"
                  >
                    Start Lesson 1 (F & J Practice) →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step Bottom Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <button
            disabled={activeStep === 0}
            onClick={() => setActiveStep(prev => prev - 1)}
            className="flex items-center space-x-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-gray-700 font-bold text-xs rounded-xl transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          {activeStep < steps.length - 1 ? (
            <button
              onClick={() => setActiveStep(prev => prev + 1)}
              className="flex items-center space-x-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              <span>Next Step: {steps[activeStep + 1].tag}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onStartLessons}
              className="flex items-center space-x-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              <span>Go to Practice Lessons</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
