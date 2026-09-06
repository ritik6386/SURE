import React from 'react'
import { Sparkles, CheckCircle2, RefreshCw, Layers, ShieldCheck, Zap } from 'lucide-react'

export default function LoadingModal({ query, step = 1 }) {
  const steps = [
    { id: 1, label: 'Extracting product parameters via Sarvam AI...', desc: 'Extracts capacity, voltage, rating, and duty cycle' },
    { id: 2, label: 'Grounding query against 234+ BIS standards...', desc: 'Semantic search across current Bureau of Indian Standards' },
    { id: 3, label: 'Checking Ministry Quality Control Orders (QCO)...', desc: 'Verifies Scheme-I ISI Mark or CRS statutory mandate' },
    { id: 4, label: 'Retrieving allied testing & safety standards...', desc: 'Maps normative references and test methods' },
    { id: 5, label: 'Synthesizing GFR 2017 compliant tender clause...', desc: 'Compiles ready-to-use procurement specifications' }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center space-y-6 animate-in zoom-in-95 duration-150">
        
        {/* Tricolor Animated Indicator */}
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#FF9933] border-r-[#003366] border-b-[#138808] animate-spin"></div>
          <div className="absolute inset-3 rounded-full bg-blue-50 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-[#003366] animate-pulse" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-black text-[#003366] tracking-tight">
            Analyzing Regulatory Standards
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto truncate font-medium">
            "{query}"
          </p>
        </div>

        {/* Step Progress Checklist */}
        <div className="text-left space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
          {steps.map((s) => {
            const isCompleted = step > s.id
            const isCurrent = step === s.id

            return (
              <div key={s.id} className="flex items-start space-x-3">
                <div className="mt-0.5 flex-shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-[#138808]" />
                  ) : isCurrent ? (
                    <RefreshCw className="w-4 h-4 text-[#FF9933] animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>
                  )}
                </div>
                <div>
                  <p className={`font-bold ${isCurrent ? 'text-[#003366]' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                    {s.label}
                  </p>
                  <p className="text-[10px] text-slate-500">{s.desc}</p>
                </div>
              </div>
            )
          })}
        </div>

        <p className="text-[11px] text-slate-400 font-medium">
          Powered by Digital India Bhashini • Sarvam AI • BIS RAG Engine
        </p>

      </div>
    </div>
  )
}
