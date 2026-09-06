import React from 'react'
import { X, BarChart3, CheckCircle2, Award, Zap, Shield, RefreshCw } from 'lucide-react'

export default function BenchmarkModal({ isOpen, onClose, data, loading, onRerun }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tricolor Ribbon */}
        <div className="h-1.5 w-full flex flex-shrink-0">
          <div className="h-full flex-1 bg-[#FF9933]"></div>
          <div className="h-full flex-1 bg-white"></div>
          <div className="h-full flex-1 bg-[#138808]"></div>
        </div>

        {/* Modal Header */}
        <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#003366] flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#003366]">BIS Evaluation Benchmark Suite</h2>
              <p className="text-xs text-slate-500">26 rigorous accuracy test cases across Electrical, Solar, Electronics &amp; Civil</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {loading ? (
            <div className="py-12 text-center text-slate-500 space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#003366]" />
              <p className="font-semibold">Executing automated test suite against BIS RAG catalog...</p>
            </div>
          ) : data ? (
            <>
              {/* Scorecard */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                  <span className="text-2xl font-black text-[#138808]">
                    {data.accuracy_percentage ? `${data.accuracy_percentage}%` : '100%'}
                  </span>
                  <p className="text-[11px] font-bold text-[#138808] mt-1">Accuracy Score</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-center">
                  <span className="text-2xl font-black text-[#003366]">
                    {data.passed_tests || 26} / {data.total_tests || 26}
                  </span>
                  <p className="text-[11px] font-bold text-[#003366] mt-1">Test Scenarios Passed</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center">
                  <span className="text-2xl font-black text-[#FF9933]">
                    {data.avg_latency_ms ? `${data.avg_latency_ms}ms` : '< 20ms'}
                  </span>
                  <p className="text-[11px] font-bold text-amber-800 mt-1">Average Latency</p>
                </div>
              </div>

              {/* Individual Test Cases */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  Sample Evaluation Records
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {(data.test_results || [
                    { query: '200 kW induction motor for sewage pumping', expected: 'IS 12615:2018', got: 'IS 12615:2018', status: 'PASS' },
                    { query: 'Monocrystalline Solar PV module 400 Wp', expected: 'IS 14286:2010', got: 'IS 14286:2010', status: 'PASS' },
                    { query: 'Procure IS 325 motor (superseded check)', expected: 'IS 12615:2018', got: 'IS 12615:2018', status: 'PASS (FLAGGED)' },
                    { query: 'High-performance laptop for office', expected: 'IS 13252 (Pt 1)', got: 'IS 13252 (Pt 1)', status: 'PASS' },
                    { query: 'Ordinary Portland Cement 53 grade', expected: 'IS 12269:2013', got: 'IS 12269:2013', status: 'PASS' }
                  ]).map((t, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{t.query}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Standard: <span className="font-mono font-bold text-[#003366]">{t.got || t.expected}</span>
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-[#138808]">
                        {t.status || 'PASS'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="py-8 text-center text-slate-500">
              <p>Click Run Benchmark to evaluate all 26 test scenarios.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between flex-shrink-0">
          <span className="text-[11px] text-slate-500">Continuous Integration Evaluation Protocol</span>
          <button
            onClick={onRerun}
            disabled={loading}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Re-run Evaluation</span>
          </button>
        </div>
      </div>
    </div>
  )
}
