import React from 'react';
import { 
  History, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Zap, 
  Award,
  Calendar,
  Eye
} from 'lucide-react';

export default function HistoryView({ history, onClearHistory, onInspectAttempt, candidateInfo }) {
  if (!history || history.length === 0) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl border border-slate-200 p-12 shadow-xs space-y-3">
          <History className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-700">No Typing Attempts Yet</h3>
          {candidateInfo && (
            <div className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200">
              Candidate: {candidateInfo.name} ({candidateInfo.email || candidateInfo.rollNo})
            </div>
          )}
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Take an SSC or Railway typing test to start tracking your Net WPM, accuracy, and qualification trends here.
          </p>
        </div>
      </div>
    );
  }

  // Summary Metrics
  const totalTests = history.length;
  const qualifiedCount = history.filter(h => h.isQualified).length;
  const qualRate = Math.round((qualifiedCount / totalTests) * 100);
  const avgNetWPM = Math.round(history.reduce((acc, h) => acc + (h.netWPM || 0), 0) / totalTests);
  const bestNetWPM = Math.max(...history.map(h => h.netWPM || 0));

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header & Overall Analytics */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs text-gray-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold flex items-center space-x-2 text-gray-900">
                <History className="w-6 h-6 text-blue-600" />
                <span>Test History & Audit Log</span>
              </h2>
              {candidateInfo && (
                <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {candidateInfo.name} ({candidateInfo.category})
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {candidateInfo?.email ? `Attempts recorded for ${candidateInfo.email}` : 'Complete performance audit log computed as per official SSC CGL / CHSL & Railway rules.'}
            </p>
          </div>

          <button
            onClick={onClearHistory}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-semibold transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        </div>

        {/* Aggregate Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          
          <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
            <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Tests</div>
            <div className="text-2xl font-black font-mono text-gray-900 mt-1">{totalTests}</div>
          </div>

          <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
            <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Qualification Rate</div>
            <div className="text-2xl font-black font-mono text-emerald-600 mt-1">{qualRate}%</div>
          </div>

          <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
            <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Average Net Speed</div>
            <div className="text-2xl font-black font-mono text-blue-600 mt-1">{avgNetWPM} <span className="text-xs font-normal">WPM</span></div>
          </div>

          <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
            <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Peak Speed</div>
            <div className="text-2xl font-black font-mono text-amber-600 mt-1">{bestNetWPM} <span className="text-xs font-normal">WPM</span></div>
          </div>

        </div>
      </div>

      {/* Attempts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3">Passage Title</th>
                <th className="px-4 py-3">Exam / Cat</th>
                <th className="px-4 py-3 text-center">Net WPM</th>
                <th className="px-4 py-3 text-center">Gross WPM</th>
                <th className="px-4 py-3 text-center">Error %</th>
                <th className="px-4 py-3 text-center">Mistakes (F / H)</th>
                <th className="px-4 py-3 text-center">Result</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {history.map((record) => {
                const date = new Date(record.timestamp);
                const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <tr key={record.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {dateStr}
                    </td>

                    <td className="px-4 py-3 font-semibold text-slate-900 max-w-xs truncate">
                      {record.passageTitle}
                    </td>

                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      <span className="font-semibold">{record.examType.replace('_', ' ')}</span>{' '}
                      <span className="text-slate-400">({record.category})</span>
                    </td>

                    <td className="px-4 py-3 text-center font-mono font-bold text-sm text-slate-800">
                      {record.netWPM}
                    </td>

                    <td className="px-4 py-3 text-center font-mono text-slate-600">
                      {record.grossWPM}
                    </td>

                    <td className="px-4 py-3 text-center font-mono font-semibold text-slate-700">
                      {record.errorPercentage}%
                    </td>

                    <td className="px-4 py-3 text-center text-slate-600 font-mono">
                      <span className="text-red-600 font-semibold">{record.fullMistakes}</span>
                      <span className="text-slate-400 mx-1">/</span>
                      <span className="text-amber-600 font-semibold">{record.halfMistakes}</span>
                    </td>

                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      {record.isQualified ? (
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                          QUALIFIED
                        </span>
                      ) : (
                        <span className="bg-rose-100 text-rose-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                          NOT QUALIFIED
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onInspectAttempt(record)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg text-xs font-semibold border border-slate-200 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
