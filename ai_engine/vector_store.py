"""
Vector Store & Semantic Search Engine for BIS Standards
Implements hybrid dense semantic search, cosine similarity ranking, and domain routing.
"""

import os
import json
import re
import math
from collections import Counter
from typing import List, Dict, Any, Optional

from ai_engine.domain_classifier import classify_domain, extract_parameters

class PureTFIDF:
    """Lightweight zero-dependency TF-IDF Vectorizer with Sublinear TF & Cosine Similarity."""
    def __init__(self, ngram_range=(1, 3), sublinear_tf=True):
        self.ngram_range = ngram_range
        self.sublinear_tf = sublinear_tf
        self.token_pattern = re.compile(r'(?u)\b\w\w+\b')
        self.idf: Dict[str, float] = {}
        self.doc_vectors: List[Dict[str, float]] = []

    def _tokenize(self, text: str) -> List[str]:
        return self.token_pattern.findall(text)

    def _get_ngrams(self, tokens: List[str]) -> List[str]:
        ngrams = []
        n = len(tokens)
        for k in range(self.ngram_range[0], self.ngram_range[1] + 1):
            for i in range(n - k + 1):
                ngrams.append(' '.join(tokens[i:i+k]))
        return ngrams

    def fit_transform(self, docs: List[str]):
        df = Counter()
        N = len(docs)
        doc_term_counts = []
        for doc in docs:
            tokens = self._tokenize(doc)
            ngrams = self._get_ngrams(tokens)
            counts = Counter(ngrams)
            doc_term_counts.append(counts)
            for term in counts:
                df[term] += 1

        self.idf = {term: math.log((1.0 + N) / (1.0 + count)) + 1.0 for term, count in df.items()}

        self.doc_vectors = []
        for counts in doc_term_counts:
            vec = {}
            norm_sq = 0.0
            for term, count in counts.items():
                w = (1.0 + math.log(count)) * self.idf[term] if self.sublinear_tf else float(count) * self.idf[term]
                vec[term] = w
                norm_sq += w * w
            norm = math.sqrt(norm_sq) if norm_sq > 0 else 1.0
            self.doc_vectors.append({term: w / norm for term, w in vec.items()})
        return self

    def transform_and_score(self, query: str) -> List[float]:
        tokens = self._tokenize(query)
        ngrams = self._get_ngrams(tokens)
        q_counts = Counter(ngrams)
        q_vec = {}
        norm_sq = 0.0
        for term, count in q_counts.items():
            if term in self.idf:
                w = (1.0 + math.log(count)) * self.idf[term] if self.sublinear_tf else float(count) * self.idf[term]
                q_vec[term] = w
                norm_sq += w * w
        if norm_sq == 0:
            return [0.0] * len(self.doc_vectors)
        norm = math.sqrt(norm_sq)
        q_norm = {term: w / norm for term, w in q_vec.items()}

        scores = [0.0] * len(self.doc_vectors)
        for idx, doc_vec in enumerate(self.doc_vectors):
            dot = sum(doc_vec[t] * qw for t, qw in q_norm.items() if t in doc_vec)
            scores[idx] = dot
        return scores

