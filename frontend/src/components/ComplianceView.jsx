import React, { useState } from 'react'
import { 
  ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle2, 
  ExternalLink, ArrowLeft, CheckSquare, Square, FileText, 
  Scale, ShieldAlert, Award, ChevronRight, HelpCircle
} from 'lucide-react'

export default function ComplianceView({
  result,
  checklist,
  setChecklist,
  onBack,
  onViewStandardDetails
}) {
  const primary = result?.primary_standard || {
    standard_id: 'IS 12615:2018',
    title: 'Energy Efficient Three-Phase Induction Motors',
  }

  const qco = result?.qco || {
    applicable: true,
    order_title: 'Electric Motors (Quality Control) Order, 2024',
    badge: 'Mandatory QCO Applicable',
    details: 'Compulsory certification under Section 16 of the BIS Act, 2016.',
    issuing_ministry: 'Ministry of Commerce and Industry (DPIIT)',
    effective_date: '2024-01-01'
  }

  const cert = result?.certification || {
    popular_name: 'ISI Mark',
    scheme: 'Scheme-I / ISI Mark',
    description: 'Product Certification Scheme involving factory surveillance audits and routine test records.',
    statutory_basis: 'BIS Act 2016, Schedule II, Scheme I',
    lead_time_weeks: 8
  }

  const warnings = Array.isArray(result?.warnings) ? result.warnings : []

  const toggleItem = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const allCompliant = Object.values(checklist).every(Boolean)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Breadcrumbs & Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#003366] hover:text-[#002244] bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs hover:bg-slate-50 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Analysis</span>
        </button>

        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <span>Home</span>
          <span>&gt;</span>
          <span>Compliance &amp; QCO Matrix</span>
          <span>&gt;</span>
          <span className="font-bold text-[#003366]">{primary.standard_id}</span>
        </div>
      </div>

      {/* 2. Top Title & Overall Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#003366] tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#138808]" />
            Compliance, QCO Mandate &amp; Certification Matrix
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Statutory obligations under Section 16 of the Bureau of Indian Standards Act, 2016 and General Financial Rules (GFR) 2017.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
            allCompliant 
              ? 'bg-emerald-50 text-[#138808] border border-emerald-300' 
              : 'bg-amber-50 text-amber-800 border border-amber-300'
          }`}>
            <span className={`w-2 h-2 rounded-full ${allCompliant ? 'bg-[#138808]' : 'bg-[#FF9933]'}`}></span>
            <span>{allCompliant ? '100% GFR Audit Ready' : 'Verification In Progress'}</span>
          </span>
        </div>
      </div>

      {/* 3. Panel 5 - 3 Clean Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: QCO Applicability */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="h-1 bg-[#FF9933] absolute top-0 left-0 right-0"></div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Legal Status
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-red-100 text-red-800">
                {qco.applicable ? 'Mandatory Order' : 'Voluntary Standard'}
              </span>
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">
              {qco.order_title || qco.badge || 'Mandatory Quality Control Order'}
            </h3>
            <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
              {qco.details || 'Under Section 16 of BIS Act, 2016, no person shall manufacture, import, distribute, or sell without certified standard mark.'}
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 text-xs space-y-1 text-slate-600">
            <p><strong>Issuing Authority:</strong> {qco.issuing_ministry || 'Ministry of Commerce and Industry'}</p>
            <p><strong>Enforcement Status:</strong> {qco.badge || 'Enforced'}</p>
          </div>
        </div>

        {/* Card 2: Certification Scheme */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="h-1 bg-[#003366] absolute top-0 left-0 right-0"></div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Certification Route
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-100 text-[#003366]">
                {cert.popular_name || 'ISI Mark'}
              </span>
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">
              {cert.scheme || 'Product Certification Scheme'}
            </h3>
            <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
              {cert.description || 'Requires factory surveillance, designated in-house laboratory testing, and certified license number on product mark.'}
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 text-xs space-y-1 text-slate-600">
            <p><strong>Statutory Basis:</strong> {cert.statutory_basis || 'BIS Act 2016'}</p>
            <p><strong>Lead Time for Testing:</strong> ~{cert.lead_time_weeks || 8} weeks</p>
          </div>
        </div>

        {/* Card 3: Obsolescence / Replacement Status */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="h-1 bg-[#138808] absolute top-0 left-0 right-0"></div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Standard Lifecycle
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-[#138808]">
                {primary.status || 'Active & Current'}
              </span>
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">
              {primary.standard_id}
            </h3>
            <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
              {primary.supersedes ? (
                <>Strictly supersedes <strong>{primary.supersedes}</strong>. Any bids citing the withdrawn code must be rejected under GFR Rule 144(i).</>
              ) : (
                'Current and actively enforceable standard across Central and State procurement.'
              )}
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 text-xs space-y-1 text-slate-600">
            <p><strong>Replaces:</strong> {primary.supersedes || 'None (Original standard)'}</p>
            <p><strong>Category:</strong> {primary.category || 'Standard Machinery'}</p>
          </div>
        </div>

      </div>

      {/* 4. Warnings and Alert Items from Engine */}
      {warnings.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Regulatory Evaluation Alerts &amp; Findings
          </h3>
          <div className="space-y-2">
            {warnings.map((w, idx) => (
              <div 
                key={idx} 
                className={`p-4 rounded-xl border flex items-start space-x-3 text-xs ${
                  w.level === 'RED' 
                    ? 'bg-red-50/80 border-red-300 text-red-950' 
                    : w.level === 'YELLOW' 
                    ? 'bg-amber-50/80 border-amber-300 text-amber-950' 
                    : 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                }`}
              >
                {w.level === 'RED' ? (
                  <AlertOctagon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                ) : w.level === 'YELLOW' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-[#138808] flex-shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">{w.title}</span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-white shadow-2xs">
                      {w.badge}
                    </span>
                  </div>
                  <p className="leading-relaxed">{w.message}</p>
                  {w.action_required && (
                    <p className="text-[11px] font-semibold pt-1">
                      <strong>Mandatory Action:</strong> {w.action_required}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Panel 5 - Interactive Tender Drafting Verification Checklist (GFR 2017) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-sm text-[#003366] flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-[#138808]" />
              Interactive GFR 2017 Procurement Verification Checklist
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verify compliance before publishing tender on GeM (Rule 144(i) of General Financial Rules, 2017).
            </p>
          </div>
          
          <button
            onClick={() => {
              setChecklist({
                primary: true,
                testing: true,
                safety: true,
                cert: true,
                qco: true,
                version: true,
                installation: true
              })
            }}
            className="text-xs text-[#003366] hover:underline font-semibold cursor-pointer"
          >
            Select All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div 
            onClick={() => toggleItem('primary')}
            className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start space-x-3 ${
              checklist.primary ? 'bg-emerald-50/50 border-emerald-300' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="mt-0.5">
              {checklist.primary ? (
                <CheckSquare className="w-4 h-4 text-[#138808]" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Current Primary Standard Specified</h4>
              <p className="text-[11px] text-slate-500">
                Tender specifies {primary.standard_id} explicitly without restrictive brand names.
              </p>
            </div>
          </div>

          <div 
            onClick={() => toggleItem('testing')}
            className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start space-x-3 ${
              checklist.testing ? 'bg-emerald-50/50 border-emerald-300' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="mt-0.5">
              {checklist.testing ? (
                <CheckSquare className="w-4 h-4 text-[#138808]" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Normative Testing Standards Included</h4>
              <p className="text-[11px] text-slate-500">
                Tender cites accredited laboratory test certificates from NABL/BIS testing labs.
              </p>
            </div>
          </div>

          <div 
            onClick={() => toggleItem('safety')}
            className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start space-x-3 ${
              checklist.safety ? 'bg-emerald-50/50 border-emerald-300' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="mt-0.5">
              {checklist.safety ? (
                <CheckSquare className="w-4 h-4 text-[#138808]" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Mandatory BIS Certification / ISI Mark Clause</h4>
              <p className="text-[11px] text-slate-500">
                Bid document requires valid BIS License ({cert.popular_name || 'ISI Mark'}) on the date of bid submission.
              </p>
            </div>
          </div>

          <div 
            onClick={() => toggleItem('qco')}
            className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start space-x-3 ${
              checklist.qco ? 'bg-emerald-50/50 border-emerald-300' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="mt-0.5">
              {checklist.qco ? (
                <CheckSquare className="w-4 h-4 text-[#138808]" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Statutory QCO Order Compliance</h4>
              <p className="text-[11px] text-slate-500">
                Confirmed that the procured item aligns with {qco.order_title || 'mandatory Ministry QCO'}.
              </p>
            </div>
          </div>

          <div 
            onClick={() => toggleItem('version')}
            className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start space-x-3 ${
              checklist.version ? 'bg-emerald-50/50 border-emerald-300' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="mt-0.5">
              {checklist.version ? (
                <CheckSquare className="w-4 h-4 text-[#138808]" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Zero Obsolete Standards (No Superseded Codes)</h4>
              <p className="text-[11px] text-slate-500">
                Audited tender schedules to ensure zero withdrawn standards (e.g. IS 325) are cited.
              </p>
            </div>
          </div>

          <div 
            onClick={() => toggleItem('installation')}
            className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start space-x-3 ${
              checklist.installation ? 'bg-emerald-50/50 border-emerald-300' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="mt-0.5">
              {checklist.installation ? (
                <CheckSquare className="w-4 h-4 text-[#138808]" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Commissioning &amp; Earthing Protocol</h4>
              <p className="text-[11px] text-slate-500">
                Installation aligns with Central Electricity Authority and IS safety standards.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
