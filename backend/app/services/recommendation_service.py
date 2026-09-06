"""
Recommendation Service
Orchestrates end-to-end processing from query to verified procurement recommendation.
Integrated with Digital India Bhashini (MeitY) for cross-lingual regional support.
"""

from typing import Dict, Any, List, Optional
from ai_engine.vector_store import BISVectorStore
from ai_engine.ranker import BISRanker
from knowledge_graph.graph import BISKnowledgeGraph
from compliance.qco_engine import QCOEngine
from compliance.certification_engine import CertificationEngine
from compliance.warning_rules import WarningRulesEngine
from backend.app.services.llm_service import LLMExplainerService
from backend.app.services.bhashini_service import BhashiniService
from backend.app.services.sarvam_service import SarvamIntelligenceService

class RecommendationEngine:
    def __init__(self):
        self.vector_store = BISVectorStore()
        self.ranker = BISRanker(self.vector_store)
        self.knowledge_graph = BISKnowledgeGraph()
        self.qco_engine = QCOEngine()
        self.cert_engine = CertificationEngine()
        self.bhashini = BhashiniService()
        self.sarvam = SarvamIntelligenceService()

    def process_query(self, query: str, language: Optional[str] = "en") -> Dict[str, Any]:
        """
        Executes complete procurement intelligence recommendation flow.
        Supports cross-lingual translation and regional explanations via Bhashini.
        """
        # 0. Digital India Bhashini (MeitY) Translation & Normalization
        normalized_query, detected_lang = self.bhashini.translate_to_english(query, source_lang=language)
        effective_lang = language if (language and language != "auto") else detected_lang

        # 1. AI Semantic Retrieval & Ranking
        ranked_output = self.ranker.rank_and_select(normalized_query, top_k=5)
        primary = ranked_output["primary"]
        confidence = ranked_output["confidence"]
        parameters = ranked_output["parameters"]
        domains = ranked_output["domains"]
        alternates = ranked_output["alternates"]

        if not primary:
            return {
                "success": False,
                "message": "No matching Indian Standard could be identified for this requirement."
            }

        sid = primary["standard_id"]

        # 2. Knowledge Graph Traversal (Allied, Testing, Safety, Performance)
        allied_graph = self.knowledge_graph.get_allied_standards(sid)

        # 3. Compliance: QCO Verification
        qco_eval = self.qco_engine.evaluate_compliance(sid, product_text=primary["title"])

        # 4. Compliance: Certification Scheme
        cert_scheme_name = primary.get("certification_scheme", "Scheme-I / ISI Mark")
        cert_details = self.cert_engine.get_scheme_details(cert_scheme_name)

        # 5. Warning Rules Engine (Red / Yellow / Green)
        warnings = WarningRulesEngine.evaluate_warnings(primary, qco_eval, query=normalized_query)

        # 6. Sarvam AI: Grounded Explanation & Tender Clause
        explainer = self.sarvam.generate_grounded_explanation(
            query=normalized_query,
            standard=primary,
            allied=allied_graph,
            qco=qco_eval,
            confidence=confidence,
            parameters=parameters
        )

        # 7. Regional Bhashini Localization (Tamil, Marathi, Hindi)
        loc_data = self.bhashini.localize_explanation(
            standard_id=sid,
            title=primary["title"],
            category=primary["category"],
            qco_badge=qco_eval["badge"],
            cert_name=cert_details["popular_name"],
            confidence_pct=int(confidence * 100),
            target_lang=effective_lang
        )

        # Use localized explanation if user requested regional language
        explanation_reasons = loc_data["reasons"] if effective_lang in ["ta", "mr", "hi"] else explainer["reasons"]
        summary_rec = loc_data["summary"] if effective_lang in ["ta", "mr", "hi"] else explainer["summary_recommendation"]

        return {
            "success": True,
            "query": query,
            "normalized_query": normalized_query,
            "language": effective_lang,
            "detected_language": detected_lang,
            "primary_standard": {
                "standard_id": sid,
                "title": primary["title"],
                "description": primary["description"],
                "category": primary["category"],
                "department": primary["department"],
                "year": primary["year"],
                "status": primary["status"],
                "supersedes": primary.get("supersedes"),
                "confidence": confidence,
                "confidence_percent": int(confidence * 100)
            },
            "allied_standards": {
                "testing": allied_graph.get("testing", []),
                "safety": allied_graph.get("safety", []),
                "performance": allied_graph.get("performance", []),
                "general": allied_graph.get("allied", [])
            },
            "certification": {
                "scheme": cert_scheme_name,
                "popular_name": cert_details["popular_name"],
                "description": cert_details["description"],
                "statutory_basis": cert_details["statutory_basis"],
                "symbol": cert_details["symbol"],
                "lead_time_weeks": cert_details.get("lead_time_weeks", 8)
            },
            "qco": {
                "applicable": qco_eval["applicable"],
                "status": qco_eval["status"],
                "badge": qco_eval["badge"],
                "details": qco_eval["details"],
                "effective_date": qco_eval.get("effective_date"),
                "days_remaining": qco_eval.get("days_remaining", 0),
                "order_title": qco_eval.get("qco_info", {}).get("qco_title") if qco_eval.get("qco_info") else None,
                "issuing_ministry": qco_eval.get("qco_info", {}).get("issuing_ministry") if qco_eval.get("qco_info") else None
            },
            "warnings": warnings,
            "alternates": alternates,
            "extracted_parameters": parameters,
            "detected_domains": domains,
            "explanation": explanation_reasons,
            "summary_recommendation": summary_rec,
            "tender_clause": explainer["tender_clause"],
            "sarvam_metadata": explainer.get("sarvam_metadata", {
                "provider": "Sarvam AI",
                "model": "sarvam-2b",
                "role": "Indigenous Intelligence & Reasoning Layer",
                "mode": "Sovereign Grounded RAG (Offline Active)",
                "status": "Active"
            }),
            "bhashini_metadata": {
                "service": "Digital India Bhashini (MeitY)",
                "engine": "IndicTrans2",
                "source_language": detected_lang,
                "target_language": effective_lang,
                "localized_heading": loc_data.get("heading"),
                "checklist_label": loc_data.get("checklist_label"),
                "tender_notice": loc_data.get("tender_notice")
            },
            "architecture": {
                "language_layer": {
                    "name": "Digital India Bhashini",
                    "authority": "MeitY",
                    "model": "IndicTrans2",
                    "role": "Multilingual Access & Transliteration",
                    "status": "Active"
                },
                "intelligence_layer": {
                    "name": "Sarvam AI",
                    "model": explainer.get("sarvam_metadata", {}).get("model", "sarvam-2b"),
                    "role": "Query Understanding, Grounded Reasoning & Tender Clause Generation",
                    "status": "Active"
                },
                "truth_layer": {
                    "name": "BIS RAG Engine",
                    "catalog_size": 234,
                    "components": ["Dense Vector Search", "Knowledge Graph (GraphRAG)", "QCO Regulatory Engine", "Conformity Assessment Schemes"],
                    "status": "Active"
                }
            }
        }

# Alias for backward compatibility
RecommendationService = RecommendationEngine
