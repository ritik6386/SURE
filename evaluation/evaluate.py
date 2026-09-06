"""
Automated Evaluation Suite for SURE — Standards for Unified Regulatory Engine
Measures Primary Retrieval Accuracy, Top-5 Recall, and Compliance Precision.
"""

import os
import sys
import json
from typing import Dict, Any, List

# Ensure project root is in sys.path
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

def run_benchmark() -> Dict[str, Any]:
    from backend.app.services.recommendation_service import RecommendationEngine
    
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    bench_file = os.path.join(base_dir, "evaluation", "benchmark_queries.json")

    with open(bench_file, "r", encoding="utf-8") as f:
        test_cases: List[Dict[str, Any]] = json.load(f)

    engine = RecommendationEngine()

    total_tests = len(test_cases)
    primary_correct = 0
    top5_correct = 0
    qco_correct = 0
    superseded_correct = 0
    results_detail = []

    for test in test_cases:
        qid = test["id"]
        query = test["query"]
        exp_raw = test["expected_primary"]
        expected_primary = "/".join(exp_raw) if isinstance(exp_raw, list) else exp_raw.upper().strip()
        expected_qco = test.get("expected_qco", False)
        is_superseded_test = test.get("expected_superseded", False)

        res = engine.process_query(query)

        actual_primary_id = res["primary_standard"]["standard_id"].upper()
        confidence = res["primary_standard"]["confidence"]

        # Gather all retrieved candidates
        all_candidate_ids = [actual_primary_id] + [a["standard_id"].upper() for a in res.get("alternates", [])]

        # Check primary standard match (support string or list of valid standards)
        if isinstance(test["expected_primary"], list):
            expected_list = [x.upper().strip() for x in test["expected_primary"]]
            p_hit = any(exp in actual_primary_id for exp in expected_list)
            top5_hit = any(any(exp in cid for exp in expected_list) for cid in all_candidate_ids)
        else:
            p_hit = expected_primary in actual_primary_id
            top5_hit = any(expected_primary in cid for cid in all_candidate_ids)

        # Check QCO accuracy
        actual_qco = res["qco"]["applicable"]
        qco_hit = (actual_qco == expected_qco)

        # Check superseded alert
        has_red_warning = any(w.get("level") == "RED" for w in res.get("warnings", []))
        if is_superseded_test:
            super_hit = has_red_warning
            if super_hit:
                superseded_correct += 1
        else:
            super_hit = True

        if p_hit:
            primary_correct += 1
        if top5_hit:
            top5_correct += 1
        if qco_hit:
            qco_correct += 1

        status = "PASSED" if (p_hit and top5_hit and qco_hit and super_hit) else "PARTIAL"

        results_detail.append({
            "id": qid,
            "query": query,
            "expected_primary": expected_primary,
            "actual_primary": actual_primary_id,
            "confidence": confidence,
            "primary_hit": p_hit,
            "top5_hit": top5_hit,
            "qco_hit": qco_hit,
            "status": status,
            "category": res["primary_standard"]["category"]
        })

    primary_accuracy = round((primary_correct / total_tests) * 100, 1)
    top5_recall = round((top5_correct / total_tests) * 100, 1)
    qco_accuracy = round((qco_correct / total_tests) * 100, 1)
    overall_score = round((primary_accuracy + top5_recall + qco_accuracy) / 3, 1)

    summary = {
        "total_queries": total_tests,
        "primary_retrieval_accuracy": primary_accuracy,
        "top_5_recall": top5_recall,
        "qco_compliance_accuracy": qco_accuracy,
        "overall_benchmark_score": overall_score,
        "evaluation_verdict": "EXCELLENT (Production-Ready Prototype)" if overall_score >= 85 else "ACCEPTABLE",
        "detailed_results": results_detail
    }

    return summary

if __name__ == "__main__":
    report = run_benchmark()
    print("================================================================")
    print("SURE — Standards for Unified Regulatory Engine")
    print("AUTOMATED EVALUATION BENCHMARK REPORT")
    print("================================================================")
    print(f"Total Test Queries:              {report['total_queries']}")
    print(f"Primary Standard Retrieval Acc:  {report['primary_retrieval_accuracy']}%")
    print(f"Top-5 Candidate Recall:          {report['top_5_recall']}%")
    print(f"QCO Compliance Accuracy:         {report['qco_compliance_accuracy']}%")
    print(f"Overall Benchmark Score:         {report['overall_benchmark_score']}%")
    print(f"Verdict:                         {report['evaluation_verdict']}")
    print("================================================================")
    for r in report["detailed_results"]:
        mark = "PASS" if r["status"] == "PASSED" else "FAIL"
        exp = r["expected_primary"]
        act = r["actual_primary"].split(":")[0]
        hit = "OK" if r["primary_hit"] else "MISS"
        print(f"[{mark}] Q{r['id']:02d}: {r['query'][:35]:<35} | Exp: {exp:<10} | Act: {act:<15} | Hit: {hit}")
    print("================================================================")
