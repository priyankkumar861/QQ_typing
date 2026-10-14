import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Activity, 
  TrendingUp, 
  Award, 
  Search, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Mail, 
  Calendar, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Zap,
  Filter
} from 'lucide-react';

export default function AdminDashboard({ onInspectAttempt }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('students'); // 'students' | 'activity'
  const [selectedStudentEmail, setSelectedStudentEmail] = useState('');

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/analytics');
      const json = await res.json();
      if (json.success) {
        setData(json.analytics);
      }
    } catch (err) {
      console.error('Error fetching admin analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading && !data) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full mb-3" />
        <p className="text-sm text-gray-500">Loading student directory & usage analytics...</p>
      </div>
    );
  }

  const students = data?.students || [];
  const activity = data?.recentActivity || [];

  // Filter students by search term
  const filteredStudents = students.filter(s => {
    const q = searchTerm.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.rollNo.toLowerCase().includes(q)
    );
  });

  // Filter activity by search or selected student
  const filteredActivity = activity.filter(a => {
    if (selectedStudentEmail) {
      return a.userEmail && a.userEmail.toLowerCase() === selectedStudentEmail.toLowerCase();
    }
    const q = searchTerm.toLowerCase();
    return (
      a.candidateName.toLowerCase().includes(q) ||
      a.userEmail.toLowerCase().includes(q) ||
      a.passageTitle.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Top Admin Header */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Administrator Control Center</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            Student Logins & Test Usage Analytics
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Real-time tracking of registered candidates, test attempts, individual speeds, and exam practice history.
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          className="flex items-center space-x-1.5 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl text-xs font-bold transition shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase">
            <span>Total Students</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black font-mono text-gray-900 mt-2">
            {data?.totalStudents || 0}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">Registered candidate accounts</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase">
            <span>Tests Attempted</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black font-mono text-emerald-600 mt-2">
            {data?.totalTestsTaken || 0}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">Completed mock exam sessions</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase">
            <span>Avg Student Speed</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-black font-mono text-indigo-600 mt-2">
            {data?.avgNetWPM || 0} <span className="text-sm font-normal text-gray-500">WPM</span>
          </div>
          <div className="text-[11px] text-gray-500 mt-1">Platform average net cadence</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase">
            <span>Pass Qualification</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black font-mono text-amber-600 mt-2">
            {data?.overallPassRate || 0}%
          </div>
          <div className="text-[11px] text-gray-500 mt-1">Met official category cutoff</div>
        </div>

      </div>

      {/* Control Tabs & Search Bar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => { setActiveTab('students'); setSelectedStudentEmail(''); }}
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === 'students' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Registered Students ({students.length})
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === 'activity' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Live Test Activity Log ({activity.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px] sm:min-w-[320px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search student name, email, roll no..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-9 pr-3 text-xs text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-hidden focus:border-blue-500"
            />
          </div>

        </div>

        {selectedStudentEmail && (
          <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-xs flex items-center justify-between text-blue-800">
            <span>Showing test records filtered specifically for: <strong>{selectedStudentEmail}</strong></span>
            <button
              onClick={() => setSelectedStudentEmail('')}
              className="text-xs text-blue-600 hover:underline font-bold"
            >
              Clear Filter ✕
            </button>
          </div>
        )}
      </div>

      {/* VIEW 1: REGISTERED STUDENTS DIRECTORY */}
      {activeTab === 'students' && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Student Candidate</th>
                  <th className="py-3 px-4">Gmail Address</th>
                  <th className="py-3 px-4">Roll Number</th>
                  <th className="py-3 px-4">Exam & Category</th>
                  <th className="py-3 px-4 text-center">Tests Taken</th>
                  <th className="py-3 px-4 text-center">Peak Speed</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-400">
                      No students found matching "{searchTerm}"
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50/80 transition">
                      
                      {/* Name & Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center uppercase text-xs shrink-0 shadow-2xs">
                            {s.name.charAt(0)}
                          </div>
                          <div className="font-bold text-gray-900">{s.name}</div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3 px-4 text-gray-600 font-mono">
                        {s.email}
                      </td>

                      {/* Roll Number */}
                      <td className="py-3 px-4 text-gray-700 font-mono font-semibold">
                        {s.rollNo}
                      </td>

                      {/* Exam & Category */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-semibold text-gray-800">
                            {s.examType.replace('_', ' ')}
                          </span>
                          <span className="bg-gray-100 text-gray-700 font-bold px-2 py-0.5 rounded text-[10px] border border-gray-200">
                            {s.category}
                          </span>
                        </div>
                      </td>

                      {/* Tests Taken */}
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block font-mono font-bold px-2.5 py-0.5 rounded-full text-xs ${
                          s.totalAttempts > 0 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {s.totalAttempts} {s.totalAttempts === 1 ? 'Test' : 'Tests'}
                        </span>
                      </td>

                      {/* Peak Speed */}
                      <td className="py-3 px-4 text-center">
                        <span className={`font-mono font-bold text-xs ${
                          s.bestWPM >= 35 ? 'text-emerald-600' : s.bestWPM > 0 ? 'text-blue-600' : 'text-gray-400'
                        }`}>
                          {s.bestWPM > 0 ? `${s.bestWPM} WPM` : '—'}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedStudentEmail(s.email);
                            setActiveTab('activity');
                          }}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition inline-flex items-center space-x-1"
                        >
                          <span>View History</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: LIVE TEST ACTIVITY STREAM */}
      {activeTab === 'activity' && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Candidate & Gmail</th>
                  <th className="py-3 px-4">Test Passage</th>
                  <th className="py-3 px-4 text-center">Net Speed</th>
                  <th className="py-3 px-4 text-center">Accuracy</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredActivity.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-400">
                      No test attempts found for current filter.
                    </td>
                  </tr>
                ) : (
                  filteredActivity.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50/80 transition">
                      
                      {/* Candidate */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-gray-900">{a.candidateName}</div>
                        <div className="text-[11px] text-gray-500 font-mono">{a.userEmail}</div>
                      </td>

                      {/* Passage Title */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-semibold text-gray-800 truncate" title={a.passageTitle}>
                          {a.passageTitle}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {a.examType.replace('_', ' ')} • {a.category}
                        </div>
                      </td>

                      {/* Net Speed */}
                      <td className="py-3 px-4 text-center">
                        <span className="font-mono font-black text-sm text-gray-900">
                          {a.netWPM} <span className="text-[10px] font-normal text-gray-500">WPM</span>
                        </span>
                      </td>

                      {/* Accuracy */}
                      <td className="py-3 px-4 text-center font-mono font-bold text-gray-700">
                        {a.accuracy}%
                      </td>

                      {/* Qualification Status */}
                      <td className="py-3 px-4 text-center">
                        {a.isQualified ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>QUALIFIED</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            <span>FAILED</span>
                          </span>
                        )}
                      </td>

                      {/* Date & Time */}
                      <td className="py-3 px-4 text-right text-gray-500 text-[11px]">
                        {new Date(a.timestamp).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
