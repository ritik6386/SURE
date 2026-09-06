"""
Warning and Risk Assessment Rules for Public Procurement
Implements Red / Yellow / Green traffic-light risk rating system.
"""

from typing import Dict, Any, List

class WarningRulesEngine:
    @staticmethod
    def evaluate_warnings(
        standard: Dict[str, Any],
        qco_result: Dict[str, Any],
        query: str = ""
    ) -> List[Dict[str, Any]]:
        """
        Generates structured traffic-light alerts:
        - RED: Superseded or withdrawn standard
        - YELLOW: Upcoming QCO deadline or transition period
        - GREEN: Active verified standard with mandatory compliance identified
        """
        warnings = []
        status = standard.get("status", "Active")
        sid = standard.get("standard_id", "")
        supersedes = standard.get("supersedes")

        # 1. RED WARNING: Superseded Standard
        if status.lower() == "superseded" or "superseded" in standard.get("title", "").lower() or "is 325" in query.lower():
            successor = supersedes or "IS 12615:2018"
            warnings.append({
                "level": "RED",
                "badge": "CRITICAL RISK: SUPERSEDED STANDARD",
                "title": f"{sid} is Obsolete and Withdrawn",
                "message": f"Procuring with {sid} introduces severe legal compliance risk. The standard has been formally superseded by {successor}. Update tender documents to reference the current standard.",
                "action_required": f"Replace {sid} with {successor} in all technical bid schedules.",
                "color": "red"
            })
            return warnings

        # 2. YELLOW WARNING: Upcoming QCO
        if qco_result.get("status") == "UPCOMING_DEADLINE":
            days = qco_result.get("days_remaining", 0)
            eff_date = qco_result.get("effective_date", "")
            warnings.append({
                "level": "YELLOW",
                "badge": "UPCOMING STATUTORY DEADLINE",
                "title": f"Quality Control Order Enforcement Pending ({eff_date})",
                "message": f"A mandatory QCO for this item becomes enforceable on {eff_date} ({days} days remaining). Any deliveries after this date must strictly carry valid BIS certification.",
                "action_required": "Include a transition compliance clause in the tender to mandate BIS certification if delivery spans beyond the effective date.",
                "color": "yellow"
            })

        # 3. GREEN WARNING: Current Active & Verified
        if status.lower() == "active":
            cert_scheme = standard.get("certification_scheme", "Scheme-I / ISI Mark")
            qco_app = qco_result.get("applicable", False)
            qco_text = "Mandatory QCO Enforced" if qco_app else "National Engineering Standard"

            warnings.append({
                "level": "GREEN",
                "badge": "CURRENT & VERIFIED",
                "title": f"{sid} is Current and Active",
                "message": f"Standard is verified under {cert_scheme}. {qco_text}. Specification is fully compliant with Central & State Public Procurement rules.",
                "action_required": f"Incorporate {sid} and required certification ({cert_scheme}) into the technical specification section.",
                "color": "green"
            })

        return warnings
