import React from 'react'
import { 
  Search, ArrowRight, Zap, ShieldCheck, Languages, CheckCircle2, 
  Sparkles, FileText, ChevronRight, BarChart3, Building2, Laptop, 
  Sun, Wrench, ShieldAlert, Layers, ArrowUpRight
} from 'lucide-react'

export default function LandingView({
  query,
  setQuery,
  onSearch,
  selectedLanguage,
  setSelectedLanguage,
  languageConfigs,
  loading
}) {
  const currentLang = languageConfigs[selectedLanguage] || languageConfigs.en

  const handlePresetClick = (presetQuery) => {
    setQuery(presetQuery)
    onSearch(presetQuery)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query)
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-100px)] flex flex-col justify-between overflow-hidden skyline-watermark">
      
      {/* Subtle decorative radial gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-12 text-center">
        
        {/* Official Slogan Pill */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 shadow-xs mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <span className="w-2 h-2 rounded-full bg-[#FF9933]"></span>
          <span className="text-xs font-bold text-[#003366] tracking-wide">
            Government of India • BIS — AI for a Better Bharat
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#003366] tracking-tight leading-tight sm:leading-tight mb-4">
          Smarter Procurement Starts with the{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] via-amber-600 to-[#138808]">
            Right Standards
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-3xl mx-auto text-slate-600 text-sm sm:text-base lg:text-lg mb-8 leading-relaxed font-normal">
          {currentLang.inputSubtitle || 
            "Describe your tender requirements in natural language. SURE uses BIS-grounded AI to identify mandatory standards, QCO compliance, testing requirements, and generate compliant tender clauses."}
        </p>

        {/* Bhashini Language Selector Tabs */}
        <div className="flex items-center justify-center space-x-2 mb-3">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Languages className="w-3.5 h-3.5 text-[#003366]" />
            Bhashini Input:
          </span>
          {Object.values(languageConfigs).map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLanguage(lang.code)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer flex items-center space-x-1 ${
                selectedLanguage === lang.code
                  ? 'bg-[#003366] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.native}</span>
            </button>
          ))}
        </div>

        {/* Search Box Form */}
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mb-6 relative">
          <div className="relative flex items-center rounded-2xl bg-white border-2 border-slate-300 focus-within:border-[#003366] focus-within:ring-4 focus-within:ring-[#003366]/10 shadow-lg shadow-slate-200/50 transition-all p-1.5 sm:p-2">
            <div className="pl-3 sm:pl-4 text-slate-400">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-[#003366]" />
            </div>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={currentLang.placeholder}
              className="w-full px-3 py-2.5 sm:py-3 text-sm sm:text-base text-slate-800 bg-transparent outline-none placeholder:text-slate-400 font-medium"
              disabled={loading}
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600 mr-2 text-xs font-bold"
              >
                Clear
              </button>
            )}

            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="flex-shrink-0 inline-flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#FF9933] to-amber-600 hover:from-amber-600 hover:to-[#FF9933] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>{currentLang.analyzeBtn || "Analyze"}</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </form>

        {/* Example Query Chips (Try:) */}
        <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-2 mb-12">
          <span className="text-xs font-bold text-slate-500 mr-1">Try examples:</span>
          {(currentLang.presets || []).map((preset) => {
            const Icon = preset.icon || Zap
            return (
              <button
                key={preset.id}
                onClick={() => handlePresetClick(preset.query)}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-white/90 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-xs text-slate-700 hover:text-[#003366] font-medium transition shadow-2xs cursor-pointer"
              >
                <Icon className="w-3.5 h-3.5 text-[#FF9933]" />
                <span>{preset.title}</span>
              </button>
            )
          })}
        </div>

        {/* 4 Feature Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16">
          <div className="p-4 rounded-xl bg-white/90 border border-slate-200/90 shadow-2xs text-left hover:border-[#FF9933]/50 transition group">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#FF9933] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <Zap className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 mb-0.5">AI-Powered Matching</h3>
            <p className="text-[11px] text-slate-500 leading-snug">
              Sarvam AI parameterizes requirements into structured engineering specs.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/90 border border-slate-200/90 shadow-2xs text-left hover:border-emerald-300 transition group">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#138808] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 mb-0.5">BIS Verified</h3>
            <p className="text-[11px] text-slate-500 leading-snug">
              Directly grounded in 234+ Bureau of Indian Standards with full normative links.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/90 border border-slate-200/90 shadow-2xs text-left hover:border-blue-300 transition group">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#003366] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <Languages className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 mb-0.5">Multilingual Access</h3>
            <p className="text-[11px] text-slate-500 leading-snug">
              Digital India Bhashini enables native queries in Hindi, Tamil, and Marathi.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/90 border border-slate-200/90 shadow-2xs text-left hover:border-purple-300 transition group">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 mb-0.5">Government Ready</h3>
            <p className="text-[11px] text-slate-500 leading-snug">
              Complies with GFR 2017 Rule 144(i) and mandatory Quality Control Orders.
            </p>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="max-w-4xl mx-auto pt-6 border-t border-slate-200/80">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
            How SURE Regulatory Engine Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-white/70 border border-slate-200/70">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#003366] text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <div>
                <h4 className="font-bold text-xs text-slate-900 mb-1">State Your Requirement</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Enter product specs or tender description in English or regional languages.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-white/70 border border-slate-200/70">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FF9933] text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <div>
                <h4 className="font-bold text-xs text-slate-900 mb-1">AI Grounding & QCO Lookup</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Engine matches current BIS standards, flags obsolete codes, and pulls QCO orders.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-white/70 border border-slate-200/70">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#138808] text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              <div>
                <h4 className="font-bold text-xs text-slate-900 mb-1">Get GFR Tender Clause</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Export ready-to-use procurement clauses with mandatory testing and certification.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Stats Ticker */}
      <div className="bg-[#001D3D] text-white py-4 border-t border-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-around gap-4 text-center">
          <div>
            <p className="text-xl sm:text-2xl font-black text-[#FF9933]">234+</p>
            <p className="text-[11px] text-slate-300 font-medium">Active BIS Standards</p>
          </div>
          <div className="hidden sm:block w-px h-8 bg-blue-900"></div>
          <div>
            <p className="text-xl sm:text-2xl font-black text-white">48</p>
            <p className="text-[11px] text-slate-300 font-medium">Mandatory QCO Orders</p>
          </div>
          <div className="hidden sm:block w-px h-8 bg-blue-900"></div>
          <div>
            <p className="text-xl sm:text-2xl font-black text-[#138808]">100%</p>
            <p className="text-[11px] text-slate-300 font-medium">GFR 2017 Grounded</p>
          </div>
          <div className="hidden sm:block w-px h-8 bg-blue-900"></div>
          <div>
            <p className="text-xl sm:text-2xl font-black text-blue-300">4</p>
            <p className="text-[11px] text-slate-300 font-medium">Regional Languages</p>
          </div>
        </div>
      </div>

    </div>
  )
}
