import React from 'react';
import { KEYBOARD_LAYOUT, FINGER_COLORS, getFingerForKey } from '../data/touchTypingData';

// Dynamic flex ratios and sizing so keys fluidly scale on ALL screen resolutions without overflow
const getKeyStyles = (k) => {
  if (k.key === 'Backspace') {
    return { flex: '1.7 1 0%', minWidth: '30px', maxWidth: '82px' };
  }
  if (k.key === 'Tab') {
    return { flex: '1.4 1 0%', minWidth: '28px', maxWidth: '68px' };
  }
  if (k.key === '\\') {
    return { flex: '1.1 1 0%', minWidth: '20px', maxWidth: '54px' };
  }
  if (k.key === 'Caps') {
    return { flex: '1.7 1 0%', minWidth: '32px', maxWidth: '80px' };
  }
  if (k.key === 'Enter') {
    return { flex: '1.9 1 0%', minWidth: '36px', maxWidth: '90px' };
  }
  if (k.key === 'Shift') {
    return { flex: '2.3 1 0%', minWidth: '40px', maxWidth: '105px' };
  }
  if (k.key === 'Ctrl') {
    return { flex: '1.4 1 0%', minWidth: '26px', maxWidth: '64px' };
  }
  if (k.key === 'Alt') {
    return { flex: '1.2 1 0%', minWidth: '24px', maxWidth: '58px' };
  }
  if (k.key === ' ') {
    return { flex: '8.5 1 0%', minWidth: '110px', maxWidth: '420px' };
  }
  // Standard letter, number, or punctuation key
  return { flex: '1 1 0%', minWidth: '18px', maxWidth: '48px' };
};

