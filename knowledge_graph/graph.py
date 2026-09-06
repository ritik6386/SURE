"""
Knowledge Graph Engine for BIS Standards and Normative Ecosystem
Navigates relationships: testing, safety, performance, installation, and supersessions.
"""

import os
import json
from typing import Dict, Any, List, Optional

class BISKnowledgeGraph:
    def __init__(self, rel_path: Optional[str] = None, standards_path: Optional[str] = None):
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        if rel_path is None:
            rel_path = os.path.join(base_dir, "data", "relationships.json")
        if standards_path is None:
            standards_path = os.path.join(base_dir, "data", "standards.json")
            
        self.rel_path = rel_path
        self.standards_path = standards_path
        self.relationships: Dict[str, Any] = {}
        self.standards_lookup: Dict[str, Any] = {}
        self.load_graph()

    def load_graph(self):
        with open(self.rel_path, "r", encoding="utf-8") as f:
            self.relationships = json.load(f)

        with open(self.standards_path, "r", encoding="utf-8") as f:
            standards = json.load(f)
            for s in standards:
                sid = s["standard_id"].upper().strip()
                self.standards_lookup[sid] = s
                self.standards_lookup[sid.split(":")[0].strip()] = s
                self.standards_lookup[sid.split(":")[0].strip().replace(" ", "")] = s

    def get_allied_standards(self, standard_id: str) -> Dict[str, Any]:
        """
        Traverses relationships for the standard and returns categorized allied standards:
        - testing
        - safety
        - performance
        - installation / systems
        - supersedes / superseded_by
        """
        clean_id = standard_id.upper().strip()
        prefix_id = clean_id.split(":")[0].strip()

        rel = self.relationships.get(clean_id) or self.relationships.get(prefix_id) or {}
        std = self.standards_lookup.get(clean_id) or self.standards_lookup.get(prefix_id) or {}

        # Resolve testing
        testing = []
        for t in rel.get("testing_standards", []):
            testing.append(t)
        if not testing and std.get("testing_standards"):
            for tid in std["testing_standards"]:
                testing.append({"id": tid, "title": self._lookup_title(tid), "relationship": "requires_testing"})

        # Resolve safety
        safety = []
        for s in rel.get("safety_standards", []):
            safety.append(s)
        if not safety and std.get("safety_standards"):
            for sid in std["safety_standards"]:
                safety.append({"id": sid, "title": self._lookup_title(sid), "relationship": "requires_safety"})

        # Resolve performance
        performance = []
        for p in rel.get("performance_standards", []):
            performance.append(p)
        if not performance and std.get("performance_standards"):
            for pid in std["performance_standards"]:
                if pid != clean_id and pid != prefix_id:
                    performance.append({"id": pid, "title": self._lookup_title(pid), "relationship": "performance_rating"})

        # Additional allied lists
        allied_list = std.get("allied_standards", [])
        general_allied = []
        known_ids = {item["id"].split(":")[0].strip() for item in (testing + safety + performance)}
        for aid in allied_list:
            clean_aid = aid.split(":")[0].strip()
            if clean_aid not in known_ids and clean_aid != prefix_id:
                general_allied.append({
                    "id": aid,
                    "title": self._lookup_title(aid),
                    "relationship": "normative_reference"
                })

        return {
            "primary_id": standard_id,
            "testing": testing,
            "safety": safety,
            "performance": performance,
            "allied": general_allied,
            "supersedes": rel.get("supersedes", []),
            "superseded_by": rel.get("superseded_by") or std.get("supersedes")
        }

    def _lookup_title(self, std_id: str) -> str:
        clean = std_id.upper().strip()
        matched = self.standards_lookup.get(clean) or self.standards_lookup.get(clean.split(":")[0].strip())
        if matched:
            return matched["title"]
        return "Associated Indian Standard"
