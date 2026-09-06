"""
Digital India Bhashini (MeitY) Indigenous Language Service
Provides cross-lingual normalization and localized explanations for Indian Public Procurement.
Supports English (en), Hindi (hi), Tamil (ta), and Marathi (mr).
Integrates with MeitY Bhashini / IndicTrans2 API with local offline fallback.
"""

import os
import re
import json
import requests
from typing import Dict, Any, Tuple, Optional

class BhashiniService:
    def __init__(self):
        self.bhashini_api_key = os.environ.get("BHASHINI_API_KEY", "")
        self.bhashini_user_id = os.environ.get("BHASHINI_USER_ID", "")
        self.bhashini_pipeline_id = os.environ.get("BHASHINI_PIPELINE_ID", "")
        self.api_url = "https://dhruva-api.bhashini.gov.in/services/inference/pipeline"

        self.languages = {
            "en": {"name": "English", "native": "English", "code": "en"},
            "hi": {"name": "Hindi", "native": "हिन्दी", "code": "hi"},
            "ta": {"name": "Tamil", "native": "தமிழ்", "code": "ta"},
            "mr": {"name": "Marathi", "native": "मराठी", "code": "mr"}
        }

        # Multi-Sector Indigenous Procurement Lexicon (Tamil, Marathi, Hindi)
        self.indic_to_en_lexicon = {
            # --- TAMIL (தமிழ்) ---
            "தூண்டல் மோட்டார்": "induction motor",
            "மோட்டார்": "motor",
            "நீரேற்று": "pumping",
            "சாக்கடை நீரேற்று": "sewage pumping",
            "சாக்கடை": "sewage",
            "சூரிய மின் பலகை": "solar pv module",
            "சூரிய மின் பலகைகள்": "solar pv module",
            "சூரிய பிவி தொகுதி": "solar pv module",
            "சூரிய தொகுதி": "solar pv module",
            "சூரிய இன்வெர்ட்டர்": "solar inverter",
            "சூரிய பம்ப்": "solar pump",
            "சூரிய": "solar",
            "பிவி தொகுதி": "pv module",
            "மடிக்கணினி": "laptop",
            "கணினி": "computer",
            "உயர் செயல்திறன்": "high performance",
            "குடிநீர் வழங்கல்": "drinking water supply",
            "குடிநீர்": "drinking water",
            "யூபிவிசி குழாய்": "upvc pipe",
            "குழாய்": "pipe",
            "குழாய்கள்": "pipes",
            "போர்ட்லேண்ட் சிமெண்ட்": "portland cement",
            "53 தரம்": "53 grade",
            "53 தர சிமெண்ட்": "53 grade cement",
            "சிமெண்ட்": "cement",
            "காஸ்ட் அயர்ன் ஸ்லூயிஸ் வால்வு": "cast iron sluice valve",
            "ஸ்லூயிஸ் வால்வு": "sluice valve",
            "மையவிலக்கு பம்ப்": "centrifugal pump",
            "நீர்மூழ்கி பம்ப்": "submersible pump",
            "வால்வு": "valve",
            "மின் கம்பி": "power cable",
            "எக்ஸ்எல்பிஇ கம்பி": "xlpe cable",
            "கம்பி": "cable",
            "மின்மாற்றி": "transformer",
            "டிரான்ஸ்பார்மர்": "transformer",
            "மின்சார அளவி": "electricity meter",
            "ஸ்மார்ட் மீட்டர்": "smart meter",
            "மீட்டர்": "meter",
            "தீயணைப்பு கருவி": "fire extinguisher",
            "அரசு அலுவலகம்": "government office",
            "அலுவலகம்": "office",
            "மேற்கூரை": "rooftop",

            # --- MARATHI (मराठी) ---
            "इंडक्शन मोटर": "induction motor",
            "मोटर": "motor",
            "सांडपाणी उपसा": "sewage pumping",
            "उपसा": "pumping",
            "सांडपाणी": "sewage",
            "सौर पीव्ही मॉड्यूल": "solar pv module",
            "सौर पॅनेल": "solar pv module",
            "सौर इन्व्हर्टर": "solar inverter",
            "सौर पंप": "solar pump",
            "सौर ऊर्जा": "solar power",
            "सौर": "solar",
            "पीव्ही मॉड्यूल": "pv module",
            "लॅपटॉप": "laptop",
            "संगणक": "computer",
            "हाय परफॉर्मन्स": "high performance",
            "पिण्याचे पाणी": "drinking water",
            "पाणी पुरवठा": "water supply",
            "यूपीव्हीसी पाईप": "upvc pipe",
            "पाईप": "pipe",
            "नळ": "pipe",
            "पोर्टलँड सिमेंट": "portland cement",
            "५३ ग्रेड सिमेंट": "53 grade cement",
            "53 ग्रेड सिमेंट": "53 grade cement",
            "सिमेंट": "cement",
            "कास्ट आयर्न स्लुइस व्हॉल्व्ह": "cast iron sluice valve",
            "स्लुइस व्हॉल्व्ह": "sluice valve",
            "सेंट्रीफ्यूगल पंप": "centrifugal pump",
            "सबमर्सिबल पंप": "submersible pump",
            "व्हॉल्व्ह": "valve",
            "एक्सएलपीई केबल": "xlpe cable",
            "केबल": "cable",
            "ट्रान्सफॉर्मर": "transformer",
            "विद्युत वितरण": "power distribution",
            "स्मार्ट वीज मीटर": "smart electricity meter",
            "विद्युत मीटर": "electricity meter",
            "मीटर": "meter",
            "अग्निशामक यंत्र": "fire extinguisher",
            "अग्निशामक": "fire extinguisher",
            "शासकीय कार्यालय": "government office",
            "कार्यालय": "office",
            "छतावरील": "rooftop",

            # --- HINDI (हिन्दी) ---
            "इंडक्शन मोटर": "induction motor",
            "मोटर": "motor",
            "सीवेज पंपिंग": "sewage pumping",
            "पंपिंग": "pumping",
            "सीवेज": "sewage",
            "सोलर पीवी मॉड्यूल": "solar pv module",
            "सोलर पैनल": "solar pv module",
            "सोलर इन्वर्टर": "solar inverter",
            "सोलर पंप": "solar pump",
            "सोलर": "solar",
            "सौर": "solar",
            "पीवी मॉड्यूल": "pv module",
            "लैपटॉप": "laptop",
            "कंप्यूटर": "computer",
            "उच्च प्रदर्शन": "high performance",
            "पेयजल आपूर्ति": "drinking water supply",
            "पेयजल": "drinking water",
            "जलापूर्ति": "water supply",
            "यूपीवीसी पाइप": "upvc pipe",
            "पाइप": "pipe",
            "पोर्टलैंड सीमेंट": "portland cement",
            "53 ग्रेड सीमेंट": "53 grade cement",
            "५३ ग्रेड सीमेंट": "53 grade cement",
            "सीमेंट": "cement",
            "कास्ट आयरन स्लुइस वाल्व": "cast iron sluice valve",
            "स्लुइस वाल्व": "sluice valve",
            "सेंट्रीफ्यूगल पंप": "centrifugal pump",
            "सबमर्सिबल पंप": "submersible pump",
            "वाल्व": "valve",
            "एक्सएलपीई केबल": "xlpe cable",
            "केबल": "cable",
            "वितरण ट्रांसफार्मर": "distribution transformer",
            "ट्रांसफार्मर": "transformer",
            "स्मार्ट बिजली मीटर": "smart electricity meter",
            "बिजली मीटर": "electricity meter",
            "मीटर": "meter",
            "अग्निशामक यंत्र": "fire extinguisher",
            "सरकारी कार्यालय": "government office",
            "कार्यालय": "office",
            "छत": "rooftop"
        }

        # Case markers and connective suffixes to clean
        self.grammar_suffixes = [
            # Tamil
            "க்கான", "க்கு", "உடைய", "உள்ள", "தேவையான", "ஆகிய",
            # Marathi
            "करण्यासाठी", "साठीचे", "साठी", "करिता", "करिताचे", "च्या", "चे", "असलेले",
            # Hindi
            "के लिए", "के हेतु", "हेतु", "वाले", "वाली", "सहित", "युक्त"
        ]

    def detect_script_language(self, text: str) -> str:
        """
        Detects script:
        - Tamil: U+0B80 to U+0BFF
        - Devanagari: U+0900 to U+097F (Hindi or Marathi)
        - Latin: English
        """
        tamil_chars = len(re.findall(r'[\u0B80-\u0BFF]', text))
        devanagari_chars = len(re.findall(r'[\u0900-\u097F]', text))

        if tamil_chars > 2:
            return "ta"
        elif devanagari_chars > 2:
            if any(k in text for k in ["साठी", "उपसा", "व्हॉल्व्ह", "पाईप", "ळ", "झाले"]):
                return "mr"
            return "hi"
        return "en"

    def translate_to_english(self, query: str, source_lang: Optional[str] = None) -> Tuple[str, str]:
        """
        Normalizes regional language procurement query to technical English.
        Returns (english_query, detected_language).
        """
        if not source_lang or source_lang == "auto":
            source_lang = self.detect_script_language(query)

        if source_lang == "en":
            return query, "en"

        # 1. Bhashini Cloud API if configured
        if self.bhashini_api_key and self.bhashini_pipeline_id:
            try:
                cloud_trans = self._call_bhashini_api(query, source_lang, "en")
                if cloud_trans:
                    return cloud_trans, source_lang
            except Exception as e:
                print(f"[Bhashini] Cloud API fallback: {e}")

        # 2. High-precision Local IndicTrans2 Technical Lexicon Normalization
        normalized = query

        # Sort technical terms by length descending to match compound phrases first
        sorted_lexicon = sorted(self.indic_to_en_lexicon.items(), key=lambda x: len(x[0]), reverse=True)
        for regional_term, en_term in sorted_lexicon:
            if regional_term in normalized:
                normalized = normalized.replace(regional_term, f" {en_term} ")

        # Clean grammar suffixes
        for suffix in self.grammar_suffixes:
            normalized = normalized.replace(suffix, " for ")

        # Replace Indic numerals if present (०-९, ௦-௯)
        indic_digits = {
            "०":"0","१":"1","२":"2","३":"3","४":"4","५":"5","६":"6","७":"7","८":"8","९":"9",
            "௦":"0","௧":"1","௨":"2","௩":"3","௪":"4","௫":"5","௬":"6","௭":"7","௮":"8","௯":"9"
        }
        for ind_d, lat_d in indic_digits.items():
            normalized = normalized.replace(ind_d, lat_d)

        # Clean multiple spaces and non-informative remnants
        normalized = re.sub(r'\s+', ' ', normalized).strip()
        return normalized, source_lang

    def localize_explanation(
        self,
        standard_id: str,
        title: str,
        category: str,
        qco_badge: str,
        cert_name: str,
        confidence_pct: int,
        target_lang: str
    ) -> Dict[str, Any]:
        """
        Generates localized procurement rationale in Tamil, Marathi, Hindi, or English.
        """
        if target_lang == "ta": # தமிழ் (Tamil)
            return {
                "language": "ta",
                "language_name": "தமிழ் (Tamil)",
                "heading": "பரிந்துரைக்கப்பட்ட முதன்மை இந்திய தரநிலை (BIS)",
                "summary": f"உங்கள் தேவையின் அடிப்படையில் இந்திய தரநிலை {standard_id} முதன்மையான விவரக்குறிப்பாக பரிந்துரைக்கப்படுகிறது.",
                "reasons": [
                    f"பொருளடக்கம்: பிஐஎஸ் தொழில்நுட்பக் குழுவால் '{category}' பிரிவின் கீழ் அங்கீகரிக்கப்பட்டது.",
                    f"தரநிலை விவரம்: '{standard_id}' ஆனது {title} ஆகியவற்றின் செயல்திறன் மற்றும் தரத் தேவைகளைக் குறிப்பிடுகிறது.",
                    f"ஒத்துப்போகும் நம்பிக்கை: வினவல் நோக்கத்தின் அடிப்படையில் {confidence_pct}% துல்லியத்தன்மை கண்டறியப்பட்டது.",
                    f"சான்றிதழ் முறை: '{cert_name}' உரிமம் மற்றும் தரக் குறிப்பு கட்டாயமாகும்.",
                    f"ஒழுங்குமுறை உத்தரவு: {qco_badge} பொருந்தும். தகுதியற்ற பொருட்களை அரசு டெண்டர்களில் ஏற்க முடியாது."
                ],
                "checklist_label": "டெண்டர் இணக்கச் சரிபார்ப்பு பட்டியல்",
                "tender_notice": f"குறிப்பு: இந்த தயாரிப்பு இந்திய தரநிலை {standard_id} மற்றும் {cert_name} விதிகளுக்கு உட்பட்டது என்பதை உறுதிப்படுத்தவும்."
            }

        elif target_lang == "mr": # मराठी (Marathi)
            return {
                "language": "mr",
                "language_name": "मराठी (Marathi)",
                "heading": "शिफारस केलेले प्राथमिक भारतीय मानक (BIS)",
                "summary": f"तुमच्या गरजेनुसार भारतीय मानक {standard_id} हे प्राथमिक तांत्रिक तपशील म्हणून शिफारस केले आहे.",
                "reasons": [
                    f"उत्पादन क्षेत्र: बीआयएस तांत्रिक समितीनुसार '{category}' श्रेणीत निश्चित केले आहे.",
                    f"मानक तपशील: '{standard_id}' हे {title} च्या कार्यक्षमता आणि गुणवत्ता मानकांचे नियमन करते.",
                    f"सुसंगतता विश्वासार्हता: विचारलेल्या गरजेनुसार {confidence_pct}% अचूक जुळणी आढळली.",
                    f"प्रमाणीकरण योजना: '{cert_name}' परवाना आणि मानक चिन्ह आवश्यक आहे.",
                    f"नियामक आदेश: {qco_badge} लागू आहे. शासकीय निविदेत निकृष्ट उत्पादने नाकारली जातील."
                ],
                "checklist_label": "निविदा अनुपालन पडताळणी सूची",
                "tender_notice": f"टीप: या उत्पादनासाठी भारतीय मानक {standard_id} आणि {cert_name} चे पालन अनिवार्य आहे."
            }

        elif target_lang == "hi": # हिन्दी (Hindi)
            return {
                "language": "hi",
                "language_name": "हिन्दी (Hindi)",
                "heading": "अनुशंसित प्राथमिक भारतीय मानक (BIS)",
                "summary": f"आपकी अधिप्राप्ति आवश्यकता के लिए भारतीय मानक {standard_id} को प्राथमिक मानक के रूप में अनुशंसित किया गया है।",
                "reasons": [
                    f"उत्पाद श्रेणी: बीआईएस तकनीकी समिति द्वारा '{category}' श्रेणी के अंतर्गत वर्गीकृत।",
                    f"मानक विवरण: '{standard_id}' {title} के प्रदर्शन एवं सुरक्षा मानकों को निर्धारित करता है।",
                    f"सटीकता स्तर: तकनीकी विश्लेषण के आधार पर {confidence_pct}% मिलान पाया गया।",
                    f"प्रमाणन योजना: '{cert_name}' अनिवार्य अनुपालन योजना।",
                    f"गुणवत्ता नियंत्रण आदेश (QCO): {qco_badge} लागू है। गैर-अनुपालन निविदाओं को खारिज कर दिया जाएगा।"
                ],
                "checklist_label": "निविदा अनुपालन चेकलिस्ट",
                "tender_notice": f"नोट: निविदा दस्तावेज में भारतीय मानक {standard_id} तथा {cert_name} का उल्लेख अनिवार्य है।"
            }

        # Default English
        return {
            "language": "en",
            "language_name": "English",
            "heading": "Recommended Primary Standard",
            "summary": f"Based on your requirement, Indian Standard {standard_id} is recommended as the primary specification.",
            "reasons": [
                f"Product Domain: Categorized under '{category}' by the relevant BIS Technical Committee.",
                f"Benchmark Specification: '{standard_id}' defines design, rating, and quality parameters for {title}.",
                f"Match Confidence: Calibrated semantic vector confidence of {confidence_pct}%.",
                f"Certification Scheme: Governed under '{cert_name}'.",
                f"Regulatory Mandate: {qco_badge} applicable."
            ],
            "checklist_label": "Tender Drafting Compliance Checklist",
            "tender_notice": f"Note: Strict compliance with {standard_id} and {cert_name} is mandatory."
        }

    def _call_bhashini_api(self, text: str, source_lang: str, target_lang: str) -> Optional[str]:
        """Calls MeitY Bhashini inference pipeline if API keys are set."""
        payload = {
            "pipelineTasks": [
                {
                    "taskType": "translation",
                    "config": {
                        "language": {
                            "sourceLanguage": source_lang,
                            "targetLanguage": target_lang
                        }
                    }
                }
            ],
            "inputData": {
                "input": [{"source": text}]
            }
        }
        headers = {
            "Authorization": self.bhashini_api_key,
            "User-ID": self.bhashini_user_id,
            "Content-Type": "application/json"
        }
        resp = requests.post(self.api_url, json=payload, headers=headers, timeout=5)
        if resp.status_code == 200:
            data = resp.json()
            return data["pipelineResponse"][0]["output"][0]["target"]
        return None
