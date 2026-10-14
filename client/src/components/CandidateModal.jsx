import React, { useState } from 'react';
import { X, UserCheck, Shield, BookOpen } from 'lucide-react';

export default function CandidateModal({ isOpen, onClose, candidateInfo, setCandidateInfo }) {
  const [formData, setFormData] = useState({ ...candidateInfo });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setCandidateInfo(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-5 text-white flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-blue-200" />
            <h3 className="font-bold text-lg">Candidate Profile & Target Exam</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Candidate Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3.5 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Rahul Sharma"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Roll Number
              </label>
              <input
                type="text"
                value={formData.rollNo}
                onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3.5 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                placeholder="2201048291"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="UR">UR (Unreserved)</option>
                <option value="OBC">OBC</option>
                <option value="EWS">EWS</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="PwD">PwD / ESM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Target Government Exam
            </label>
            <select
              value={formData.examType}
              onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="SSC_CGL">SSC CGL DEST (27 WPM / 2000 Keystrokes in 15 Min)</option>
              <option value="SSC_CHSL">SSC CHSL DEST / LDC (35 WPM / 1750 Keystrokes in 10 Min)</option>
              <option value="RRB_NTPC_GRAD">RRB NTPC Graduate Level 5 (Senior Clerk / JAA - 30 WPM)</option>
              <option value="RRB_NTPC_UG">RRB NTPC Under Graduate Level 2 (Junior Clerk / Accounts - 30 WPM)</option>
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              Evaluation rules and error cutoffs automatically adjust to the selected exam.
            </p>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 flex items-start space-x-2.5">
            <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <span className="font-semibold text-amber-300">Exam Hall Standard:</span> Official SSC & RRB exam halls conduct tests on full keyboard typing. Full mistakes carry 1.0 deduction, and minor spelling or capitalization errors carry 0.5 deduction.
            </div>
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md transition"
            >
              Save Profile
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
