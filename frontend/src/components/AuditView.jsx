import React, { useState, useRef } from 'react'
import { 
  FileUp, Upload, AlertTriangle, AlertOctagon, CheckCircle2, 
  FileText, ArrowLeft, Download, RefreshCw, Layers, ShieldAlert, 
  Check, Copy, Sparkles, BookOpen, ExternalLink, ChevronDown, ChevronUp, Scale
} from 'lucide-react'

export default function AuditView({
  docResult,
  docLoading,
  docError,
  sampleDocs,
  uploadMethod,
  setUploadMethod,
  pastedText,
  setPastedText,
  onUploadFile,
  onAnalyzePastedText,
  onLoadSample,
  onBack
}) {
  const [dragOver, setDragOver] = useState(false)
  const [expandedItem, setExpandedItem] = useState(null)
  const fileInputRef = useRef(null)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUploadFile(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      onUploadFile(e.target.files[0])
    }
  }

  const summary = docResult?.summary || {}
  const evaluatedItems = Array.isArray(docResult?.evaluated_items) ? docResult.evaluated_items : []
  const hasSuperseded = (summary.superseded_flags || 0) > 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#003366] tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#FF9933]" />
            Tender &amp; DPR Document Compliance Auditor
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Upload tender notices, DPRs, or BoQ files. SURE automatically decomposes technical clauses, audits cited BIS standards, detects obsolete codes, and regenerates compliant clauses.
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

      {/* 2. Pre-loaded Sample Tenders for Instant Testing */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <span className="text-xs font-bold text-slate-500 mr-2 block sm:inline mb-2 sm:mb-0">
          Load Pre-built Audit Scenarios:
        </span>
        <div className="flex flex-wrap gap-2">
          {sampleDocs && sampleDocs.length > 0 ? (
            sampleDocs.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => onLoadSample(sample)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-xs text-slate-700 font-semibold transition cursor-pointer"
              >
                {sample.filename.includes('Obsolete') ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-[#003366]" />
                )}
                <span>{sample.title || sample.filename}</span>
              </button>
            ))
          ) : (
            <button
              onClick={() => onLoadSample({
                title: 'Water Supply Tender (Contains Obsolete IS 325)',
                filename: 'sample_water_supply_tender.txt',
                content: 'Supply, installation and testing of 200 kW Three Phase Induction Motors conforming to IS 325:1996 for intake pump house.'
              })}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-300 text-xs text-slate-700 font-semibold transition cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
              <span>Water Supply Tender (Contains Obsolete IS 325)</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Upload or Paste Input Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        {/* Toggle Tabs */}
        <div className="flex border-b border-slate-200 mb-2 space-x-6 text-xs font-bold">
          <button
            onClick={() => setUploadMethod('file')}
            className={`pb-3 border-b-2 transition cursor-pointer flex items-center space-x-2 ${
              uploadMethod === 'file'
                ? 'border-[#003366] text-[#003366]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Tender Document (PDF / DOCX / TXT)</span>
          </button>
          <button
            onClick={() => setUploadMethod('paste')}
            className={`pb-3 border-b-2 transition cursor-pointer flex items-center space-x-2 ${
              uploadMethod === 'paste'
                ? 'border-[#003366] text-[#003366]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Paste Technical Specifications Text</span>
          </button>
        </div>

        {uploadMethod === 'file' ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition ${
              dragOver 
                ? 'border-[#FF9933] bg-amber-50/50' 
                : 'border-slate-300 hover:border-[#003366] bg-slate-50/50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".pdf,.docx,.txt,.csv,.md"
              className="hidden"
            />
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-[#003366] mx-auto flex items-center justify-center mb-3 shadow-xs">
              <FileUp className="w-6 h-6 text-[#FF9933]" />
            </div>
            <p className="font-bold text-sm text-slate-800">
              Drag &amp; drop your tender notice, DPR, or BoQ document, or <span className="text-[#003366] underline">browse files</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports .PDF, .DOCX, and .TXT documents (Max 25MB)
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <textarea
              rows={5}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste tender technical specifications, equipment schedule, or BoQ text here..."
              className="w-full p-4 text-xs font-mono rounded-xl border border-slate-300 focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/10 outline-none"
            />
            <div className="flex justify-end">
              <button
                onClick={onAnalyzePastedText}
                disabled={docLoading || !pastedText.trim()}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold shadow-xs transition disabled:opacity-50 cursor-pointer"
              >
                {docLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-400" />}
                <span>{docLoading ? 'Auditing Specifications...' : 'Run Compliance Audit'}</span>
              </button>
            </div>
          </div>
        )}

        {docLoading && (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-center space-x-3 text-xs text-[#003366] font-semibold animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Decomposing technical requirements and cross-referencing BIS repository...</span>
          </div>
        )}

        {docError && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{docError}</span>
          </div>
        )}
      </div>

      {/* 4. Document Audit Scorecard & Line-Item Table */}
      {docResult && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Executive Summary Scorecard */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Audit Report for
                </span>
                <h2 className="text-base sm:text-lg font-black text-[#003366]">
                  {docResult.filename || 'Tender Document'}
                </h2>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-black ${
                hasSuperseded 
                  ? 'bg-red-100 text-red-800 border border-red-300' 
                  : 'bg-emerald-100 text-[#138808] border border-emerald-300'
              }`}>
                {hasSuperseded ? '⚠️ Action Required: Obsolete Standard Cited' : '✅ 100% Compliant with BIS & QCO'}
              </span>
            </div>

            {/* Scorecard Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-2xl font-black text-slate-900">
                  {summary.total_items_detected || evaluatedItems.length}
                </span>
                <p className="text-[11px] font-bold text-slate-500 mt-0.5">Total Line Items</p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-2xl font-black text-[#138808]">
                  {summary.compliant_items || 0}
                </span>
                <p className="text-[11px] font-bold text-[#138808] mt-0.5">Compliant Standards</p>
              </div>

              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-center">
                <span className="text-2xl font-black text-red-600">
                  {summary.superseded_flags || 0}
                </span>
                <p className="text-[11px] font-bold text-red-800 mt-0.5">Superseded / Withdrawn</p>
              </div>

              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-center">
                <span className="text-2xl font-black text-purple-700">
                  {summary.mandatory_qco_items || 0}
                </span>
                <p className="text-[11px] font-bold text-purple-800 mt-0.5">Mandatory QCO Items</p>
              </div>
            </div>

            {/* Executive Verdict Notice */}
            <div className={`p-4 rounded-xl text-xs font-semibold leading-relaxed border ${
              hasSuperseded 
                ? 'bg-red-50/70 border-red-200 text-red-900' 
                : 'bg-emerald-50/70 border-emerald-200 text-[#138808]'
            }`}>
              <strong>Executive Verdict:</strong> {summary.executive_verdict || 'Document analyzed successfully.'}
            </div>
          </div>

          {/* Line-Item Audit Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#003366] flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#FF9933]" />
                Line-Item Regulatory Audit Matrix ({evaluatedItems.length} Items)
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Click any row to expand the GFR 2017 compliant tender clause
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-slate-200">
                <thead className="bg-slate-50 font-bold text-slate-700">
                  <tr>
                    <th className="px-4 py-3.5">#</th>
                    <th className="px-4 py-3.5">Specification Extracted</th>
                    <th className="px-4 py-3.5">Standard Cited in Tender</th>
                    <th className="px-4 py-3.5">Mandatory BIS Standard</th>
                    <th className="px-4 py-3.5">QCO Mandate</th>
                    <th className="px-4 py-3.5">Audit Status</th>
                    <th className="px-4 py-3.5 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {evaluatedItems.map((item, idx) => {
                    const isObsolete = item.tender_standard_audit?.audit_status === 'OBSOLETE_STANDARD'
                    const cited = item.tender_standard_audit?.cited_in_document || []
                    const primaryStd = item.primary_standard || {}
                    const qco = item.qco || {}
                    const isExpanded = expandedItem === idx

                    return (
                      <React.Fragment key={idx}>
                        <tr 
                          onClick={() => setExpandedItem(isExpanded ? null : idx)}
                          className={`cursor-pointer transition hover:bg-slate-50 ${isObsolete ? 'bg-red-50/30' : ''}`}
                        >
                          <td className="px-4 py-4 font-bold text-slate-500">{item.item_index || idx + 1}</td>
                          <td className="px-4 py-4 font-semibold text-slate-900 max-w-xs">
                            <p className="line-clamp-2">{item.title || item.specification_text}</p>
                          </td>
                          <td className="px-4 py-4 font-mono font-bold whitespace-nowrap">
                            {cited.length > 0 ? (
                              <span className={isObsolete ? 'text-red-700 line-through' : 'text-slate-700'}>
                                {cited.join(', ')}
                              </span>
                            ) : (
                              <span className="text-slate-400 font-normal text-[11px]">Implicit requirement</span>
                            )}
                          </td>
                          <td className="px-4 py-4 font-mono font-black text-[#003366] whitespace-nowrap">
                            {primaryStd.standard_id}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                              {qco.badge || 'Mandatory QCO'}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {isObsolete ? (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">
                                <AlertOctagon className="w-3.5 h-3.5" />
                                <span>Withdrawn Code</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-[#138808] border border-emerald-200">
                                <Check className="w-3.5 h-3.5" />
                                <span>Verified Active</span>
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-right whitespace-nowrap">
                            <button className="text-slate-400 hover:text-slate-700">
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </td>
                        </tr>

                        {/* Expandable row with clause and audit note */}
                        {isExpanded && (
                          <tr className="bg-slate-50/80">
                            <td colSpan={7} className="px-6 py-4 space-y-3">
                              {isObsolete && (
                                <div className="p-3 rounded-xl bg-red-100/60 border border-red-300 text-red-900 font-semibold text-xs">
                                  ⚠️ <strong>Auditor Finding:</strong> {item.tender_standard_audit?.audit_message}
                                </div>
                              )}
                              
                              <div className="space-y-1">
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                  Recommended Replacement Tender Clause for Item #{item.item_index || idx + 1}:
                                </p>
                                <div className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs whitespace-pre-wrap leading-relaxed selection:bg-amber-400 selection:text-slate-950">
                                  {item.recommended_tender_clause || `The item must conform to ${primaryStd.standard_id}: ${primaryStd.title}. Valid BIS certification under ${item.certification?.scheme || 'Scheme-I'} is mandatory.`}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  )
}
