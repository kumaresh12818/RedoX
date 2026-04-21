import json
import re
from google import genai
from google.genai import types
from .config import GEMINI_API_KEY

# ---------------------------------------------------------------------------
# Initialize Gemini Client
# ---------------------------------------------------------------------------
client = None
try:
    if GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here":
        client = genai.Client(api_key=GEMINI_API_KEY)
        print("[INFO] Gemini AI client initialized successfully.")
    else:
        print("[WARN] GEMINI_API_KEY not set. AI analysis will not work.")
except Exception as e:
    print(f"[WARN] Gemini client init failed: {e}")

# ---------------------------------------------------------------------------
# The strict radiologist system prompt
# ---------------------------------------------------------------------------
SYSTEM_PROMPT = """ACT AS: A Senior Radiologist and Medical Image Analyst.

OBJECTIVE: Analyze the uploaded file (X-ray, Mammogram, or Ultrasound) and generate a structured JSON report.

STRICT PROTOCOL:
1. VALIDATION: Check if the image is a medical scan. If it is a landscape, human face, random object, or text, IMMEDIATELY stop and return: {"status": "invalid", "error": "Non-medical image detected"}.
2. IDENTIFICATION: Identify the type of scan (e.g., Chest X-ray, Cranial CT, Breast Mammogram).
3. SYSTEMATIC ANALYSIS: Look for specific abnormalities based on the scan type:
   - X-RAY: Check for fractures, opacities, or cardiomegaly.
   - MAMMOGRAM: Check for calcifications, masses, or architectural distortions.
   - ULTRASOUND: Check for fluid levels, cysts, or tissue density.
4. CONFIDENCE SCORE: Assign a confidence percentage (0.0 to 1.0) based on image clarity.
5. RECOVERY STEPS: Provide 4 actionable "next steps" (e.g., "Consult a Pulmonologist", "Schedule a follow-up MRI in 3 months", "Maintain Vitamin D levels").

OUTPUT FORMAT (STRICT JSON ONLY — no markdown, no code fences, no extra text):
{
  "status": "success",
  "metadata": {
    "scan_type": "string",
    "confidence_score": 0.0,
    "clarity": "high/medium/low"
  },
  "clinical_findings": "Detailed description of what is seen.",
  "impression": "The final summary/diagnosis suggestion.",
  "recovery_guidance": ["Step 1", "Step 2", "Step 3", "Step 4"],
  "disclaimer": "This is an AI-generated report for educational purposes and must be verified by a medical professional."
}

If the image is NOT a medical scan, return ONLY:
{"status": "invalid", "error": "Non-medical image detected"}

Return ONLY valid JSON. No additional commentary."""


# ---------------------------------------------------------------------------
# Analyze a medical image
# ---------------------------------------------------------------------------
def analyze_medical_image(image_bytes: bytes, mime_type: str) -> dict:
    """
    Send an image to Gemini for medical analysis.
    Returns a parsed dict matching the AnalysisReport schema.
    """
    if client is None:
        return {
            "status": "invalid",
            "error": "Backend is missing GEMINI_API_KEY. Upload succeeded, but AI analysis could not run.",
            "disclaimer": "AI Service Unreachable."
        }

    try:
        response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=[
                SYSTEM_PROMPT,
                types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
            ],
        )
    except Exception as e:
        return {
            "status": "invalid",
            "error": f"AI Analysis failed: {str(e)}",
            "disclaimer": "AI Service Unreachable."
        }

    raw_text = response.text.strip()

    # Strip markdown code fences if present
    raw_text = re.sub(r"^```(?:json)?\s*", "", raw_text)
    raw_text = re.sub(r"\s*```$", "", raw_text)
    raw_text = raw_text.strip()

    try:
        report = json.loads(raw_text)
    except json.JSONDecodeError:
        # If Gemini didn't return valid JSON, wrap it as an error
        report = {
            "status": "invalid",
            "error": "AI returned an unparseable response. Please try again.",
            "disclaimer": "This is an AI-generated report for educational purposes and must be verified by a medical professional.",
        }

    # Ensure disclaimer is always present
    if "disclaimer" not in report:
        report["disclaimer"] = (
            "This is an AI-generated report for educational purposes "
            "and must be verified by a medical professional."
        )

    return report
