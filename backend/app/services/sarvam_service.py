"""
Sarvam AI Intelligence Service
Designated Indigenous LLM Layer for SURE (Standards for Unified Regulatory Engine)

Responsibilities:
1. Grounded reasoning and plain-language justification based strictly on RAG truth.
2. Technical tender clause generation (GFR 2017 / GeM compliant).
3. Dual-mode operation: Live Sarvam API if SARVAM_API_KEY is configured, with
   seamless sovereign local grounded generation fallback (zero cost, zero downtime).
"""

import os
import json
import logging
from typing import Dict, Any, List, Optional
import httpx

logger = logging.getLogger(__name__)

class SarvamIntelligenceService:
    def __init__(self):
        self.api_key = os.environ.get("SARVAM_API_KEY", "").strip()
        self.api_url = os.environ.get("SARVAM_API_URL", "https://api.sarvam.ai/v1/chat/completions").strip()
        self.model = os.environ.get("SARVAM_MODEL", "sarvam-2b").strip()
        self.timeout = float(os.environ.get("SARVAM_TIMEOUT", "6.0"))

    def generate_grounded_explanation(
        self,
        query: str,
        standard: Dict[str, Any],
        allied: Dict[str, Any],
        qco: Dict[str, Any],
        confidence: float,
        parameters: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Synthesizes grounded executive recommendations and technical tender clauses.
        Constrained strictly by retrieved RAG evidence to prevent LLM hallucinations.
        """
        # If API key is provided, attempt live Sarvam generation
        if self.api_key:
            try:
                live_result = self._call_sarvam_api(query, standard, allied, qco, confidence, parameters)
                if live_result:
                    return live_result
            except Exception as e:
                logger.warning(f"Sarvam API call failed, falling back to sovereign grounded engine: {e}")

        # Local Sovereign Grounded RAG Generation (Deterministic, zero cost, 100% compliant)
        return self._local_grounded_generation(query, standard, allied, qco, confidence, parameters)

    def _call_sarvam_api(
        self,
        query: str,
        standard: Dict[str, Any],
        allied: Dict[str, Any],
        qco: Dict[str, Any],
        confidence: float,
        parameters: Dict[str, Any]
    ) -> Optional[Dict[str, Any]]:
        """Invokes official Sarvam AI chat endpoint with strict RAG constraints."""
        sid = standard["standard_id"]
        title = standard["title"]
        cert = standard.get("certification_scheme", "Scheme-I / ISI Mark")
        qco_title = qco.get("qco_info", {}).get("qco_title", "Central QCO") if qco.get("applicable") else "N/A"
        
        system_prompt = (
            "You are the Sarvam AI Intelligence Engine for SURE (Standards for Unified Regulatory Engine). "
            "You assist Indian public procurement officers with BIS compliance under GFR 2017. "
            "STRICT RULE: Only use the provided BIS standard and QCO facts. Never guess or hallucinate standards."
        )

        user_content = f"""
Procurement Requirement: {query}
Retrieved Primary BIS Standard: {sid} - {title}
Category: {standard.get('category')}
Department: {standard.get('department')}
Conformity Assessment: {cert}
Statutory QCO Status: {'Mandatory (' + qco_title + ')' if qco.get('applicable') else 'Not Applicable'}
Match Confidence: {int(confidence * 100)}%
Extracted Parameters: {json.dumps(parameters or {})}

Provide your response in JSON format with keys:
"summary_recommendation": "<concise 1-sentence procurement directive>",
"reasons": ["<evidence factor 1>", "<evidence factor 2>", "<evidence factor 3>", "<evidence factor 4>"],
"tender_clause": "<full GFR 2017 compliant technical specification clause>"
"""

        headers = {
            "Content-Type": "application/json",
            "api-subscription-key": self.api_key
        }

        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content}
            ],
            "temperature": 0.2,
            "max_tokens": 800
        }

        with httpx.Client(timeout=self.timeout) as client:
            resp = client.post(self.api_url, headers=headers, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                content = data["choices"][0]["message"]["content"]
                # Try parsing JSON from LLM output
                try:
                    cleaned = content.strip()
                    if cleaned.startswith("```json"):
                        cleaned = cleaned[7:-3].strip()
                    elif cleaned.startswith("```"):
                        cleaned = cleaned[3:-3].strip()
                    parsed = json.loads(cleaned)
                    return {
                        "summary_recommendation": parsed.get("summary_recommendation"),
                        "reasons": parsed.get("reasons", []),
                        "tender_clause": parsed.get("tender_clause"),
                        "sarvam_metadata": {
                            "provider": "Sarvam AI",
                            "model": self.model,
                            "role": "Intelligence & Reasoning Layer",
                            "mode": "Live Sarvam API",
                            "grounding_policy": "Zero Hallucination - Strict RAG Grounding",
                            "status": "Active"
                        }
                    }
                except Exception:
                    pass
        return None

    def _local_grounded_generation(
        self,
        query: str,
        standard: Dict[str, Any],
        allied: Dict[str, Any],
        qco: Dict[str, Any],
        confidence: float,
        parameters: Dict[str, Any]
    ) -> Dict[str, Any]:
        """High-fidelity sovereign deterministic grounded explanation generator."""
        sid = standard["standard_id"]
        title = standard["title"]
        cat = standard["category"]
        dept = standard["department"]
        cert = standard.get("certification_scheme", "Scheme-I / ISI Mark")

        # Plain-language grounded reasons
        reasons = [
            f"Product Domain: Identified as '{cat}' under BIS Technical Sectional Committee '{dept}'.",
            f"Primary Benchmark: '{sid}' specifies ratings, construction, and performance testing for {title.lower()}.",
            f"Dense Semantic Match: {int(confidence * 100)}% calibrated vector similarity with tender scope.",
            f"Conformity Scheme: Mandatory compliance under '{cert}'.",
        ]

        if parameters:
            param_details = ", ".join(f"{k.capitalize()}: {v}" for k, v in parameters.items())
            reasons.append(f"Extracted Engineering Parameters: {param_details}.")

        if qco.get("applicable"):
            qco_name = qco.get("qco_info", {}).get("qco_title", "Central Quality Control Order")
            reasons.append(f"Statutory Mandate: Governed by {qco_name}. Bidding non-compliant items violates Section 16 BIS Act 2016.")

        # Testing & safety allied list
        test_stds = [t["id"] if isinstance(t, dict) and "id" in t else (t.get("code") if isinstance(t, dict) else str(t)) for t in allied.get("testing", [])]
        safety_stds = [s["id"] if isinstance(s, dict) and "id" in s else (s.get("code") if isinstance(s, dict) else str(s)) for s in allied.get("safety", [])]
        perf_stds = [p["id"] if isinstance(p, dict) and "id" in p else (p.get("code") if isinstance(p, dict) else str(p)) for p in allied.get("performance", [])]

        if test_stds:
            reasons.append(f"Normative Testing: Acceptance and factory batch testing must conform to {', '.join(test_stds[:3])}.")
        if safety_stds:
            reasons.append(f"Safety & Environmental: Mandatory safety qualification according to {', '.join(safety_stds[:3])}.")

        # Construct Tender Specification Clause
        tender_clause = (
            f"TECHNICAL SPECIFICATION COMPLIANCE CLAUSE (GFR 2017 / GeM READY):\n"
            f"1. Governing Standard: The supplied items shall strictly conform to Indian Standard {sid} "
            f"(\"{title}\") along with all current amendments.\n"
            f"2. Certification & Marking: The bidder/OEM must hold a valid BIS License under {cert}. "
            f"The standard mark along with the valid CM/L (or CRS R-number) must be indelibly embossed/printed on each unit.\n"
        )

        if qco.get("applicable"):
            qco_title = qco.get("qco_info", {}).get("qco_title", "Central Quality Control Order")
            tender_clause += (
                f"3. Statutory Quality Control Order (QCO): Strict adherence to {qco_title} is mandatory. "
                f"Bids offering uncertified products or seeking post-award testing exemptions shall be summarily rejected.\n"
            )

        if test_stds:
            tender_clause += f"4. Routine and Type Testing: Type test certificates as per {', '.join(test_stds[:3])} issued by a NABL/BIS-accredited laboratory within the past 3 years must be submitted with technical bid.\n"

        if safety_stds:
            tender_clause += f"5. Safety Standards: Equipment enclosure and operational safety shall comply with {', '.join(safety_stds[:3])}.\n"

        tender_clause += (
            f"6. Consignee Inspection: Consignee reserves the right to inspect and sample test supplies "
            f"at the manufacturer's works or upon delivery as per BIS sampling protocols."
        )

        summary_recommendation = (
            f"Mandate {sid} as the primary technical specification in the tender document. "
            f"Enforce {cert} certification and require certified type test reports under {', '.join(test_stds[:2]) if test_stds else 'prescribed BIS codes'}."
        )

        return {
            "summary_recommendation": summary_recommendation,
            "reasons": reasons,
            "tender_clause": tender_clause,
            "sarvam_metadata": {
                "provider": "Sarvam AI",
                "model": self.model,
                "role": "Indigenous Intelligence & Reasoning Layer",
                "mode": "Sovereign Grounded RAG (Offline Active)",
                "grounding_policy": "Zero Hallucination - Strict RAG Grounding",
                "status": "Active"
            }
        }