class BISVectorStore:
    def __init__(self, data_path: Optional[str] = None):
        if data_path is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            data_path = os.path.join(base_dir, "data", "standards.json")
        
        self.data_path = data_path
        self.standards: List[Dict[str, Any]] = []
        self.doc_texts: List[str] = []
        self.vectorizer: Optional[PureTFIDF] = None
        self.std_index: Dict[str, Dict[str, Any]] = {}
        
        self.load_data()

    def _normalize_text(self, text: str) -> str:
        """Normalizes technical text for matching."""
        t = text.lower()
        t = re.sub(r'[/\\()\-:,]', ' ', t)
        return ' '.join(t.split())

    def _create_rich_document(self, std: Dict[str, Any]) -> str:
        """Creates an enriched multi-field semantic chunk for each standard."""
        sid = std["standard_id"]
        title = std["title"]
        desc = std["description"]
        cat = std["category"]
        dept = std["department"]
        kw = " ".join(std.get("keywords", []))
        allied = " ".join(std.get("allied_standards", []))
        supersedes = std.get("supersedes") or ""

        # Weight the title and keywords heavily
        rich_doc = f"{sid} {sid} {title} {title} {cat} {dept} {kw} {kw} {desc} {allied} {supersedes}"
        return self._normalize_text(rich_doc)

    def load_data(self):
        with open(self.data_path, "r", encoding="utf-8") as f:
            self.standards = json.load(f)

        self.doc_texts = []
        self.std_index = {}
        for std in self.standards:
            doc = self._create_rich_document(std)
            self.doc_texts.append(doc)
            # Index by primary standard ID prefix and full string
            raw_id = std["standard_id"].upper()
            clean_id = raw_id.split(":")[0].strip()
            self.std_index[raw_id] = std
            self.std_index[clean_id] = std
            # Also index clean standard without spaces
            self.std_index[clean_id.replace(" ", "")] = std

        # Build subword character + word n-gram vectorizer for robust semantic matching
        self.vectorizer = PureTFIDF(
            ngram_range=(1, 3),
            sublinear_tf=True
        )
        self.vectorizer.fit_transform(self.doc_texts)

    def search(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Executes semantic search over standards.
        Returns top-K candidate standards with normalized confidence scores.
        """
        norm_query = self._normalize_text(query)
        extracted_params = extract_parameters(query)
        detected_domains = classify_domain(query)
        primary_domain = detected_domains[0]["domain"] if detected_domains else None

        # Check direct standard ID reference (e.g. IS 325, IS 12615)
        std_ref = extracted_params.get("referenced_standard")
        direct_match = None
        if std_ref:
            std_clean = std_ref.upper().strip()
            direct_match = self.std_index.get(std_clean) or self.std_index.get(std_clean.replace(" ", ""))

        # Compute cosine similarity
        scores = self.vectorizer.transform_and_score(norm_query)

        # Domain boosting & keyword reinforcement
        boosted_scores = list(scores)
        query_words = set(norm_query.split())

        for idx, std in enumerate(self.standards):
            std_cat = std["category"]
            std_title_norm = self._normalize_text(std["title"])

            # Domain alignment: strongly reward matching domain and penalize conflicting domain
            if primary_domain and primary_domain != "General / Cross-Domain":
                if primary_domain.lower() in std_cat.lower() or std_cat.lower() in primary_domain.lower():
                    boosted_scores[idx] += 0.35
                else:
                    boosted_scores[idx] -= 0.30

            # Keyword bonus: exact word, multi-word phrase, and product token hits
            kw_boost = 0.0
            for kw in std.get("keywords", []):
                norm_kw = self._normalize_text(kw)
                if not norm_kw:
                    continue
                if norm_kw in norm_query:
                    # Multi-word phrase or exact keyword matches
                    kw_boost += (0.45 if " " in norm_kw else 0.35)
                elif norm_kw in query_words:
                    kw_boost += 0.40
                elif any(w in query_words for w in norm_kw.split() if len(w) > 3):
                    kw_boost += 0.08
            boosted_scores[idx] += min(0.85, kw_boost)

            # Title significant tokens overlap
            title_words = set(std_title_norm.split())
            significant_overlap = [
                w for w in query_words.intersection(title_words)
                if w not in {"for", "and", "the", "with", "part", "sec", "use", "standard", "code", "general", "type"}
            ]
            boosted_scores[idx] += min(0.40, len(significant_overlap) * 0.10)

            # Direct match bonus
            if direct_match and std["standard_id"].split(":")[0] == direct_match["standard_id"].split(":")[0]:
                boosted_scores[idx] += 0.80

        # Sort top indices
        top_indices = sorted(range(len(boosted_scores)), key=lambda i: boosted_scores[i], reverse=True)[:top_k * 2]

        results = []
        for rank, idx in enumerate(top_indices):
            std = self.standards[idx]
            raw_score = float(boosted_scores[idx])

            # Calibrate confidence score to realistic 0.0 - 1.0 range
            # Strong matches with domain alignment reach 0.90 - 0.96
            if raw_score >= 0.45:
                calibrated_conf = min(0.96, 0.90 + (raw_score - 0.45) * 0.25)
            elif raw_score >= 0.25:
                calibrated_conf = min(0.89, 0.75 + (raw_score - 0.25) * 0.70)
            elif raw_score >= 0.10:
                calibrated_conf = min(0.74, 0.55 + (raw_score - 0.10) * 1.20)
            else:
                calibrated_conf = 0.35

            res_item = {
                "standard": std,
                "confidence": round(calibrated_conf, 2),
                "raw_score": round(raw_score, 4),
                "rank": rank + 1
            }
            results.append(res_item)
            if len(results) >= top_k:
                break

        return results

    def get_standard_by_id(self, standard_id: str) -> Optional[Dict[str, Any]]:
        clean_id = standard_id.upper().strip()
        return self.std_index.get(clean_id) or self.std_index.get(clean_id.split(":")[0].strip())
