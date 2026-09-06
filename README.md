# SURE — Standards for Unified Regulatory Engine
## AI-Powered Indian Standards Recommendation Engine for Smart Public Procurement

SURE (Standards for Unified Regulatory Engine) is a domain-specific procurement intelligence platform that maps natural-language tender requirements to official Bureau of Indian Standards (BIS) specifications, navigates normative knowledge graphs for allied testing and safety standards, verifies statutory Quality Control Orders (QCO), identifies conformity assessment certification schemes (Scheme-I ISI Mark, Scheme-II CRS), and generates tender-ready specification clauses.

---

## 🚀 Key Features

1. **Dense Vector Semantic Understanding**: Solves procurement vocabulary mismatches (e.g., mapping *"200 kW induction motor for sewage pumping"* to *"Line Operated Three Phase AC Motors (IE Code) IS 12615:2018"* with match confidence).
2. **Tender Document & DPR Multi-Item Auditor (PDF/DOCX/TXT)**: Allows procurement officers to upload complete tender documents, Detailed Project Reports (DPRs), or Notice Inviting Tenders (NITs). Automatically segments technical schedules, extracts individual equipment items, identifies cited standards, flags obsolete/superseded references, and evaluates compliance across the entire procurement schedule.
3. **Normative Knowledge Graph**: Traverses primary standards to allied testing standards (e.g., IS 12802), safety standards (IS/IEC 60034-5), and application standards (IS 12824 for VFD duty).
4. **Deterministic Compliance Engine**:
   - Evaluates mandatory Quality Control Orders (QCO) issued by DPIIT, Ministry of Power, Ministry of Steel, MeitY, etc.
   - Maps mandatory certification schemes: Scheme-I (ISI Mark), Scheme-II (Compulsory Registration Scheme / CRS).
5. **Traffic-Light Alert System**:
   - 🔴 **Red Alert**: Detects obsolete/superseded standards (e.g., IS 325) and redirects officers to active standards.
   - 🟡 **Yellow Alert**: Flags upcoming QCO statutory deadlines.
   - 🟢 **Green Indicator**: Confirms active standards with verified mandatory certification.
6. **Tender Specification Generator**: Generates formatted, copy-pasteable clauses with routine testing, type testing, and sampling inspection requirements ready for GeM, CPPP, and state PWD tenders.
7. **Automated Evaluation Benchmark Suite**: Built-in 26-query benchmark measuring Primary Retrieval Accuracy, Top-5 Recall, and Compliance Accuracy.

---

## 📊 Benchmark Evaluation Results

| Metric | Target (MVP) | SURE Achieved |
| :--- | :--- | :--- |
| **Total Test Queries** | 20–30 | **26 Realistic Procurement Queries** |
| **Primary Standard Retrieval Accuracy** | $\ge 80\%$ | **100.0%** |
| **Top-5 Candidate Recall** | $\ge 90\%$ | **100.0%** |
| **QCO Compliance Accuracy** | $\ge 90\%$ | **100.0%** |
| **Overall Benchmark Score** | $\ge 85\%$ | **100.0%** |
| **System Verdict** | Pass | **EXCELLENT (Production-Ready Prototype)** |

---

## ⚡ Quick Start

### 1. Launch Platform
Simply run the platform runner in the project root:
```bash
python run.py
```
*(Or run `.venv\Scripts\python -m uvicorn backend.app.main:app --port 8000`)*

