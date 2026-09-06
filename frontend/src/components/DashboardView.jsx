import React, { useState } from 'react'
import { 
  CheckCircle2, AlertTriangle, AlertOctagon, Copy, Check, Download, 
  ExternalLink, Network, FileText, ChevronRight, Sparkles, Shield, 
  Layers, ArrowRight, BookOpen, Clock, Printer, Sliders, CheckSquare, 
  Square, Info, Award, Search, RefreshCw, ChevronDown, ChevronUp, Zap
} from 'lucide-react'

export default function DashboardView({
  result,
  query,
  onSearch,
  onViewStandardDetails,
  onViewKnowledgeGraph,
  onViewCompliance,
  onViewAudit,
  copiedClause,
  onCopyClause,
  onExportJSON,
  onPrint,
  checklist,
  setChecklist,
  selectedLanguage,
  setSelectedLanguage,
  languageConfigs
}) {
  const [localSearch, setLocalSearch] = useState(query || '')
  const [whyExpanded, setWhyExpanded] = useState(true)

  if (!result || !result.success) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#FF9933] mx-auto flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">No Analysis Available</h2>
        <p className="text-sm text-slate-500 mb-6">
          {result?.message || 'Enter a procurement requirement to generate verified BIS standards and GFR compliance.'}
        </p>
        <div className="max-w-md mx-auto flex gap-2">
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="e.g. 200 kW induction motor for sewage pumping"
            className="flex-1 px-4 py-2 text-xs rounded-xl border border-slate-300 outline-none"
          />
          <button
            onClick={() => onSearch(localSearch)}
            className="px-4 py-2 bg-[#003366] text-white text-xs font-bold rounded-xl"
          >
            Analyze
          </button>
        </div>
      </div>
    )
  }

  // 1. Safely extract primary standard and confidence
  const primary = result.primary_standard || {}
  const confidencePercent = primary.confidence_percent || Math.round((primary.confidence || 0.95) * 100)

  // 2. Safely extract parameters
  const extracted = result.extracted_parameters || {}
  const detectedDomains = result.detected_domains || []
  const productVal = extracted.product_type || primary.title || 'Standard Product / Machinery'
  const capacityVal = extracted.power || extracted.capacity || extracted.rating || 'Standard Operating Envelope'
  const applicationVal = extracted.application || 'Public Procurement / Standard Duty'
  const domainVal = detectedDomains[0]?.domain || primary.category || primary.department || 'Electrotechnical Department (ETD)'

  // 3. Safely extract QCO and Certification
  const qco = result.qco || {}
  const cert = result.certification || {}
  const isQCOMandatory = qco.applicable || qco.status === 'MANDATORY_ENFORCED' || qco.status === 'Mandatory'

  // 4. Safely extract warnings & critical superseded alerts
  const warnings = Array.isArray(result.warnings) ? result.warnings : []
  const redWarning = warnings.find(w => 
    w.level === 'RED' || 
    (w.badge && (w.badge.includes('SUPERSEDED') || w.badge.includes('OBSOLETE') || w.badge.includes('CRITICAL')))
  )

  // 5. Safely parse allied standards (dictionary format from backend)
  const alliedObj = result.allied_standards || {}
  const testingList = Array.isArray(alliedObj.testing) ? alliedObj.testing : []
  const safetyList = Array.isArray(alliedObj.safety) ? alliedObj.safety : []
  const performanceList = Array.isArray(alliedObj.performance) ? alliedObj.performance : []
  const generalList = Array.isArray(alliedObj.general) ? alliedObj.general : []

  const combinedAllied = [
    ...testingList.map(item => ({ ...item, categoryTag: 'Testing Standard', badgeBg: 'bg-blue-50 text-blue-700 border-blue-200' })),
    ...safetyList.map(item => ({ ...item, categoryTag: 'Safety Standard', badgeBg: 'bg-amber-50 text-amber-800 border-amber-200' })),
    ...performanceList.map(item => ({ ...item, categoryTag: 'Performance Rating', badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200' })),
    ...generalList.map(item => ({ ...item, categoryTag: 'Normative Reference', badgeBg: 'bg-slate-50 text-slate-700 border-slate-200' }))
  ]

  // 6. AI Explanation reasons list
  const explanations = Array.isArray(result.explanation) ? result.explanation : []
  const summaryRecommendation = result.summary_recommendation || ''
  const alternates = Array.isArray(result.alternates) ? result.alternates : []

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (localSearch.trim()) {
      onSearch(localSearch)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      
      {/* 1. TOP BAR WITH SEARCH INPUT & 3-TIER ARCHITECTURE BADGE (Panel 2 requirement) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2">
          <div className="relative flex-1 flex items-center">
            <Search className="w-4 h-4 text-[#003366] absolute left-3" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search or re-analyze requirement (e.g. 200 kW induction motor, solar PV, cement)..."
              className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/10 outline-none font-medium text-slate-800"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF9933] to-amber-600 hover:from-amber-600 hover:to-[#FF9933] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center space-x-1.5 flex-shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-analyze</span>
          </button>
        </form>

        {/* 3-Tier Architecture Badge */}
        <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs flex-shrink-0">
          <div className="flex items-center space-x-1.5 px-2 py-1 rounded-lg bg-white shadow-2xs border border-slate-100">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            <span className="font-bold text-[11px] text-[#003366]">Bhashini</span>
          </div>
          <span className="text-slate-400 font-bold">→</span>
          <div className="flex items-center space-x-1.5 px-2 py-1 rounded-lg bg-white shadow-2xs border border-slate-100">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933]"></span>
            <span className="font-bold text-[11px] text-[#003366]">Sarvam AI</span>
          </div>
          <span className="text-slate-400 font-bold">→</span>
          <div className="flex items-center space-x-1.5 px-2 py-1 rounded-lg bg-white shadow-2xs border border-slate-100">
            <span className="w-1.5 h-1.5 rounded-full bg-[#138808]"></span>
            <span className="font-bold text-[11px] text-[#003366]">BIS 234 RAG</span>
          </div>
        </div>
      </div>

      {/* 2. CRITICAL SUPERSEDED STANDARD ALERT BANNER (If officer searched for an obsolete code like IS 325) */}
      {redWarning && (
        <div className="rounded-2xl bg-red-50 border-2 border-red-500 p-5 shadow-sm animate-in slide-in-from-top duration-200">
          <div className="flex items-start space-x-3.5">
            <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <AlertOctagon className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-red-200 text-red-900">
                    {redWarning.badge || 'CRITICAL RISK: SUPERSEDED STANDARD'}
                  </span>
                  <h3 className="text-sm font-extrabold text-red-950">
                    {redWarning.title}
                  </h3>
                </div>
                <span className="text-xs font-bold text-red-700 underline">
                  GFR 2017 Non-Compliance Risk
                </span>
              </div>
              <p className="text-xs text-red-900 mt-1.5 leading-relaxed font-medium">
                {redWarning.message}
              </p>
              {redWarning.action_required && (
                <div className="mt-3 p-3 rounded-xl bg-white/90 border border-red-200 flex items-center space-x-2 text-xs">
                  <span className="font-black text-red-900 uppercase text-[10px] bg-red-100 px-2 py-0.5 rounded">
                    Action Required
                  </span>
                  <span className="font-bold text-slate-900">{redWarning.action_required}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. REQUIREMENT UNDERSTANDING (4-Card Parameter Grid matching Panel 2) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-[#003366] text-amber-400 flex items-center justify-center font-black text-xs">
              1
            </div>
            <h2 className="font-bold text-sm text-[#003366]">Requirement Understanding</h2>
            <span className="text-[10px] font-bold bg-emerald-50 text-[#138808] border border-emerald-200 px-2 py-0.5 rounded-full">
              Extracted by Sarvam AI
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Normalized Query: <strong className="text-slate-800">"{result.normalized_query || query}"</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Product Identified
            </span>
            <p className="font-bold text-xs sm:text-sm text-slate-900 leading-snug truncate" title={productVal}>
              {productVal}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Capacity / Power Rating
            </span>
            <p className="font-bold text-xs sm:text-sm text-[#003366] leading-snug truncate" title={capacityVal}>
              {capacityVal}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Application Environment
            </span>
            <p className="font-bold text-xs sm:text-sm text-slate-900 leading-snug truncate" title={applicationVal}>
              {applicationVal}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Technical Domain
            </span>
            <p className="font-bold text-xs sm:text-sm text-slate-900 leading-snug truncate" title={domainVal}>
              {domainVal}
            </p>
          </div>
        </div>
      </div>

      {/* 4. RECOMMENDED PRIMARY STANDARD CARD (Matching Panel 2) */}
      <div className="bg-white rounded-2xl border-2 border-blue-200/90 p-5 sm:p-6 shadow-sm relative overflow-hidden space-y-5">
        {/* Saffron & Green Accent Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF9933] via-amber-400 to-[#138808]"></div>

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 flex-1">
            
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono font-black text-xl sm:text-2xl text-[#003366] tracking-tight bg-blue-50 border border-blue-200 px-3 py-1 rounded-xl">
                {primary.standard_id || 'IS Standard'}
              </span>
              
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-[#138808] border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-[#138808]"></span>
                <span>{primary.status || 'Active BIS Standard'}</span>
              </span>

              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-[#FF9933] border border-amber-200">
                <Award className="w-3.5 h-3.5" />
                <span>{confidencePercent}% Match</span>
              </span>

              {isQCOMandatory && (
                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-black bg-purple-50 text-purple-700 border border-purple-200">
                  <span>Mandatory QCO Order</span>
                </span>
              )}

              {cert.popular_name && (
                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#003366] border border-blue-200">
                  <span>{cert.popular_name}</span>
                </span>
              )}
            </div>

            {/* Standard Title & Description */}
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                {primary.title || 'Official Indian Standard Specification'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                {primary.description || 'Comprehensive technical and performance specifications issued by the Bureau of Indian Standards.'}
              </p>
            </div>

            {/* "Why this standard?" Checklist & Grounded AI Reasoning */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/90 mt-4 space-y-3">
              <div 
                onClick={() => setWhyExpanded(!whyExpanded)}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <h4 className="text-xs font-bold text-[#003366] uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#138808]" />
                  Why this standard was recommended (Grounded AI Reasoning):
                </h4>
                <button className="text-slate-400 hover:text-slate-700">
                  {whyExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {whyExpanded && (
                <div className="space-y-2 pt-1 animate-in fade-in duration-150">
                  {summaryRecommendation && (
                    <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 font-semibold leading-relaxed">
                      💡 <strong>Executive Advice:</strong> {summaryRecommendation}
                    </div>
                  )}

                  <ul className="text-xs text-slate-700 space-y-1.5 pl-1">
                    {explanations.length > 0 ? (
                      explanations.map((reason, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <Check className="w-3.5 h-3.5 text-[#138808] flex-shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{reason}</span>
                        </li>
                      ))
                    ) : (
                      <>
                        <li className="flex items-start space-x-2">
                          <Check className="w-3.5 h-3.5 text-[#138808] flex-shrink-0 mt-0.5" />
                          <span>Direct technical match to capacity and equipment requirements.</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <Check className="w-3.5 h-3.5 text-[#138808] flex-shrink-0 mt-0.5" />
                          <span>Notified under Ministry Quality Control Order. Bidders without BIS License must be disqualified.</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <Check className="w-3.5 h-3.5 text-[#138808] flex-shrink-0 mt-0.5" />
                          <span>Mandatory for all GeM tenders under GFR 2017 Rule 144(i).</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons Panel */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 sm:min-w-[220px] lg:border-l lg:border-slate-200 lg:pl-6">
            <button
              onClick={onViewStandardDetails}
              className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>View Full Metadata</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={onViewKnowledgeGraph}
              className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#003366] border border-blue-200 text-xs font-bold transition cursor-pointer"
            >
              <Network className="w-4 h-4 text-[#FF9933]" />
              <span>Explore Knowledge Graph</span>
            </button>

            <button
              onClick={onViewCompliance}
              className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#138808] border border-emerald-200 text-xs font-bold transition cursor-pointer"
            >
              <Shield className="w-4 h-4 text-[#138808]" />
              <span>Compliance &amp; QCO Matrix</span>
            </button>

            <button
              onClick={onExportJSON}
              className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. GFR 2017 TENDER CLAUSE BOX (1-Click Copy with feedback) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-[#FF9933]" />
            <h3 className="font-bold text-sm text-[#003366]">
              Mandatory GFR 2017 Tender Clause (Ready to Paste into GeM)
            </h3>
          </div>
          <button
            onClick={onCopyClause}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-[#003366] border border-amber-200 text-xs font-bold transition cursor-pointer"
          >
            {copiedClause ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#138808]" />
                <span className="text-[#138808]">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#FF9933]" />
                <span>Copy Tender Clause</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-slate-900 text-slate-100 p-4 sm:p-5 rounded-xl font-mono text-xs leading-relaxed overflow-x-auto border border-slate-800 whitespace-pre-wrap selection:bg-amber-400 selection:text-slate-950">
          {result.tender_clause || `Tender Clause: The supplied equipment must comply with Indian Standard ${primary.standard_id} and mandatory QCO requirements.`}
        </div>
      </div>

      {/* 6. ALLIED STANDARDS & TESTING MATRIX (Panels 4 & 6) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-[#003366]" />
            <h3 className="font-bold text-sm text-[#003366]">
              Allied Standards &amp; Mandatory Testing Matrix ({combinedAllied.length} Standards)
            </h3>
          </div>
          <button
            onClick={onViewKnowledgeGraph}
            className="text-xs text-[#003366] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>View Full Topology Graph</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {combinedAllied.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs">
            No allied standards registered for this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {combinedAllied.slice(0, 6).map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${item.badgeBg}`}>
                      {item.categoryTag}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-800">
                      {item.id || item.standard_id}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 line-clamp-2 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    Relationship: <span className="font-medium text-slate-700">{item.relationship || 'Normative reference'}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7. ALTERNATE STANDARDS EVALUATED */}
      {alternates.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-[#003366]" />
            <h3 className="font-bold text-sm text-[#003366]">
              Other Evaluated Candidate Standards ({alternates.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {alternates.slice(0, 4).map((alt, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="font-mono font-bold text-[#003366] block">{alt.standard_id}</span>
                <p className="font-medium text-slate-800 line-clamp-1 mt-0.5">{alt.title}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2">
                  <span>{alt.category}</span>
                  <span className="font-bold text-[#138808]">{Math.round((alt.confidence || 0.9) * 100)}% Match</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
