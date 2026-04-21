from fastapi import Request, HTTPException
from ..firebase_client import verify_id_token


async def get_current_user(request: Request) -> dict:
    """
    Extract and verify the Firebase ID token from the Authorization header.
    Returns the decoded token claims (contains uid, email, etc.).
    """
    auth_header = request.headers.get("Authorization", "")

    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")

    id_token = auth_header.split("Bearer ")[1]

    try:
        decoded = verify_id_token(id_token)
        return decoded
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
