import React from 'react';
import { 
  HelpCircle, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Scale, 
  Award,
  Calculator
} from 'lucide-react';

export default function ExamRulesView() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md text-white">
        <h2 className="text-xl font-bold flex items-center space-x-2">
          <Scale className="w-6 h-6 text-blue-400" />
          <span>Official Evaluation Scheme & Evaluation Manual</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Based on official guidelines issued by the Staff Selection Commission (SSC) and Railway Recruitment Boards (RRB) for DEST and Typing Skill Tests.
        </p>
      </div>

      {/* Official Exam Architecture & Blueprint */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Railway RRB Typing Blueprint */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200 font-bold text-sm">
              RRB
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Railway Skill Test Architecture</h3>
              <p className="text-[11px] text-slate-400">RRB NTPC Typing Examination Protocol</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            The Railway recruitment evaluation runs for a strict 10-minute window, demanding a qualifying benchmark of 30 WPM (English) or 25 WPM (Hindi). In authentic CBT labs, the Backspace utility remains strictly locked. Evaluation permits an error forgiveness window of up to 5% of typed words; any deviations past this 5% boundary trigger a 10-word reduction per excess mistake against the gross word tally. Aspirants should target maintaining 36+ Gross WPM to comfortably withstand the mistake penalty equation.
          </p>
        </div>

        {/* SSC DEST Blueprint */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-200 font-bold text-sm">
              SSC
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">SSC DEST & Skill Test Framework</h3>
              <p className="text-[11px] text-slate-400">CGL Tier-II & CHSL Qualification System</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            For SSC CGL Tier-II, examinees must achieve 2,000 keystrokes across a 15-minute slot, translating to the mandated 8,000 KDPH pace (~27 WPM). SSC CHSL operates on a 10-minute timer targeting 1,750 keystrokes (35 WPM / 10,500 KDPH). Unlike Railways, Backspace functionality remains active in SSC. Mistake thresholds vary by reservation roster: General/UR candidates must keep overall errors under 5% (CGL) or 7% (CHSL), while OBC/EWS can have up to 7%-10%, and SC/ST up to 10%.
          </p>
        </div>
      </div>

      {/* Grid of Rule Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Full Mistakes Card */}
        <div className="bg-white rounded-2xl border border-red-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center space-x-2.5 text-red-700 border-b border-red-100 pb-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <h3 className="font-bold text-base">Full Mistakes (1.0 Penalty each)</h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Every full mistake deducts 1 full point or is equivalent to a full word error:
          </p>

          <ul className="space-y-2.5 text-xs text-slate-700">
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
              <div>
                <strong>Omission of Word(s):</strong> For every word omitted from the master text passage.
              </div>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
              <div>
                <strong>Substitution of Wrong Word:</strong> For every word typed in place of the original word (e.g. typing "economic" instead of "financial").
              </div>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
              <div>
                <strong>Addition of Word(s):</strong> For every word added which is not found in the master passage.
              </div>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
              <div>
                <strong>Severely Mispelled Words:</strong> Any word where more than half the letters are incorrect or mangled.
              </div>
            </li>
          </ul>
        </div>

        {/* Half Mistakes Card */}
        <div className="bg-white rounded-2xl border border-amber-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center space-x-2.5 text-amber-700 border-b border-amber-100 pb-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <h3 className="font-bold text-base">Half Mistakes (0.5 Penalty each)</h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Half mistakes reflect minor typographical imperfections and carry half penalty:
          </p>

          <ul className="space-y-2.5 text-xs text-slate-700">
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div>
                <strong>Minor Spelling Errors:</strong> Transposition, omission, or substitution of one or two letters within an otherwise recognizable word.
              </div>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div>
                <strong>Capitalization Error:</strong> Wrong use of capital letter for small letter, or small letter for capital letter.
              </div>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div>
                <strong>Punctuation Error:</strong> Missing, incorrect, or unnecessary punctuation attached to a word.
              </div>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div>
                <strong>Spacing & Paragraph Discrepancies:</strong> Failure to provide space between words or unwanted space within a word.
              </div>
            </li>
          </ul>
        </div>

      </div>

      {/* Official Cutoff & Benchmark Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="font-bold text-base text-slate-800 flex items-center space-x-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          <span>Cutoff Benchmarks by Exam & Category</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-semibold uppercase">
              <tr>
                <th className="px-4 py-3">Exam Name</th>
                <th className="px-4 py-3">Language</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Required Speed</th>
                <th className="px-4 py-3">Permissible Error Cutoff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-4 py-3 font-bold text-slate-800">SSC CGL Tier-2 (DEST)</td>
                <td className="px-4 py-3 text-slate-600">English</td>
                <td className="px-4 py-3 text-slate-600 font-mono">15 Mins</td>
                <td className="px-4 py-3 font-semibold text-blue-700">2000 KDPH (~27 WPM)</td>
                <td className="px-4 py-3 text-slate-700">
                  <span className="font-semibold text-slate-900">UR: 5%</span> | OBC/EWS: 7% | SC/ST: 10%
                </td>
              </tr>

              <tr>
                <td className="px-4 py-3 font-bold text-slate-800">SSC CHSL Tier-2 (LDC / JSA)</td>
                <td className="px-4 py-3 text-slate-600">English</td>
                <td className="px-4 py-3 text-slate-600 font-mono">10 Mins</td>
                <td className="px-4 py-3 font-semibold text-blue-700">35 WPM (10500 KDPH)</td>
                <td className="px-4 py-3 text-slate-700">
                  <span className="font-semibold text-slate-900">UR: 7%</span> | OBC/EWS: 10% | SC/ST: 10%
                </td>
              </tr>

              <tr>
                <td className="px-4 py-3 font-bold text-slate-800">SSC CHSL Tier-2 (DEO)</td>
                <td className="px-4 py-3 text-slate-600">English</td>
                <td className="px-4 py-3 text-slate-600 font-mono">15 Mins</td>
                <td className="px-4 py-3 font-semibold text-blue-700">15000 KDPH (~50 WPM)</td>
                <td className="px-4 py-3 text-slate-700">
                  <span className="font-semibold text-slate-900">UR: 5%</span> | Reserved: 7%
                </td>
              </tr>

              <tr>
                <td className="px-4 py-3 font-bold text-slate-800">Railway RRB NTPC</td>
                <td className="px-4 py-3 text-slate-600">English / Hindi</td>
                <td className="px-4 py-3 text-slate-600 font-mono">10 Mins</td>
                <td className="px-4 py-3 font-semibold text-blue-700">30 WPM (Eng) / 25 WPM (Hindi)</td>
                <td className="px-4 py-3 text-slate-700">
                  5% errors ignored; excess errors deducted @ 5 words per error
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Formulas Card */}
      <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 space-y-3">
        <h3 className="font-bold text-sm text-amber-400 uppercase tracking-wider">
          Standard Mathematical Formulas Used in this Portal
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono text-slate-300">
          <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
            <div className="text-amber-300 font-bold mb-1">Total Mistakes:</div>
            <div>Full Mistakes + (Half Mistakes × 0.5)</div>
          </div>

          <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
            <div className="text-amber-300 font-bold mb-1">Error Percentage:</div>
            <div>(Total Mistakes / Total Words) × 100</div>
          </div>

          <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
            <div className="text-amber-300 font-bold mb-1">Net WPM (Speed):</div>
            <div>Gross WPM - (Total Mistakes / Time in Min)</div>
          </div>
        </div>
      </div>

    </div>
  );
}
