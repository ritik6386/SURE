"""
Automated Test Suite for Sarvam AI Indigenous Intelligence Layer
Verifies the 3-tier sovereign architecture:
1. Bhashini (Language Layer)
2. Sarvam AI (Intelligence Layer)
3. BIS RAG (Truth Layer)
"""

import sys
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.services.sarvam_service import SarvamIntelligenceService

def test_sarvam_and_three_tier_architecture():
    # Ensure UTF-8 console output
    if sys.stdout.encoding != 'utf-8':
        sys.stdout.reconfigure(encoding='utf-8')

    client = TestClient(app)

    # 1. Unit Test SarvamIntelligenceService directly
    print("\n--- 1. Testing SarvamIntelligenceService Directly ---")
    sarvam = SarvamIntelligenceService()
    dummy_std = {
        "standard_id": "IS 12615:2018",
        "title": "Line Operated Three Phase Induction Motors",
        "category": "Electrical",
        "department": "ETD",
        "certification_scheme": "Scheme-I / ISI Mark"
    }
    dummy_allied = {
        "testing": [{"id": "IS 12802", "title": "Testing Methods"}],
        "safety": [{"id": "IS/IEC 60034-5", "title": "IP Protection"}]
    }
    dummy_qco = {
        "applicable": True,
        "qco_info": {"qco_title": "Electric Motors QCO, 2024"}
    }
    explanation = sarvam.generate_grounded_explanation(
        query="200 kW induction motor",
        standard=dummy_std,
        allied=dummy_allied,
        qco=dummy_qco,
        confidence=0.96,
        parameters={"power": "200 KW"}
    )
    assert "IS 12615:2018" in explanation["summary_recommendation"]
    assert len(explanation["reasons"]) >= 4
    assert "TECHNICAL SPECIFICATION COMPLIANCE CLAUSE" in explanation["tender_clause"]
    assert explanation["sarvam_metadata"]["provider"] == "Sarvam AI"
    assert explanation["sarvam_metadata"]["role"] == "Indigenous Intelligence & Reasoning Layer"
    print(f"[PASS] Sarvam provider: {explanation['sarvam_metadata']['provider']}")
    print(f"[PASS] Sarvam model: {explanation['sarvam_metadata']['model']}")
    print(f"[PASS] Sarvam mode: {explanation['sarvam_metadata']['mode']}")

    # 2. Integration Test via /api/recommend with 3-Tier Architecture Verification
    print("\n--- 2. Testing End-to-End /api/recommend Architecture Response ---")
    res = client.post("/api/recommend", json={"query": "200 kW induction motor for sewage pumping", "language": "en"})
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True

    # Verify 3 Layers present in architecture object
    arch = data["architecture"]
    print(f"[PASS] Layer 1 (Language): {arch['language_layer']['name']} ({arch['language_layer']['model']})")
    print(f"[PASS] Layer 2 (Intelligence): {arch['intelligence_layer']['name']} ({arch['intelligence_layer']['model']})")
    print(f"[PASS] Layer 3 (Truth / RAG): {arch['truth_layer']['name']} ({arch['truth_layer']['catalog_size']} BIS Standards)")

    assert arch["language_layer"]["name"] == "Digital India Bhashini"
    assert arch["intelligence_layer"]["name"] == "Sarvam AI"
    assert arch["truth_layer"]["name"] == "BIS RAG Engine"

    # Verify Sarvam metadata and Tender Clause
    assert data["sarvam_metadata"]["provider"] == "Sarvam AI"
    assert "IS 12615:2018" in data["tender_clause"]

    # 3. Multilingual Flow: Tamil with Sarvam Grounding
    print("\n--- 3. Testing Multilingual Flow: Tamil Query -> Bhashini -> Sarvam -> RAG ---")
    ta_res = client.post("/api/recommend", json={"query": "சாக்கடை நீரேற்றுக்கான 200 kW தூண்டல் மோட்டார்", "language": "ta"})
    assert ta_res.status_code == 200
    ta_data = ta_res.json()
    assert ta_data["detected_language"] == "ta"
    assert ta_data["architecture"]["intelligence_layer"]["name"] == "Sarvam AI"
    assert ta_data["primary_standard"]["standard_id"] == "IS 12615:2018"
    print(f"[PASS] Tamil Normalized Query: {ta_data['normalized_query']}")
    print(f"[PASS] Sarvam Grounded Primary Match: {ta_data['primary_standard']['standard_id']}")

    print("\n=======================================================")
    print("ALL SARVAM AI & 3-TIER ARCHITECTURE TESTS PASSED CLEANLY!")
    print("=======================================================")

if __name__ == "__main__":
    test_sarvam_and_three_tier_architecture()
