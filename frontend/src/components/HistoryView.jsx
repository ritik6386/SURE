import React, { useState } from 'react'
import { 
  Clock, ArrowRight, Search, Trash2, ArrowLeft, 
  CheckCircle2, RefreshCw, FileText, BookOpen
} from 'lucide-react'

export default function HistoryView({
  history,
  onSelectQuery,
  onClearHistory,
  onBack
}) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredHistory = history.filter(item => 
    item.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.standard.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#003366] tracking-tight flex items-center gap-2">
            <Clock className="w-6 h-6 text-[#FF9933]" />
            Procurement Search &amp; Analysis History
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Review past procurement queries, analyzed BIS standards, and regenerated GFR compliance matrices.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#003366] hover:text-[#002244] bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs hover:bg-slate-50 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Analysis</span>
          </button>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center space-x-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter past queries, standard codes, or sectors..."
          className="w-full text-xs outline-none bg-transparent text-slate-800 placeholder:text-slate-400 font-medium"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-xs text-slate-400 hover:text-slate-600 font-bold"
          >
            Clear
          </button>
        )}
      </div>

      {/* 3. History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredHistory.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Clock className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No past procurement queries found</p>
            <p className="text-xs text-slate-400 mt-0.5">Queries analyzed in the search bar will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 font-bold text-slate-600">
                <tr>
                  <th className="px-5 py-3.5">Procurement Query</th>
                  <th className="px-5 py-3.5">Identified BIS Standard</th>
                  <th className="px-5 py-3.5">Sector</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Timestamp</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-4 font-semibold text-slate-900 max-w-xs truncate">
                      {item.query}
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-[#003366]">
                      {item.standard}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 font-medium text-[11px]">
                        {item.category || 'General'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        item.status.includes('CRS')
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-emerald-50 text-[#138808] border border-emerald-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.status.includes('CRS') ? 'bg-purple-600' : 'bg-[#138808]'}`}></span>
                        <span>{item.status}</span>
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-400 font-medium text-[11px]">
                      {item.time}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => onSelectQuery(item.query)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold transition shadow-2xs cursor-pointer"
                      >
                        <span>Re-analyze</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}
