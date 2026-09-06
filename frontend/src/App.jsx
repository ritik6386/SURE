import React, { useState, useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import LandingView from './components/LandingView'
import DashboardView from './components/DashboardView'
import StandardDetailsView from './components/StandardDetailsView'
import KnowledgeGraphView from './components/KnowledgeGraphView'
import ComplianceView from './components/ComplianceView'
import AuditView from './components/AuditView'
import HistoryView from './components/HistoryView'
import StandardsDirectoryView from './components/StandardsDirectoryView'
import LoginModal from './components/LoginModal'
import LoadingModal from './components/LoadingModal'
import BenchmarkModal from './components/BenchmarkModal'

import { 
  Zap, Sun, Laptop, Building2, Wrench, ShieldAlert,
  Search, BarChart3, BookOpen, Network, CheckCircle2, FileText, Clock
} from 'lucide-react'

// Digital India Bhashini Language Configurations (MeitY / IndicTrans2)
const LANGUAGE_CONFIGS = {
  en: {
    code: 'en',
    name: 'English',
    native: 'English',
    flag: '🇬🇧',
    placeholder: 'Describe your product or tender requirement (e.g. 200 kW three-phase induction motor for sewage pumping)...',
    inputHeading: 'What are you procuring?',
    inputSubtitle: 'Describe your tender requirements in natural language. SURE parameterizes your need and maps it to verified BIS codes, QCO mandates, and allied standards.',
    analyzeBtn: 'Analyze Requirement',
    presets: [
      { id: 'motor', title: '200 kW Induction Motor', icon: Zap, query: '200 kW induction motor for sewage pumping' },
      { id: 'solar', title: 'Solar PV Module', icon: Sun, query: 'Solar PV module for government rooftop project' },
      { id: 'laptop', title: 'Office Laptop', icon: Laptop, query: 'High-performance laptop for government office' },
      { id: 'superseded', title: 'IS 325 Obsolete Check', icon: ShieldAlert, query: 'Use IS 325 for three-phase induction motor' },
      { id: 'cement', title: '53 Grade Cement', icon: Building2, query: 'Ordinary Portland Cement 53 grade for bridge construction' },
      { id: 'pipe', title: 'UPVC Pipes', icon: Wrench, query: 'UPVC pipes 110 mm for potable water distribution' }
    ]
  },
  ta: {
    code: 'ta',
    name: 'Tamil',
    native: 'தமிழ்',
    flag: '🏛️',
    placeholder: 'உங்கள் தயாரிப்பு அல்லது டெண்டர் தேவையை தமிழில் விவரிக்கவும்... (உதா: சாக்கடை நீரேற்றுக்கான 200 kW தூண்டல் மோட்டார்)',
    inputHeading: 'நீங்கள் எதை கொள்முதல் செய்கிறீர்கள்?',
    inputSubtitle: 'உங்கள் தேவையை சொந்த வார்த்தைகளில் குறிப்பிடவும். டிஜிட்டல் இந்தியா பாஷிணி (Bhashini / IndicTrans2) மூலம் BIS தரநிலைகள் மற்றும் QCO இணக்கம் சரிபார்க்கப்படும்.',
    analyzeBtn: 'தேவையை பகுப்பாய்வு செய்க',
    presets: [
      { id: 'motor_ta', title: 'தூண்டல் மோட்டார்', icon: Zap, query: 'சாக்கடை நீரேற்றுக்கான 200 kW தூண்டல் மோட்டார்' },
      { id: 'solar_ta', title: 'சூரிய மின் பலகை', icon: Sun, query: 'மேற்கூரை திட்டத்திற்கான சூரிய மின் பலகை' },
      { id: 'laptop_ta', title: 'அலுவலக மடிக்கணினி', icon: Laptop, query: 'அரசு அலுவலகத்திற்கான உயர் செயல்திறன் மடிக்கணினி' },
      { id: 'cement_ta', title: '53 தர சிமெண்ட்', icon: Building2, query: 'பாலம் கட்டுமானத்திற்கான 53 தர சிமெண்ட்' },
      { id: 'pipe_ta', title: 'யூபிவிசி குழாய்', icon: Wrench, query: 'குடிநீர் வழங்கலுக்கான யூபிவிசி குழாய் 110 மிமீ' }
    ]
  },
  mr: {
    code: 'mr',
    name: 'Marathi',
    native: 'मराठी',
    flag: '🚩',
    placeholder: 'तुमच्या उत्पादनाची किंवा निविदेची आवश्यकता मराठीत लिहा... (उदा: सांडपाणी उपसा करण्यासाठी 200 kW इंडक्शन मोटर)',
    inputHeading: 'तुम्ही काय खरेदी करत आहात?',
    inputSubtitle: 'तुमच्या निविदेची आवश्यकता स्वतःच्या शब्दांत लिहा. डिजिटल इंडिया भाषिणी (Bhashini / IndicTrans2) द्वारे बीआयएस मानके आणि क्यूसीओ तपासले जातील.',
    analyzeBtn: 'गरज तपासा (विश्लेषण करा)',
    presets: [
      { id: 'motor_mr', title: 'इंडक्शन मोटर', icon: Zap, query: 'सांडपाणी उपसा करण्यासाठी 200 kW इंडक्शन मोटर' },
      { id: 'solar_mr', title: 'सौर पीव्ही मॉड्यूल', icon: Sun, query: 'छतावरील प्रकल्पासाठी सौर पीव्ही मॉड्यूल' },
      { id: 'laptop_mr', title: 'शासकीय लॅपटॉप', icon: Laptop, query: 'शासकीय कार्यालयासाठी उच्च कार्यक्षमतेचा लॅपटॉप' },
      { id: 'cement_mr', title: '५३ ग्रेड सिमेंट', icon: Building2, query: 'पुलाच्या बांधकामासाठी ५३ ग्रेड सिमेंट' },
      { id: 'pipe_mr', title: 'यूपीव्हीसी पाईप', icon: Wrench, query: 'पिण्याच्या पाण्याच्या पुरवठ्यासाठी यूपीव्हीसी पाईप ११० मिमी' }
    ]
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    native: 'हिन्दी',
    flag: '🇮🇳',
    placeholder: 'अपनी उत्पाद या निविदा आवश्यकता को हिंदी में लिखें... (उदा: सीवेज पंपिंग के लिए 200 kW इंडक्शन मोटर)',
    inputHeading: 'आप क्या अधिप्राप्ति (खरीद) कर रहे हैं?',
    inputSubtitle: 'अपनी आवश्यकता को अपने शब्दों में लिखें। डिजिटल इंडिया भाषिणी (Bhashini / IndicTrans2) द्वारा बीआईएस मानक एवं क्यूसीओ आदेशों की जांच की जाएगी।',
    analyzeBtn: 'आवश्यकता का विश्लेषण करें',
    presets: [
      { id: 'motor_hi', title: 'इंडक्शन मोटर', icon: Zap, query: 'सीवेज पंपिंग के लिए 200 kW इंडक्शन मोटर' },
      { id: 'solar_hi', title: 'सोलर पीवी मॉड्यूल', icon: Sun, query: 'छत परियोजना के लिए सोलर पीवी मॉड्यूल' },
      { id: 'laptop_hi', title: 'कार्यालयीन लैपटॉप', icon: Laptop, query: 'सरकारी कार्यालय के लिए हाई-परफॉरमेंस लैपटॉप' },
      { id: 'cement_hi', title: '53 ग्रेड सीमेंट', icon: Building2, query: 'पुल निर्माण के लिए 53 ग्रेड पोर्टलैंड सीमेंट' },
      { id: 'pipe_hi', title: 'यूपीवीसी पाइप', icon: Wrench, query: 'पेयजल आपूर्ति के लिए 110 मिमी यूपीवीसी पाइप' }
    ]
  }
}

export default function App() {
  // Navigation: 'home' | 'dashboard' | 'details' | 'graph' | 'compliance' | 'audit' | 'history' | 'standards'
  const [activeNav, setActiveNav] = useState('home')

  // Bhashini Language State
  const [selectedLanguage, setSelectedLanguage] = useState('en')

  // Query and Search State
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysisStep, setAnalysisStep] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [selectedStandard, setSelectedStandard] = useState(null)

  // Checklist state for Compliance
  const [checklist, setChecklist] = useState({
    primary: true,
    testing: true,
    safety: true,
    cert: true,
    qco: true,
    version: true,
    installation: false
  })

  // Copied state
  const [copiedClause, setCopiedClause] = useState(false)

  // Search & Analysis History
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('sure_analysis_history')
      return saved ? JSON.parse(saved) : [
        { id: 1, query: '200 kW induction motor for sewage pumping', standard: 'IS 12615:2018', category: 'Electrical', time: '10 mins ago', status: 'Compliant' },
        { id: 2, query: 'Solar PV module for government rooftop project', standard: 'IS 14286:2010', category: 'Solar / RE', time: '1 hour ago', status: 'Compliant' },
        { id: 3, query: 'High-performance laptop for government office', standard: 'IS 13252 (Pt 1)', category: 'Electronics', time: '3 hours ago', status: 'CRS Mandate' },
        { id: 4, query: 'Ordinary Portland Cement 53 grade for bridge', standard: 'IS 12269:2013', category: 'Civil', time: 'Yesterday', status: 'Compliant' }
      ]
    } catch {
      return []
    }
  })

  // Document Auditor State
  const [docLoading, setDocLoading] = useState(false)
  const [docResult, setDocResult] = useState(null)
  const [docError, setDocError] = useState(null)
  const [uploadMethod, setUploadMethod] = useState('file')
  const [pastedText, setPastedText] = useState('')
  const [sampleDocs, setSampleDocs] = useState([])

  // Standards Explorer State
  const [standardsList, setStandardsList] = useState([])
  const [stdLoading, setStdLoading] = useState(false)

  // Officer Login Modal
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [officerProfile, setOfficerProfile] = useState({ name: 'Amit Kumar', role: 'Procurement Officer (GoI)' })

  // Evaluation Benchmark Modal
  const [showBenchmarkModal, setShowBenchmarkModal] = useState(false)
  const [benchmarkData, setBenchmarkData] = useState(null)
  const [benchLoading, setBenchLoading] = useState(false)

  // Initial load
  useEffect(() => {
    fetchSampleDocs()
    fetchStandards()
    // Pre-populate result with default demo
    handleSearchSilent(LANGUAGE_CONFIGS.en.presets[0].query)
  }, [])

  // Silent search on mount for instant state readiness without hijacking landing page
  const handleSearchSilent = async (q) => {
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, language: 'en' })
      })
      if (res.ok) {
        const data = await res.json()
        setResult(data)
        setQuery(q)
      }
    } catch (e) {
      console.warn('Initial preload note:', e)
    }
  }

  const fetchSampleDocs = async () => {
    try {
      const res = await fetch('/api/sample-documents')
      if (res.ok) {
        const data = await res.json()
        setSampleDocs(data.samples || [])
      }
    } catch (e) {
      console.warn('Sample docs fetch', e)
    }
  }

  const fetchStandards = async (search = '', cat = '') => {
    setStdLoading(true)
    try {
      const url = new URL('/api/standards', window.location.origin)
      if (search) url.searchParams.set('search', search)
      if (cat) url.searchParams.set('category', cat)
      url.searchParams.set('limit', '100')
      const res = await fetch(url.toString())
      if (res.ok) {
        const data = await res.json()
        setStandardsList(data.results || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setStdLoading(false)
    }
  }

  const handleSearch = async (searchQuery, langOverride) => {
    const q = searchQuery || query
    if (!q.trim()) return

    const activeLang = langOverride || selectedLanguage

    setLoading(true)
    setError(null)
    setQuery(q)
    setAnalysisStep(1)

    // Step Simulator for full AI transparency
    const t1 = setTimeout(() => setAnalysisStep(2), 300)
    const t2 = setTimeout(() => setAnalysisStep(3), 650)
    const t3 = setTimeout(() => setAnalysisStep(4), 1000)
    const t4 = setTimeout(() => setAnalysisStep(5), 1350)

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, language: activeLang })
      })

      if (!res.ok) throw new Error(`Server returned status ${res.status}`)
      const data = await res.json()

      setTimeout(() => {
        setResult(data)
        setSelectedStandard(null)
        setLoading(false)
        setAnalysisStep(0)
        setActiveNav('dashboard')

        // Add to history
        if (data.success && data.primary_standard) {
          const newItem = {
            id: Date.now(),
            query: q,
            standard: data.primary_standard.standard_id,
            category: data.primary_standard.category,
            time: 'Just now',
            status: data.qco?.badge || (data.superseded_alert ? 'Superseded' : 'Compliant')
          }
          setHistory(prev => {
            const updated = [newItem, ...prev.filter(x => x.query !== q)].slice(0, 20)
            try { localStorage.setItem('sure_analysis_history', JSON.stringify(updated)) } catch {}
            return updated
          })
        }
      }, 1500)

    } catch (err) {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      setError('Unable to fetch recommendation. Ensure backend server is running.')
      setLoading(false)
      setAnalysisStep(0)
    }
  }

  const handleCopyClause = () => {
    if (result && result.tender_clause) {
      navigator.clipboard.writeText(result.tender_clause)
      setCopiedClause(true)
      setTimeout(() => setCopiedClause(false), 2500)
    }
  }

  const handleExportJSON = () => {
    if (!result) return
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `SURE_Audit_${result.primary_standard?.standard_id.replace(/[:\/ ]/g, '_') || 'Report'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handlePrint = () => {
    window.print()
  }

  const processFileUpload = async (file) => {
    setDocLoading(true)
    setDocError(null)
    setDocResult(null)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload-document', { method: 'POST', body: formData })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || `Server returned error ${res.status}`)
      }
      const data = await res.json()
      setDocResult(data)
    } catch (err) {
      setDocError(err.message || 'Error processing document.')
    } finally {
      setDocLoading(false)
    }
  }

  const handleAnalyzePastedText = async () => {
    if (!pastedText.trim()) return
    setDocLoading(true)
    setDocError(null)
    setDocResult(null)

    try {
      const res = await fetch('/api/analyze-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: pastedText, title: 'Pasted_Tender_Clause.txt' })
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || `Server returned error ${res.status}`)
      }
      const data = await res.json()
      setDocResult(data)
    } catch (err) {
      setDocError(err.message || 'Error processing text.')
    } finally {
      setDocLoading(false)
    }
  }

  const handleLoadSample = (sample) => {
    setUploadMethod('paste')
    setPastedText(sample.content)
    setDocLoading(true)
    setDocError(null)
    setDocResult(null)
    fetch('/api/analyze-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: sample.content, title: sample.filename })
    })
      .then(res => res.json())
      .then(data => setDocResult(data))
      .catch(e => setDocError(e.message))
      .finally(() => setDocLoading(false))
  }

  const handleFetchBenchmark = async () => {
    setBenchLoading(true)
    setShowBenchmarkModal(true)
    try {
      const res = await fetch('/api/evaluate')
      const data = await res.json()
      setBenchmarkData(data)
    } catch (e) {
      console.error(e)
    } finally {
      setBenchLoading(false)
    }
  }

  const handleClearHistory = () => {
    setHistory([])
    try { localStorage.removeItem('sure_analysis_history') } catch {}
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-amber-300 selection:text-slate-950">
      
      {/* 1. Global Government Header Navigation */}
      <Navbar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        languageConfigs={LANGUAGE_CONFIGS}
        onOpenLogin={() => setShowLoginModal(true)}
        onOpenBenchmark={handleFetchBenchmark}
      />

      {/* 2. Main Content Area with Seamless Transitions */}
      <main className="flex-1 w-full pb-16 sm:pb-8">
        {activeNav === 'home' && (
          <LandingView
            query={query}
            setQuery={setQuery}
            onSearch={handleSearch}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            languageConfigs={LANGUAGE_CONFIGS}
            loading={loading}
          />
        )}

        {activeNav === 'dashboard' && (
          <DashboardView
            result={result}
            query={query}
            onSearch={handleSearch}
            onViewStandardDetails={() => setActiveNav('details')}
            onViewKnowledgeGraph={() => setActiveNav('graph')}
            onViewCompliance={() => setActiveNav('compliance')}
            onViewAudit={() => setActiveNav('audit')}
            copiedClause={copiedClause}
            onCopyClause={handleCopyClause}
            onExportJSON={handleExportJSON}
            onPrint={handlePrint}
            checklist={checklist}
            setChecklist={setChecklist}
          />
        )}

        {activeNav === 'details' && (
          <StandardDetailsView
            standard={selectedStandard}
            result={result}
            onBack={() => setActiveNav('dashboard')}
            onViewGraph={() => setActiveNav('graph')}
            onViewCompliance={() => setActiveNav('compliance')}
            onPrint={handlePrint}
          />
        )}

        {activeNav === 'graph' && (
          <KnowledgeGraphView
            result={result}
            onBack={() => setActiveNav('dashboard')}
            onViewStandardDetails={() => setActiveNav('details')}
          />
        )}

        {activeNav === 'compliance' && (
          <ComplianceView
            result={result}
            checklist={checklist}
            setChecklist={setChecklist}
            onBack={() => setActiveNav('dashboard')}
            onViewStandardDetails={() => setActiveNav('details')}
          />
        )}

        {activeNav === 'audit' && (
          <AuditView
            docResult={docResult}
            docLoading={docLoading}
            docError={docError}
            sampleDocs={sampleDocs}
            uploadMethod={uploadMethod}
            setUploadMethod={setUploadMethod}
            pastedText={pastedText}
            setPastedText={setPastedText}
            onUploadFile={processFileUpload}
            onAnalyzePastedText={handleAnalyzePastedText}
            onLoadSample={handleLoadSample}
            onBack={() => setActiveNav('dashboard')}
          />
        )}

        {activeNav === 'history' && (
          <HistoryView
            history={history}
            onSelectQuery={(q) => handleSearch(q)}
            onClearHistory={handleClearHistory}
            onBack={() => setActiveNav('dashboard')}
          />
        )}

        {activeNav === 'standards' && (
          <StandardsDirectoryView
            standardsList={standardsList}
            stdLoading={stdLoading}
            onFetchStandards={fetchStandards}
            onSelectStandard={(std) => {
              setSelectedStandard(std)
              setActiveNav('details')
            }}
            onBack={() => setActiveNav('dashboard')}
          />
        )}
      </main>

      {/* 3. Mobile Bottom Bar for Quick Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveNav('home')}
          className={`flex flex-col items-center p-1 text-[10px] font-bold ${
            activeNav === 'home' ? 'text-[#003366]' : 'text-slate-500'
          }`}
        >
          <Search className="w-4 h-4 mb-0.5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveNav('dashboard')}
          className={`flex flex-col items-center p-1 text-[10px] font-bold ${
            activeNav === 'dashboard' ? 'text-[#003366]' : 'text-slate-500'
          }`}
        >
          <BarChart3 className="w-4 h-4 mb-0.5" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveNav('graph')}
          className={`flex flex-col items-center p-1 text-[10px] font-bold ${
            activeNav === 'graph' ? 'text-[#003366]' : 'text-slate-500'
          }`}
        >
          <Network className="w-4 h-4 mb-0.5" />
          <span>Graph</span>
        </button>

        <button
          onClick={() => setActiveNav('compliance')}
          className={`flex flex-col items-center p-1 text-[10px] font-bold ${
            activeNav === 'compliance' ? 'text-[#003366]' : 'text-slate-500'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 mb-0.5" />
          <span>Compliance</span>
        </button>

        <button
          onClick={() => setActiveNav('audit')}
          className={`flex flex-col items-center p-1 text-[10px] font-bold ${
            activeNav === 'audit' ? 'text-[#003366]' : 'text-slate-500'
          }`}
        >
          <FileText className="w-4 h-4 mb-0.5" />
          <span>Auditor</span>
        </button>
      </div>

      {/* 4. Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={(profile) => setOfficerProfile(profile)}
      />

      <BenchmarkModal
        isOpen={showBenchmarkModal}
        onClose={() => setShowBenchmarkModal(false)}
        data={benchmarkData}
        loading={benchLoading}
        onRerun={handleFetchBenchmark}
      />

      {loading && (
        <LoadingModal query={query} step={analysisStep} />
      )}

    </div>
  )
}
