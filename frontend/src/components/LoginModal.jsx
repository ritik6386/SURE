import React, { useState } from 'react'
import { X, Shield, Lock, Mail, ArrowRight, CheckCircle2, User } from 'lucide-react'

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('amit.kumar@gem.gov.in')
  const [password, setPassword] = useState('••••••••••••')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSignIn = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      if (onLoginSuccess) onLoginSuccess({ name: 'Amit Kumar', role: 'Procurement Officer (GoI)' })
      onClose()
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tricolor Ribbon */}
        <div className="h-1.5 w-full flex">
          <div className="h-full flex-1 bg-[#FF9933]"></div>
          <div className="h-full flex-1 bg-white"></div>
          <div className="h-full flex-1 bg-[#138808]"></div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-4 text-center border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#003366] to-[#002244] text-amber-400 mx-auto flex items-center justify-center mb-3 shadow-md">
            <Shield className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h2 className="text-xl font-black text-[#003366]">Officer Authentication</h2>
          <p className="text-xs text-slate-500 mt-1">
            Sign in with your official Government e-Marketplace (GeM) credentials
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSignIn} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Official Email / Gov ID</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@gov.in"
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/10 outline-none font-medium text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password / Security Pin</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/10 outline-none font-medium text-slate-800"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center space-x-2 text-slate-600 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#003366]" />
              <span>Remember this session</span>
            </label>
            <a href="#" onClick={(e) => e.preventDefault()} className="text-[#003366] font-semibold hover:underline">
              Forgot pin?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold shadow-md transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In with SURE ID'}</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>

          <div className="relative flex items-center justify-center py-1">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-2 text-[10px] uppercase font-bold text-slate-400 absolute">
              Or Government SSO
            </span>
          </div>

          <button
            type="button"
            onClick={handleSignIn}
            className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            <img src="/sure-logo.png" alt="Jan Parichay" className="h-4 w-auto object-contain" />
            <span>Sign In with Jan Parichay (National SSO)</span>
          </button>

          <p className="text-[10px] text-slate-400 text-center leading-relaxed pt-2">
            Protected by NIC National Cloud Security Infrastructure. Unauthorized access is punishable under IT Act, 2000.
          </p>
        </form>
      </div>
    </div>
  )
}
