"""
Automated Verification Suite for Document Upload & Procurement Audit Engine
"""

from fastapi.testclient import TestClient
from backend.app.main import app

def test_document_audit_pipeline():
    client = TestClient(app)

    # 1. Test sample-documents endpoint
    samples_res = client.get("/api/sample-documents")
    assert samples_res.status_code == 200
    samples = samples_res.json()["samples"]
    print(f"[PASS] Sample documents endpoint returned {len(samples)} sample files")

    # 2. Test uploading Water Supply Tender
    water_tender = next(s for s in samples if "Water_Supply" in s["filename"])
    files = {"file": (water_tender["filename"], water_tender["content"].encode("utf-8"), "text/plain")}
    upload_res = client.post("/api/upload-document", files=files)
    assert upload_res.status_code == 200
    data = upload_res.json()
    total_items = data["summary"]["total_items_detected"]
    comp_score = data["summary"]["compliance_score_percent"]
    print(f"[PASS] Water Supply Tender: {total_items} items detected, compliance rate: {comp_score}%")
    assert total_items >= 5

    for item in data["evaluated_items"]:
        sid = item["primary_standard"]["standard_id"]
        qco_badge = item["qco"]["badge"]
        title = item["title"][:40]
        print(f"   - Item {item['item_index']}: {title} -> {sid} (QCO: {qco_badge})")

    # 3. Test uploading Obsolete Tender
    obsolete_tender = next(s for s in samples if "Obsolete" in s["filename"])
    files_obs = {"file": (obsolete_tender["filename"], obsolete_tender["content"].encode("utf-8"), "text/plain")}
    obs_res = client.post("/api/upload-document", files=files_obs)
    assert obs_res.status_code == 200
    obs_data = obs_res.json()
    flags = obs_data["summary"]["superseded_flags"]
    verdict = obs_data["summary"]["executive_verdict"]
    print(f"[PASS] Obsolete Tender Audit: {flags} obsolete flags detected")
    print(f"   - Verdict: {verdict}")
    assert flags >= 1
    assert "CRITICAL ATTENTION REQUIRED" in verdict

    print("\n=======================================================")
    print("ALL DOCUMENT AUDIT INTEGRATION TESTS PASSED CLEANLY!")
    print("=======================================================")

if __name__ == "__main__":
    test_document_audit_pipeline()
