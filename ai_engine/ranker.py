"""
Ranker & Candidate Evaluator for BIS Standards
Selects primary recommendation, filters alternates, and computes confidence.
"""

from typing import Dict, Any, List
from ai_engine.vector_store import BISVectorStore
from ai_engine.domain_classifier import classify_domain, extract_parameters

class BISRanker:
    def __init__(self, vector_store: BISVectorStore):
        self.vector_store = vector_store

    def rank_and_select(self, query: str, top_k: int = 5) -> Dict[str, Any]:
        """
        Retrieves, ranks, and categorizes candidates into:
        - Primary standard recommendation
        - Alternate standards
        - Extracted parameters
        - Detected domain
        """
        raw_candidates = self.vector_store.search(query, top_k=top_k)
        params = extract_parameters(query)
        domains = classify_domain(query)

        if not raw_candidates:
            return {
                "primary": None,
                "alternates": [],
                "parameters": params,
                "domains": domains
            }

        primary = raw_candidates[0]
        alternates = raw_candidates[1:]

        return {
            "primary": primary["standard"],
            "confidence": primary["confidence"],
            "raw_score": primary["raw_score"],
            "alternates": [
                {
                    "standard_id": c["standard"]["standard_id"],
                    "title": c["standard"]["title"],
                    "confidence": c["confidence"],
                    "category": c["standard"]["category"]
                }
                for c in alternates
            ],
            "parameters": params,
            "domains": domains
        }
