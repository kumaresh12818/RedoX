import uuid
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from starlette.concurrency import run_in_threadpool
from ..routes.auth import get_current_user
from ..gemini_client import analyze_medical_image
from ..firebase_client import upload_image, save_report

router = APIRouter()

ALLOWED_MIME_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/bmp",
    "image/tiff",
}


@router.post("/analyze")
async def analyze_scan(
    file: UploadFile = File(...),
    user: dict = Depends(get_current_user),
):
    """
    Accept a medical image, send it to Gemini AI for analysis,
    store the image in Firebase Storage and the report in Firestore,
    then return the structured report to the client.
    """
    # 1 — Validate file type
    mime = file.content_type or ""
    if mime not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {mime}. Please upload a JPEG, PNG, or WebP image.",
        )

    # 2 — Read bytes
    image_bytes = await file.read()
    if len(image_bytes) > 20 * 1024 * 1024:  # 20 MB limit
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 20 MB.")

    # 3 — Analyze with Gemini (blocking I/O → threadpool)
    report_data = await run_in_threadpool(analyze_medical_image, image_bytes, mime)

    # 4 — Generate a unique scan ID
    scan_id = uuid.uuid4().hex[:12]
    user_id = user["uid"]
    file_name = file.filename or "scan"

    # 5 — If valid medical image, persist to Firebase
    image_url = ""
    if report_data.get("status") == "success":
        try:
            # Skip Firebase Storage upload as requested, save only the text-based report
            await run_in_threadpool(save_report, user_id, scan_id, report_data, image_url, file_name)
        except Exception as e:
            # Don't fail the whole request if storage fails – still return the report
            print(f"[WARN] Firebase persistence failed: {e}")

    return {
        "report": report_data,
        "scan_id": scan_id,
        "image_url": image_url,
        "file_name": file_name,
    }
