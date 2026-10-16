import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  CheckCircle2, 
  Hand, 
  Sparkles, 
  X, 
  Compass 
} from 'lucide-react';
import { getFingerForKey, FINGER_COLORS } from '../data/touchTypingData';

// Hand finger anatomy positions for realistic hand animation
const LEFT_FINGERS = [
  { id: 'left-pinky', label: 'Pinky', homeKey: 'A', x: 28, y: 55, h: 42, color: '#f43f5e' },
  { id: 'left-ring', label: 'Ring', homeKey: 'S', x: 44, y: 35, h: 56, color: '#f97316' },
  { id: 'left-middle', label: 'Mid', homeKey: 'D', x: 60, y: 22, h: 64, color: '#eab308' },
  { id: 'left-index', label: 'Index', homeKey: 'F', bump: true, x: 76, y: 32, h: 58, color: '#10b981' },
  { id: 'left-thumb', label: 'Thumb', homeKey: 'Space', x: 92, y: 80, h: 32, color: '#6366f1' },
];

const RIGHT_FINGERS = [
  { id: 'right-thumb', label: 'Thumb', homeKey: 'Space', x: 18, y: 80, h: 32, color: '#6366f1' },
  { id: 'right-index', label: 'Index', homeKey: 'J', bump: true, x: 34, y: 32, h: 58, color: '#06b6d4' },
  { id: 'right-middle', label: 'Mid', homeKey: 'K', x: 50, y: 22, h: 64, color: '#3b82f6' },
  { id: 'right-ring', label: 'Ring', homeKey: 'L', x: 66, y: 35, h: 56, color: '#a855f7' },
  { id: 'right-pinky', label: 'Pinky', homeKey: ';', x: 82, y: 55, h: 42, color: '#ec4899' },
];

