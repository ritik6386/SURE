"""
Automated Test Suite for Digital India Bhashini Multilingual & Indigenous AI Engine
"""

import sys
from fastapi.testclient import TestClient
from backend.app.main import app

def test_bhashini_multilingual_pipeline():
    # Ensure UTF-8 console output
    if sys.stdout.encoding != 'utf-8':
        sys.stdout.reconfigure(encoding='utf-8')

    client = TestClient(app)

    # 1. Test Languages Endpoint
    print("\n--- 1. Testing /api/languages ---")
    lang_res = client.get("/api/languages")
    assert lang_res.status_code == 200, f"Expected 200, got {lang_res.status_code}"
    langs = lang_res.json()["languages"]
    lang_codes = [l["code"] for l in langs]
    print(f"[PASS] Supported languages: {lang_codes}")
    assert "ta" in lang_codes, "Tamil ('ta') must be present"
    assert "mr" in lang_codes, "Marathi ('mr') must be present"
    assert "hi" in lang_codes, "Hindi ('hi') must be present"
    assert "en" in lang_codes, "English ('en') must be present"

    # 2. Test Tamil Procurement Recommendation
    print("\n--- 2. Testing Tamil (தமிழ்) Procurement Query ---")
    ta_query = "சாக்கடை நீரேற்றுக்கான 200 kW தூண்டல் மோட்டார்"
    ta_res = client.post("/api/recommend", json={"query": ta_query, "language": "ta"})
    assert ta_res.status_code == 200
    ta_data = ta_res.json()
    assert ta_data["success"] is True
    assert ta_data["primary_standard"]["standard_id"] == "IS 12615:2018"
    assert ta_data["primary_standard"]["confidence_percent"] >= 90
    assert ta_data["detected_language"] == "ta"
    assert ta_data["bhashini_metadata"]["engine"] == "IndicTrans2"
    assert len(ta_data["explanation"]) > 0
    print(f"[PASS] Tamil Query: {ta_query}")
    print(f"       -> Primary Standard: {ta_data['primary_standard']['standard_id']}")
    print(f"       -> Confidence: {ta_data['primary_standard']['confidence_percent']}%")
    print(f"       -> Localized Heading: {ta_data['bhashini_metadata']['localized_heading']}")
    print(f"       -> Localized Rationale: {ta_data['explanation'][0]}")

    # 3. Test Marathi Procurement Recommendation
    print("\n--- 3. Testing Marathi (मराठी) Procurement Query ---")
    mr_query = "सांडपाणी उपसा करण्यासाठी 200 kW इंडक्शन मोटर"
    mr_res = client.post("/api/recommend", json={"query": mr_query, "language": "mr"})
    assert mr_res.status_code == 200
    mr_data = mr_res.json()
    assert mr_data["success"] is True
    assert mr_data["primary_standard"]["standard_id"] == "IS 12615:2018"
    assert mr_data["primary_standard"]["confidence_percent"] >= 90
    assert mr_data["detected_language"] == "mr"
    assert len(mr_data["explanation"]) > 0
    print(f"[PASS] Marathi Query: {mr_query}")
    print(f"       -> Primary Standard: {mr_data['primary_standard']['standard_id']}")
    print(f"       -> Confidence: {mr_data['primary_standard']['confidence_percent']}%")
    print(f"       -> Localized Heading: {mr_data['bhashini_metadata']['localized_heading']}")
    print(f"       -> Localized Rationale: {mr_data['explanation'][0]}")

    # 4. Test Hindi Procurement Recommendation
    print("\n--- 4. Testing Hindi (हिन्दी) Procurement Query ---")
    hi_query = "सीवेज पंपिंग के लिए 200 kW इंडक्शन मोटर"
    hi_res = client.post("/api/recommend", json={"query": hi_query, "language": "hi"})
    assert hi_res.status_code == 200
    hi_data = hi_res.json()
    assert hi_data["success"] is True
    assert hi_data["primary_standard"]["standard_id"] == "IS 12615:2018"
    assert hi_data["primary_standard"]["confidence_percent"] >= 90
    assert hi_data["detected_language"] == "hi"
    print(f"[PASS] Hindi Query: {hi_query}")
    print(f"       -> Primary Standard: {hi_data['primary_standard']['standard_id']}")
    print(f"       -> Confidence: {hi_data['primary_standard']['confidence_percent']}%")
    print(f"       -> Localized Heading: {hi_data['bhashini_metadata']['localized_heading']}")

    # 5. Test Frontend Static Distribution Serving
    print("\n--- 5. Testing Frontend Static Files & SPA Root ---")
    root_res = client.get("/")
    assert root_res.status_code == 200
    assert "SURE" in root_res.text or "saarthi" in root_res.text or "html" in root_res.text.lower()
    print("[PASS] SPA root / serves index.html successfully")

    print("\n=======================================================")
    print("ALL BHASHINI MULTILINGUAL INTEGRATION TESTS PASSED CLEANLY!")
    print("=======================================================")

if __name__ == "__main__":
    test_bhashini_multilingual_pipeline()
