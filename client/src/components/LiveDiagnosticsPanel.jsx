import React from 'react';
import { 
  Activity, 
  Target, 
  AlertOctagon, 
  TrendingUp, 
  Type, 
  Volume2, 
  VolumeX, 
  Sliders,
  CheckCircle,
  ShieldAlert
} from 'lucide-react';

export default function LiveDiagnosticsPanel({
  examType,
  category,
  liveGrossWPM,
  totalKeystrokes,
  backspaceCount,
  elapsedMinutes,
  fontSize,
  setFontSize,
  fontFamily,
  setFontFamily,
  keyboardSoundEnabled,
  setKeyboardSoundEnabled,
  hallNoiseEnabled,
  setHallNoiseEnabled,
  onCollapse
}) {
  const isNTPC = examType === 'RRB_NTPC' || examType?.startsWith('RRB_NTPC') || examType?.includes('NTPC') || examType?.includes('RAILWAY');
  const isCGL = examType === 'SSC_CGL' || examType?.startsWith('SSC_CGL');

  // Target KDPH
  const targetKDPH = isCGL ? 8000 : (isNTPC ? 9000 : 10500);
  const targetWPM = isCGL ? 27 : (isNTPC ? 30 : 35);
  
  // Projected KDPH at current pace
  const projectedKDPH = elapsedMinutes > 0.05 
    ? Math.round((totalKeystrokes / elapsedMinutes) * 60) 
    : 0;

  const isPaceOnTarget = projectedKDPH >= targetKDPH;
  const pacePercentage = Math.min(100, Math.round((projectedKDPH / targetKDPH) * 100));

  return (
    <aside className="w-full xl:w-72 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between space-y-4 text-white animate-in fade-in duration-150">
      
      {/* Top Diagnostics Header */}
      <div>
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
              Live Test Telemetry
            </h3>
          </div>
          
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold">
              {isNTPC ? 'RRB MODE' : (isCGL ? 'CGL 8K' : 'CHSL 10.5K')}
            </span>

            {onCollapse && (
              <button
                onClick={onCollapse}
                className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                title="Collapse Telemetry Panel"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Real-time KDPH Pace Gauge */}
        <div className="mt-4 p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/70 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-blue-400" />
              <span>Current KDPH Pace</span>
            </span>
            <span className={`font-mono font-bold text-sm ${isPaceOnTarget ? 'text-emerald-400' : 'text-amber-400'}`}>
              {projectedKDPH}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${isPaceOnTarget ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-amber-500 to-rose-400'}`}
              style={{ width: `${pacePercentage}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-400">
            <span>Target: {targetKDPH} KDPH</span>
            <span className={isPaceOnTarget ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              {pacePercentage}% of cutoff
            </span>
          </div>
        </div>

        {/* Projected Speed Meter */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Live Gross</div>
            <div className="text-xl font-mono font-bold text-cyan-300 mt-0.5">
              {liveGrossWPM} <span className="text-[10px] font-normal">WPM</span>
            </div>
            <div className="text-[9px] text-slate-500 mt-0.5">Goal: {targetWPM} WPM</div>
          </div>

          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Keystrokes</div>
            <div className="text-xl font-mono font-bold text-white mt-0.5">
              {totalKeystrokes}
            </div>
            <div className="text-[9px] text-slate-500 mt-0.5">Target: {isCGL ? '2000' : '1750'}</div>
          </div>
        </div>

        {/* Exam Specific Rule Indicator */}
        <div className="mt-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs space-y-1.5">
          <div className="font-semibold text-[11px] text-slate-300 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Active Exam Parameters</span>
          </div>
          
          <div className="text-[10px] text-slate-400 leading-relaxed">
            {isNTPC ? (
              <div>
                • <strong className="text-amber-300">Backspace:</strong> Disabled in CBT<br/>
                • <strong className="text-amber-300">Penalty:</strong> 5% errors free; excess × 10 words penalty
              </div>
            ) : isCGL ? (
              <div>
                • <strong className="text-blue-300">Duration:</strong> 15 Mins (2000 keystrokes)<br/>
                • <strong className="text-blue-300">Max Error:</strong> {category === 'UR' ? '5% (UR)' : '7%-10%'}
              </div>
            ) : (
              <div>
                • <strong className="text-emerald-300">Duration:</strong> 10 Mins (1750 keystrokes)<br/>
                • <strong className="text-emerald-300">Speed Req:</strong> 35 WPM / 10,500 KDPH
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Display Customizer (Font Size, Family, Audio) */}
      <div className="pt-3 border-t border-slate-800 space-y-2.5">
        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
          <Sliders className="w-3 h-3" />
          <span>Display & Audio Engine</span>
        </div>

        {/* Font Size Selector */}
        <div className="flex items-center justify-between text-xs bg-slate-800/70 p-1.5 rounded-lg border border-slate-700">
          <span className="text-slate-400 text-[11px]">Text Size:</span>
          <div className="flex space-x-1">
            {['small', 'medium', 'large'].map((size) => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition ${
                  fontSize === size 
                    ? 'bg-blue-600 text-white shadow' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {size === 'small' ? 'A-' : size === 'medium' ? 'A' : 'A+'}
              </button>
            ))}
          </div>
        </div>

        {/* Font Family Selector */}
        <div className="flex items-center justify-between text-xs bg-slate-800/70 p-1.5 rounded-lg border border-slate-700">
          <span className="text-slate-400 text-[11px]">Font Style:</span>
          <div className="flex space-x-1">
            {['mono', 'sans', 'serif'].map((f) => (
              <button
                key={f}
                onClick={() => setFontFamily(f)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition ${
                  fontFamily === f 
                    ? 'bg-blue-600 text-white shadow' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Audio Toggles: Keyboard Click & Hall Noise */}
        <div className="space-y-1.5 pt-1">
          <button
            onClick={() => setKeyboardSoundEnabled(!keyboardSoundEnabled)}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
              keyboardSoundEnabled
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span>⌨️ Key Click Noise</span>
            </span>
            <span className="font-mono text-[10px] font-bold">
              {keyboardSoundEnabled ? 'ON' : 'OFF'}
            </span>
          </button>

          <button
            onClick={() => setHallNoiseEnabled(!hallNoiseEnabled)}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
              hallNoiseEnabled
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span>🎧 Exam Hall Noise (TCS)</span>
            </span>
            <span className="font-mono text-[10px] font-bold">
              {hallNoiseEnabled ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>

      </div>

    </aside>
  );
}
