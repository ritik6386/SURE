"""
Quality Control Order (QCO) Regulatory Compliance Engine
Evaluates statutory compliance under the BIS Act, 2016 and Central Ministry notifications.
"""

import os
import json
from datetime import datetime
from typing import Dict, Any, Optional, List

class QCOEngine:
    def __init__(self, qco_path: Optional[str] = None):
        if qco_path is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            qco_path = os.path.join(base_dir, "data", "qco.json")
        self.qco_path = qco_path
        self.qco_list: List[Dict[str, Any]] = []
        self.load_qco()

    def load_qco(self):
        with open(self.qco_path, "r", encoding="utf-8") as f:
            self.qco_list = json.load(f)

    def evaluate_compliance(self, standard_id: str, product_text: str = "") -> Dict[str, Any]:
        """
        Determines QCO applicability, statutory status, and timeline enforcement.
        """
        clean_std = standard_id.upper().strip()
        prefix_std = clean_std.split(":")[0].strip()
        product_lower = product_text.lower()

        matched_qco = None
        for qco in self.qco_list:
            q_std = qco["standard_id"].upper().strip()
            if prefix_std == q_std or prefix_std == q_std.split(":")[0].strip():
                matched_qco = qco
                break

        if not matched_qco:
            # Fallback search by standard ID prefix in central registry
            for qco in self.qco_list:
                q_prefix = qco["standard_id"].upper().split(":")[0].replace("(", "").replace(")", "").strip()
                c_prefix = clean_std.split(":")[0].replace("(", "").replace(")", "").strip()
                if q_prefix == c_prefix or q_prefix.split()[0:2] == c_prefix.split()[0:2]:
                    matched_qco = qco
                    break

        # Fallback search by product name
        if not matched_qco:
            for qco in self.qco_list:
                if any(w in product_lower for w in qco["product_name"].lower().split() if len(w) > 4):
                    matched_qco = qco
                    break

        # Check in standards.json directly if this standard has qco_applicable = True
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        standards_path = os.path.join(base_dir, "data", "standards.json")
        std_qco_flag = False
        std_qco_ref = None
        if os.path.exists(standards_path):
            with open(standards_path, "r", encoding="utf-8") as f:
                for s in json.load(f):
                    if s["standard_id"].upper().split(":")[0].strip() == clean_std.split(":")[0].strip():
                        std_qco_flag = s.get("qco_applicable", False)
                        std_qco_ref = s.get("qco_reference")
                        break

        if not matched_qco and not std_qco_flag:
            return {
                "applicable": False,
                "status": "VOLUNTARY / STANDARD_CONFORMITY",
                "badge": "Standard Conformity",
                "details": "No mandatory Central Quality Control Order notified. Procurement compliance defaults to General Financial Rules (GFR) 2017 specifications.",
                "qco_info": None
            }

        # If matched by standard flag but not in central 10-table
        if not matched_qco and std_qco_flag:
            order_name = std_qco_ref or f"Mandatory Quality Control Order ({clean_std.split(':')[0]})"
            return {
                "applicable": True,
                "status": "MANDATORY_ENFORCED",
                "badge": "Mandatory QCO Applicable",
                "details": f"Mandatory under {order_name}. Public procurement tenders must strictly enforce BIS certification.",
                "effective_date": "Enforced",
                "days_remaining": 0,
                "qco_info": {
                    "product_name": clean_std,
                    "qco_title": order_name,
                    "issuing_ministry": "Competent Administrative Ministry",
                    "enforcement_status": "MANDATORY_ENFORCED"
                }
            }

        status = matched_qco["enforcement_status"]
        eff_date_str = matched_qco["effective_date"]
        eff_date = datetime.strptime(eff_date_str, "%Y-%m-%d")
        now = datetime.now()

        days_remaining = (eff_date - now).days

        if status == "UPCOMING_DEADLINE" and days_remaining > 0:
            badge = "Upcoming Mandatory QCO"
            desc = f"Mandatory QCO notified by {matched_qco['issuing_ministry']} becoming strictly enforceable on {eff_date_str} ({days_remaining} days remaining)."
        else:
            status = "MANDATORY_ENFORCED"
            badge = "Mandatory QCO Applicable"
            desc = f"Mandatory under {matched_qco['qco_title']} issued by {matched_qco['issuing_ministry']}. Bidders without valid BIS certification must be disqualified."

        return {
            "applicable": True,
            "status": status,
            "badge": badge,
            "details": desc,
            "effective_date": eff_date_str,
            "days_remaining": days_remaining if days_remaining > 0 else 0,
            "qco_info": matched_qco
        }