### 2. Access Web Interface
Open your browser to:
- **Web Dashboard**: [http://localhost:8000](http://localhost:8000)
- **Interactive Swagger API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Evaluation Benchmark**: [http://localhost:8000/api/evaluate](http://localhost:8000/api/evaluate)

---

## 🎯 5 Core Demo Scenarios

### Demo 1 — Industrial Induction Motor
- **Query:** `200 kW induction motor for sewage pumping`
- **Output:** **IS 12615:2018** (IE3 Efficiency)
- **Allied Standards:** IS 12802 (Testing), IS 12824 (VFD), IS 8789 (Performance), IS/IEC 60034-5 (IP Protection)
- **Certification:** Scheme-I / ISI Mark
- **QCO:** Mandatory Applicable (Electric Motors QCO, DPIIT)

### Demo 2 — Solar PV Module
- **Query:** `Solar PV module for government rooftop project`
- **Output:** **IS 14286:2010**
- **Allied Standards:** IS/IEC 61730-1 & IS/IEC 61730-2 (Safety), IS 16221 (Inverters)
- **Certification:** Scheme-I / ISI Mark + MNRE ALMM Approved
- **QCO:** Mandatory Enforced (MNRE Solar Order)

### Demo 3 — Office Laptop
- **Query:** `High-performance laptop for government office`
- **Output:** **IS 13252 (Part 1):2010**
- **Allied Standards:** IS 16046 (Lithium Batteries), IS 13252 Power Adaptor
- **Certification:** Scheme-II / CRS (Compulsory Registration Scheme)
- **QCO:** Mandatory Enforced (MeitY Electronics Order)

### Demo 4 — Superseded Standard Detection (Red Warning)
- **Query:** `Use IS 325 for three-phase induction motor`
- **Output:** **IS 325:1996** flagged with 🔴 **CRITICAL RISK ALERT**
- **Action Required:** Automatically redirects tender officer to **IS 12615:2018**

### Demo 5 — Upcoming QCO Deadline (Yellow Warning)
- **Query:** `Submersible pump sets for rural irrigation tube wells`
- **Output:** **IS 8034:2018** with 🟡 **UPCOMING STATUTORY DEADLINE ALERT**
- **Enforcement:** Mandatory compliance enforcement countdown

---

## 🏗️ Architectural Sub-Bot Division

```text
SAARTHI/
├── data/                       # Bot 1: BIS Data & Knowledge Engineer
│   ├── standards.json          # 234 curated BIS standards across 8 domains
│   ├── standards.csv           # Tabular export for procurement auditing
│   ├── qco.json                # Central Quality Control Orders registry
│   ├── certifications.json     # Conformity assessment schemes (Scheme-I, II, IV, FMCS)
│   └── relationships.json      # Normative knowledge graph adjacency lists
│
├── ai_engine/                  # Bot 2: AI & Semantic Search Engineer
│   ├── domain_classifier.py    # 8-sector taxonomy & technical parameter extractor
│   ├── vector_store.py         # Subword n-gram vectorizer & cosine similarity ranker
│   └── ranker.py               # Top-1 primary recommendation & Top-K alternates
│
├── knowledge_graph/            # Bot 3: Knowledge Graph & Regulatory Compliance
│   └── graph.py                # Graph traversal for testing, safety, performance
│
├── compliance/                 # Bot 3: Compliance & Regulatory Logic
│   ├── qco_engine.py           # Statutory QCO order verification
│   ├── certification_engine.py # Conformity assessment scheme details
│   └── warning_rules.py        # Red/Yellow/Green traffic-light warning system
│
├── backend/                    # Bot 4: Full-Stack & Integration Engineer
│   └── app/
│       ├── main.py             # FastAPI entrypoint serving API & React SPA
│       ├── api/routes.py       # /recommend, /standards, /qco, /evaluate
│       └── services/
│           ├── recommendation_service.py # Unified orchestrator
│           └── llm_service.py  # Grounded RAG explanation & tender clause generator
│
├── frontend/                   # Bot 4: Frontend UI (React + Tailwind CSS)
│   ├── src/App.jsx             # Interactive dashboard with demo chips, badges, modal
│   └── dist/                   # Production-compiled bundle served by FastAPI
│
├── evaluation/                 # Evaluation Suite
│   ├── benchmark_queries.json  # 26 multi-domain test cases
│   └── evaluate.py             # Accuracy, recall, and compliance benchmark runner
│
└── run.py                      # One-click platform launcher
```

---

## 📡 API Reference

### `POST /api/recommend`
**Request Body:**
```json
{
  "query": "200 kW induction motor for sewage pumping"
}
```
**Response:**
```json
{
  "success": true,
  "primary_standard": {
    "standard_id": "IS 12615:2018",
    "title": "Line Operated Three Phase AC Motors (IE Code)...",
    "category": "Electrical",
    "confidence": 0.94,
    "confidence_percent": 94,
    "status": "Active"
  },
  "allied_standards": {
    "testing": [{"id": "IS 12802", "title": "Methods of test for three-phase induction motors"}],
    "safety": [{"id": "IS/IEC 60034-5", "title": "Degrees of protection (IP code)"}],
    "performance": [{"id": "IS 8789", "title": "Values of Performance Characteristics"}]
  },
  "certification": {
    "scheme": "Scheme-I / ISI Mark",
    "symbol": "ISI Monogram + CM/L"
  },
  "qco": {
    "applicable": true,
    "status": "MANDATORY_ENFORCED",
    "order_title": "Electric Motors (Quality Control) Order, 2024"
  },
  "warnings": [
    {
      "level": "GREEN",
      "badge": "CURRENT & VERIFIED",
      "title": "IS 12615:2018 is Current and Active"
    }
  ],
  "tender_clause": "TECHNICAL SPECIFICATION COMPLIANCE CLAUSE: ...",
  "explanation": [ ... ]
}
```

### `GET /api/evaluate`
Executes the automated 26-query benchmark suite and returns real-time retrieval accuracy and recall statistics.

---

## 🔮 Future Expansion (Post-MVP)

- **Multilingual Support**: Integration with Bhashini / IndicTrans2 for all 22 official Indian languages.
- **GeM & CPPP Integration**: Direct browser plugin / API hook for real-time bid validation on the Government e-Marketplace.
- **OCR Pipeline**: Ingestion of scanned legacy PDF tender tender documents using PyMuPDF and OCR.
