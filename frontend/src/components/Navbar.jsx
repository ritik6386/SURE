import React, { useState } from 'react'
import { 
  Shield, Languages, User, Menu, X, Bell, ExternalLink, 
  Search, BarChart3, FileText, CheckCircle2, BookOpen, Clock, Network
} from 'lucide-react'

export default function Navbar({ 
  activeNav, 
  setActiveNav, 
  selectedLanguage, 
  setSelectedLanguage, 
  languageConfigs,
  onOpenLogin,
  onOpenBenchmark,
  unreadAlertsCount = 2
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)

  const navItems = [
    { id: 'home', label: 'Home', icon: Search },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'standards', label: 'Standards Directory', icon: BookOpen },
    { id: 'graph', label: 'Knowledge Graph', icon: Network },
    { id: 'compliance', label: 'Compliance & QCO', icon: CheckCircle2 },
    { id: 'audit', label: 'Document Auditor', icon: FileText },
    { id: 'history', label: 'Search History', icon: Clock }
  ]

  const currentLang = languageConfigs[selectedLanguage] || languageConfigs.en

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      {/* 1. Official Tricolor Top Header Ribbon */}
      <div className="h-1 w-full flex">
        <div className="h-full flex-1 bg-[#FF9933]"></div>
        <div className="h-full flex-1 bg-white"></div>
        <div className="h-full flex-1 bg-[#138808]"></div>
      </div>

      {/* 2. Top Authority Sub-header (Govt. of India / BIS Notice) */}
      <div className="bg-[#002244] text-white text-[11px] py-1 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-200 flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-[#138808]"></span>
              भारत सरकार | Government of India
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300 hidden md:inline">Bureau of Indian Standards (BIS) • MeitY Bhashini</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-300 text-[10px]">
            <span className="hidden sm:inline bg-blue-900/60 px-2 py-0.5 rounded border border-blue-800 text-amber-300 font-medium">
              National Portal for Public Procurement Standards
            </span>
            <button 
              onClick={onOpenBenchmark}
              className="text-amber-300 hover:text-amber-200 font-semibold underline underline-offset-2 flex items-center gap-1 cursor-pointer"
            >
              <span>Audit Benchmark (26 Tests)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Brand & Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Brand Identity */}
          <div 
            onClick={() => setActiveNav('home')}
            className="flex items-center space-x-3 cursor-pointer select-none group"
          >
            <div className="relative flex items-center">
              <img 
                src="/sure-logo.png" 
                alt="SURE Logo" 
                className="h-10 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105 duration-200"
                onError={(e) => {
                  e.target.style.display = 'none'
                  if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'
                }}
              />
              <div 
                style={{ display: 'none' }} 
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#003366] to-[#002244] items-center justify-center text-white font-black text-lg shadow-sm"
              >
                SURE
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#003366]">
                  SURE
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-50 text-[#FF9933] border border-amber-200">
                  AI Regulatory Engine
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-none -mt-0.5">
                Standards for Unified Regulatory Engine • GeM & GFR 2017 Ready
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map(item => {
              const Icon = item.icon
              const isActive = activeNav === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all duration-150 cursor-pointer ${
                    isActive 
                      ? 'bg-[#003366] text-white shadow-xs' 
                      : 'text-slate-600 hover:text-[#003366] hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Right Action Controls: Language Switcher, Alerts & Officer Login */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Digital India Bhashini Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition cursor-pointer"
                title="Change Regional Language (Digital India Bhashini)"
              >
                <Languages className="w-3.5 h-3.5 text-[#003366]" />
                <span className="hidden sm:inline font-medium">{currentLang.flag} {currentLang.native}</span>
                <span className="sm:hidden font-bold uppercase">{currentLang.code}</span>
              </button>

              {langDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setLangDropdownOpen(false)}
                >
                  <div className="px-3 py-1 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Digital India Bhashini
                  </div>
                  {Object.values(languageConfigs).map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLanguage(lang.code)
                        setLangDropdownOpen(false)
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer transition ${
                        selectedLanguage === lang.code ? 'bg-amber-50/60 text-[#003366] font-bold' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{lang.flag}</span>
                        <div>
                          <p className="font-semibold leading-tight">{lang.native}</p>
                          <p className="text-[10px] text-slate-400 leading-tight">{lang.name}</p>
                        </div>
                      </div>
                      {selectedLanguage === lang.code && (
                        <span className="w-2 h-2 rounded-full bg-[#138808]"></span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Officer Profile / Login Button */}
            <button
              onClick={onOpenLogin}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Officer Login</span>
              <span className="md:hidden">Login</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden pt-3 pb-2 border-t border-slate-200 mt-2 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon
              const isActive = activeNav === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id)
                    setMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
                    isActive 
                      ? 'bg-[#003366] text-white' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </header>
  )
}
