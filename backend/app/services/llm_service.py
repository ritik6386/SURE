"""
LLM & RAG Explanation Layer
Generates grounded justifications and copy-paste tender clauses strictly based on retrieved BIS context.
"""

from typing import Dict, Any, List

class LLMExplainerService:
    @staticmethod
    def generate_explanation(
        query: str,
        standard: Dict[str, Any],
        allied: Dict[str, Any],
        qco: Dict[str, Any],
        confidence: float,
        parameters: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Generates explainable rationale and formatted tender procurement clause.
        """
        sid = standard["standard_id"]
        title = standard["title"]
        cat = standard["category"]
        dept = standard["department"]
        cert = standard.get("certification_scheme", "Scheme-I / ISI Mark")

        # Explainability points
        reasons = [
            f"Product Domain: Identified as '{cat}' categorized under BIS Technical Committee '{dept}'.",
            f"Primary Benchmark: '{sid}' specifies performance, ratings, and design qualification for {title.lower()}.",
            f"Semantic Relevance: Calculated semantic similarity confidence of {int(confidence * 100)}% based on query intent.",
            f"Regulatory Conformity: Governed under '{cert}'.",
        ]

        if parameters:
            param_details = ", ".join(f"{k.capitalize()}: {v}" for k, v in parameters.items())
            reasons.append(f"Extracted Technical Parameters: {param_details}.")

        if qco.get("applicable"):
            reasons.append(f"Statutory Order: Governed by {qco.get('qco_info', {}).get('qco_title', 'Central QCO')}. Compliance is mandatory for public tender acceptance.")

        # Testing & safety allied list
        test_stds = [t["id"] for t in allied.get("testing", [])]
        safety_stds = [s["id"] for s in allied.get("safety", [])]
        perf_stds = [p["id"] for p in allied.get("performance", [])]

        if test_stds:
            reasons.append(f"Normative Testing: Acceptance and factory batch testing must conform to {', '.join(test_stds)}.")
        if safety_stds:
            reasons.append(f"Safety & Environmental: Mandatory electrical/mechanical safety qualification according to {', '.join(safety_stds)}.")

        # Construct Tender Specification Clause
        tender_clause = (
            f"TECHNICAL SPECIFICATION COMPLIANCE CLAUSE:\n"
            f"1. Governing Standard: The supplied items shall strictly conform to Indian Standard {sid} "
            f"(\"{title}\") along with all current amendments.\n"
            f"2. Certification & Marking: The bidder/OEM must possess a valid BIS License under {cert}. "
            f"The standard mark along with the valid CM/L (or CRS R-number) must be indelibly embossed/printed on each unit.\n"
        )

        if qco.get("applicable"):
            qco_title = qco.get("qco_info", {}).get("qco_title", "Central Quality Control Order")
            tender_clause += (
                f"3. Statutory Quality Control Order (QCO): Strict adherence to {qco_title} is mandatory. "
                f"Bids offering uncertified products or seeking post-award testing exemptions shall be summarily rejected.\n"
            )

        if test_stds:
            tender_clause += f"4. Routine and Type Testing: Type test certificates as per {', '.join(test_stds)} issued by a NABL/BIS-accredited laboratory within the past 3 years must be submitted with the technical bid.\n"

        if safety_stds:
            tender_clause += f"5. Safety Standards: Equipment enclosure and operational safety shall comply with {', '.join(safety_stds)}.\n"

        tender_clause += (
            f"6. Inspection & Verification: Consignee reserves the right to inspect and sample test supplies "
            f"at the manufacturer's works or upon delivery as per BIS sampling protocols."
        )

        summary_recommendation = (
            f"Include {sid} as the primary mandatory specification in the tender document. "
            f"Mandate {cert} certification and verify adherence to allied testing standard(s) {', '.join(test_stds) if test_stds else 'prescribed in the standard'}."
        )

        return {
            "summary_recommendation": summary_recommendation,
            "reasons": reasons,
            "tender_clause": tender_clause
        }
