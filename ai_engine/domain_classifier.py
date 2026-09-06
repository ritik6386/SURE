"""
Domain Classifier and Parameter Extractor for Public Procurement Queries
Identifies target procurement sector and extracts engineering parameters.
"""

import re
from typing import Dict, List, Any

DOMAIN_TAXONOMY = {
    "Electrical": [
        "motor", "induction", "transformer", "cable", "wire", "switchgear", "circuit breaker",
        "mcb", "mccb", "rccb", "energy meter", "smart meter", "earthing", "lightning",
        "luminaire", "lighting", "fan", "substation", "acsr", "fuse", "relay"
    ],
    "Solar Energy": [
        "solar", "photovoltaic", "pv module", "solar panel", "inverter", "grid tie",
        "islanding", "solar pump", "solar water heater", "flat plate collector",
        "lithium battery", "battery storage", "almm", "mnre"
    ],
    "Electronics & IT": [
        "laptop", "notebook", "desktop", "computer", "server", "screen", "display",
        "cctv", "camera", "surveillance", "biometric", "fingerprint", "pos", "smart card",
        "ups", "printer", "scanner", "led driver", "fastag", "firewall", "switch"
    ],
    "Civil & Construction": [
        "cement", "opc", "ppc", "concrete", "rcc", "rebar", "tmt", "structural steel",
        "beam", "column", "girder", "upvc pipe", "pvc pipe", "di pipe", "ductile iron",
        "aggregate", "sand", "brick", "masonry", "block", "bitumen", "asphalt", "culvert"
    ],
    "Mechanical": [
        "pump", "centrifugal", "submersible", "valve", "sluice", "butterfly", "gate valve",
        "fire extinguisher", "diesel engine", "pressure vessel", "compressor", "air receiver"
    ],
    "Medical Devices": [
        "syringe", "hypodermic", "gloves", "surgical", "medical", "mask", "respirator",
        "n95", "ffp2", "thermometer", "ppe", "hospital", "infusion", "patient monitor"
    ],
    "Chemicals": [
        "caustic soda", "sodium hydroxide", "acid", "sulphuric", "nitric", "plastic",
        "polyethylene", "hdpe", "pvc resin", "paint", "enamel", "bleaching powder"
    ],
    "Food & Agriculture": [
        "drinking water", "bottled water", "mineral water", "potable water", "grain silo",
        "cattle feed", "livestock", "milk powder", "infant food", "water quality"
    ]
}

def extract_parameters(query: str) -> Dict[str, Any]:
    """Extracts technical parameters like power rating, voltage, capacity, application."""
    params = {}
    q_lower = query.lower()

    # Power (kW, HP, MW, W)
    power_match = re.search(r'(\d+(?:\.\d+)?)\s*(kw|hp|mw|w)\b', q_lower)
    if power_match:
        params["power"] = f"{power_match.group(1)} {power_match.group(2).upper()}"

    # Voltage (kV, V)
    voltage_match = re.search(r'(\d+(?:\.\d+)?)\s*(kv|v)\b', q_lower)
    if voltage_match:
        params["voltage"] = f"{voltage_match.group(1)} {voltage_match.group(2).upper()}"

    # Current / Rating (A, Amps, kVA, MVA)
    current_match = re.search(r'(\d+(?:\.\d+)?)\s*(kva|mva|a|amp|amps)\b', q_lower)
    if current_match:
        params["rating"] = f"{current_match.group(1)} {current_match.group(2).upper()}"

    # Application mentions
    applications = ["sewage pumping", "water supply", "drinking water", "irrigation", "rooftop", "substation", "hospital", "highway", "office"]
    for app in applications:
        if app in q_lower:
            params["application"] = app.capitalize()
            break

    # Specific Standard ID in query (e.g. IS 325, IS 12615)
    std_match = re.search(r'\b(is\s*\d+(?:\s*(?:part|\(part)\s*\d+)?)\b', q_lower)
    if std_match:
        params["referenced_standard"] = std_match.group(1).upper().replace("  ", " ")

    return params

def classify_domain(query: str) -> List[Dict[str, Any]]:
    """Scores query across domains and returns sorted matching domains."""
    q_lower = query.lower()
    scores = {}

    for domain, keywords in DOMAIN_TAXONOMY.items():
        score = 0
        for kw in keywords:
            if kw in q_lower:
                # Give higher weight to exact word or multi-word matches
                score += (2 if " " in kw else 1)
        if score > 0:
            scores[domain] = score

    if not scores:
        return [{"domain": "General / Cross-Domain", "score": 1.0}]

    total = sum(scores.values())
    ranked = [
        {"domain": d, "score": round(s / total, 3)}
        for d, s in sorted(scores.items(), key=lambda x: x[1], reverse=True)
    ]
    return ranked
