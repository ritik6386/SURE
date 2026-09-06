"""
FastAPI Routes for SAARTHI Recommendation Platform
"""

from fastapi import APIRouter, HTTPException, Query, UploadFile, File
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

from backend.app.services.recommendation_service import RecommendationEngine
from backend.app.services.document_parser import DocumentParserService

router = APIRouter()
engine = RecommendationEngine()
document_parser = DocumentParserService(engine=engine)

class QueryRequest(BaseModel):
    query: str = Field(..., description="Procurement requirement or tender specification")
    language: Optional[str] = Field(default="en", description="Language code (en=English, ta=Tamil, mr=Marathi, hi=Hindi, or auto)")

class TextAnalyzeRequest(BaseModel):
    text: str = Field(..., description="Full text of the tender, DPR, or technical specifications")
    title: Optional[str] = Field(default="Tender_Text_Analysis.txt", description="Optional document title")

@router.post("/recommend")
def recommend_standard(payload: QueryRequest):
    if not payload.query.strip():
        raise HTTPException(status_code=400, detail="Query string cannot be empty.")
    result = engine.process_query(payload.query, language=payload.language)
    return result

@router.post("/upload-document")
async def upload_document(file: UploadFile = File(...)):
    """
    Accepts PDF, DOCX, or TXT tender/DPR documents, extracts technical clauses & BoQ,
    and runs comprehensive multi-item BIS and QCO compliance audits.
    """
    allowed_exts = ["pdf", "docx", "doc", "txt", "csv", "md"]
    filename = file.filename or "uploaded_document.txt"
    ext = filename.lower().split(".")[-1]
    
    if ext not in allowed_exts:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format (.{ext}). Please upload a .pdf, .docx, or .txt file."
        )

    content = await file.read()
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty (0 bytes).")
    
    if len(content) > 25 * 1024 * 1024: # 25 MB limit
        raise HTTPException(status_code=400, detail="File size exceeds the 25 MB limit.")

    try:
        result = document_parser.analyze_document(content, filename)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing document: {str(e)}")

@router.post("/analyze-text")
def analyze_tender_text(payload: TextAnalyzeRequest):
    """
    Directly analyzes pasted tender text / DPR sections without requiring file upload.
    """
    if not payload.text.strip():
        raise HTTPException(status_code=400, detail="Document text cannot be empty.")
    
    content = payload.text.encode("utf-8")
    result = document_parser.analyze_document(content, payload.title)
    return result

@router.get("/standards")
def list_standards(
    search: Optional[str] = None,
    category: Optional[str] = None,
    limit: int = Query(default=20, le=100)
):
    standards = engine.vector_store.standards
    filtered = standards

    if category:
        filtered = [s for s in filtered if s["category"].lower() == category.lower()]

    if search:
        s_lower = search.lower()
        filtered = [
            s for s in filtered
            if s_lower in s["standard_id"].lower()
            or s_lower in s["title"].lower()
            or s_lower in s["description"].lower()
            or any(s_lower in kw for kw in s.get("keywords", []))
        ]

    return {
        "total": len(filtered),
        "results": filtered[:limit]
    }

@router.get("/qco")
def list_qcos():
    return {
        "total": len(engine.qco_engine.qco_list),
        "qcos": engine.qco_engine.qco_list
    }

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "SURE — Standards for Unified Regulatory Engine",
        "standards_indexed": len(engine.vector_store.standards),
        "qco_indexed": len(engine.qco_engine.qco_list)
    }

@router.get("/evaluate")
def run_evaluation():
    from evaluation.evaluate import run_benchmark
    report = run_benchmark()
    return report

@router.get("/sample-documents")
def get_sample_documents():
    import os
    sample_dir = os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "sample_documents")
    docs = []
    if os.path.exists(sample_dir):
        for fname in os.listdir(sample_dir):
            if fname.endswith(".txt"):
                fpath = os.path.join(sample_dir, fname)
                with open(fpath, "r", encoding="utf-8") as f:
                    docs.append({
                        "filename": fname,
                        "title": fname.replace("_", " ").replace(".txt", ""),
                        "content": f.read()
                    })
    return {"samples": docs}

@router.get("/languages")
def get_supported_languages():
    return {
        "service": "Digital India Bhashini (MeitY)",
        "engine": "IndicTrans2",
        "languages": [
            {"code": "en", "name": "English", "native": "English", "flag": "🇬🇧"},
            {"code": "hi", "name": "Hindi", "native": "हिन्दी", "flag": "🇮🇳"},
            {"code": "ta", "name": "Tamil", "native": "தமிழ்", "flag": "🏛️"},
            {"code": "mr", "name": "Marathi", "native": "मराठी", "flag": "🚩"}
        ]
    }


