import React, { useState } from 'react'
import { 
  Network, ArrowLeft, Info, CheckCircle2, Shield, Layers, 
  ExternalLink, Sparkles, Filter, ZoomIn, ZoomOut, RotateCcw
} from 'lucide-react'

export default function KnowledgeGraphView({
  result,
  onBack,
  onViewStandardDetails
}) {
  const [selectedNode, setSelectedNode] = useState(null)
  const [viewMode, setViewMode] = useState('graph') // 'graph' | 'list'

  const primary = result?.primary_standard || {
    standard_id: 'IS 12615:2018',
    title: 'Energy Efficient Three-Phase Induction Motors',
    category: 'Electrical'
  }

  const qco = result?.qco || {
    applicable: true,
    order_title: 'Electric Motors (Quality Control) Order',
    badge: 'Mandatory QCO Applicable'
  }

  const cert = result?.certification || {
    popular_name: 'ISI Mark',
    scheme: 'Scheme-I (ISI Mark)'
  }

  const alliedObj = result?.allied_standards || {}
  const testingList = Array.isArray(alliedObj.testing) ? alliedObj.testing : []
  const safetyList = Array.isArray(alliedObj.safety) ? alliedObj.safety : []
  const performanceList = Array.isArray(alliedObj.performance) ? alliedObj.performance : []

  // Construct dynamic nodes
  const nodes = [
    {
      id: 'primary',
      label: primary.standard_id,
      title: primary.title,
      type: 'primary',
      category: 'Primary Standard',
      x: 350,
      y: 200,
      color: '#003366',
      textColor: '#FFFFFF',
      description: primary.description || 'Core product specification governing manufacturing, performance, and legal procurement compliance.'
    },
    ...testingList.slice(0, 2).map((t, idx) => ({
      id: `testing-${idx}`,
      label: t.id || t.standard_id,
      title: t.title,
      type: 'testing',
      category: 'Testing Standard',
      x: 160,
      y: 110 + idx * 160,
      color: '#0284C7',
      textColor: '#FFFFFF',
      description: `Mandatory testing benchmark: ${t.relationship || 'type testing and routine laboratory verification'}.`
    })),
    ...safetyList.slice(0, 2).map((s, idx) => ({
      id: `safety-${idx}`,
      label: s.id || s.standard_id,
      title: s.title,
      type: 'safety',
      category: 'Safety Standard',
      x: 540,
      y: 110 + idx * 160,
      color: '#D97706',
      textColor: '#FFFFFF',
      description: `Safety protocol: ${s.relationship || 'protection ratings and electrical insulation'}.`
    })),
    {
      id: 'qco',
      label: 'QCO Order',
      title: qco.order_title || qco.badge || 'Mandatory Quality Control Order',
      type: 'qco',
      category: 'Statutory Mandate',
      x: 350,
      y: 60,
      color: '#7E22CE',
      textColor: '#FFFFFF',
      description: `Notified by Central Ministry under Section 16 of BIS Act, 2016. Makes compliance compulsory by law.`
    },
    {
      id: 'scheme',
      label: cert.popular_name || 'Scheme-I',
      title: cert.scheme || 'BIS Certification Scheme',
      type: 'certification',
      category: 'Certification Scheme',
      x: 350,
      y: 340,
      color: '#FF9933',
      textColor: '#FFFFFF',
      description: `Compulsory product marking scheme. Requires active manufacturer license (CM/L or CRS) on bid date.`
    }
  ]

  const links = [
    ...testingList.slice(0, 2).map((_, idx) => ({
      from: 'primary',
      to: `testing-${idx}`,
      label: 'Mandatory Testing'
    })),
    ...safetyList.slice(0, 2).map((_, idx) => ({
      from: 'primary',
      to: `safety-${idx}`,
      label: 'Safety Protocol'
    })),
    { from: 'qco', to: 'primary', label: 'Enforces' },
    { from: 'primary', to: 'scheme', label: 'Certified Under' }
  ]

  // Active node to inspect
  const activeNode = selectedNode || nodes[0]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Top Controls & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#003366] hover:text-[#002244] bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs hover:bg-slate-50 transition cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Analysis</span>
        </button>

        <div className="flex items-center space-x-2">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 text-xs font-bold">
            <button
              onClick={() => setViewMode('graph')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                viewMode === 'graph' ? 'bg-white text-[#003366] shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Interactive Topology Graph
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-[#003366] shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Structured Standards List
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Graph Canvas & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Graph Canvas in Left 2 Columns */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-bold text-sm text-[#003366] flex items-center gap-1.5">
                <Network className="w-4 h-4 text-[#FF9933]" />
                Standards Normative &amp; Regulatory Graph
              </h2>
              <p className="text-[11px] text-slate-500">
                Click any node to inspect testing requirements, relationship hierarchy, and procurement implications.
              </p>
            </div>
            
            <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-blue-50 text-[#003366] border border-blue-200">
              {nodes.length} Nodes • {links.length} Edges
            </span>
          </div>

          {viewMode === 'graph' ? (
            <div className="relative w-full h-[450px] bg-slate-50/70 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center select-none">
              
              {/* SVG Canvas for links and nodes */}
              <svg className="w-full h-full" viewBox="0 0 700 400">
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="8"
                    markerHeight="6"
                    refX="22"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 8 3, 0 6" fill="#94A3B8" />
                  </marker>
                </defs>

                {/* Render Connecting Lines */}
                {links.map((link, idx) => {
                  const src = nodes.find(n => n.id === link.from)
                  const dst = nodes.find(n => n.id === link.to)
                  if (!src || !dst) return null
                  return (
                    <g key={idx}>
                      <line
                        x1={src.x}
                        y1={src.y}
                        x2={dst.x}
                        y2={dst.y}
                        stroke="#CBD5E1"
                        strokeWidth="2"
                        strokeDasharray={link.from === 'qco' ? '4,4' : 'none'}
                      />
                      <text
                        x={(src.x + dst.x) / 2}
                        y={(src.y + dst.y) / 2 - 6}
                        fill="#64748B"
                        fontSize="9"
                        textAnchor="middle"
                        fontWeight="600"
                      >
                        {link.label}
                      </text>
                    </g>
                  )
                })}

                {/* Render Nodes */}
                {nodes.map(node => {
                  const isSelected = activeNode.id === node.id
                  const isPrimary = node.type === 'primary'
                  const r = isPrimary ? 38 : 28

                  return (
                    <g
                      key={node.id}
                      className="cursor-pointer transition-transform duration-150"
                      onClick={() => setSelectedNode(node)}
                    >
                      {/* Pulse ring for selected node */}
                      {isSelected && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={r + 6}
                          fill="none"
                          stroke="#FF9933"
                          strokeWidth="3"
                          className="animate-pulse"
                        />
                      )}

                      {/* Node circle */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={r}
                        fill={node.color}
                        stroke="#FFFFFF"
                        strokeWidth="3"
                        className="shadow-md hover:opacity-90"
                      />

                      {/* Node text */}
                      <text
                        x={node.x}
                        y={node.y + 4}
                        fill={node.textColor}
                        fontSize={isPrimary ? "11" : "9"}
                        fontWeight="800"
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        {node.label}
                      </text>
                    </g>
                  )
                })}
              </svg>

              <div className="absolute bottom-2 right-2 text-[10px] text-slate-400 font-medium pointer-events-none bg-white/80 px-2 py-0.5 rounded border border-slate-200">
                Interactive SVG Topology
              </div>
            </div>
          ) : (
            /* Structured List View */
            <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
              {nodes.map(node => (
                <div 
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    activeNode.id === node.id 
                      ? 'border-[#003366] bg-blue-50/50 shadow-xs' 
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span 
                      className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: node.color }}
                    ></span>
                    <div>
                      <span className="font-mono font-bold text-xs text-[#003366]">{node.label}</span>
                      <h4 className="text-xs font-semibold text-slate-900">{node.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{node.category}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">Inspect &gt;</span>
                </div>
              ))}
            </div>
          )}

          {/* Graph Legend */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 mt-auto border-t border-slate-200 text-[11px] font-semibold">
            <span className="text-slate-400 uppercase tracking-wider text-[10px]">Legend:</span>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#003366]"></span>
              <span className="text-slate-700">Primary Standard</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]"></span>
              <span className="text-slate-700">Testing Methods</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]"></span>
              <span className="text-slate-700">Safety Protocol</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7E22CE]"></span>
              <span className="text-slate-700">Mandatory QCO</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF9933]"></span>
              <span className="text-slate-700">Certification Scheme</span>
            </div>
          </div>
        </div>

        {/* Node Inspector Drawer in Right Column */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Node Inspector
              </span>
              <span 
                className="text-[10px] font-bold px-2 py-0.5 rounded text-white"
                style={{ backgroundColor: activeNode.color }}
              >
                {activeNode.category}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <span className="font-mono font-black text-xl text-[#003366]">
                  {activeNode.label}
                </span>
                <h3 className="font-bold text-sm text-slate-900 mt-1 leading-snug">
                  {activeNode.title}
                </h3>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs leading-relaxed text-slate-700">
                <p>{activeNode.description}</p>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-[#003366]">Role in Tender Procurement</h4>
                <ul className="text-xs text-slate-600 space-y-1.5">
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#138808] flex-shrink-0 mt-0.5" />
                    <span>Must be cited as verification benchmark in technical bid evaluation.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#138808] flex-shrink-0 mt-0.5" />
                    <span>Test certificates from NABL/BIS accredited laboratories required.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={onViewStandardDetails}
              className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <span>View Specification Details</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  )
}
