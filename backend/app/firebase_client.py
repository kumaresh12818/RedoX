import os
import firebase_admin
from firebase_admin import credentials, firestore, storage, auth as firebase_auth
from datetime import datetime, timezone
from .config import FIREBASE_CREDENTIALS_PATH, FIREBASE_STORAGE_BUCKET

# ---------------------------------------------------------------------------
# Initialize Firebase Admin SDK  (graceful fallback if creds missing)
# ---------------------------------------------------------------------------
db = None
bucket = None
_initialized = False

try:
    _cred_path = FIREBASE_CREDENTIALS_PATH
    if _cred_path and os.path.exists(_cred_path):
        _cred = credentials.Certificate(_cred_path)
        firebase_admin.initialize_app(_cred, {"storageBucket": FIREBASE_STORAGE_BUCKET})
    else:
        firebase_admin.initialize_app(options={"storageBucket": FIREBASE_STORAGE_BUCKET})

    db = firestore.client()
    bucket = storage.bucket()
    _initialized = True
    print("[INFO] Firebase Admin SDK initialized successfully.")
except Exception as e:
    print(f"[WARN] Firebase Admin SDK init failed: {e}")
    print("[WARN] The server will start but Firebase operations will fail.")
    print("[WARN] To fix: add serviceAccountKey.json to the backend directory.")


def _require_firebase():
    if not _initialized:
        raise RuntimeError(
            "Firebase is not initialized. Add a valid serviceAccountKey.json "
            "to the backend directory and restart the server."
        )


# ---------------------------------------------------------------------------
# Verify Firebase ID Token
# ---------------------------------------------------------------------------
def verify_id_token(id_token: str) -> dict:
    """Verify a Firebase ID token and return the decoded claims."""
    _require_firebase()
    decoded = firebase_auth.verify_id_token(id_token)
    return decoded


# ---------------------------------------------------------------------------
# Storage helpers
# ---------------------------------------------------------------------------
def upload_image(user_id: str, scan_id: str, image_bytes: bytes, mime_type: str) -> str:
    """Upload an image to Firebase Storage and return the public download URL."""
    _require_firebase()
    ext = "jpg"
    if "png" in mime_type:
        ext = "png"
    elif "webp" in mime_type:
        ext = "webp"

    blob_path = f"scans/{user_id}/{scan_id}.{ext}"
    blob = bucket.blob(blob_path)
    blob.upload_from_string(image_bytes, content_type=mime_type)
    blob.make_public()
    return blob.public_url


# ---------------------------------------------------------------------------
# Firestore helpers
# ---------------------------------------------------------------------------
def save_report(user_id: str, scan_id: str, report_data: dict, image_url: str, file_name: str):
    """Save an analysis report to Firestore under the user's medical history."""
    _require_firebase()
    doc_ref = db.collection("users").document(user_id).collection("medical_history").document(scan_id)
    doc_ref.set({
        **report_data,
        "image_url": image_url,
        "file_name": file_name,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })


def get_user_reports(user_id: str) -> list:
    """Retrieve all reports for a given user, ordered by creation date."""
    _require_firebase()
    docs = (
        db.collection("users")
        .document(user_id)
        .collection("medical_history")
        .order_by("created_at", direction=firestore.Query.DESCENDING)
        .stream()
    )
    reports = []
    for doc in docs:
        data = doc.to_dict()
        data["scan_id"] = doc.id
        reports.append(data)
    return reports


def get_report(user_id: str, scan_id: str) -> dict | None:
    """Get a single report by scan_id."""
    _require_firebase()
    doc = (
        db.collection("users")
        .document(user_id)
        .collection("medical_history")
        .document(scan_id)
        .get()
    )
    if doc.exists:
        data = doc.to_dict()
        data["scan_id"] = doc.id
        return data
    return None


def delete_report(user_id: str, scan_id: str):
    """Delete a report and its associated image."""
    _require_firebase()
    # Delete Firestore document
    db.collection("users").document(user_id).collection("medical_history").document(scan_id).delete()

    # Attempt to delete storage blob (best-effort)
    for ext in ("jpg", "png", "webp"):
        blob = bucket.blob(f"scans/{user_id}/{scan_id}.{ext}")
        if blob.exists():
            blob.delete()
            break
