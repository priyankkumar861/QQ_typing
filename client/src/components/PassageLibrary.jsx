import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  PlusCircle, 
  Clock, 
  CheckCircle, 
  Play, 
  Filter, 
  Sparkles,
  FileText
} from 'lucide-react';

export default function PassageLibrary({ 
  passages, 
  currentPassage, 
  onSelectPassage, 
  onAddPassage 
}) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedLanguage, setSelectedLanguage] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Passage Form State
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');
  const [newCategory, setNewCategory] = useState('SSC CGL');
  const [newLanguage, setNewLanguage] = useState('English');
  const [newDuration, setNewDuration] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter passages
  const filteredPassages = passages.filter((p) => {
    const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchLang = selectedLanguage === 'ALL' || p.language.toLowerCase() === selectedLanguage.toLowerCase();
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        p.text.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchLang && matchSearch;
  });

  const handleCreatePassage = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newText.trim()) return;

    setIsSubmitting(true);
    await onAddPassage({
      title: newTitle,
      text: newText,
      category: newCategory,
      language: newLanguage,
      durationMinutes: Number(newDuration)
    });
    setIsSubmitting(false);
    setShowAddModal(false);
    setNewTitle('');
    setNewText('');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header & Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-blue-400" />
              <span>SSC & Railway Passage Bank</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select official previous year typing test passages or upload your own custom passage.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Custom Passage</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic or keywords..."
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Exam Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Exam Categories</option>
            <option value="SSC CGL">SSC CGL (Tier 2 DEST)</option>
            <option value="SSC CHSL">SSC CHSL (Typing Skill Test)</option>
            <option value="RRB NTPC">Railway RRB NTPC</option>
            <option value="Custom Practice">Custom Practice</option>
          </select>

          {/* Language Filter */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Languages</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi (हिंदी)</option>
          </select>

        </div>
      </div>

      {/* Passage Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPassages.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            <BookOpen className="w-10 h-10 mx-auto text-slate-400 mb-2" />
            <p className="text-sm font-semibold">No passages found matching your filter criteria.</p>
          </div>
        ) : (
          filteredPassages.map((p) => {
            const isCurrent = currentPassage?.id === p.id;
            const wordCount = p.text.split(/\s+/).length;
            const keystrokeCount = p.targetKeystrokes || p.text.length;

            return (
              <div
                key={p.id}
                className={`bg-white rounded-xl border p-5 transition flex flex-col justify-between shadow-xs hover:shadow-md ${
                  isCurrent 
                    ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/20' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      {p.category}
                    </span>
                    <span className="text-xs text-slate-500 font-medium flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{p.durationMinutes || 10} Mins</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">
                    {p.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                    {p.text}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="space-x-2">
                    <span>{wordCount} Words</span>
                    <span>•</span>
                    <span>~{keystrokeCount} Keystrokes</span>
                    <span>•</span>
                    <span className="font-semibold text-slate-700">{p.language}</span>
                  </div>

                  <button
                    onClick={() => onSelectPassage(p)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      isCurrent
                        ? 'bg-emerald-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isCurrent ? 'Currently Active' : 'Start Test'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Custom Passage Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl p-6 text-white space-y-4">
            <h3 className="text-base font-bold flex items-center space-x-2">
              <PlusCircle className="w-5 h-5 text-blue-400" />
              <span>Add Custom Typing Passage</span>
            </h3>

            <form onSubmit={handleCreatePassage} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                  Passage Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. The Hindu Editorial - Economic Survey"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="SSC CGL">SSC CGL</option>
                    <option value="SSC CHSL">SSC CHSL</option>
                    <option value="RRB NTPC">RRB NTPC</option>
                    <option value="Custom Practice">Custom Practice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                    Language
                  </label>
                  <select
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                    Duration (Min)
                  </label>
                  <select
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={3}>3 Minutes</option>
                    <option value={5}>5 Minutes</option>
                    <option value={10}>10 Minutes (Standard)</option>
                    <option value={15}>15 Minutes (DEST)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                  Passage Content (Paste or write text)
                </label>
                <textarea
                  required
                  rows={6}
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Paste your typing passage text here... (Around 350-450 words / 1750-2000 keystrokes recommended)"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-3 text-xs font-mono leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                  <span>Characters: {newText.length}</span>
                  <span>Words: {newText.trim() ? newText.trim().split(/\s+/).length : 0}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow transition"
                >
                  {isSubmitting ? 'Saving...' : 'Add Passage'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
