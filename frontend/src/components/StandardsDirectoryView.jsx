import React, { useState, useEffect } from 'react'
import { 
  BookOpen, Search, Filter, ArrowRight, ArrowLeft, 
  CheckCircle2, Shield, RefreshCw, ExternalLink 
} from 'lucide-react'

export default function StandardsDirectoryView({
  standardsList,
  stdLoading,
  onFetchStandards,
  onSelectStandard,
  onBack
}) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  const categories = [
    { id: '', label: 'All Sectors' },
    { id: 'Electrical', label: 'Electrical & Power' },
    { id: 'Solar', label: 'Solar & Renewables' },
    { id: 'Electronics', label: 'Electronics & IT' },
    { id: 'Civil', label: 'Civil & Construction' },
    { id: 'Mechanical', label: 'Mechanical & Piping' },
    { id: 'Medical', label: 'Healthcare & Medical' }
  ]

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    onFetchStandards(search, category)
  }

  const handleCategoryChange = (cat) => {
    setCategory(cat)
    onFetchStandards(search, cat)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#003366] tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#FF9933]" />
            National Standards Directory (234+ BIS Standards)
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Browse, search, and verify official Indian Standards, mandatory QCO notifications, and normative testing specifications.
          </p>
        </div>

        <button
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#003366] hover:text-[#002244] bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs hover:bg-slate-50 transition cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Analysis</span>
        </button>
      </div>

      {/* 2. Search & Category Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1 flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by IS code or keyword (e.g. IS 12615, solar module, cement, pipe)..."
              className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/10 outline-none font-medium"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center space-x-1.5"
          >
            <span>Search</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </form>

        {/* Sector Filter Chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                category === cat.id
                  ? 'bg-[#003366] text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Standards List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {stdLoading ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#003366]" />
            <p className="text-xs font-semibold">Loading standards catalog from BIS RAG engine...</p>
          </div>
        ) : standardsList.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <BookOpen className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No matching Indian Standards found</p>
            <p className="text-xs text-slate-400 mt-0.5">Try searching with a broader keyword or different category filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 font-bold text-slate-600">
                <tr>
                  <th className="px-5 py-3.5">Standard Number</th>
                  <th className="px-5 py-3.5">Title &amp; Scope</th>
                  <th className="px-5 py-3.5">Sector</th>
                  <th className="px-5 py-3.5">Year</th>
                  <th className="px-5 py-3.5">Mandatory QCO</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {standardsList.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-4 font-mono font-bold text-[#003366] whitespace-nowrap">
                      {item.standard_id}
                    </td>
                    <td className="px-5 py-4 max-w-md">
                      <p className="font-semibold text-slate-900 leading-snug">{item.title}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.description}</p>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 font-medium text-[11px] text-slate-700">
                        {item.category || 'General'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600 whitespace-nowrap">
                      {item.year || 'Current'}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {item.qco_order || item.is_mandatory ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          <span>Mandatory QCO</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Voluntary / GFR Standard</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onSelectStandard(item)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold transition shadow-2xs cursor-pointer"
                      >
                        <span>View Details</span>
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