export default function VirtualKeyboard({ nextChar, lastPressedKey, isMistake }) {
  const activeFingerInfo = getFingerForKey(nextChar);
  const targetLower = nextChar ? nextChar.toLowerCase() : '';
  const isShiftNeeded = activeFingerInfo?.requiresShift;

  return (
    <div className="w-full bg-slate-900/95 border border-slate-800 rounded-2xl p-2.5 sm:p-4 shadow-xl space-y-3 select-none">
      
      {/* Top Finger Guide Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-800/80 px-3 sm:px-4 py-2 rounded-xl border border-slate-700/60 text-xs">
        
        {/* Next Key Instruction */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <span className="text-slate-400 font-medium text-[11px] sm:text-xs">Target:</span>
          <span className="inline-flex items-center justify-center min-w-8 h-8 px-2 font-mono text-sm sm:text-base font-black rounded-lg bg-blue-600 text-white shadow-md shadow-blue-500/30 animate-pulse">
            {nextChar === ' ' ? '␣ Space' : nextChar || '—'}
          </span>
          {isShiftNeeded && (
            <span className="text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded animate-pulse">
              Hold Shift (Opposite Pinky)
            </span>
          )}
        </div>

        {/* Target Finger Indicator */}
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-medium text-[11px] sm:text-xs">Finger:</span>
          <span 
            className="font-bold px-2.5 py-0.5 sm:py-1 rounded-lg text-white text-[11px] sm:text-xs shadow-sm transition-all"
            style={{ 
              backgroundColor: activeFingerInfo?.hex ? `${activeFingerInfo.hex}` : '#3b82f6',
              boxShadow: `0 0 12px ${activeFingerInfo?.hex ? activeFingerInfo.hex : '#3b82f6'}88`
            }}
          >
            {activeFingerInfo?.label || 'Index Finger'}
          </span>
        </div>

        {/* Hand visualizer mini legend */}
        <div className="hidden md:flex items-center space-x-2 text-[10px] sm:text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#10b981]"></span> L-Index
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#06b6d4]"></span> R-Index
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#6366f1]"></span> Thumbs
          </span>
        </div>

      </div>

      {/* Virtual Keyboard Grid - 100% fluid, zero horizontal overflow */}
      <div className="w-full flex flex-col items-center gap-1 sm:gap-1.5 py-1">
        {KEYBOARD_LAYOUT.map((row, rIdx) => (
          <div key={rIdx} className="w-full flex flex-nowrap gap-0.5 sm:gap-1 md:gap-1.5 items-center justify-center">
            {row.map((k, kIdx) => {
              const finger = FINGER_COLORS[k.finger] || { hex: '#475569', label: '' };
              const isTargetKey = (k.key.toLowerCase() === targetLower) || 
                                  (k.shiftKey === nextChar) ||
                                  (k.key === ' ' && nextChar === ' ');
              const isTargetShift = isShiftNeeded && k.key === 'Shift';
              const isPressed = lastPressedKey && (lastPressedKey.toLowerCase() === k.key.toLowerCase());

              const styles = getKeyStyles(k);
              const isSpecial = k.special || k.key === ' ';

              return (
                <div
                  key={kIdx}
                  style={{
                    flex: styles.flex,
                    minWidth: styles.minWidth,
                    maxWidth: styles.maxWidth,
                    borderColor: isTargetKey ? finger.hex : undefined,
                    boxShadow: isTargetKey ? `0 0 14px ${finger.hex}bb` : undefined
                  }}
                  className={`
                    relative flex flex-col items-center justify-center rounded-md sm:rounded-lg font-mono transition-all duration-100 select-none
                    h-8 sm:h-9 md:h-10 lg:h-11
                    ${isTargetKey 
                      ? 'bg-white text-slate-900 border-2 scale-105 z-10 animate-bounce' 
                      : isTargetShift
                      ? 'bg-amber-500 text-slate-900 border-2 border-amber-300 animate-pulse'
                      : 'bg-slate-800 text-slate-300 border border-slate-700/80 hover:border-slate-600'}
                    ${isPressed ? 'scale-95 brightness-150' : ''}
                  `}
                >
                  {/* Key Label */}
                  <span className={`${isSpecial ? 'text-[9px] sm:text-xs font-semibold' : 'text-xs sm:text-sm font-bold'} truncate px-0.5`}>
                    {k.label || k.key}
                  </span>

                  {/* Shift symbol indicator (e.g. ! @ # $ on top right) */}
                  {k.shiftKey && (
                    <span className="absolute top-0.5 right-1 text-[7px] sm:text-[8px] font-mono text-slate-500 hidden sm:inline">
                      {k.shiftKey}
                    </span>
                  )}

                  {/* Tactile bump marker for F & J (Home anchors) */}
                  {k.bump && (
                    <div className="absolute bottom-1 w-2 sm:w-3 h-0.5 rounded-full bg-slate-400"></div>
                  )}

                  {/* Finger color dot indicator on key bottom */}
                  <div 
                    className="absolute bottom-0.5 left-1 w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full opacity-60"
                    style={{ backgroundColor: finger.hex }}
                    title={finger.label}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Two Hands Graphical Visualizer (Compact & Scaled) */}
      <div className="pt-2 border-t border-slate-800 flex justify-center items-center gap-6 sm:gap-14 text-xs text-slate-400">
        
        {/* Left Hand Indicator */}
        <div className="flex flex-col items-center space-y-1">
          <div className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Left Hand</div>
          <div className="flex gap-1 items-end h-10 bg-slate-800/40 p-1.5 rounded-xl border border-slate-700/50">
            {/* Left Pinky */}
            <div 
              style={{ backgroundColor: activeFingerInfo?.finger === 'left-pinky' ? FINGER_COLORS['left-pinky'].hex : '#334155' }}
              className={`w-3 sm:w-3.5 h-6 rounded-t-md transition-all ${activeFingerInfo?.finger === 'left-pinky' ? 'scale-110 shadow-lg shadow-rose-500/50' : ''}`}
              title="Left Pinky (A, Q, Z, 1, Shift)"
            />
            {/* Left Ring */}
            <div 
              style={{ backgroundColor: activeFingerInfo?.finger === 'left-ring' ? FINGER_COLORS['left-ring'].hex : '#334155' }}
              className={`w-3 sm:w-3.5 h-8 rounded-t-md transition-all ${activeFingerInfo?.finger === 'left-ring' ? 'scale-110 shadow-lg shadow-orange-500/50' : ''}`}
              title="Left Ring (S, W, X, 2)"
            />
            {/* Left Middle */}
            <div 
              style={{ backgroundColor: activeFingerInfo?.finger === 'left-middle' ? FINGER_COLORS['left-middle'].hex : '#334155' }}
              className={`w-3 sm:w-3.5 h-9 rounded-t-md transition-all ${activeFingerInfo?.finger === 'left-middle' ? 'scale-110 shadow-lg shadow-amber-500/50' : ''}`}
              title="Left Middle (D, E, C, 3)"
            />
            {/* Left Index */}
            <div 
              style={{ backgroundColor: activeFingerInfo?.finger === 'left-index' ? FINGER_COLORS['left-index'].hex : '#334155' }}
              className={`w-3 sm:w-3.5 h-8 rounded-t-md transition-all ${activeFingerInfo?.finger === 'left-index' ? 'scale-110 shadow-lg shadow-emerald-500/50' : ''}`}
              title="Left Index (F, G, R, T, V, B, 4, 5)"
            />
            {/* Left Thumb */}
            <div 
              style={{ backgroundColor: activeFingerInfo?.finger === 'thumb' || activeFingerInfo?.finger === 'left-thumb' ? FINGER_COLORS['thumb'].hex : '#334155' }}
              className={`w-3.5 sm:w-4 h-5 rounded-t-md transition-all ${activeFingerInfo?.finger === 'thumb' ? 'scale-110 shadow-lg shadow-indigo-500/50' : ''}`}
              title="Left Thumb (Spacebar)"
            />
          </div>
          <span className="text-[9px] sm:text-[10px] text-slate-500">ASDF Home Anchor</span>
        </div>

        {/* Right Hand Indicator */}
        <div className="flex flex-col items-center space-y-1">
          <div className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Right Hand</div>
          <div className="flex gap-1 items-end h-10 bg-slate-800/40 p-1.5 rounded-xl border border-slate-700/50">
            {/* Right Thumb */}
            <div 
              style={{ backgroundColor: activeFingerInfo?.finger === 'thumb' || activeFingerInfo?.finger === 'right-thumb' ? FINGER_COLORS['thumb'].hex : '#334155' }}
              className={`w-3.5 sm:w-4 h-5 rounded-t-md transition-all ${activeFingerInfo?.finger === 'thumb' ? 'scale-110 shadow-lg shadow-indigo-500/50' : ''}`}
              title="Right Thumb (Spacebar)"
            />
            {/* Right Index */}
            <div 
              style={{ backgroundColor: activeFingerInfo?.finger === 'right-index' ? FINGER_COLORS['right-index'].hex : '#334155' }}
              className={`w-3 sm:w-3.5 h-8 rounded-t-md transition-all ${activeFingerInfo?.finger === 'right-index' ? 'scale-110 shadow-lg shadow-cyan-500/50' : ''}`}
              title="Right Index (J, H, U, Y, M, N, 6, 7)"
            />
            {/* Right Middle */}
            <div 
              style={{ backgroundColor: activeFingerInfo?.finger === 'right-middle' ? FINGER_COLORS['right-middle'].hex : '#334155' }}
              className={`w-3 sm:w-3.5 h-9 rounded-t-md transition-all ${activeFingerInfo?.finger === 'right-middle' ? 'scale-110 shadow-lg shadow-blue-500/50' : ''}`}
              title="Right Middle (K, I, Comma, 8)"
            />
            {/* Right Ring */}
            <div 
              style={{ backgroundColor: activeFingerInfo?.finger === 'right-ring' ? FINGER_COLORS['right-ring'].hex : '#334155' }}
              className={`w-3 sm:w-3.5 h-8 rounded-t-md transition-all ${activeFingerInfo?.finger === 'right-ring' ? 'scale-110 shadow-lg shadow-purple-500/50' : ''}`}
              title="Right Ring (L, O, Period, 9)"
            />
            {/* Right Pinky */}
            <div 
              style={{ backgroundColor: activeFingerInfo?.finger === 'right-pinky' ? FINGER_COLORS['right-pinky'].hex : '#334155' }}
              className={`w-3 sm:w-3.5 h-6 rounded-t-md transition-all ${activeFingerInfo?.finger === 'right-pinky' ? 'scale-110 shadow-lg shadow-pink-500/50' : ''}`}
              title="Right Pinky (;, P, Enter, Slash, 0)"
            />
          </div>
          <span className="text-[9px] sm:text-[10px] text-slate-500">JKL; Home Anchor</span>
        </div>

      </div>

    </div>
  );
}
