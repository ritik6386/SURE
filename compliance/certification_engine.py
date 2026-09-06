"""
Certification Scheme Engine
Maps products and standards to Conformity Assessment Schemes (Scheme-I, II, IV, FMCS).
"""

import os
import json
from typing import Dict, Any, Optional

class CertificationEngine:
    def __init__(self, cert_path: Optional[str] = None):
        if cert_path is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            cert_path = os.path.join(base_dir, "data", "certifications.json")
        self.cert_path = cert_path
        self.schemes: Dict[str, Any] = {}
        self.load_schemes()

    def load_schemes(self):
        with open(self.cert_path, "r", encoding="utf-8") as f:
            self.schemes = json.load(f)

    def get_scheme_details(self, scheme_name: str) -> Dict[str, Any]:
        """Returns details of a certification scheme."""
        for name, details in self.schemes.items():
            if scheme_name.lower() in name.lower() or name.lower() in scheme_name.lower():
                return details
        # Default fallback
        return {
            "scheme_code": "Scheme-I",
            "popular_name": "Standard ISI Mark / Conformity",
            "description": "Standard third-party certification conformity requirement.",
            "statutory_basis": "BIS Act 2016",
            "symbol": "ISI Standard Mark",
            "lead_time_weeks": 8,
            "is_mandatory_for_qco": True
        }
