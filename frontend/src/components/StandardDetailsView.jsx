import React, { useState } from 'react'
import { 
  ArrowLeft, Download, Bookmark, Share2, Printer, CheckCircle2, 
  AlertTriangle, FileText, Network, Shield, BookOpen, ExternalLink, 
  Layers, Check, Copy, HelpCircle, ChevronRight, Scale
} from 'lucide-react'

export default function StandardDetailsView({
  standard,
  result,
  onBack,
  onViewGraph,
  onViewCompliance,
  onPrint
}) {
  const [activeSubTab, setActiveSubTab] = useState('overview')
  const [copiedId, setCopiedId] = useState(false)

  // Use primary standard from result if standard prop is not passed directly
  const data = standard || result?.primary_standard || {
    standard_id: 'IS 12615:2018',
    title: 'Energy Efficient Three-Phase Induction Motors (IE Code)',
    category: 'Electrical / Industrial Machinery',
    department: 'Electrotechnical Department (ETD 15)',
    year: '2018',
    status: 'Active',
    supersedes: 'IS 325:1996',
    ics_code: '29.160.30',
    description: 'Line operated three-phase cage induction motors efficiency classes and performance specification.'
  }

  const qco = result?.qco || {
    applicable: true,
    order_title: 'Electric Motors (Quality Control) Order',
    issuing_ministry: 'Ministry of Commerce and Industry (DPIIT)',
    badge: 'Mandatory QCO Applicable'
  }

  const cert = result?.certification || {
    popular_name: 'ISI Mark',
    scheme: 'Scheme-I / ISI Mark',
    statutory_basis: 'BIS Act 2016, Schedule II, Scheme I'
  }

  // Allied standards
  const alliedObj = result?.allied_standards || {}
  const testingList = Array.isArray(alliedObj.testing) ? alliedObj.testing : []
  const safetyList = Array.isArray(alliedObj.safety) ? alliedObj.safety : []
  const performanceList = Array.isArray(alliedObj.performance) ? alliedObj.performance : []

  const handleCopyId = () => {
    navigator.clipboard.writeText(data.standard_id)
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Breadcrumbs & Back Navigation */}
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
          <span>Standards Directory</span>
          <span>&gt;</span>
          <span className="font-bold text-[#003366]">{data.standard_id}</span>
        </div>
      </div>

      {/* 2. Standard Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative overflow-hidden space-y-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono font-black text-2xl text-[#003366] bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">
                {data.standard_id}
              </span>
              <button
                onClick={handleCopyId}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                title="Copy Standard ID"
              >
                {copiedId ? <Check className="w-4 h-4 text-[#138808]" /> : <Copy className="w-4 h-4" />}
              </button>
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-[#138808] border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-[#138808]"></span>
                <span>{data.status || 'Active BIS Standard'}</span>
              </span>
              {qco.applicable && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                  {qco.badge || 'Mandatory QCO Order'}
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
              {data.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-4xl leading-relaxed">
              {data.description}
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap sm:flex-nowrap md:flex-col gap-2 min-w-[200px]">
            <button 
              onClick={onPrint}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Specification</span>
            </button>
            <button 
              onClick={onViewGraph}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#003366] border border-blue-200 text-xs font-bold transition cursor-pointer"
            >
              <Network className="w-4 h-4 text-[#FF9933]" />
              <span>Relationship Graph</span>
            </button>
            <button 
              onClick={onPrint}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Specification</span>
            </button>
          </div>
        </div>

        {/* Sub-tab Bar */}
        <div className="flex border-b border-slate-200 -mb-2 space-x-6 text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`pb-3 border-b-2 transition cursor-pointer ${
              activeSubTab === 'overview'
                ? 'border-[#003366] text-[#003366]'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Overview &amp; Specifications
          </button>
          <button
            onClick={() => setActiveSubTab('normative')}
            className={`pb-3 border-b-2 transition cursor-pointer ${
              activeSubTab === 'normative'
                ? 'border-[#003366] text-[#003366]'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Normative Cross-References ({testingList.length + safetyList.length + performanceList.length})
          </button>
        </div>
      </div>

      {/* 3. Panel 3 - Official Standard Metadata Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Table in Left 2 Columns */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-[#003366]" />
            <h2 className="font-bold text-sm text-[#003366]">Official BIS Standard Metadata</h2>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 text-xs">
            <table className="w-full text-left divide-y divide-slate-200">
              <tbody className="divide-y divide-slate-200 bg-white">
                <tr className="bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-500 w-1/3">Standard Number</td>
                  <td className="px-4 py-3 font-mono font-bold text-[#003366]">{data.standard_id}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-500">Full Title</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{data.title}</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-500">BIS Sectional Department</td>
                  <td className="px-4 py-3 text-slate-800">{data.department || data.category || 'Electrotechnical Department (ETD)'}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-500">Year / Revision</td>
                  <td className="px-4 py-3 text-slate-800">{data.year || 'Current'}</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-500">Current Status</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center space-x-1 text-xs font-bold text-[#138808]">
                      <span className="w-2 h-2 rounded-full bg-[#138808]"></span>
                      <span>{data.status || 'Active & Enforceable'}</span>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-500">Replaces / Supersedes</td>
                  <td className="px-4 py-3 font-medium text-red-700 bg-red-50/40">
                    {data.supersedes || data.replaces || 'None (Original Specification)'}
                  </td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-500">ICS Classification</td>
                  <td className="px-4 py-3 font-mono text-slate-800">{data.ics_code || '29.160.30'}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-500">Certification Scheme</td>
                  <td className="px-4 py-3 font-semibold text-[#003366]">{cert.popular_name || cert.scheme || 'Scheme-I (ISI Mark)'}</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-500">Mandatory QCO Order</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{qco.order_title || qco.badge || 'Mandatory Quality Control Order'}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-500">GFR Rule Compliance</td>
                  <td className="px-4 py-3 font-bold text-[#138808]">GFR 2017 Rule 144(i) Mandatory</td>
                </tr>
              </tbody>
            </table>
          </div>

          {activeSubTab === 'normative' && (
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-xs text-[#003366]">Normative References &amp; Testing Specifications</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {testingList.map((t, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-blue-50/60 border border-blue-200">
                    <span className="font-mono font-bold text-[#003366]">{t.id || t.standard_id}</span>
                    <p className="text-slate-700 text-[11px] font-medium mt-0.5">{t.title}</p>
                    <span className="text-[10px] text-blue-700 font-bold uppercase mt-1 block">Testing Method</span>
                  </div>
                ))}
                {safetyList.map((s, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-amber-50/60 border border-amber-200">
                    <span className="font-mono font-bold text-amber-900">{s.id || s.standard_id}</span>
                    <p className="text-slate-700 text-[11px] font-medium mt-0.5">{s.title}</p>
                    <span className="text-[10px] text-amber-800 font-bold uppercase mt-1 block">Safety Protocol</span>
                  </div>
                ))}
                {performanceList.map((p, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200">
                    <span className="font-mono font-bold text-[#138808]">{p.id || p.standard_id}</span>
                    <p className="text-slate-700 text-[11px] font-medium mt-0.5">{p.title}</p>
                    <span className="text-[10px] text-[#138808] font-bold uppercase mt-1 block">Performance Standard</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions & Officer Toolkit in Right Column */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
              Procurement Officer Toolkit
            </h3>

            <button 
              onClick={onViewCompliance}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition group cursor-pointer text-left"
            >
              <div className="flex items-center space-x-3">
                <Shield className="w-4 h-4 text-[#138808]" />
                <div>
                  <h4 className="font-bold text-xs text-slate-800 group-hover:text-[#003366]">QCO Compliance Check</h4>
                  <p className="text-[11px] text-slate-500">Verify gazette enforcement date</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#003366]" />
            </button>

            <button 
              onClick={onViewGraph}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 transition group cursor-pointer text-left"
            >
              <div className="flex items-center space-x-3">
                <Network className="w-4 h-4 text-[#FF9933]" />
                <div>
                  <h4 className="font-bold text-xs text-slate-800 group-hover:text-[#003366]">Explore Topology Graph</h4>
                  <p className="text-[11px] text-slate-500">View testing &amp; safety parents</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#003366]" />
            </button>

            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
              <h4 className="font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-[#FF9933]" />
                GeM Tender Drafting Note
              </h4>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                When drafting tender parameters on the Government e-Marketplace (GeM), always mandate compliance with {data.standard_id} and accredited third-party test reports.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