export default function LessonFingerDemoModal({ lesson, isOpen, onClose, onStartPractice }) {
  if (!isOpen || !lesson) return null;

  // Extract a clean 4 to 6 character demo sequence from lesson
  const demoSequence = React.useMemo(() => {
    const rawTokens = (lesson.text || '').replace(/\s+/g, ' ').trim().split('');
    const valid = rawTokens.slice(0, 6);
    return valid.length > 0 ? valid : ['f', 'j', 'f', 'j'];
  }, [lesson]);

  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isPressing, setIsPressing] = useState(false);
  const timerRef = useRef(null);

  const currentChar = demoSequence[stepIdx] || demoSequence[0];
  const fingerInfo = getFingerForKey(currentChar);

  // Synthesize realistic typewriter mechanical click sound
  const playClickSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Sharp mechanical keypress transient
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(620, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {}
  };

  // Auto-play demo cycle (2.5 - 3.5 seconds)
  useEffect(() => {
    if (!isPlaying) return;

    timerRef.current = setInterval(() => {
      setIsPressing(true);
      playClickSound();

      setTimeout(() => {
        setIsPressing(false);
      }, 260);

      setStepIdx((prev) => {
        if (prev + 1 < demoSequence.length) {
          return prev + 1;
        } else {
          // Completed full demonstration sequence
          setIsPlaying(false);
          return prev;
        }
      });
    }, 650);

    return () => clearInterval(timerRef.current);
  }, [isPlaying, demoSequence, soundEnabled]);

  // Handle Space/Enter key to instantly start typing practice
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        onStartPractice();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStartPractice, onClose]);

  // Restart demo animation
  const handleReplay = () => {
    setStepIdx(0);
    setIsPlaying(true);
  };

  const isLeftHandActive = fingerInfo?.finger?.startsWith('left');
  const isRightHandActive = fingerInfo?.finger?.startsWith('right');
  const isThumbActive = fingerInfo?.finger === 'thumb' || fingerInfo?.finger?.includes('thumb');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-4 select-none animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col text-white">
        
        {/* Top Video Player Bar */}
        <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Hand className="w-3.5 h-3.5 text-blue-400" />
              <span>Real Finger Motion Tutorial ({lesson.badge})</span>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              title={soundEnabled ? "Mute" : "Unmute"}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-red-400" />}
            </button>

            <button
              onClick={handleReplay}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1 text-[11px] font-semibold"
              title="Replay Video Demo"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Replay</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Canvas Arena */}
        <div className="p-6 space-y-5 flex flex-col items-center">
          
          {/* Target Key & Subtitle Banner */}
          <div className="text-center space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-bold">
              <span>{lesson.title}</span>
              <span>•</span>
              <span className="text-amber-300 font-mono">{lesson.fingerFocus}</span>
            </div>
            
            <div className="text-base sm:text-lg font-bold text-white pt-1 flex items-center justify-center gap-2">
              <span>Watch Finger Motion:</span>
              <span 
                className="px-2.5 py-0.5 rounded-lg font-mono font-black text-white text-base shadow-md transition-all scale-110"
                style={{ backgroundColor: fingerInfo?.hex || '#3b82f6' }}
              >
                {currentChar === ' ' ? '␣ Spacebar' : currentChar.toUpperCase()}
              </span>
              <span className="text-xs text-slate-400 font-normal">
                ({fingerInfo?.label || 'Index Finger'})
              </span>
            </div>
          </div>

          {/* Graphical Real-Hands Finger Tap Stage */}
          <div className="w-full bg-slate-950/80 rounded-2xl p-5 border border-slate-800 relative overflow-hidden flex flex-col items-center shadow-inner">
            
            {/* Background 3D Home Row Keycap Strip */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {[
                { char: 'A', finger: 'left-pinky', bump: false },
                { char: 'S', finger: 'left-ring', bump: false },
                { char: 'D', finger: 'left-middle', bump: false },
                { char: 'F', finger: 'left-index', bump: true },
                { char: 'J', finger: 'right-index', bump: true },
                { char: 'K', finger: 'right-middle', bump: false },
                { char: 'L', finger: 'right-ring', bump: false },
                { char: ';', finger: 'right-pinky', bump: false },
              ].map((k) => {
                const isTarget = currentChar.toLowerCase() === k.char.toLowerCase();
                const fingerColor = FINGER_COLORS[k.finger]?.hex || '#475569';

                return (
                  <div
                    key={k.char}
                    style={{
                      borderColor: isTarget ? fingerColor : '#334155',
                      boxShadow: isTarget ? `0 0 15px ${fingerColor}88` : 'none'
                    }}
                    className={`
                      w-9 h-11 sm:w-11 sm:h-13 rounded-xl border-2 flex flex-col items-center justify-center font-mono font-black text-sm sm:text-base transition-all
                      ${isTarget 
                        ? 'bg-slate-800 text-white translate-y-1 scale-105 ring-2 ring-white/20' 
                        : 'bg-slate-900 text-slate-400 opacity-60'}
                    `}
                  >
                    <span>{k.char}</span>
                    {k.bump && (
                      <div className="w-3 h-0.5 bg-slate-400 rounded-full mt-0.5" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Simulated Animated Left & Right Hands */}
            <div className="w-full flex items-center justify-center gap-8 sm:gap-16 pt-2">
              
              {/* Left Hand SVG Model */}
              <div className={`relative flex flex-col items-center transition-opacity ${
                isLeftHandActive || (isThumbActive && stepIdx % 2 === 0) ? 'opacity-100 scale-105' : 'opacity-50'
              }`}>
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Left Hand (ASDF)</div>
                <div className="relative w-40 sm:w-48 h-32 flex items-end justify-center gap-1.5 p-2 bg-slate-900/60 rounded-2xl border border-slate-800/80">
                  {LEFT_FINGERS.map((f) => {
                    const isActive = fingerInfo?.finger === f.id || (isThumbActive && f.id === 'left-thumb');

                    return (
                      <div key={f.id} className="flex flex-col items-center">
                        <span className={`text-[8px] font-mono font-bold mb-1 ${isActive ? 'text-white' : 'text-slate-500'}`}>
                          {f.homeKey}
                        </span>
                        <div
                          style={{ 
                            height: `${f.h}px`,
                            backgroundColor: isActive ? f.color : '#334155',
                            transform: (isActive && isPressing) ? 'translateY(8px) scale(0.96)' : 'none',
                            boxShadow: isActive ? `0 0 16px ${f.color}99` : 'none'
                          }}
                          className={`
                            w-6 sm:w-7 rounded-t-xl transition-all duration-150 flex flex-col items-center justify-between py-1 text-[9px] font-bold text-white
                            ${isActive ? 'ring-2 ring-white' : ''}
                          `}
                        >
                          <span className="text-[7px] uppercase opacity-80">{f.label[0]}</span>
                          {f.bump && (
                            <div className="w-2 h-0.5 bg-white/80 rounded-full" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Hand SVG Model */}
              <div className={`relative flex flex-col items-center transition-opacity ${
                isRightHandActive || (isThumbActive && stepIdx % 2 === 1) ? 'opacity-100 scale-105' : 'opacity-50'
              }`}>
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Right Hand (JKL;)</div>
                <div className="relative w-40 sm:w-48 h-32 flex items-end justify-center gap-1.5 p-2 bg-slate-900/60 rounded-2xl border border-slate-800/80">
                  {RIGHT_FINGERS.map((f) => {
                    const isActive = fingerInfo?.finger === f.id || (isThumbActive && f.id === 'right-thumb');

                    return (
                      <div key={f.id} className="flex flex-col items-center">
                        <span className={`text-[8px] font-mono font-bold mb-1 ${isActive ? 'text-white' : 'text-slate-500'}`}>
                          {f.homeKey}
                        </span>
                        <div
                          style={{ 
                            height: `${f.h}px`,
                            backgroundColor: isActive ? f.color : '#334155',
                            transform: (isActive && isPressing) ? 'translateY(8px) scale(0.96)' : 'none',
                            boxShadow: isActive ? `0 0 16px ${f.color}99` : 'none'
                          }}
                          className={`
                            w-6 sm:w-7 rounded-t-xl transition-all duration-150 flex flex-col items-center justify-between py-1 text-[9px] font-bold text-white
                            ${isActive ? 'ring-2 ring-white' : ''}
                          `}
                        >
                          <span className="text-[7px] uppercase opacity-80">{f.label[0]}</span>
                          {f.bump && (
                            <div className="w-2 h-0.5 bg-white/80 rounded-full" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Sequence Step Indicators */}
            <div className="flex items-center space-x-1.5 mt-5">
              {demoSequence.map((c, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === stepIdx 
                      ? 'bg-blue-500 scale-125 ring-2 ring-blue-300' 
                      : i < stepIdx 
                      ? 'bg-emerald-500' 
                      : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>

          </div>

          {/* Bottom Action Footer */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="text-xs text-slate-400">
              Tip: Press <strong className="text-white font-mono bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">Space</strong> or <strong className="text-white font-mono bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">Enter</strong> to skip tutorial
            </div>

            <button
              onClick={onStartPractice}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition active:scale-95 flex items-center space-x-2"
            >
              <span>Start Typing Practice</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
